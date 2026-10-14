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

// The first field must never target the dropdown belonging to another field.
test('ARIA controls scopes two real Taiga UI Select fields to different portals', async ({page}) => {
    const primary = tuiSelect(page.getByTestId('country-field'));
    const secondary = tuiSelect(page.getByTestId('secondary-country-field'));

    await primary.open();
    const primaryId = await primary.input.getAttribute('aria-controls');
    expect(primaryId).toBeTruthy();
    await expect(primary.overlay).toHaveAttribute('id', primaryId!);
    await primary.close();

    await secondary.open();
    const secondaryId = await secondary.input.getAttribute('aria-controls');
    expect(secondaryId).toBeTruthy();
    expect(secondaryId).not.toBe(primaryId);
    await expect(secondary.overlay).toHaveAttribute('id', secondaryId!);
    await secondary.selectOption('Austria');

    await expect(page.getByTestId('secondary-country-model')).toHaveText('Austria');
    await expect(page.getByTestId('country-model')).toHaveText('null');
});

test('Select handles detached and recreated Angular portal', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));

    await select.open();
    const original = await select.getOverlay();
    await expect(original).toBeVisible();

    await select.close();
    await expect(original).toHaveCount(0);

    await select.open();
    await expect(await select.getOverlay()).toBeVisible();
    await select.selectOption('Estonia');

    await expect(page.getByTestId('country-model')).toHaveText('Estonia');
});

test('Select ignores an unrelated visible portal with a duplicate option', async ({page}) => {
    await page.evaluate(() => {
        const decoy = document.createElement('tui-dropdown');
        decoy.setAttribute('data-testid', 'unrelated-overlay');
        decoy.innerHTML = '<tui-data-list><button tuiOption>Estonia</button></tui-data-list>';
        decoy.style.cssText = 'display: block; position: fixed; right: 0; bottom: 0; z-index: 1;';
        document.body.appendChild(decoy);
    });

    const select = tuiSelect(page.getByTestId('country-field'));
    await select.selectOption('Estonia');

    await expect(select.input).toHaveValue('Estonia');
    await expect(page.getByTestId('country-model')).toHaveText('Estonia');
    await expect(page.getByTestId('unrelated-overlay')).toBeVisible();
});
