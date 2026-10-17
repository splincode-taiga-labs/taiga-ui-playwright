import {expect, test} from '@playwright/test';

test('Angular fixture bootstraps before running integration tests', async ({page}) => {
    const errors: string[] = [];

    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
        if (message.type() === 'error' && /needs to be compiled|JIT compiler|NG\d{4}|Uncaught|TypeError|ReferenceError/.test(message.text())) {
            errors.push(message.text());
        }
    });

    await page.goto('/');
    await expect(page.getByRole('heading', {name: 'Taiga UI Playwright integration fixture'})).toBeVisible();
    await expect(page.getByTestId('harness-controls')).toBeVisible();
    await expect(page.getByTestId('multi-fields')).toBeVisible();
    expect(errors).toEqual([]);
});
