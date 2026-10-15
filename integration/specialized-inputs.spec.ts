import {expect, test} from '@playwright/test';
import {
    tuiInputColor,
    tuiInputNumber,
    tuiInputPhone,
    tuiInputPin,
    tuiInputSlider,
    tuiSlider,
} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('specialized-inputs')).toBeVisible();
});

test('InputNumber commits a numeric value to Angular FormControl', async ({page}) => {
    const field = tuiInputNumber(page.getByTestId('number-field'));
    await field.fill('42');
    await expect(page.getByTestId('number-model')).toHaveText('42');
    await expect(field.input).toHaveValue('42');
});

test('InputPhone applies Taiga UI phone mask and updates Angular model', async ({page}) => {
    const field = tuiInputPhone(page.getByTestId('phone-field'));
    await field.fill('9991234567');

    await expect(page.getByTestId('phone-model')).toContainText('999');
    await expect(field.input).toHaveValue(/999/);
});

test('InputPin edits a real Angular form field', async ({page}) => {
    const field = tuiInputPin(page.getByTestId('pin-field'));
    await field.fill('1234');

    await expect(page.getByTestId('pin-model')).toContainText('1234');
});

test('InputColor synchronizes a CSS hex color with its form model', async ({page}) => {
    const field = tuiInputColor(page.getByTestId('color-field'));
    await field.fill('#112233');

    await expect(page.getByTestId('color-model')).toHaveText('#112233');
});

test('InputSlider supports numeric entry into a synchronized slider', async ({page}) => {
    const field = tuiInputSlider(page.getByTestId('input-slider-field'));
    await field.fill('65');

    await expect(page.getByTestId('input-slider-model')).toHaveText('65');
});

test('native Slider responds to keyboard arrows and updates Angular model', async ({page}) => {
    const slider = tuiSlider(page.getByTestId('range-slider'));
    await slider.stepRight();

    await expect(page.getByTestId('range-slider-model')).toHaveText('11');
    expect(await slider.value()).toBe(11);

    await slider.stepLeft();
    await expect(page.getByTestId('range-slider-model')).toHaveText('10');
});
