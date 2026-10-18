import {expect, test} from '@playwright/test';
import {
    tuiFiles, tuiTree, tuiInternationalPhone, tuiNotificationMiddle, tuiPreview, tuiPush,
} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/?fixture=remaining-kit');
    await expect(page.getByTestId('remaining-kit')).toBeVisible();
});

test('Files expands hidden document items from a real TuiFiles template', async ({page}) => {
    const files = tuiFiles(page.getByTestId('files-widget'));
    await files.expectFile('File alpha.txt');
    await files.expand();
    await files.expectFile('File gamma.txt');
});

test('Tree updates its rendered root when the bound value changes', async ({page}) => {
    const tree = tuiTree(page.getByTestId('tree-widget'));
    await tree.expectNode('Initial tree node');
    await page.getByRole('button', {name: 'Update tree'}).click();
    await tree.expectNode('Updated tree node');
});

test('InternationalPhone accepts formatted input using its actual directive', async ({page}) => {
    const phone = tuiInternationalPhone(page.getByTestId('international-phone-widget'));
    await phone.fill('+79110330102');
    await expect(page.getByTestId('phone-value')).toHaveText('+79110330102');
});

test('NotificationMiddle is a real closable portal and responds to Escape', async ({page}) => {
    await page.getByRole('button', {name: 'Open middle notification'}).click();
    const notice = tuiNotificationMiddle(page.locator('tui-notification-middle'));
    await notice.expectOpen('Loading account information');
    await notice.dismiss();
    await expect(page.getByTestId('middle-open')).toHaveText('false');
});

test('Preview rotates its actual transformed image surface', async ({page}) => {
    await tuiPreview(page.getByTestId('preview-widget')).rotate();
});

test('Push exposes heading and emits the close action', async ({page}) => {
    const push = tuiPush(page.getByTestId('push-widget'));
    await push.expectHeading('Account update');
    await push.close();
    await page.getByRole('button', {name: 'Show push'}).click();
    await push.expectHeading('Account update');
});
