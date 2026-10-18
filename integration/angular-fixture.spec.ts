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

test('Select handles exact labels with regexp characters in a real Taiga UI data list', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));
    await select.selectOption('C++');

    await expect(select.input).toHaveValue('C++');
    await expect(page.getByTestId('country-model')).toHaveText('C++');
});

test('Select refuses a disabled option and preserves Angular FormControl', async ({page}) => {
    const select = tuiSelect(page.getByTestId('disabled-country-field'));

    await select.open();
    await expect(select.option('Austria')).toBeDisabled();
    await expect(select.selectOption('Austria')).rejects.toThrow(/must be enabled/);

    await expect(page.getByTestId('disabled-country-model')).toHaveText('null');
    await select.selectOption('Estonia');
    await expect(page.getByTestId('disabled-country-model')).toHaveText('Estonia');
});

test('Select keyboard navigation can select an option via native Playwright keys', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));

    await select.open();
    await select.input.press('ArrowDown');
    await expect(select.option('Austria')).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page.getByTestId('country-model')).toHaveText('Austria');
});

test('ComboBox handles empty filtering without selecting any option', async ({page}) => {
    const combo = tuiComboBox(page.getByTestId('city-field'));
    await combo.fill('unmatched city');

    await expect(combo.options).toHaveCount(0);
    await expect(combo.overlay.locator('tui-data-list .t-empty')).toBeVisible();
    await expect(page.getByTestId('city-model')).toHaveText('null');
    await combo.close();
});

test('ComboBox strict mode does not commit unmatched custom text on blur', async ({page}) => {
    const combo = tuiComboBox(page.getByTestId('city-field'));
    await combo.fill('Atlantis');
    await page.getByRole('heading', {name: 'Taiga UI Playwright integration fixture'}).click();

    await expect(page.getByTestId('city-model')).toHaveText('null');
});

test('ComboBox non-strict mode accepts text not present in the list', async ({page}) => {
    const combo = tuiComboBox(page.getByTestId('free-city-field'));
    await combo.fill('Atlantis');
    await page.getByRole('heading', {name: 'Taiga UI Playwright integration fixture'}).click();

    await expect(page.getByTestId('free-city-model')).toHaveText('Atlantis');
});

test('ComboBox waits for asynchronously loaded options before choosing', async ({page}) => {
    const combo = tuiComboBox(page.getByTestId('async-city-field'));
    await combo.fill('Os');

    await combo.selectOption('Oslo');

    await expect(combo.input).toHaveValue('Oslo');
    await expect(page.getByTestId('async-city-model')).toHaveText('Oslo');
});

test('Select Escape closes the real Taiga UI dropdown without changing the model', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));

    await select.open();
    await select.input.press('Escape');

    await expect(select.overlay).toBeHidden();
    await expect(page.getByTestId('country-model')).toHaveText('null');

    await select.selectOption('Estonia');
    await expect(page.getByTestId('country-model')).toHaveText('Estonia');
});

test('Dialog can be reopened after the previous portal has been destroyed', async ({page}) => {
    const button = page.getByRole('button', {name: 'Open dialog'});
    const dialog = tuiDialog(page.locator('tui-dialog'));

    for (let attempt = 0; attempt < 2; attempt++) {
        await button.click();
        await expect(dialog.title).toHaveText('Review changes');
        await dialog.clickButton('Confirm');
        await expect(dialog.host).toBeHidden();
        await expect(page.getByTestId('dialog-model')).toHaveText('closed');
    }
});

test('Dialog Escape dismisses the real portal', async ({page}) => {
    await page.getByRole('button', {name: 'Open dialog'}).click();
    const dialog = tuiDialog(page.locator('tui-dialog'));
    await expect(dialog.host).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(dialog.host).toBeHidden();
    await expect(page.getByTestId('dialog-model')).toHaveText('closed');
});

test('Non-closable dialog fails with a useful error and is not dismissed by Escape', async ({page}) => {
    await page.getByRole('button', {name: 'Open locked dialog'}).click();
    const dialog = tuiDialog(page.locator('tui-dialog'));

    await expect(dialog.title).toHaveText('Locked dialog');
    await expect(dialog.closeButton).toHaveCount(0);
    await expect(dialog.close()).rejects.toThrow(/closable: false/);
    await page.keyboard.press('Escape');

    await expect(dialog.host).toBeVisible();
    await expect(page.getByTestId('dialog-model')).toHaveText('open');
});

test('Dismissible dialog without a close button closes via Escape', async ({page}) => {
    await page.getByRole('button', {name: 'Open dismissible dialog'}).click();
    const dialog = tuiDialog(page.locator('tui-dialog'));

    await expect(dialog.closeButton).toHaveCount(0);
    await page.keyboard.press('Escape');

    await expect(dialog.host).toBeHidden();
    await expect(page.getByTestId('dialog-model')).toHaveText('closed');
});

test('Dialog close waits for async closable guard and exit animations', async ({page}) => {
    await page.getByRole('button', {name: 'Open guarded dialog'}).click();
    const dialog = tuiDialog(page.locator('tui-dialog'));

    await expect(dialog.title).toHaveText('Guarded dialog');
    await dialog.close();

    await expect(dialog.host).toBeHidden();
    await expect(page.getByTestId('dialog-model')).toHaveText('closed');
});

test('Dialog Escape restores focus to its original trigger', async ({page}) => {
    const button = page.getByRole('button', {name: 'Open dialog'});
    await button.focus();
    await button.click();

    const dialog = tuiDialog(page.locator('tui-dialog'));
    await expect(dialog.host).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog.host).toBeHidden();

    await expect(button).toBeFocused();
});
