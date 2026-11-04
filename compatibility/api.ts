import {readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const dist = resolve(dir, '../dist/package');
const manifest = JSON.parse(readFileSync(resolve(dist, 'package.json'), 'utf8'));

export async function packageApi(entrypoint: '.' | './v4'): Promise<typeof import('../src/index.js')> {
    const bundle = manifest.exports?.[entrypoint]?.default;

    if (typeof bundle !== 'string' || !bundle.startsWith('./')) {
        throw new Error('Missing built APF entrypoint ' + entrypoint);
    }

    return import(pathToFileURL(resolve(dist, bundle)).href);
}
