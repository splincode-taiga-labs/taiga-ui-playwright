import {expect, test} from '@playwright/test';
import {tuiInputDateMulti, tuiInputRange, tuiMultiSelect} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('multi-fields')).toBeVisible();
});

test('MultiSelect chooses two values through its owned portal and updates Angular FormControl', async ({page}) => {
    const multi = tuiMultiSelect(page.getByTestId('multi-select-field'));
    await multi.selectOption('Estonia');
    await expect(page.getByTestId('multi-select-model')).toHaveText('Estonia');
    await multi.selectOption('Latvia');
    await expect(page.getByTestId('multi-select-model')).toHaveText('Estonia,Latvia');
    await expect(multi.chips).toHaveCount(2);
    expect((await multi.selectedLabels()).map(s => s.trim())).toEqual(['Estonia', 'Latvia']);
});

test('MultiSelect rejects non-existent options without changing the model', async ({page}) => {
    const multi = tuiMultiSelect(page.getByTestId('multi-select-field'));
    await multi.selectOption('Austria');
    await expect(page.getByTestId('multi-select-model')).toHaveText('Austria');
    await expect(multi.selectOption('Unknown country')).rejects.toThrow();
    await expect(page.getByTestId('multi-select-model')).toHaveText('Austria');
});

test('InputDateMulti selects several distinct calendar days into its Angular array model', async ({page}) => {
    const dates = tuiInputDateMulti(page.getByTestId('date-multi-field'));
    await expect(page.getByTestId('date-multi-model')).toHaveText('15');
    await dates.toggleDay(17);
    await expect(page.getByTestId('date-multi-model')).toHaveText('15,17');
    await dates.toggleDay(18);
    await expect(page.getByTestId('date-multi-model')).toHaveText('15,17,18');
    await expect(dates.chips).toHaveCount(3);
    await expect(dates.toggleDay(0)).rejects.toThrow(/from 1 through 31/);
});

test('InputRange edits both numeric bounds and synchronizes its slider', async ({page}) => {
    const range = tuiInputRange(page.getByTestId('input-range-field'));
    await expect(page.getByTestId('input-range-model')).toHaveText('20,60');
    await range.setStart(30);
    await expect(page.getByTestId('input-range-model')).toHaveText('30,60');
    await range.setEnd(70);
    await expect(page.getByTestId('input-range-model')).toHaveText('30,70');
    await expect(range.range).toBeVisible();
    await expect(range.setStart(Number.NaN)).rejects.toThrow(/finite number/);
});
