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
    assert.notEqual(packageJson.private, true, 'Packed release candidate must be publishable');

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
        !/^dist\/[^/]+\.(?:js|js\.map|d\.ts|d\.ts\.map)$/.test(path) &&
        !['package.json', 'README.md', 'LICENSE'].includes(path),
    );
    assert.deepEqual(unexpected, [], 'Unexpected files in npm tarball');

    const consumer = join(work, 'consumer');
    await mkdir(consumer);
    const playwrightVersion = process.env.CONSUMER_PLAYWRIGHT_VERSION?.trim() ||
        await installedVersion('@playwright/test');
    const dependencies = {
        [packageJson.name]: 'file:' + join(work, artifact.filename),
        '@playwright/test': playwrightVersion,
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
        "import {tuiSelect, tuiComboBox, tuiDialog, tuiTabs, type TuiOptionsFieldOptions, type TuiSelect, type TuiComboBox, type TuiDialog} from '@taiga-ui-labs/playwright';",
        '',
        'export function verifyTypedApi(host: Locator): void {',
        '    const options: TuiOptionsFieldOptions = {overlay: host.page().locator("tui-dropdown")};',
        '    const select = tuiSelect(host, options);',
        '    const combo = tuiComboBox(host);',
        '    const dialog = tuiDialog(host);',
        '    void select.selectOption("Estonia");',
        '    void combo.fill("Tall");',
        '    void dialog.close();',
        '    const expectedSelect: TuiSelect = select;',
        '    const expectedCombo: TuiComboBox = combo;',
        '    const expectedDialog: TuiDialog = dialog;',
        '    const input: Locator = expectedSelect.input;',
        '    const option: Locator = expectedSelect.option("Estonia");',
        '    const overlay: Promise<Locator> = expectedSelect.getOverlay();',
        '    const labels: Promise<string[]> = expectedSelect.getOptionLabels();',
        '    const value: Promise<string> = expectedSelect.getValue();',
        '    const selection: Promise<void> = expectedSelect.selectOption("Estonia");',
        '    const opening: Promise<void> = expectedSelect.open();',
        '    const closing: Promise<void> = expectedSelect.close();',
        '    const optionList: Locator = expectedSelect.options;',
        '    const comboFill: Promise<void> = expectedCombo.fill("Tall");',
        '    const dialogTitle: Locator = expectedDialog.title;',
        '    const dialogCloseButton: Locator = expectedDialog.closeButton;',
        '    const dialogAction: Locator = expectedDialog.button("Save");',
        '    const dialogClick: Promise<void> = expectedDialog.clickButton("Save");',
                '    const tabs = tuiTabs(host);',
        '    const tab: Locator = tabs.tab("Details");',
        '    const activation: Promise<void> = tabs.select("Details");',
        '    void [input, option, overlay, labels, value, selection, tab, activation, expectedCombo, expectedDialog,',
        '          opening, closing, optionList, comboFill, dialogTitle, dialogCloseButton, dialogAction, dialogClick];',
        '}',
        '',
    ].join('\n'));

    await run(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumer);
    const installedPlaywright = JSON.parse(await readFile(
        join(consumer, 'node_modules', '@playwright', 'test', 'package.json'), 'utf8',
    ));
    assert.equal(installedPlaywright.version, playwrightVersion,
        'Consumer resolved an unexpected Playwright version');
    await run(process.execPath, [
        join(consumer, 'node_modules', 'typescript', 'bin', 'tsc'),
        '--project', join(consumer, 'tsconfig.json'),
    ], consumer);
    // Check actual ESM exports from the packed package, not only TS source declarations.
    const inventory = JSON.parse(await readFile(join(root, 'docs/public-api.exports.json'), 'utf8'));
    const runtimeExports = inventory.exports.filter((name) => !name.startsWith('type '));
    await run(process.execPath, [
        '--input-type=module',
        '--eval',
        "import * as api from '@taiga-ui-labs/playwright'; " +
        'const expected = ' + JSON.stringify(runtimeExports) + '; ' +
        "const actual = Object.keys(api).sort(); " +
        "if (JSON.stringify(actual) !== JSON.stringify(expected)) " +
        "throw new Error('Packed ESM exports mismatch: ' + JSON.stringify({" +
        "missing: expected.filter((name) => !(name in api)), " +
        "unexpected: actual.filter((name) => !expected.includes(name))})); " +
        "if (actual.some((name) => typeof api[name] !== 'function')) " +
        "throw new Error('A runtime API export is not a class or factory');",
    ], consumer);

    process.stdout.write('Packed ' + artifact.filename + ', validated ' + paths.length +
        ' archive files, ESM imports, and NodeNext TypeScript consumer on Node ' +
        process.version + ' with Playwright ' + playwrightVersion + '.\n');
} finally {
    await rm(work, {recursive: true, force: true});
}
