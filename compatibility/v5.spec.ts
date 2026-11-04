import {expect, test} from '@playwright/test';

import {packageApi} from './api';

const {tuiSelect, tuiComboBox, tuiDialog} = await packageApi('.');

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByRole('heading', {name: 'Taiga UI Playwright integration fixture'})).toBeVisible();
});

test('Select updates real v5 Angular form', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));
    await select.selectOption('Estonia');
    await expect(page.getByTestId('country-model')).toHaveText('Estonia');
});

test('ComboBox filters options in real v5 Angular form', async ({page}) => {
    const combo = tuiComboBox(page.getByTestId('city-field'));
    await combo.fill('Tall');
    await combo.selectOption('Tallinn');
    await expect(page.getByTestId('city-model')).toHaveText('Tallinn');
});

test('Dialog confirms a real v5 portal', async ({page}) => {
    await page.getByRole('button', {name: 'Open dialog'}).click();
    const dialog = tuiDialog(page.locator('tui-dialog'));
    await dialog.clickButton('Confirm');
    await expect(dialog.host).toBeHidden();
});
