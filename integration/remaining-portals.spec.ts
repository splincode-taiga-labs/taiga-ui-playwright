import {expect, test} from '@playwright/test';
import {tuiAlert, tuiDropdownPortal, tuiHintPortal, tuiModal, tuiPopup} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('remaining-portals')).toBeVisible();
});

test('Alert directive injects real Taiga alert into the popup system', async ({page}) => {
    await page.getByRole('button', {name: 'Open alert'}).click();
    await tuiAlert(page.locator('tui-toast')).expectAlert('Portal alert content');
});

test('Dropdown portal opens a list with a selectable option', async ({page}) => {
    await page.getByRole('button', {name: 'Open dropdown portal'}).click();
    await tuiDropdownPortal(page.locator('tui-dropdown:visible')).expectMenuOption('Portal option');
    await page.locator('tui-dropdown:visible').getByRole('option', {name: 'Portal option'}).click();
    await expect(page.getByTestId('portal-dropdown-value')).toHaveText('Portal option');
});

test('Hint uses a real tooltip portal under a manual visibility driver', async ({page}) => {
    await page.getByRole('button', {name: 'Toggle portal hint'}).click();
    await tuiHintPortal(page.locator('tui-hint')).expectHint('Manual hint text');
    await page.getByRole('button', {name: 'Toggle portal hint'}).click();
    await expect(page.locator('tui-hint')).toHaveCount(0);
});

test('Modal portal uses aria-modal and shows the sheet dialog content', async ({page}) => {
    await page.getByRole('button', {name: 'Open modal portal'}).click();
    await tuiModal(page.locator('tui-modal')).expectDialog('The modal portal content');
});

test('Popup adds and removes embedded content through the TuiPopupService', async ({page}) => {
    await page.getByRole('button', {name: 'Toggle popup template'}).click();
    const popup = tuiPopup(page.getByTestId('portal-popup-content'));
    await popup.expectPortalContent('Projected popup portal content');
    await page.getByRole('button', {name: 'Toggle popup template'}).click();
    await expect(popup.host).toHaveCount(0);
});
