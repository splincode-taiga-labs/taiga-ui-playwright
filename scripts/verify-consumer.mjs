import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const exec = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const work = await mkdtemp(join(tmpdir(), 'taiga-ui-playwright-consumer-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

async function run(command, args, cwd) {
    try {
        return await exec(command, args, {
            cwd,
            maxBuffer: 10 * 1024 * 1024,
            env: {...process.env, npm_config_update_notifier: 'false'},
        });
    } catch (error) {
        process.stderr.write(error.stdout || '');
        process.stderr.write(error.stderr || '');
        throw error;
    }
}

async function installedVersion(name) {
    const json = await readFile(join(root, 'node_modules', ...name.split('/'), 'package.json'), 'utf8');
    return JSON.parse(json).version;
}

try {
    const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
    assert.equal(packageJson.private, true, 'Keep the package private until release approval');

    const {stdout} = await run(npm, [
        'pack', '--json', '--ignore-scripts', '--pack-destination', work,
    ], root);
    const [artifact] = JSON.parse(stdout);
    assert.ok(artifact?.filename, 'npm pack did not produce a tarball');

    const paths = artifact.files.map(({path}) => path);
    for (const required of ['package.json', 'dist/index.js', 'dist/index.d.ts']) {
        assert.ok(paths.includes(required), 'Missing packed file: ' + required);
    }
    const unexpected = paths.filter((path) =>
        !path.startsWith('dist/') &&
        !['package.json', 'README.md', 'LICENSE'].includes(path),
    );
    assert.deepEqual(unexpected, [], 'Unexpected files in npm tarball');

    const consumer = join(work, 'consumer');
    await mkdir(consumer);
    const dependencies = {
        [packageJson.name]: 'file:' + join(work, artifact.filename),
        '@playwright/test': await installedVersion('@playwright/test'),
        typescript: await installedVersion('typescript'),
    };
    await writeFile(join(consumer, 'package.json'), JSON.stringify({
        name: 'taiga-ui-playwright-package-consumer',
        private: true,
        type: 'module',
        dependencies,
    }, null, 2));
    await writeFile(join(consumer, 'tsconfig.json'), JSON.stringify({
        compilerOptions: {
            target: 'ES2022',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            strict: true,
            noEmit: true,
            skipLibCheck: true,
        },
        files: ['consumer.mts'],
    }, null, 2));
    await writeFile(join(consumer, 'consumer.mts'), [
        "import type {Locator} from '@playwright/test';",
        "import {tuiSelect, tuiComboBox, tuiDialog, type TuiOptionsFieldOptions} from '@taiga-ui-labs/playwright';",
        '',
        'export function verifyTypedApi(host: Locator): void {',
        '    const options: TuiOptionsFieldOptions = {overlay: host.page().locator("tui-dropdown")};',
        '    const select = tuiSelect(host, options);',
        '    const combo = tuiComboBox(host);',
        '    const dialog = tuiDialog(host);',
        '    void select.selectOption("Estonia");',
        '    void combo.fill("Tall");',
        '    void dialog.close();',
        '}',
        '',
    ].join('\n'));

    await run(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumer);
    await run(process.execPath, [
        join(consumer, 'node_modules', 'typescript', 'bin', 'tsc'),
        '--project', join(consumer, 'tsconfig.json'),
    ], consumer);
    await run(process.execPath, [
        '--input-type=module',
        '--eval',
        "import {tuiSelect, tuiComboBox, tuiDialog} from '@taiga-ui-labs/playwright'; " +
        "if ([tuiSelect, tuiComboBox, tuiDialog].some((value) => typeof value !== 'function')) " +
        "throw new Error('Missing ESM factory export');",
    ], consumer);

    process.stdout.write('Packed ' + artifact.filename + ', validated ' + paths.length +
        ' archive files, ESM imports, and NodeNext TypeScript consumer.\n');
} finally {
    await rm(work, {recursive: true, force: true});
}
