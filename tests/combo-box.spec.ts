import {expect, test} from '@playwright/test';

import {tuiComboBox} from '../src/index.js';
import {setupOptionsFixture} from './fixtures.js';

test.beforeEach(async ({page}) => setupOptionsFixture(page));

test('enters text and selects an exact option', async ({page}) => {
    const combo = tuiComboBox(page.getByTestId('city-field'));

    await combo.fill('Tall');
    await expect(combo.overlay).toBeVisible();
    await combo.selectOption('Tallinn');

    await expect(combo.input).toHaveValue('Tallinn');
});

test('supports explicit overlay scoping and closing', async ({page}) => {
    const combo = tuiComboBox(page.getByTestId('city-field'), {
        overlay: page.getByTestId('city-overlay'),
    });

    await combo.open();
    await expect(combo.option('Tartu')).toBeVisible();
    await combo.close();
    await expect(combo.overlay).toBeHidden();
});
