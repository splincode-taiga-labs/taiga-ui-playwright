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

test('InputDateRange uses its preopened calendar and ignores an unrelated dropdown', async ({page}) => {
    const field = tuiInputDateRange(page.getByTestId('date-range-field'));
    await field.input.click();
    await expect(field.input).toHaveAttribute('aria-expanded', 'true');

    const id = await field.input.getAttribute('aria-controls');
    expect(id).toBeTruthy();
    const owned = page.locator('tui-dropdown:visible').and(page.locator('[id=' + JSON.stringify(id) + ']'));
    await expect(owned).toBeVisible();

    await page.evaluate(() => {
        const unrelated = document.createElement('tui-dropdown');
        unrelated.dataset.testid = 'unrelated-date-range-popup';
        unrelated.style.cssText = 'display:block;position:fixed;right:0;bottom:0;z-index:0';
        unrelated.innerHTML = '<tui-calendar-range><button type="button">18</button><button type="button">20</button></tui-calendar-range>';
        unrelated.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
            unrelated.dataset.selected = 'true';
        }));
        document.body.appendChild(unrelated);
    });
    const unrelated = page.getByTestId('unrelated-date-range-popup');
    await expect(unrelated).toBeVisible();

    await field.selectRange(18, 20);

    await expect(page.getByTestId('date-range-model')).toHaveText('18-20');
    await expect(owned).toBeHidden();
    await expect(unrelated).toBeVisible();
    await expect(unrelated).not.toHaveAttribute('data-selected', 'true');
});

test('InputDateTime selects from its already-expanded calendar', async ({page}) => {
    const field = tuiInputDateTime(page.getByTestId('datetime-field'));
    await field.input.click();
    await expect(field.input).toHaveAttribute('aria-expanded', 'true');

    await field.selectDay(22);

    await expect(page.getByTestId('datetime-model')).toHaveText('22-11:30');
});

test('InputMonth selects from its already-expanded calendar', async ({page}) => {
    const field = tuiInputMonth(page.getByTestId('month-input-field'));
    await field.input.click();
    await expect(field.input).toHaveAttribute('aria-expanded', 'true');

    await field.selectMonth(2);

    await expect(page.getByTestId('input-month-model')).toHaveText('2026-2');
});
