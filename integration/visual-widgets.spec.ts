import {expect, test} from '@playwright/test';
import {
    tuiAvatar, tuiBadgeNotification, tuiBreadcrumbs, tuiLoader, tuiStatus,
} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('visual-widgets')).toBeVisible();
});

test('Loader makes its content inert until loading is complete', async ({page}) => {
    const loader = tuiLoader(page.getByTestId('loader-widget'));
    await loader.expectLoading();
    await expect(page.getByTestId('loader-model')).toHaveText('true');
    await page.getByRole('button', {name: 'Toggle spinner'}).click();
    await loader.expectIdle();
    await expect(page.getByTestId('loader-model')).toHaveText('false');
    await page.getByRole('button', {name: 'Toggle spinner'}).click();
    await loader.expectLoading();
});

test('Avatar reflects current shape and size inputs', async ({page}) => {
    const avatar = tuiAvatar(page.getByTestId('avatar-widget'));
    await avatar.expectShape('round');
    await avatar.expectSize('m');
    await page.getByRole('button', {name: 'Toggle avatar shape'}).click();
    await avatar.expectShape('square');
});

test('BadgeNotification reflects a changed counter and size', async ({page}) => {
    const badge = tuiBadgeNotification(page.getByTestId('notification-badge'));
    await badge.expectCount(3);
    await badge.expectSize('s');
    await page.getByRole('button', {name: 'Update badge'}).click();
    await badge.expectCount(8);
    await badge.expectSize('m');
    await expect(badge.expectCount(-1)).rejects.toThrow(/non-negative/);
});

test('Status exposes the Angular-bound color through its CSS property', async ({page}) => {
    const status = tuiStatus(page.getByTestId('status-widget'));
    await status.expectColor('lime');
    await page.getByRole('button', {name: 'Update status'}).click();
    await status.expectColor('orange');
});

test('Breadcrumbs expose native links and navigate to the selected destination', async ({page}) => {
    const breadcrumbs = tuiBreadcrumbs(page.getByTestId('breadcrumbs-widget'));
    await breadcrumbs.expectSize('m');
    await expect(breadcrumbs.links).toHaveCount(3);
    await breadcrumbs.follow('Products');
    await expect(page).toHaveURL(/#visual-products$/);
});
