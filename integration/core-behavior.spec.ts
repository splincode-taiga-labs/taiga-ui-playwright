import {expect, test} from '@playwright/test';
import {tuiCarousel, tuiDataList, tuiError, tuiScrollbar, tuiTextfield} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('core-behavior')).toBeVisible();
});

test('Error displays and clears the live validation message', async ({page}) => {
    const error = tuiError(page.getByTestId('validation-error'));
    await error.expectCleared();
    await page.getByRole('button', {name: 'Show validation error'}).click();
    await error.expectError('Invalid value');
    await page.getByRole('button', {name: 'Clear validation error'}).click();
    await error.expectCleared();
});

test('DataList moves focus with ArrowDown and selects an enabled option', async ({page}) => {
    const list = tuiDataList(page.getByTestId('choice-list'));
    await expect(list.options).toHaveCount(4);
    await list.focusNext('Alpha', 'Beta');
    await expect(list.option('Unavailable')).toBeDisabled();
    await list.select('Gamma');
    await expect(page.getByTestId('choice-model')).toHaveText('Gamma');
});

test('Textfield clears its underlying Angular FormControl and detects disabled input', async ({page}) => {
    const field = tuiTextfield(page.getByTestId('clearable-textfield'));
    await field.focus();
    await expect(field.input).toHaveValue('Initial text');
    await field.clear();
    await expect(page.getByTestId('textfield-model')).toHaveText('');
    await tuiTextfield(page.getByTestId('disabled-textfield')).expectDisabled();
});

test('Scrollbar scrolls the real content to both ends', async ({page}) => {
    const scrollbar = tuiScrollbar(page.getByTestId('scrollbar-widget'));
    expect(await scrollbar.scrollOffset()).toBe(0);
    await scrollbar.scrollToBottom();
    await expect(page.getByTestId('scroll-content-bottom')).toBeInViewport();
    expect(await scrollbar.scrollOffset()).toBeGreaterThan(0);
    await scrollbar.scrollToTop();
    expect(await scrollbar.scrollOffset()).toBe(0);
});

test('Carousel changes the Angular index using scroll snapping', async ({page}) => {
    const carousel = tuiCarousel(page.getByTestId('carousel-widget'));
    await expect(page.getByTestId('carousel-model')).toHaveText('0');
    await expect(carousel.slide('Slide 1')).toBeVisible();
    await carousel.moveNext();
    await expect(page.getByTestId('carousel-model')).toHaveText('1');
    await carousel.expectCenteredSlide();
    await carousel.movePrevious();
    await expect(page.getByTestId('carousel-model')).toHaveText('0');
});
