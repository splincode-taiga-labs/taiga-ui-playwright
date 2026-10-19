import {expect, test} from '@playwright/test';
import {
    tuiNotification, tuiBadgedContent, tuiBlockStatus, tuiCard, tuiInputSearch,
} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('notification-layout')).toBeVisible();
});

test('Notification reflects actual reactive appearance and size', async ({page}) => {
    const notice = tuiNotification(page.getByTestId('inline-notification'));
    await notice.expectState('info', 's');
    await page.getByRole('button', {name: 'Change notification'}).click();
    await notice.expectState('warning', 'l');
    await expect(notice.host).toContainText('Updates are available');
});

test('BadgedContent projects two badges and updates them independently', async ({page}) => {
    const badged = tuiBadgedContent(page.getByTestId('badged-wrapper'));
    await badged.expectBadge('top', '2');
    await badged.expectBadge('bottom', '5');
    await page.getByRole('button', {name: 'Update top badge'}).click();
    await badged.expectBadge('top', '7');
    await page.getByRole('button', {name: 'Hide bottom badge'}).click();
    await badged.expectBadgeAbsent('bottom');
    await badged.expectBadge('top', '7');
});

test('BlockStatus switches card layout and dispatches its projected action', async ({page}) => {
    const status = tuiBlockStatus(page.getByTestId('block-status-widget'));
    await status.expectState('l', false);
    await expect(status.heading).toHaveText('No results');
    await status.clickAction('Restore results');
    await expect(page.getByTestId('block-status-action-model')).toHaveText('1');
    await page.getByRole('button', {name: 'Compact status'}).click();
    await status.expectState('m', true);
});

test('Card changes collapsed clip-path when the Angular input changes', async ({page}) => {
    const card = tuiCard(page.getByTestId('card-layout-widget'));
    await card.expectSpace('normal');
    await card.expectCollapsed(false);
    await page.getByRole('button', {name: 'Toggle collapsed card'}).click();
    await card.expectCollapsed(true);
    await page.getByRole('button', {name: 'Toggle collapsed card'}).click();
    await card.expectCollapsed(false);
});

test('InputSearch moves its textfield into a popup and closes with Escape', async ({page}) => {
    const field = tuiInputSearch(page.getByTestId('input-search-widget'));
    await field.fill('Al');
    await expect(page.getByTestId('input-search-open')).toHaveText('true');
    await expect(page.getByTestId('input-search-value')).toHaveText('Al');
    await field.close();
    await expect(page.getByTestId('input-search-open')).toHaveText('false');

    await field.open();
    await field.chooseResult('Alpha result');
    await expect(page.getByTestId('input-search-selection')).toHaveText('Alpha');
    await expect(field.popup).toHaveCount(0);
});

test('InputSearch scopes results and Escape to the popup containing its host', async ({page}) => {
    const field = tuiInputSearch(page.getByTestId('input-search-widget'));
    await field.fill('Al');

    await page.evaluate(() => {
        const unrelated = document.createElement('tui-input-search-content');
        unrelated.setAttribute('data-testid', 'unrelated-search-popup');
        unrelated.style.cssText = 'display:block;position:fixed;right:0;bottom:0;z-index:0';
        unrelated.innerHTML = '<button type="button">Alpha result</button>';
        unrelated.querySelector('button')?.addEventListener('click', () => {
            unrelated.setAttribute('data-selected', 'true');
        });
        document.body.appendChild(unrelated);
    });

    const unrelated = page.getByTestId('unrelated-search-popup');
    await expect(unrelated).toBeVisible();
    await expect(field.popup).toContainText('Alpha result');
    await field.chooseResult('Alpha result');
    await expect(page.getByTestId('input-search-selection')).toHaveText('Alpha');
    await expect(field.popup).toHaveCount(0);
    await expect(unrelated).toBeVisible();
    await expect(unrelated).not.toHaveAttribute('data-selected', 'true');

    await field.open();
    await expect(field.popup).toBeVisible();
    await field.close();
    await expect(field.popup).toHaveCount(0);
    await expect(page.getByTestId('input-search-open')).toHaveText('false');
    await expect(unrelated).toBeVisible();
});
