import {expect, test} from '@playwright/test';

import {packageApi} from './api';

const {tuiButton, tuiSelect, tuiComboBox} = await packageApi('./v4');

test.beforeEach(async ({page}) => {
    page.on('pageerror', (error) => console.log('v4 browser exception:', error.stack));
    page.on('console', (msg) => { if (msg.type() === 'error') console.log('v4 console error:', msg.text()); });
    await page.goto('/');
    await expect(page.getByRole('heading', {name: 'Taiga UI 4 demo'})).toBeVisible();
});

test('button updates Angular state', async ({page}) => {
    await tuiButton(page.getByTestId('save-button')).click();
    await expect(page.getByTestId('save-model')).toHaveText('1');
});

test('Select updates FormControl via a v4 dropdown', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));
    await select.input.press('ArrowDown');
    await expect(page.locator('tui-dropdown:visible')).toBeVisible();
    console.log('v4 open keyboard:', JSON.stringify(await page.evaluate(() => {
        const input = document.querySelector('[data-testid="country-field"] input')!;
        const portals = [...document.querySelectorAll('tui-dropdown')];
        return {
            expanded: input.getAttribute('aria-expanded'),
            controls: input.getAttribute('aria-controls'),
            portal: portals.map(e => ({
                id: e.id, visibility: getComputedStyle(e).visibility,
                options: [...e.querySelectorAll('[tuiOption]')].map(x => x.textContent?.trim()),
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
