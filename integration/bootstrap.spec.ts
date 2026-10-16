import {expect, test} from '@playwright/test';

test('Angular fixture bootstraps and renders all feature sections', async ({page}) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
        if (message.type() === 'error') {
            errors.push(message.text());
        }
    });

    await page.goto('/');
    await expect(page.getByRole('heading', {name: 'Taiga UI Playwright integration fixture'})).toBeVisible();
    await expect(page.getByTestId('harness-controls')).toBeVisible();
    await expect(page.getByTestId('multi-fields')).toBeVisible();
    await expect(page.getByTestId('semantic-widgets')).toBeVisible();
    expect(errors).toEqual([]);
});
