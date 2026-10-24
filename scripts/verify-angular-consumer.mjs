import assert from 'node:assert/strict';
import {execFile, spawn} from 'node:child_process';
import {mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';

const exec = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const work = await mkdtemp(join(tmpdir(), 'taiga-ui-angular-consumer-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const port = 4251;
const url = 'http://127.0.0.1:' + port;

async function run(command, args, cwd) {
    try {
        return await exec(command, args, {
            cwd,
            timeout: 300_000,
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
    const data = await readFile(join(root, 'node_modules', ...name.split('/'), 'package.json'), 'utf8');
    return JSON.parse(data).version;
}

async function writeProject(directory, files) {
    for (const [path, contents] of Object.entries(files)) {
        const target = join(directory, path);
        await mkdir(dirname(target), {recursive: true});
        await writeFile(target, typeof contents === 'string' ? contents : JSON.stringify(contents, null, 2));
    }
}

async function serveAndTest(directory) {
    const cli = join(directory, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
    const server = spawn(process.execPath, [cli, 'serve', '--host', '127.0.0.1', '--port', String(port)], {
        cwd: directory,
        env: {...process.env, CI: 'true'},
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    for (const stream of [server.stdout, server.stderr]) {
        stream.setEncoding('utf8');
        stream.on('data', (chunk) => { output = (output + chunk).slice(-16_000); });
    }

    try {
        let ready = false;
        for (let attempts = 0; attempts < 120; attempts++) {
            if (server.exitCode !== null) {
                throw new Error('Isolated Angular dev server exited early:\n' + output);
            }
            try {
                const response = await fetch(url, {signal: AbortSignal.timeout(2_000)});
                if (response.ok) {
                    ready = true;
                    break;
                }
            } catch {
                // The independent Angular build has not finished yet.
            }
            await new Promise((resolve) => setTimeout(resolve, 1_000));
        }
        if (!ready) {
            throw new Error('Isolated Angular app did not start:\n' + output);
        }
        await run(process.execPath, ['smoke.mjs'], directory);
    } catch (error) {
        process.stderr.write('Angular consumer server log:\n' + output + '\n');
        throw error;
    } finally {
        server.kill('SIGTERM');
        await new Promise((resolve) => {
            if (server.exitCode !== null) return resolve();
            server.once('close', resolve);
            setTimeout(resolve, 5_000).unref();
        });
    }
}

try {
    const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
    assert.equal(packageJson.private, true, 'Do not turn on publishing during consumer validation');

    const {stdout} = await run(npm, ['pack', '--json', '--ignore-scripts', '--pack-destination', work], root);
    const [artifact] = JSON.parse(stdout);
    assert.ok(artifact?.filename, 'npm pack must produce an artifact');

    const dependencies = {
        [packageJson.name]: 'file:' + join(work, artifact.filename),
    };
    const packages = [
        '@angular/build', '@angular/cli', '@angular/cdk', '@angular/common',
        '@angular/compiler', '@angular/compiler-cli', '@angular/core',
        '@angular/forms', '@angular/platform-browser', '@angular/router', '@ng-web-apis/common',
        '@ng-web-apis/platform', '@taiga-ui/cdk', '@taiga-ui/core',
        '@taiga-ui/kit', '@taiga-ui/icons', '@taiga-ui/styles', '@playwright/test',
        'less', 'rxjs', 'typescript', 'zone.js',
    ];
    for (const name of packages) dependencies[name] = await installedVersion(name);

    const consumer = join(work, 'angular-consumer');
    const files = {
        'package.json': {
            name: 'taiga-ui-isolated-angular-consumer',
            private: true,
            type: 'module',
            scripts: {start: 'ng serve'},
            dependencies,
        },
        'angular.json': {
            version: 1,
            projects: {
                consumer: {
                    projectType: 'application',
                    root: '',
                    sourceRoot: 'src',
                    architect: {
                        build: {
                            builder: '@angular/build:application',
                            options: {
                                outputPath: 'dist',
                                index: 'src/index.html',
                                browser: 'src/main.ts',
                                polyfills: ['zone.js'],
                                tsConfig: 'tsconfig.app.json',
                                styles: ['src/styles.less'],
                                assets: [{
                                    glob: '**/*.svg',
                                    input: 'node_modules/@taiga-ui/icons/src',
                                    output: 'assets/taiga-ui/icons',
                                }],
                            },
                            configurations: {
                                development: {optimization: false, sourceMap: true},
                            },
                            defaultConfiguration: 'development',
                        },
                        serve: {
                            builder: '@angular/build:dev-server',
                            options: {buildTarget: 'consumer:build:development'},
                        },
                    },
                },
            },
        },
        'tsconfig.app.json': {
            compilerOptions: {
                target: 'ES2022',
                module: 'ES2022',
                moduleResolution: 'bundler',
                lib: ['ES2022', 'DOM'],
                strict: true,
                experimentalDecorators: true,
                useDefineForClassFields: false,
                skipLibCheck: true,
                types: [],
            },
            angularCompilerOptions: {strictTemplates: true, strictInjectionParameters: true},
            files: ['src/main.ts', 'src/app.ts'],
        },
        'src/index.html': '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Independent Angular consumer</title></head><body><app-consumer></app-consumer></body></html>',
        'src/styles.less': "@import '@taiga-ui/styles/taiga-ui-theme.less';\n@import '@taiga-ui/styles/taiga-ui-fonts.less';\n",
        'src/main.ts': [
            "import '@angular/compiler';",
            "import {provideZonelessChangeDetection} from '@angular/core';",
            "import {bootstrapApplication} from '@angular/platform-browser';",
            "import {provideTaiga} from '@taiga-ui/core';",
            "import {ConsumerApp} from './app';",
            "bootstrapApplication(ConsumerApp, {providers: [provideZonelessChangeDetection(), provideTaiga()]})",
            "    .catch((error: unknown) => console.error(error));",
        ].join('\n'),
        'src/app.html': "<tui-root><main>\n  <tui-textfield data-testid=\"country-field\" tuiChevron>\n    <input aria-label=\"Country\" tuiSelect [formControl]=\"country\" />\n    <tui-data-list-wrapper *tuiDropdown [items]=\"countries\" />\n  </tui-textfield>\n  <output data-testid=\"country-model\">{{ country.value }}</output>\n  <tui-textfield data-testid=\"city-field\" tuiChevron>\n    <input aria-label=\"City\" tuiComboBox [formControl]=\"city\" />\n    <tui-data-list-wrapper *tuiDropdown [items]=\"cities | tuiFilterByInput\" />\n  </tui-textfield>\n  <output data-testid=\"city-model\">{{ city.value }}</output>\n</main></tui-root>",
        'src/app.ts': [
            "import {Component} from '@angular/core';",
            "import {FormControl, ReactiveFormsModule} from '@angular/forms';",
            "import {TuiChevron, TuiComboBox, TuiDataListWrapper, TuiSelect} from '@taiga-ui/kit';",
            "import {TuiFilterByInputPipe, TuiRoot, TuiTextfield} from '@taiga-ui/core';",
            "@Component({",
            "  selector: 'app-consumer',",
            "  imports: [ReactiveFormsModule, TuiRoot, TuiTextfield, TuiChevron, TuiSelect, TuiDataListWrapper, TuiComboBox, TuiFilterByInputPipe],",
            "  templateUrl: './app.html',",
            "})",
            "export class ConsumerApp {",
            "  protected readonly countries = ['Austria', 'Estonia'];",
            "  protected readonly cities = ['Tallinn', 'Vienna'];",
            "  protected readonly country = new FormControl<string | null>(null);",
            "  protected readonly city = new FormControl<string | null>(null);",
            "}",
        ].join('\n'),
        'smoke.mjs': [
            "import {chromium, expect} from '@playwright/test';",
            "import {tuiSelect, tuiComboBox} from '@taiga-ui-labs/playwright';",
            "const browser = await chromium.launch({headless: true});",
            "try {",
            "  const page = await browser.newPage({viewport: {width: 1280, height: 800}});",
            "  page.setDefaultTimeout(15000);",
            "  await page.goto('http://127.0.0.1:4251');",
            "  const country = tuiSelect(page.getByTestId('country-field'));",
            "  const city = tuiComboBox(page.getByTestId('city-field'));",
            "  await country.selectOption('Estonia');",
            "  await expect(page.getByTestId('country-model')).toHaveText('Estonia');",
            "  await city.fill('Tall');",
            "  await city.selectOption('Tallinn');",
            "  await expect(page.getByTestId('city-model')).toHaveText('Tallinn');",
            "  await expect(page.getByTestId('country-model')).toHaveText('Estonia');",
            "  console.log('Packed package drives real independent Angular Select and ComboBox.');",
            "} finally { await browser.close(); }",
        ].join('\n'),
    };
    await writeProject(consumer, files);
    await run(npm, ['install', '--no-audit', '--no-fund'], consumer);
    const resolvedPackage = JSON.parse(await readFile(join(
        consumer, 'node_modules', '@taiga-ui-labs', 'playwright', 'package.json',
    ), 'utf8'));
    assert.equal(resolvedPackage.version, packageJson.version);
    await serveAndTest(consumer);
    process.stdout.write('Isolated Angular 20 + Taiga UI 5 consumer passed using packed ' +
        artifact.filename + ' and Playwright ' + dependencies['@playwright/test'] + '.\n');
} finally {
    await rm(work, {recursive: true, force: true});
}
