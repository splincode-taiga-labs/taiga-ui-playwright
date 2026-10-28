import assert from 'node:assert/strict';
import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

const entrypoint = fileURLToPath(new URL('../src/index.ts', import.meta.url));
const snapshotPath = fileURLToPath(new URL('../docs/public-api.exports.json', import.meta.url));
const text = await readFile(entrypoint, 'utf8');
const source = ts.createSourceFile(entrypoint, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
assert.equal(source.parseDiagnostics.length, 0, 'src/index.ts must parse without errors');

const exports = [];
for (const statement of source.statements) {
    assert.ok(
        ts.isExportDeclaration(statement) &&
        statement.exportClause &&
        ts.isNamedExports(statement.exportClause),
        'Use explicit named re-exports in src/index.ts so the public surface can be reviewed',
    );
    for (const specifier of statement.exportClause.elements) {
        const prefix = statement.isTypeOnly || specifier.isTypeOnly ? 'type ' : '';
        exports.push(prefix + specifier.name.text);
    }
}
exports.sort();
assert.equal(new Set(exports).size, exports.length, 'Duplicate public exports detected');
const expected = {exports};

if (process.argv.includes('--update')) {
    assert.deepEqual(process.argv.slice(2), ['--update'], 'Only --update is supported');
    await writeFile(snapshotPath, JSON.stringify(expected, null, 2) + '\n');
    process.stdout.write('Updated public export inventory: ' + exports.length + ' entries.\n');
} else {
    assert.deepEqual(process.argv.slice(2), [], 'Unexpected arguments');
    const snapshot = JSON.parse(await readFile(snapshotPath, 'utf8'));
    assert.deepEqual(
        expected,
        snapshot,
        'Public exports changed. Review SemVer compatibility, then run npm run test:api -- --update and commit the reviewed snapshot.',
    );
    process.stdout.write('Public export inventory unchanged: ' + exports.length + ' entries.\n');
}
