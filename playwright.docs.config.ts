import {defineConfig, devices} from '@playwright/test';

const baseURL = 'http://127.0.0.1:4202';

export default defineConfig({
    testDir: './docs/site/tests',
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    reporter: 'list',
    use: {...devices['Desktop Chrome'], baseURL, trace: 'on-first-retry'},
    webServer: {
        command: 'npm run start:docs',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
