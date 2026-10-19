import {expect, test} from '@playwright/test';
import {tuiAlert, tuiDropdownPortal, tuiHintPortal, tuiModal, tuiPopup} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/?fixture=remaining-portals');
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

test('Dropdown only accepts exact option names in the real Taiga UI portal', async ({page}) => {
    await page.getByRole('button', {name: 'Open dropdown portal'}).click();
    const dropdown = tuiDropdownPortal(page.locator('tui-dropdown:visible'));

    await expect(dropdown.expectMenuOption('Portal')).rejects.toThrow();
    await dropdown.expectMenuOption('Portal option');
    await expect(page.getByTestId('portal-dropdown-value')).toHaveText('');
});

test('Dropdown rejects ambiguous options with identical accessible names', async ({page}) => {
    await page.getByRole('button', {name: 'Open dropdown portal'}).click();
    const host = page.locator('tui-dropdown:visible');
    const dropdown = tuiDropdownPortal(host);

    await host.locator('tui-data-list').evaluate((list) => {
        const original = list.querySelector('[tuiOption]');
        if (!(original instanceof HTMLElement)) {
            throw new Error('Real Taiga UI option is missing');
        }

        const duplicate = original.cloneNode(true);
        list.appendChild(duplicate);
    });
    await expect(host.getByRole('option', {name: 'Portal option', exact: true})).toHaveCount(2);
    await expect(dropdown.expectMenuOption('Portal option')).rejects.toThrow();
    await expect(page.getByTestId('portal-dropdown-value')).toHaveText('');
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
