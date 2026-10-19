import {defineConfig, devices} from '@playwright/test';

const baseURL = 'http://127.0.0.1:4201';

export default defineConfig({
    testDir: './integration',
    testMatch: '**/browser-smoke.spec.ts',
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : '50%',
    reporter: 'list',
    use: {
        baseURL,
        reducedMotion: 'reduce',
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
    },
    projects: [
        {name: 'chromium', use: {...devices['Desktop Chrome']}},
        {name: 'firefox', use: {...devices['Desktop Firefox']}},
        {name: 'webkit', use: {...devices['Desktop Safari']}},
        {name: 'mobile-chromium', use: {...devices['Pixel 7']}},
    ],
    webServer: {
        command: 'npm run start:fixture',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
