import {expect, test} from '@playwright/test';

import {packageApi} from './api';

const {tuiButton, tuiSelect, tuiComboBox} = await packageApi('./v4');

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
    await select.input.click();
    console.log('v4 theme diagnostics:', JSON.stringify(await page.evaluate(() => {
        const host = document.querySelector('[data-testid="country-field"]')!;
        const input = host.querySelector('input')!;
        const cs = getComputedStyle(host);
        const root = getComputedStyle(document.documentElement);
        return {
            height: host.getBoundingClientRect().height,
            cssMinHeight: cs.minHeight,
            themeHeight: root.getPropertyValue('--tui-height-l').trim(),
            fieldHeight: cs.getPropertyValue('--t-height').trim(),
            ariaExpanded: input.getAttribute('aria-expanded'),
            controlledId: input.getAttribute('aria-controls'),
            portals: [...document.querySelectorAll('tui-dropdown')].map(el => ({
                id: el.id, visibility: getComputedStyle(el).visibility,
                outer: el.outerHTML.slice(0,350),
            })),
        };
    })));
    await select.selectOption('Estonia');
    await expect(page.getByTestId('country-model')).toHaveText('Estonia');
});

test('ComboBox updates FormControl via a v4 dropdown', async ({page}) => {
    const combo = tuiComboBox(page.getByTestId('city-field'));
    await combo.fill('Tall');
    await combo.selectOption('Tallinn');
    await expect(page.getByTestId('city-model')).toHaveText('Tallinn');
});
