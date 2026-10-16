import {expect, test} from '@playwright/test';
import {tuiCopy, tuiInputChip, tuiLike, tuiProgress, tuiRating} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('interactive-widgets')).toBeVisible();
});

test('Rating changes real Angular FormControl using native keyboard interaction', async ({page}) => {
    const rating = tuiRating(page.getByTestId('rating-widget'));
    await rating.rate(4);
    await expect(page.getByTestId('rating-model')).toHaveText('4');
    expect(await rating.value()).toBe(4);
    await rating.rate(2);
    await expect(page.getByTestId('rating-model')).toHaveText('2');
    await expect(rating.rate(6)).rejects.toThrow(/from 1 to 5/);
});

test('Like checkbox toggles the real Angular boolean model', async ({page}) => {
    const like = tuiLike(page.getByTestId('like-widget'));
    await like.setLiked(true);
    await expect(page.getByTestId('like-model')).toHaveText('true');
    await like.setLiked(false);
    await expect(page.getByTestId('like-model')).toHaveText('false');
});

test('Copy puts the exact Taiga UI content into the browser clipboard', async ({page, context}) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const copy = tuiCopy(page.getByTestId('copy-widget'));
    await expect(copy.content).toHaveText('Copy this exact value: 42');
    await copy.copy();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe('Copy this exact value: 42');
});

test('InputChip adds and removes tags in a real Angular array FormControl', async ({page}) => {
    const chips = tuiInputChip(page.getByTestId('chip-widget'));
    await chips.add('Alpha');
    await expect(page.getByTestId('chip-model')).toContainText('"Alpha"');
    await chips.add('Beta');
    await expect(page.getByTestId('chip-model')).toContainText('"Beta"');
    await chips.remove('Alpha');
    await expect(page.getByTestId('chip-model')).not.toContainText('"Alpha"');
    await expect(page.getByTestId('chip-model')).toContainText('"Beta"');
});

test('Progress reads the native value and reacts to Angular updates', async ({page}) => {
    const progress = tuiProgress(page.getByTestId('progress-widget'));
    await progress.expectValue(25);
    expect(await progress.max()).toBe(100);
    await page.getByRole('button', {name: 'Advance progress'}).click();
    await progress.expectValue(75);
    await expect(page.getByTestId('progress-model')).toHaveText('75');
});
