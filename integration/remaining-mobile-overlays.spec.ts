import {expect, test} from '@playwright/test';
import {
    tuiMobileCalendarDropdown, tuiPullToRefresh, tuiSheetDialog,
} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/?fixture=remaining-mobile-overlays');
    await expect(page.getByTestId('remaining-mobile-overlays')).toBeVisible();
});

test('MobileCalendarDropdown switches the date input to a native mobile calendar', async ({page}) => {
    await page.getByRole('textbox', {name: 'Mobile calendar input'}).click();
    await tuiMobileCalendarDropdown(page.locator('tui-mobile-calendar-dropdown'))
        .expectCalendar();
});

test('PullToRefresh projects a scrollable child under its real scroll reference', async ({page}) => {
    await tuiPullToRefresh(page.getByTestId('pull-widget'))
        .expectContent('Pullable scrolling content');
});

test('SheetDialog opens in a mobile modal with a real service', async ({page}) => {
    await page.getByRole('button', {name: 'Open sheet dialog'}).click();
    await tuiSheetDialog(page.locator('tui-sheet-dialog'))
        .expectSheet('Mobile sheet content');
    await expect(page.getByTestId('sheet-status')).toHaveText('open');
});
