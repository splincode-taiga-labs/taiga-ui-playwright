import {expect, test} from '@playwright/test';

import {
    tuiComboBox,
    tuiInputDate,
    tuiInputDateRange,
    tuiInputMonthRange,
    tuiDialog,
    tuiMobileCalendarDropdown,
    tuiMobileDateCalendar,
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

test('InputDate selects from an already-open owned calendar on desktop engines', async ({page, isMobile}) => {
    test.skip(isMobile, 'Mobile InputDate needs tuiMobileCalendar or tuiDropdownSheet, not the desktop popup.');
    await page.goto('/?fixture=smoke-calendars');
    const date = tuiInputDate(page.getByTestId('date-input-field'));

    await date.input.click();
    await expect(date.input).toHaveAttribute('aria-expanded', 'true');
    const id = await date.input.getAttribute('aria-controls');
    expect(id).toBeTruthy();
    await expect(page.locator('tui-dropdown:visible').and(page.locator('[id=' + JSON.stringify(id) + ']')))
        .toBeVisible();

    await date.selectDay(22);

    await expect(page.getByTestId('date-model')).toHaveText('2026-0-22');
    await expect(date.input).toHaveAttribute('aria-expanded', 'false');
});

test('InputDateRange completes a preopened two-day range on desktop engines', async ({page, isMobile}) => {
    test.skip(isMobile, 'Mobile InputDateRange needs tuiMobileCalendar or tuiDropdownSheet, not the desktop popup.');
    await page.goto('/?fixture=smoke-calendars');
    const range = tuiInputDateRange(page.getByTestId('date-range-field'));

    await range.input.click();
    await expect(range.input).toHaveAttribute('aria-expanded', 'true');
    await range.selectRange(18, 20);

    await expect(page.getByTestId('date-range-model')).toHaveText('18-20');
    await expect(range.input).toHaveAttribute('aria-expanded', 'false');
});

test('Mobile date inputs without a mobile adapter do not falsely expose a desktop popup', async ({page, isMobile}) => {
    test.skip(!isMobile, 'On desktop, InputDate and InputDateRange use regular calendar dropdowns.');

    await page.goto('/?fixture=smoke-calendars');
    const date = tuiInputDate(page.getByTestId('date-input-field'));
    const range = tuiInputDateRange(page.getByTestId('date-range-field'));

    await date.input.click();
    await expect(date.input).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByTestId('date-model')).toHaveText('2026-0-15');

    await range.input.click();
    await expect(range.input).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByTestId('date-range-model')).toHaveText('15-16');
});

test('InputMonthRange completes a preopened two-month range across browsers', async ({page}) => {
    await page.goto('/?fixture=smoke-calendars');
    const range = tuiInputMonthRange(page.getByTestId('month-range-field'));

    await range.input.click();
    await expect(range.input).toHaveAttribute('aria-expanded', 'true');
    await range.selectRange(2, 4);

    await expect(page.getByTestId('month-range-model')).toContainText('2026:2-4');
    await expect(range.input).toHaveAttribute('aria-expanded', 'false');
});

test('Mobile calendar dropdown uses a real mobile portal', async ({page, isMobile}) => {
    test.skip(!isMobile, 'Mobile calendar portal is tested with touch/mobile emulation');

    await page.goto('/?fixture=remaining-mobile-overlays');
    await page.getByRole('button', {name: 'Open mobile calendar dropdown'}).click();

    await tuiMobileCalendarDropdown(page.locator('tui-mobile-calendar-dropdown'))
        .expectCalendar();
});

test('Mobile InputDate chooses a day in its own real tuiMobileCalendar popup', async ({page, isMobile}) => {
    test.skip(!isMobile, 'This is the mobile-only Taiga UI date picker.');

    await page.goto('/?fixture=remaining-mobile-overlays');
    const field = tuiMobileDateCalendar(page.getByTestId('calendar-dropdown-field'));
    await page.getByRole('button', {name: 'Open mobile calendar dropdown'}).click();
    const popup = await field.portal();
    await expect(popup).toBeVisible();

    await field.selectDay(20);

    await expect(page.getByTestId('mobile-date-model')).toHaveText('2026-9-20');
    await expect(field.input).toHaveAttribute('aria-expanded', 'false');
});

test('Mobile InputDateRange confirms a real range and ignores an unrelated mobile popup', async ({page, isMobile}) => {
    test.skip(!isMobile, 'This is the mobile-only Taiga UI range picker.');

    await page.goto('/?fixture=remaining-mobile-overlays');
    const field = tuiMobileDateCalendar(page.getByTestId('mobile-date-range-field'));
    await page.getByRole('button', {name: 'Open mobile date range calendar'}).click();
    const popup = await field.portal();
    await expect(popup).toBeVisible();

    await page.evaluate(() => {
        const decoy = document.createElement('tui-mobile-calendar-dropdown');
        decoy.dataset.testid = 'unrelated-mobile-calendar';
        decoy.style.cssText = 'position:fixed;bottom:0;right:0;z-index:0;display:block;pointer-events:none';
        decoy.innerHTML = '<tui-mobile-calendar><div automation-id="tui-primitive-calendar-mobile__cell">20</div></tui-mobile-calendar>';
        decoy.addEventListener('click', () => {
            decoy.dataset.clicked = 'true';
        });
        document.body.append(decoy);
    });

    const decoy = page.getByTestId('unrelated-mobile-calendar');
    await expect(decoy).toBeVisible();
    await field.selectRange(20, 22);

    await expect(page.getByTestId('mobile-date-range-model')).toHaveText('20-22');
    await expect(field.input).toHaveAttribute('aria-expanded', 'false');
    await expect(decoy).not.toHaveAttribute('data-clicked', 'true');
});

test('Mobile InputDate selects a day in the next virtualized month', async ({page, isMobile}) => {
    test.skip(!isMobile, 'This is the real mobile-only Taiga UI calendar.');

    await page.goto('/?fixture=remaining-mobile-overlays');
    const field = tuiMobileDateCalendar(page.getByTestId('calendar-dropdown-field'));
    await page.getByRole('button', {name: 'Open mobile calendar dropdown'}).click();
    await expect(await field.portal()).toBeVisible();

    await field.selectAdjacentMonthDay(2, 'next');

    await expect(page.getByTestId('mobile-date-model')).toHaveText('2026-10-2');
    await expect(field.input).toHaveAttribute('aria-expanded', 'false');
});

test('Mobile InputDateRange selects across October and November in its own popup', async ({page, isMobile}) => {
    test.skip(!isMobile, 'This is the real mobile-only Taiga UI calendar.');

    await page.goto('/?fixture=remaining-mobile-overlays');
    const field = tuiMobileDateCalendar(page.getByTestId('mobile-date-range-field'));
    await page.getByRole('button', {name: 'Open mobile date range calendar'}).click();
    await expect(await field.portal()).toBeVisible();

    await page.evaluate(() => {
        const unrelated = document.createElement('tui-mobile-calendar-dropdown');
        unrelated.dataset.testid = 'other-month-calendar';
        unrelated.style.cssText = 'position:fixed;right:0;bottom:0;z-index:0;pointer-events:none;display:block';
        unrelated.innerHTML = '<tui-mobile-calendar><div automation-id="tui-primitive-calendar-mobile__cell">2</div></tui-mobile-calendar>';
        unrelated.addEventListener('click', () => {
            unrelated.dataset.clicked = 'true';
        });
        document.body.append(unrelated);
    });
    const unrelated = page.getByTestId('other-month-calendar');
    await expect(unrelated).toBeVisible();

    await field.selectRangeAcrossNextMonth(30, 2);

    await expect(page.getByTestId('mobile-date-range-full-model'))
        .toHaveText(/2026-9-30:\\s*2026-10-2/);
    await expect(field.input).toHaveAttribute('aria-expanded', 'false');
    await expect(unrelated).not.toHaveAttribute('data-clicked', 'true');
});

test('Mobile InputDateRange crosses the December to January year boundary', async ({page, isMobile}) => {
    test.skip(!isMobile, 'This is the real mobile-only Taiga UI calendar.');

    await page.goto('/?fixture=remaining-mobile-overlays');
    await page.getByRole('button', {name: 'Set December date range'}).click();

    const field = tuiMobileDateCalendar(page.getByTestId('mobile-date-range-field'));
    await page.getByRole('button', {name: 'Open mobile date range calendar'}).click();
    await expect(await field.portal()).toBeVisible();

    await field.selectRangeAcrossNextMonth(30, 2);

    await expect(page.getByTestId('mobile-date-range-full-model'))
        .toHaveText(/2026-11-30:\\s*2027-0-2/);
    await expect(field.input).toHaveAttribute('aria-expanded', 'false');
});

test('Mobile sheet dialog uses the Taiga UI service and overlay', async ({page, isMobile}) => {
    test.skip(!isMobile, 'Mobile sheet portal is tested with touch/mobile emulation');

    await page.goto('/?fixture=remaining-mobile-overlays');
    await page.getByRole('button', {name: 'Open sheet dialog'}).click();

    await tuiSheetDialog(page.locator('tui-sheet-dialog')).expectSheet('Mobile sheet content');
    await expect(page.getByTestId('sheet-status')).toHaveText('open');
});
