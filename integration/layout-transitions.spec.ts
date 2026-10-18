import {expect, test} from '@playwright/test';
import {tuiClose, tuiElasticContainer, tuiFloatingContainer, tuiList, tuiSlides} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('layout-transitions')).toBeVisible();
});

test('List updates Taiga sizing and projected list-item count', async ({page}) => {
    const list = tuiList(page.getByTestId('responsive-list'));
    await list.expectSize('l');
    await list.expectItems(['First', 'Second']);
    await page.getByRole('button', {name: 'Compact list'}).click();
    await list.expectSize('s');
    await page.getByRole('button', {name: 'Append list item'}).click();
    await list.expectItems(['First', 'Second', 'Third']);
});

test('Slides switches reactive directional motion and displayed content', async ({page}) => {
    const slides = tuiSlides(page.getByTestId('slides-widget'));
    await slides.expectDirection(0);
    await slides.expectSlide('Slide alpha');
    await page.getByRole('button', {name: 'Next content slide'}).click();
    await slides.expectDirection(1);
    await slides.expectSlide('Slide beta');
    await page.getByRole('button', {name: 'Previous content slide'}).click();
    await slides.expectDirection(-1);
    await slides.expectSlide('Slide alpha');
});

test('ElasticContainer responds to a real child-height change', async ({page}) => {
    const elastic = tuiElasticContainer(page.getByTestId('elastic-widget'));
    const initial = await elastic.getHeight();
    await page.getByRole('button', {name: 'Expand elastic content'}).click();
    await expect(elastic.wrapper).toContainText('Expanded content');
    await elastic.expectHeightGreaterThan(initial + 100);
});

test('FloatingContainer updates its background style input', async ({page}) => {
    const container = tuiFloatingContainer(page.getByTestId('floating-widget'));
    await container.expectBackground('rgb(255, 255, 255)');
    await page.getByRole('button', {name: 'Change floating background'}).click();
    await container.expectBackground('rgb(20, 40, 60)');
});

test('Close emits on Escape and on an outside pointer click', async ({page}) => {
    const trigger = page.getByRole('button', {name: 'Open closable panel'});
    const panel = tuiClose(page.getByTestId('closable-widget'));
    await trigger.click();
    await panel.dismissByEscape();
    await expect(page.getByTestId('close-model')).toHaveText('1');

    await trigger.click();
    await panel.dismissByOutsideClick(page.getByRole('button', {name: 'Outside close area'}));
    await expect(page.getByTestId('close-model')).toHaveText('2');
});
