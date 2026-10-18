import {expect, test} from '@playwright/test';
import {
    tuiFullscreen, tuiRoutableDialog, tuiDynamicHeader, tuiNavigation, tuiPdfViewer,
} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/?fixture=remaining-platform');
    await expect(page.getByTestId('remaining-platform')).toBeVisible();
});

test('Fullscreen hosts an independent nested Taiga root', async ({page}) => {
    await tuiFullscreen(page.getByTestId('fullscreen-widget')).expectRoot();
});

test('RoutableDialog opens from an Angular Router route', async ({page}) => {
    await page.getByRole('button', {name: 'Open routable dialog'}).click();
    const dialog = tuiRoutableDialog(page.locator('tui-dialog'));
    await dialog.expectRouted('Routed dialog fixture');
    await dialog.close();
});

test('DynamicHeader projects content inside its scroll container', async ({page}) => {
    await tuiDynamicHeader(page.getByTestId('dynamic-header-widget'))
        .expectTitle('Dynamic header content');
    const container = page.getByTestId('dynamic-header-container');
    await container.evaluate((element) => {
        element.scrollTop = 20;
        element.dispatchEvent(new Event('scroll'));
        element.scrollTop = 70;
        element.dispatchEvent(new Event('scroll'));
    });
    await tuiDynamicHeader(page.getByTestId('dynamic-header-widget')).expectDirection('-1');
});

test('Navigation aside updates expanded presentation on input changes', async ({page}) => {
    const nav = tuiNavigation(page.getByTestId('navigation-widget'));
    await nav.expectExpanded(false);
    await page.getByRole('button', {name: 'Expand aside navigation'}).click();
    await nav.expectExpanded(true);
    await expect(nav.host.getByRole('link', {name: 'Navigation home'})).toBeVisible();
});

test('PdfViewer renders a fullscreen dialog with projected title and actions', async ({page}) => {
    await page.getByRole('button', {name: 'Open PDF viewer'}).click();
    const pdf = tuiPdfViewer(page.getByTestId('pdf-viewer-widget'));
    await pdf.expectPdf('Sample.pdf');
    await page.getByRole('button', {name: 'Close PDF viewer'}).click();
    await expect(pdf.host).toBeHidden();
});
