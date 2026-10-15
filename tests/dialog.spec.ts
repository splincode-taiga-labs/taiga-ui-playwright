import {expect, test} from '@playwright/test';

import {tuiDialog} from '../src/index.js';

test('scopes actions to the dialog and closes via tuiButtonX', async ({page}) => {
    await page.setContent(
        '<tui-dialog><header><hgroup><h2>Review changes</h2></hgroup></header>' +
        '<button tuiButtonX onclick="this.closest(\'tui-dialog\').hidden=true">Close</button>' +
        '<button onclick="document.body.dataset.saved=\'yes\'">Save</button></tui-dialog>' +
        '<button>Save</button>',
    );

    const dialog = tuiDialog(page.locator('tui-dialog'));

    await expect(dialog.title).toHaveText('Review changes');
    await dialog.clickButton('Save');
    await expect(page.locator('body')).toHaveAttribute('data-saved', 'yes');
    await dialog.close();
    await expect(dialog.host).toBeHidden();
});

test('non-closable dialog does not expose a close action', async ({page}) => {
    await page.setContent('<tui-dialog><header><h2>Locked</h2></header></tui-dialog>');
    const dialog = tuiDialog(page.locator('tui-dialog'));

    await expect(dialog.title).toHaveText('Locked');
    await expect(dialog.closeButton).toHaveCount(0);
    await expect(dialog.close()).rejects.toThrow(/closable: false/);
});

test('disabled actions remain disabled and cannot be clicked implicitly', async ({page}) => {
    await page.setContent('<tui-dialog><header><h2>Review</h2></header><button disabled>Save</button></tui-dialog>');
    const dialog = tuiDialog(page.locator('tui-dialog'));

    await expect(dialog.button('Save')).toBeDisabled();
    await expect(dialog.closeButton).toHaveCount(0);
});

test('dialog helper uses its host Locator to isolate actions across portals', async ({page}) => {
    await page.setContent(
        '<tui-dialog data-testid="first"><header><h2>First</h2></header><button>Save</button></tui-dialog>' +
        '<tui-dialog data-testid="second"><header><h2>Second</h2></header><button>Save</button></tui-dialog>'
    );
    const first = tuiDialog(page.getByTestId('first'));
    const second = tuiDialog(page.getByTestId('second'));

    await expect(first.title).toHaveText('First');
    await expect(second.title).toHaveText('Second');
    await expect(first.button('Save')).toHaveCount(1);
    await expect(second.button('Save')).toHaveCount(1);
});

test('dialog without a heading allows content-based queries', async ({page}) => {
    await page.setContent('<tui-dialog><button>Close manually</button></tui-dialog>');
    const dialog = tuiDialog(page.locator('tui-dialog'));

    await expect(dialog.title).toHaveCount(0);
    await expect(dialog.button('Close manually')).toBeVisible();
});
