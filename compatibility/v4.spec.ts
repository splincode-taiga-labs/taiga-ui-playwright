import {expect, test} from '@playwright/test';

import {packageApi} from './api';

const {
    tuiButton, tuiSelect, tuiComboBox, tuiCheckbox, tuiRadio, tuiSwitch,
    tuiTabs, tuiSegmented, tuiTextarea, tuiPagination, tuiStepper, tuiInputNumber,
    tuiLink, tuiBadge, tuiChip, tuiBadgeNotification, tuiLike, tuiProgress,
    tuiLoader, tuiExpand, tuiAvatar, tuiTextfield,
} = await packageApi('./v4');

test('v4 entrypoint exposes the same runtime API as the package root', async () => {
    const root = await packageApi('.');
    const v4 = await packageApi('./v4');

    expect(Object.keys(v4).sort()).toEqual(Object.keys(root).sort());
});

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByRole('heading', {name: 'Taiga UI 4 demo'})).toBeVisible();
});

test('button updates Angular state', async ({page}) => {
    await tuiButton(page.getByTestId('save-button')).click();
    await expect(page.getByTestId('save-model')).toHaveText('1');
});

test('Select updates FormControl via a v4 dropdown', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));
    await select.selectOption('Estonia');
    await expect(page.getByTestId('country-model')).toHaveText('Estonia');
});

test('ComboBox updates FormControl via a v4 dropdown', async ({page}) => {
    const combo = tuiComboBox(page.getByTestId('city-field'));
    await combo.fill('Tall');
    await combo.selectOption('Tallinn');
    await expect(page.getByTestId('city-model')).toHaveText('Tallinn');
});


test('Checkbox updates a real v4 Angular form control', async ({page}) => {
    const checkbox = tuiCheckbox(page.getByTestId('checkbox'));
    await checkbox.check();
    await expect(page.getByTestId('checkbox-model')).toHaveText('true');
    await checkbox.uncheck();
    await expect(page.getByTestId('checkbox-model')).toHaveText('false');
});

test('Radio updates a real v4 Angular form control', async ({page}) => {
    await tuiRadio(page.getByTestId('radio-pro')).check();
    await expect(page.getByTestId('radio-model')).toHaveText('pro');
});

test('Switch updates a real v4 Angular form control', async ({page}) => {
    await tuiSwitch(page.getByTestId('switch')).setChecked(true);
    await expect(page.getByTestId('switch-model')).toHaveText('true');
});

test('Tabs switch the active v4 tab', async ({page}) => {
    await tuiTabs(page.getByTestId('tabs')).select('Details');
    await expect(page.getByTestId('tabs-model')).toHaveText('1');
});

test('Segmented switches the active v4 option', async ({page}) => {
    await tuiSegmented(page.getByTestId('segmented')).select('Cards');
    await expect(page.getByTestId('segmented-model')).toHaveText('1');
});

test('Textarea updates a real v4 Angular form control', async ({page}) => {
    await tuiTextarea(page.getByTestId('notes-field')).fill('Example notes');
    await expect(page.getByTestId('notes-model')).toHaveText('Example notes');
});

test('Pagination selects the requested v4 page', async ({page}) => {
    await tuiPagination(page.getByTestId('pagination')).goTo(2);
    await expect(page.getByTestId('pagination-model')).toHaveText('1');
});

test('Stepper activates the named v4 step', async ({page}) => {
    await tuiStepper(page.getByTestId('stepper')).activate('Review');
    await expect(page.getByTestId('stepper-model')).toHaveText('1');
});

test('InputNumber fills the real v4 textfield', async ({page}) => {
    const input = tuiInputNumber(page.getByTestId('number-field'));
    await input.fill('42');
    await expect(page.getByTestId('number-model')).toHaveText('42');
});


test('Link follows an anchor in the v4 Angular demo', async ({page}) => {
    const link = tuiLink(page.getByTestId('link'));
    expect(await link.href()).toBe('#v4-link-target');
    await link.follow();
    await expect(page).toHaveURL(/#v4-link-target$/);
});

test('Badge reads v4 appearance and size', async ({page}) => {
    await tuiBadge(page.getByTestId('badge')).expectAppearanceAndSize('primary', 'm');
});

test('Chip reads v4 appearance', async ({page}) => {
    await tuiChip(page.getByTestId('chip')).expectAppearance('neutral');
});

test('BadgeNotification reads real count and size', async ({page}) => {
    const badge = tuiBadgeNotification(page.getByTestId('notification-badge'));
    await badge.expectCount(7);
    await badge.expectSize('l');
});

test('Like updates a real v4 FormControl', async ({page}) => {
    const like = tuiLike(page.getByTestId('like'));
    await like.setLiked(true);
    await expect(page.getByTestId('like-model')).toHaveText('true');
    await like.setLiked(false);
    await expect(page.getByTestId('like-model')).toHaveText('false');
});

test('Progress reflects native DOM and Angular state', async ({page}) => {
    const progress = tuiProgress(page.getByTestId('progress'));
    await progress.expectValue(25);
    expect(await progress.max()).toBe(100);
    await page.getByRole('button', {name: 'Set progress to 75'}).click();
    await progress.expectValue(75);
    await expect(page.getByTestId('progress-model')).toHaveText('75');
});

test('Loader transitions from loading to idle in v4', async ({page}) => {
    const loader = tuiLoader(page.getByTestId('loader'));
    await loader.expectLoading();
    await page.getByRole('button', {name: 'Toggle loading'}).click();
    await loader.expectIdle();
});

test('Expand toggles real v4 content', async ({page}) => {
    const expand = tuiExpand(page.getByTestId('expand'));
    await expand.expectCollapsed();
    await page.getByRole('button', {name: 'Toggle section'}).click();
    await expand.expectExpanded();
    await page.getByRole('button', {name: 'Toggle section'}).click();
    await expand.expectCollapsed();
});

test('v4 Avatar adapter understands _round and data-type markup', async ({page}) => {
    const square = tuiAvatar(page.getByTestId('avatar'));
    await square.expectShape('square');
    await square.expectSize('m');
    await square.expectImageFallback();
    const round = tuiAvatar(page.getByTestId('avatar-round'));
    await round.expectShape('round');
    await round.expectSize('s');
});

test('Textfield harness focuses the real v4 input', async ({page}) => {
    const field = tuiTextfield(page.getByTestId('number-field'));
    await field.focus();
    await expect(field.input).toHaveAttribute('tuiInputNumber', '');
});

test('the same v4 demo documents its verified scope and versioned import', async ({page}) => {
    await page.goto('/');
    await expect(page.getByText('Tested controls, not blanket v4 compatibility.')).toBeVisible();
    await expect(page.locator('pre code')).toContainText('@taiga-ui-labs/playwright/v4');
    await expect(page.getByRole('heading', {level: 2})).toHaveCount(23);
    await page.getByText('Browse the Taiga UI 4 component inventory').click();
    await expect(page.locator('[data-v4-component]')).toHaveCount(123);
    await expect(page.locator('[data-verified="true"]')).toHaveCount(22);
    await expect(page.locator('[data-v4-component="Kit/checkbox"]')).toContainText('tuiCheckbox');
    await expect(page.getByRole('link', {name: /Back to Taiga UI 5 docs/})).toHaveAttribute('href', '../');
});
