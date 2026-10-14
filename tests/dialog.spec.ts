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
