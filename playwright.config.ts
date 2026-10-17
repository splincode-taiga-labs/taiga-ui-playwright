import {defineConfig, devices} from '@playwright/test';

const baseURL = 'http://127.0.0.1:4201';

export default defineConfig({
    testDir: '.',
    testIgnore: '**/docs/**',
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    reporter: 'list',
    use: {...devices['Desktop Chrome'], reducedMotion: 'reduce', trace: 'on-first-retry'},
    projects: [
        {name: 'dom', testMatch: '**/tests/**/*.spec.ts'},
        {
            name: 'integration',
            testMatch: '**/integration/**/*.spec.ts',
            use: {baseURL},
        },
    ],
    webServer: {
        command: 'npm run start:fixture',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
