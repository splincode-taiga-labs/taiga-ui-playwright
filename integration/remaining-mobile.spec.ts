import {expect, test} from '@playwright/test';
import {
    tuiBottomSheet, tuiKeypad, tuiMobileCalendar,
    tuiMobileCalendarSheet, tuiSearchBar, tuiSwipeActions, tuiTabBar,
} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/?fixture=remaining-mobile');
    await expect(page.getByTestId('remaining-mobile')).toBeVisible();
});

test('BottomSheet reacts to a new snap stop and hides its drag bar', async ({page}) => {
    const sheet = tuiBottomSheet(page.getByTestId('bottom-sheet-widget'));
    await sheet.expectStops(2, true);
    await page.getByRole('button', {name: 'Add sheet stop'}).click();
    await sheet.expectStops(3, false);
});

test('Keypad changes its real column count and drives a model', async ({page}) => {
    const keypad = tuiKeypad(page.getByTestId('keypad-widget'));
    await keypad.expectColumns(3);
    await keypad.press('1');
    await expect(page.getByTestId('keypad-value')).toHaveText('1');
    await page.getByRole('button', {name: 'Two keypad columns'}).click();
    await keypad.expectColumns(2);
});

test('MobileCalendar renders a virtualized calendar and interactive sheet', async ({page}) => {
    await page.getByRole('button', {name: 'Open mobile calendar'}).click();
    const calendar = tuiMobileCalendar(page.getByTestId('mobile-calendar-widget'));
    await calendar.expectInitialized();
    const sheet = tuiMobileCalendarSheet(calendar.calendarSheets.first());
    await sheet.expectDays();
});

test('MobileSearchBar updates the style and its native search value', async ({page}) => {
    const bar = tuiSearchBar(page.getByTestId('mobile-search-widget'));
    await bar.expectAppearance('neutral');
    await bar.fill('needle');
    await page.getByRole('button', {name: 'Floating mobile search'}).click();
    await bar.expectAppearance('floating');
});

test('SwipeActions projects separate content and a functional action', async ({page}) => {
    const swipe = tuiSwipeActions(page.getByTestId('swipe-actions-widget'));
    await swipe.expectProjectedAction('Archive');
    await swipe.host.locator('.t-actions').getByRole('button', {name: 'Archive'}).click();
    await expect(page.getByTestId('archive-count')).toHaveText('1');
});

test('TabBar changes active tab and skeleton count', async ({page}) => {
    const bar = tuiTabBar(page.getByTestId('tab-bar-widget'));
    await bar.expectSkeletons(4);
    await bar.selectTab('Profile');
    await expect(page.getByTestId('active-tab')).toHaveText('1');
    await page.getByRole('button', {name: 'Use two tabs'}).click();
    await bar.expectSkeletons(2);
});
