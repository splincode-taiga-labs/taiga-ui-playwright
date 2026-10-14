import {expect, test} from '@playwright/test';

import {tuiComboBox, tuiDialog, tuiSelect} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByRole('heading', {name: 'Taiga UI Playwright integration fixture'})).toBeVisible();
});

test('Select updates Angular FormControl through the Taiga UI dropdown', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));
    await select.selectOption('Estonia');

    await expect(select.input).toHaveValue('Estonia');
    await expect(page.getByTestId('country-model')).toHaveText('Estonia');
});

test('ComboBox filters options and updates Angular FormControl', async ({page}) => {
    const comboBox = tuiComboBox(page.getByTestId('city-field'));

    await comboBox.fill('Tall');
    await comboBox.selectOption('Tallinn');

    await expect(comboBox.input).toHaveValue('Tallinn');
    await expect(page.getByTestId('city-model')).toHaveText('Tallinn');
});

test('Dialog confirm completes a real TuiDialogService dialog', async ({page}) => {
    await page.getByRole('button', {name: 'Open dialog'}).click();
    const dialog = tuiDialog(page.locator('tui-dialog'));

    await expect(dialog.title).toHaveText('Review changes');
    await expect(page.getByTestId('dialog-model')).toHaveText('open');

    await dialog.clickButton('Confirm');
    await expect(dialog.host).toBeHidden();
    await expect(page.getByTestId('dialog-model')).toHaveText('closed');
});

test('Dialog close button dismisses the real dialog', async ({page}) => {
    await page.getByRole('button', {name: 'Open dialog'}).click();
    const dialog = tuiDialog(page.locator('tui-dialog'));

    await expect(dialog.title).toBeVisible();
    await dialog.close();

    await expect(page.getByTestId('dialog-model')).toHaveText('closed');
});
