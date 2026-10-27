import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';

const exec = promisify(execFile);

const {stdout} = await exec('npm', ['pack', '--json', '--dry-run', '--ignore-scripts'], {
    maxBuffer: 10 * 1024 * 1024,
});
const [artifact] = JSON.parse(stdout);

assert.ok(artifact?.files?.length, 'npm pack produced no package files');
const paths = artifact.files.map(({path}) => path);

for (const expected of ['package.json', 'dist/index.js', 'dist/index.d.ts']) {
    assert.ok(paths.includes(expected), 'Missing packed file: ' + expected);
}

const runtimeFile = /^dist\/[^/]+\.(?:js|js\.map|d\.ts|d\.ts\.map)$/;
const packageMetadata = new Set(['package.json', 'README.md', 'LICENSE']);
const unwanted = paths.filter((path) => !runtimeFile.test(path) && !packageMetadata.has(path));

assert.deepEqual(unwanted, [], 'npm tarball includes non-runtime or nested app artifacts');
assert.ok(paths.length < 250, 'Unexpected package file count: ' + paths.length);

process.stdout.write(
    'npm tarball validated: ' + paths.length + ' files, ' +
    artifact.size + ' packed bytes; no Angular fixture or docs bundles.\n',
);
