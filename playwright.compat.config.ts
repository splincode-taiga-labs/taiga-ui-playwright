import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
    testDir: './compatibility',
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: 0,
    reporter: 'list',
    use: {...devices['Desktop Chrome'], trace: 'retain-on-failure', screenshot: 'only-on-failure'},
    projects: [
        {
            name: 'taiga-v4',
            testMatch: '**/v4.spec.ts',
            use: {baseURL: 'http://127.0.0.1:4204'},
        },
        {
            name: 'taiga-v5',
            testMatch: '**/v5.spec.ts',
            use: {baseURL: 'http://127.0.0.1:4201'},
        },
    ],
    webServer: [
        {
            command: 'npm run start -w @taiga-ui-labs/demo-v4',
            url: 'http://127.0.0.1:4204',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
        },
        {
            command: 'npm run start -w @taiga-ui-labs/demo-v5',
            url: 'http://127.0.0.1:4201',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
        },
    ],
});
