import {expect, test} from '@playwright/test';
import {
    tuiBlock, tuiDataListWrapper, tuiInputMonthRange, tuiLineClamp, tuiTimeline,
} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('kit-interactions')).toBeVisible();
});

test('DataListWrapper selects a real option and shows a loading state', async ({page}) => {
    const list = tuiDataListWrapper(page.getByTestId('standalone-data-list-wrapper'));
    await expect(list.options).toHaveCount(2);
    await list.selectOption('Beta');
    await expect(page.getByTestId('data-list-wrapper-model')).toHaveText('Beta');

    await page.getByRole('button', {name: 'Load options'}).click();
    await list.expectLoading();
    await page.getByRole('button', {name: 'Resolve options'}).click();
    await expect(list.loader).toHaveCount(0);
    await list.selectOption('Delta');
    await expect(page.getByTestId('data-list-wrapper-model')).toHaveText('Delta');
});

test('LineClamp applies new line count and changes visible max height', async ({page}) => {
    const clamp = tuiLineClamp(page.getByTestId('kit-line-clamp'));
    await clamp.expectLines(1);
    const before = await clamp.maxHeight();
    await page.getByRole('button', {name: 'Expand text to 3 lines'}).click();
    await clamp.expectLines(3);
    expect(await clamp.maxHeight()).toBeGreaterThan(before);
    await expect(clamp.content).toContainText('The full text remains');
});

test('Block toggles a native checked state and mirrors the disabled FormControl', async ({page}) => {
    const block = tuiBlock(page.getByTestId('kit-block'));
    await block.expectSize('l');
    await block.setChecked(true);
    await expect(page.getByTestId('block-model')).toHaveText('true');
    await page.getByRole('button', {name: 'Make block small'}).click();
    await block.expectSize('s');
    await page.getByRole('button', {name: 'Disable block'}).click();
    await block.expectDisabled();
});

test('Timeline handles native keyboard dragging and orientation changes', async ({page}) => {
    const timeline = tuiTimeline(page.getByTestId('kit-timeline'));
    await timeline.expectOrientation('horizontal');
    await expect(page.getByTestId('timeline-model')).toHaveText('10-30');
    await timeline.moveStartOneStepRight();
    await expect(page.getByTestId('timeline-model')).toHaveText('11-31');
    await page.getByRole('button', {name: 'Vertical timeline'}).click();
    await timeline.expectOrientation('vertical');
});

test('InputMonthRange chooses a bounded range in its own calendar portal', async ({page}) => {
    const months = tuiInputMonthRange(page.getByTestId('month-range-field'));
    await months.selectRange(2, 4);
    await expect(page.getByTestId('month-range-model')).toContainText('2026:2-4');
    await expect(months.input).not.toHaveValue('');
});
