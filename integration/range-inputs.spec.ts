import {expect, test} from '@playwright/test';
import {tuiCalendarRange, tuiInputDateRange, tuiInputDateTime, tuiInputMonth} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('range-inputs')).toBeVisible();
});

test('CalendarRange chooses start/end within its first month and updates TuiDayRange', async ({page}) => {
    const range = tuiCalendarRange(page.getByTestId('standalone-calendar-range'));
    await range.selectRange(18, 20);
    await expect(page.getByTestId('calendar-range-model')).toHaveText('18-20');
    await expect(range.selectRange(21, 20)).rejects.toThrow(/Start day/);
});

test('InputDateRange resolves its own portal and updates Angular FormControl', async ({page}) => {
    const range = tuiInputDateRange(page.getByTestId('date-range-field'));
    await range.selectRange(18, 20);
    await expect(page.getByTestId('date-range-model')).toHaveText('18-20');
    await expect(range.input).not.toHaveValue('');
});

test('InputDateTime changes the date while preserving the time', async ({page}) => {
    const dateTime = tuiInputDateTime(page.getByTestId('datetime-field'));
    await dateTime.selectDay(22);
    await expect(page.getByTestId('datetime-model')).toHaveText('22-11:30');
});

test('InputMonth chooses a month from its real calendar popup', async ({page}) => {
    const month = tuiInputMonth(page.getByTestId('month-input-field'));
    await month.selectMonth(2);
    await expect(page.getByTestId('input-month-model')).toHaveText('2026-2');
    await expect(month.selectMonth(12)).rejects.toThrow(/0 through 11/);
});
