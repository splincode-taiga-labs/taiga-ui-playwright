import {expect, test} from '@playwright/test';

import {packageApi} from './api';

const {tuiButton, tuiSelect, tuiComboBox} = await packageApi('./v4');

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
