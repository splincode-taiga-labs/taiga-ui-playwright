import {expect, test} from '@playwright/test';
import {tuiCounter, tuiExpand, tuiInputInline, tuiRadioList, tuiRange} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('form-navigation-widgets')).toBeVisible();
});

test('Counter honors bounds and updates Angular FormControl', async ({page}) => {
    const counter = tuiCounter(page.getByTestId('counter-widget'));
    expect(await counter.value()).toBe(1);
    await counter.increase();
    await expect(page.getByTestId('counter-model')).toHaveText('2');
    await expect(counter.increment).toBeDisabled();
    await counter.decrease();
    await counter.decrease();
    await expect(page.getByTestId('counter-model')).toHaveText('0');
    await expect(counter.decrement).toBeDisabled();
});

test('RadioList selects one named radio and changes the reactive form model', async ({page}) => {
    const radio = tuiRadioList(page.getByTestId('radio-list-widget'));
    await radio.select('Medium');
    await expect(page.getByTestId('radio-list-model')).toHaveText('Medium');
    await expect(radio.option('Small')).not.toBeChecked();
    await radio.select('Large');
    await expect(page.getByTestId('radio-list-model')).toHaveText('Large');
});

test('InputInline mirrors its native input and Angular model', async ({page}) => {
    const inline = tuiInputInline(page.getByTestId('inline-widget'));
    await inline.fill('Edited inline');
    await expect(page.getByTestId('inline-model')).toHaveText('Edited inline');
    await inline.fill('');
    await expect(page.getByTestId('inline-model')).toHaveText('');
    await expect(inline.host.locator('[automation-id="tui-input-inline__placeholder"]')).toBeVisible();
});

test('Range changes its start and end through native thumb keyboard navigation', async ({page}) => {
    const range = tuiRange(page.getByTestId('range-widget'));
    await expect(range.start).toHaveValue('30');
    await expect(range.end).toHaveValue('70');
    await range.stepStartRight();
    await expect(page.getByTestId('range-model')).toHaveText('31,70');
    await range.stepEndLeft();
    await expect(page.getByTestId('range-model')).toHaveText('31,69');
});

test('Expand renders and collapses its content through signal input', async ({page}) => {
    const expand = tuiExpand(page.getByTestId('expand-widget'));
    await expand.expectCollapsed();
    await page.getByRole('button', {name: 'Toggle details'}).click();
    await expand.expectExpanded();
    await expect(page.getByTestId('expanded-content')).toBeVisible();
    await expect(page.getByTestId('expand-model')).toHaveText('true');
    await page.getByRole('button', {name: 'Toggle details'}).click();
    await expand.expectCollapsed();
    await expect(page.getByTestId('expand-model')).toHaveText('false');
});
