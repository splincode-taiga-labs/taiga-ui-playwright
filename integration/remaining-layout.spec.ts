import {expect, test} from '@playwright/test';
import {
    tuiRoot, tuiComment, tuiMessage, tuiDrawer, tuiHeader,
    tuiBlockDetails, tuiSurface, tuiSearch, tuiAppBar, tuiProgressiveBlur,
} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/?fixture=remaining-layout');
    await expect(page.getByTestId('remaining-layout')).toBeVisible();
});

test('Root projects the app and mounts the Taiga popup system', async ({page}) => {
    await tuiRoot(page.locator('tui-root').first()).expectBootstrapped();
});

test('Comment changes its directional appearance through an Angular input', async ({page}) => {
    const comment = tuiComment(page.getByTestId('comment-widget'));
    await comment.expectDirection('top');
    await page.getByRole('button', {name: 'Flip comment'}).click();
    await comment.expectDirection('bottom');
});

test('Message projects a real Taiga style host and message text', async ({page}) => {
    await tuiMessage(page.getByTestId('message-widget')).expectMessage('Example validation message');
});

test('Drawer changes overlay class and directional layout', async ({page}) => {
    const drawer = tuiDrawer(page.getByTestId('drawer-widget'));
    await drawer.expectState('end', false);
    await page.getByRole('button', {name: 'Toggle drawer configuration'}).click();
    await drawer.expectState('start', true);
});

test('Header changes typography size reactively', async ({page}) => {
    const header = tuiHeader(page.getByTestId('header-widget'));
    await header.expectSize('h5');
    await page.getByRole('button', {name: 'Promote heading'}).click();
    await header.expectSize('h3');
});

test('BlockDetails retains projected account information', async ({page}) => {
    await tuiBlockDetails(page.getByTestId('block-details-widget')).expectDetails('Account summary');
});

test('Surface carries the actual Taiga stylesheet version marker', async ({page}) => {
    await tuiSurface(page.getByTestId('surface-widget')).expectSurface();
});

test('Search contains a usable native search input and projected action', async ({page}) => {
    await tuiSearch(page.getByTestId('search-widget')).search('Example');
    await page.getByRole('button', {name: 'Search now'}).click();
    await expect(page.getByTestId('search-clicks')).toHaveText('1');
});

test('AppBar changes size and its end action is functional', async ({page}) => {
    const bar = tuiAppBar(page.getByTestId('app-bar-widget'));
    await bar.expectSize('m');
    await bar.clickEndAction('End action');
    await expect(page.getByTestId('app-bar-actions')).toHaveText('1');
    await page.getByRole('button', {name: 'Large app bar'}).click();
    await bar.expectSize('l');
});

test('ProgressiveBlur projects twenty gradient steps with distinct values', async ({page}) => {
    await tuiProgressiveBlur(page.getByTestId('blur-widget')).expectGradientSteps();
});
