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

test('ComboBox waits for asynchronously loaded options', async ({page}) => {
    await page.goto('/?fixture=smoke-options');
    const combo = tuiComboBox(page.getByTestId('async-city-field'));

    await combo.fill('Os');
    await combo.selectOption('Oslo');

    await expect(combo.input).toHaveValue('Oslo');
    await expect(page.getByTestId('async-city-model')).toHaveText('Oslo');
});

test('Async ComboBox reopens after Escape and ignores an unrelated matching portal', async ({page}) => {
    await page.goto('/?fixture=smoke-options');
    const combo = tuiComboBox(page.getByTestId('async-city-field'));

    await combo.fill('Os');
    await combo.input.press('Escape');
    await expect(combo.overlay).toBeHidden();
    await expect(combo.input).toHaveAttribute('aria-expanded', 'false');

    await combo.open();
    const overlay = await combo.getOverlay();
    const controlledId = await combo.input.getAttribute('aria-controls');
    expect(controlledId).toBeTruthy();
    await expect(overlay).toHaveAttribute('id', controlledId!);

    await page.evaluate(() => {
        const decoy = document.createElement('tui-dropdown');
        decoy.setAttribute('data-testid', 'unrelated-async-overlay');
        decoy.style.cssText = 'display: block; position: fixed; top: 0; right: 0; z-index: 1;';
        decoy.innerHTML = '<tui-data-list><button tuiOption type="button">Oslo</button></tui-data-list>';
        decoy.querySelector('button')?.addEventListener('click', () => {
            decoy.setAttribute('data-selected', 'true');
        });
        document.body.appendChild(decoy);
    });

    const unrelated = page.getByTestId('unrelated-async-overlay');
    await expect(unrelated).toBeVisible();
    await combo.selectOption('Oslo');

    await expect(combo.input).toHaveValue('Oslo');
    await expect(page.getByTestId('async-city-model')).toHaveText('Oslo');
    await expect(unrelated).not.toHaveAttribute('data-selected', 'true');
    await expect(unrelated).toBeVisible();
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
