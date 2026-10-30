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
const registryVersion = process.env.CONSUMER_REGISTRY_VERSION?.trim();

if (registryVersion && !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z][0-9A-Za-z.-]*)?$/.test(registryVersion)) {
    throw new Error('CONSUMER_REGISTRY_VERSION must be an exact semver version');
}

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
    assert.notEqual(packageJson.private, true, 'Packed release candidate must be publishable');

    // Registry mode proves an actual published package can be installed independently.
    // Default mode keeps checking the current local build tarball before publication.
    let packageSource;
    if (registryVersion) {
        // package.json dependency values are versions, not "name@version" CLI specs.
        packageSource = registryVersion;
    } else {
        const {stdout} = await run(npm, [
            'pack', '--json', '--ignore-scripts', '--pack-destination', work,
        ], root);
        const [artifact] = JSON.parse(stdout);
        assert.ok(artifact?.filename, 'npm pack must produce an artifact');
        packageSource = 'file:' + join(work, artifact.filename);
    }

    const playwrightVersion = process.env.CONSUMER_PLAYWRIGHT_VERSION?.trim() ||
        await installedVersion('@playwright/test');
    const dependencies = {
        [packageJson.name]: packageSource,
    };
    const packages = [
        '@angular/build', '@angular/cli', '@angular/cdk', '@angular/common',
        '@angular/compiler', '@angular/compiler-cli', '@angular/core',
        '@angular/forms', '@angular/platform-browser', '@angular/router',
        // Keep Web APIs peers from the same tested lockfile family: a newer
        // mutation-observer patch can require a newer common patch.
        '@ng-web-apis/common', '@ng-web-apis/mutation-observer', '@ng-web-apis/platform',
        // Taiga UI allows compatible Maskito peers, but mixed patches can
        // conflict (e.g. phone 5.6.1 requires kit ^5.6.1). Pin the tested family.
        '@maskito/angular', '@maskito/core', '@maskito/kit', '@maskito/phone',
        '@taiga-ui/cdk', '@taiga-ui/core',
        '@taiga-ui/kit', '@taiga-ui/icons', '@taiga-ui/styles', '@playwright/test',
        'less', 'rxjs', 'typescript', 'zone.js',
    ];
    for (const name of packages) {
        dependencies[name] = name === '@playwright/test' ? playwrightVersion : await installedVersion(name);
    }

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
        'tsconfig.contract.json': {
            compilerOptions: {
                target: 'ES2022',
                module: 'NodeNext',
                moduleResolution: 'NodeNext',
                strict: true,
                noEmit: true,
                skipLibCheck: true,
            },
            files: ['package-contract.mts'],
        },
        'package-contract.mts': [
            "import type {Locator} from '@playwright/test';",
            "import {tuiSelect, tuiComboBox, tuiDialog, type TuiOptionsFieldOptions} from '@taiga-ui-labs/playwright';",
            'export function assertTypedConsumer(host: Locator): void {',
            '  const select: ReturnType<typeof tuiSelect> = tuiSelect(host);',
            '  const options: TuiOptionsFieldOptions = {overlay: host.page().locator("tui-dropdown")};',
            '  void tuiSelect(host, options).selectOption("Estonia");',
            '  void tuiComboBox(host).fill("Tall");',
            '  void tuiDialog(host).clickButton("Save");',
            '  void select.input;',
            '}',
        ].join('\n'),
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
    const install = await run(npm, ['install', '--no-audit', '--no-fund'], consumer);
    if (registryVersion) {
        process.stdout.write('Published package install: ' + install.stdout + '\n');
    }
    const lock = JSON.parse(await readFile(join(consumer, 'package-lock.json'), 'utf8'));
    const entry = lock.packages['node_modules/' + packageJson.name];
    if (registryVersion) {
        // Avoid a false positive caused by npm installing a workspace/file reference.
        process.stdout.write('Installed npm lock entry: ' + JSON.stringify(entry) + '\n');
        assert.match(entry?.resolved || '', /^https:\/\/registry\.npmjs\.org\//,
            'Published package must be resolved through the public npm registry');
        assert.ok(entry?.integrity, 'Published package is missing npm registry integrity');
    }
    const resolvedPackage = JSON.parse(await readFile(join(
        consumer, 'node_modules', '@taiga-ui-labs', 'playwright', 'package.json',
    ), 'utf8'));
    assert.equal(resolvedPackage.version, registryVersion || packageJson.version);
    const resolvedPlaywright = JSON.parse(await readFile(join(
        consumer, 'node_modules', '@playwright', 'test', 'package.json',
    ), 'utf8'));
    assert.equal(resolvedPlaywright.version, playwrightVersion,
        'Angular consumer resolved the wrong Playwright version');
    await run(process.execPath, [
        join(consumer, 'node_modules', 'typescript', 'bin', 'tsc'),
        '--project', join(consumer, 'tsconfig.contract.json'),
    ], consumer);
    await serveAndTest(consumer);
    process.stdout.write('Isolated Angular 20 + Taiga UI 5 consumer passed using ' +
        (registryVersion ? packageJson.name + '@' + registryVersion + ' (npm registry)' : packageSource) +
        ' and Playwright ' + dependencies['@playwright/test'] + '.\n');
} finally {
    await rm(work, {recursive: true, force: true});
}
