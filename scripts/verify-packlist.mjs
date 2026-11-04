import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';

const exec = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist', 'package');
const manifest = JSON.parse(await readFile(join(dist, 'package.json'), 'utf8'));

const {stdout} = await exec('npm', ['pack', dist, '--json', '--dry-run', '--ignore-scripts'], {
    cwd: root,
    maxBuffer: 10 * 1024 * 1024,
});
const [artifact] = JSON.parse(stdout);
assert.ok(artifact?.files?.length, 'npm pack produced no package files');
const paths = artifact.files.map(({path}) => path);

assert.equal(manifest.name, '@taiga-ui-labs/playwright');
for (const name of ['.', './v4']) {
    const entry = manifest.exports?.[name];
    assert.ok(entry, 'Missing APF entrypoint: ' + name);
    for (const field of ['types', 'default']) {
        const value = entry[field];
        assert.ok(typeof value === 'string' && value.startsWith('./'),
            'Invalid ' + field + ' export for ' + name);
        const path = value.slice(2);
        assert.ok(paths.includes(path), 'Missing packed ' + name + ' ' + field + ': ' + path);
    }
}

const runtimeFile = /^fesm2022\/[^/]+\.mjs(?:\.map)?$/;
const typesFile = /^(?:v4\/)?index\.d\.ts(?:\.map)?$/;
const metadata = new Set(['package.json', 'README.md', 'LICENSE', 'v4/package.json']);
const unwanted = paths.filter((path) => !runtimeFile.test(path) && !typesFile.test(path) && !metadata.has(path));
assert.deepEqual(unwanted, [], 'npm tarball includes unexpected files');
assert.ok(paths.length < 250, 'Unexpected package file count: ' + paths.length);

process.stdout.write(
    'APF npm tarball validated: ' + paths.length + ' files, ' +
    artifact.size + ' packed bytes; root and /v4 exports resolve; no Angular fixture or docs bundles.\n',
);
