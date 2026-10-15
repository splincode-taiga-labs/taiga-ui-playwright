import {expect, test} from '@playwright/test';
import {tuiCalendar, tuiCalendarMonth, tuiInputDate, tuiInputTime, tuiInputYear} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('calendar-inputs')).toBeVisible();
});

test('Calendar chooses an in-month day, emits TuiDay, and ignores adjacent month duplicates', async ({page}) => {
    const calendar = tuiCalendar(page.getByTestId('standalone-calendar'));
    await calendar.selectDay(20);
    await expect(page.getByTestId('calendar-model')).toContainText('2026-0-20');
    await expect(calendar.day(20)).toHaveAttribute('data-range', 'active');
    await expect(calendar.day(0)).rejects.toThrow(/1 through 31/);
});

test('CalendarMonth selects an actual month and emits TuiMonth', async ({page}) => {
    const calendar = tuiCalendarMonth(page.getByTestId('standalone-month-calendar'));
    await calendar.selectMonth('March');
    await expect(page.getByTestId('month-model')).toContainText('2026-2');
});

test('InputDate opens its own portaled calendar and updates FormControl', async ({page}) => {
    const field = tuiInputDate(page.getByTestId('date-input-field'));
    await field.selectDay(22);
    await expect(page.getByTestId('date-model')).toHaveText('2026-0-22');
    await expect(field.input).not.toHaveValue('');
});

test('InputYear accepts a four-digit year into a numeric FormControl', async ({page}) => {
    const field = tuiInputYear(page.getByTestId('year-input-field'));
    await field.fillYear(2031);
    await expect(page.getByTestId('year-model')).toHaveText('2031');
    await expect(field.fillYear(99)).rejects.toThrow(/four-digit/);
});

test('InputTime accepts 24-hour HH:MM and updates TuiTime', async ({page}) => {
    const field = tuiInputTime(page.getByTestId('time-input-field'));
    await field.fillTime('12:34');
    await expect(page.getByTestId('time-model')).toHaveText('12:34');
    await expect(field.fillTime('25:99')).rejects.toThrow(/HH:MM/);
});
