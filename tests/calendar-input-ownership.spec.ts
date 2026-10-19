import {expect, test} from '@playwright/test';

import {tuiInputDate, tuiInputDateRange} from '../src/index.js';

test('InputDate refuses ambiguous aria-controls instead of guessing a visible popup', async ({page}) => {
    await page.setContent(`
        <tui-textfield data-testid="date-field">
            <input tuiInputDate aria-expanded="true" aria-controls="calendar-one calendar-two">
        </tui-textfield>
        <tui-dropdown id="calendar-one"></tui-dropdown>
        <tui-dropdown id="calendar-two"></tui-dropdown>
    `);

    const field = tuiInputDate(page.getByTestId('date-field'));
    await expect(field.calendar()).rejects.toThrow(/single aria-controls ID/);
});

test('InputDateRange refuses ambiguous aria-controls instead of selecting either portal', async ({page}) => {
    await page.setContent(`
        <tui-textfield data-testid="range-field">
            <input tuiInputDateRange aria-expanded="true" aria-controls="range-one range-two">
        </tui-textfield>
        <tui-dropdown id="range-one"></tui-dropdown>
        <tui-dropdown id="range-two"></tui-dropdown>
    `);

    const field = tuiInputDateRange(page.getByTestId('range-field'));
    await expect(field.selectRange(18, 20)).rejects.toThrow(/single aria-controls ID/);
});
