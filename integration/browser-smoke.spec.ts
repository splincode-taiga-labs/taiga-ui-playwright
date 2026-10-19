import {expect, test} from '@playwright/test';

import {
    tuiComboBox,
    tuiDialog,
    tuiMobileCalendarDropdown,
    tuiSelect,
    tuiSheetDialog,
} from '../src/index.js';

test('Select chooses from its own real Taiga UI portal', async ({page}) => {
    await page.goto('/?fixture=smoke-options');
    const primary = tuiSelect(page.getByTestId('country-field'));
    const secondary = tuiSelect(page.getByTestId('secondary-country-field'));

    await primary.selectOption('Estonia');
    await expect(page.getByTestId('country-model')).toHaveText('Estonia');

    await secondary.selectOption('Austria');
    await expect(page.getByTestId('secondary-country-model')).toHaveText('Austria');
    await expect(page.getByTestId('country-model')).toHaveText('Estonia');
});

test('ComboBox filters and selects a loaded option', async ({page}) => {
    await page.goto('/?fixture=smoke-options');
    const combo = tuiComboBox(page.getByTestId('city-field'));

    await combo.fill('Tall');
    await combo.selectOption('Tallinn');

    await expect(combo.input).toHaveValue('Tallinn');
    await expect(page.getByTestId('city-model')).toHaveText('Tallinn');
});

test('ComboBox waits for asynchronously loaded options', async ({page, browserName}) => {
    test.skip(
        browserName === 'webkit',
        'Taiga UI v5.28 async ComboBox dropdown detaches during WebKit selection (issue #7)',
    );
    await page.goto('/?fixture=smoke-options');
    const combo = tuiComboBox(page.getByTestId('async-city-field'));

    await combo.fill('Os');
    await combo.selectOption('Oslo');

    await expect(combo.input).toHaveValue('Oslo');
    await expect(page.getByTestId('async-city-model')).toHaveText('Oslo');
});

test('Dialog can close and reopen without using a stale portal', async ({page}) => {
    await page.goto('/?fixture=smoke-options');
    const trigger = page.getByRole('button', {name: 'Open dialog'});
    const dialog = tuiDialog(page.locator('tui-dialog'));

    await trigger.click();
    await expect(dialog.title).toHaveText('Review changes');
    await dialog.clickButton('Confirm');
    await expect(dialog.host).toBeHidden();

    await trigger.click();
    await expect(dialog.title).toHaveText('Review changes');
    await page.keyboard.press('Escape');
    await expect(dialog.host).toBeHidden();
    await expect(page.getByTestId('dialog-model')).toHaveText('closed');
});

test('Mobile calendar dropdown uses a real mobile portal', async ({page, isMobile}) => {
    test.skip(!isMobile, 'Mobile calendar portal is tested with touch/mobile emulation');

    await page.goto('/?fixture=remaining-mobile-overlays');
    await page.getByRole('button', {name: 'Open mobile calendar dropdown'}).click();

    await tuiMobileCalendarDropdown(page.locator('tui-mobile-calendar-dropdown'))
        .expectCalendar();
});

test('Mobile sheet dialog uses the Taiga UI service and overlay', async ({page, isMobile}) => {
    test.skip(!isMobile, 'Mobile sheet portal is tested with touch/mobile emulation');

    await page.goto('/?fixture=remaining-mobile-overlays');
    await page.getByRole('button', {name: 'Open sheet dialog'}).click();

    await tuiSheetDialog(page.locator('tui-sheet-dialog')).expectSheet('Mobile sheet content');
    await expect(page.getByTestId('sheet-status')).toHaveText('open');
});
