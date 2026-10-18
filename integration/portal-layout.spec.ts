import {expect, test} from '@playwright/test';
import {tuiConfirm, tuiToast, tuiForm, tuiItemGroup, tuiShrinkWrap} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('portal-layout')).toBeVisible();
});

test('Confirm rejects and accepts through its real Taiga UI dialog', async ({page}) => {
    const confirm = tuiConfirm(page.locator('tui-dialog'));
    await page.getByRole('button', {name: 'Request confirmation'}).click();
    await confirm.expectContent('Are you sure?');
    await confirm.decide(false);
    await expect(page.getByTestId('confirm-result')).toHaveText('no');

    await page.getByRole('button', {name: 'Request confirmation'}).click();
    await confirm.expectContent('Are you sure?');
    await confirm.decide(true);
    await expect(page.getByTestId('confirm-result')).toHaveText('yes');
});

test('Confirm resolves immediately when there are no unsaved changes', async ({page}) => {
    await page.getByRole('button', {name: 'Confirm pristine'}).click();
    await expect(page.getByTestId('confirm-result')).toHaveText('yes');
    await expect(page.locator('tui-dialog:visible')).toHaveCount(0);
});

test('Toast opens with an appearance and closes through its real button', async ({page}) => {
    await page.getByRole('button', {name: 'Show toast'}).click();
    const toast = tuiToast(page.locator('tui-toast'));
    await toast.expectState('Changes saved', 'positive');
    await expect(page.getByTestId('toast-result')).toHaveText('open');
    await toast.close();
    await expect(page.getByTestId('toast-result')).toHaveText('closed');
});

test('Form projects size into its child button and submits without navigation', async ({page}) => {
    const form = tuiForm(page.getByTestId('form-widget'));
    await form.expectSize('l');
    await form.submit();
    await expect(page.getByTestId('form-result')).toHaveText('1');
    await page.getByRole('button', {name: 'Compact form'}).click();
    await form.expectSize('s');
    await form.submit();
    await expect(page.getByTestId('form-result')).toHaveText('2');
});

test('ItemGroup scrolls a horizontal list to the clicked last item', async ({page}) => {
    const group = tuiItemGroup(page.getByTestId('item-group-widget'));
    await group.expectOrientation(true);
    await group.clickLastAndExpectScroll();
    await expect(page.getByTestId('item-group-result')).toHaveText('true');
    await page.getByRole('button', {name: 'Vertical item group'}).click();
    await group.expectOrientation(false);
});

test('ShrinkWrap updates computed maximum width from its Angular input', async ({page}) => {
    const shrink = tuiShrinkWrap(page.getByTestId('shrink-wrap-widget'));
    await shrink.expectMaxInlineSize(180);
    await page.getByRole('button', {name: 'Narrow shrink wrap'}).click();
    await shrink.expectMaxInlineSize(100);
});
