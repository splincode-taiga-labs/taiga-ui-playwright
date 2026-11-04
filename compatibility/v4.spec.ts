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
    console.log('v4 dropdown debug:', JSON.stringify(await page.evaluate(() => {
        const input = document.querySelector('[data-testid="country-field"] input');
        const host = document.querySelector('[data-testid="country-field"]');
        return {
            expanded: input?.getAttribute('aria-expanded'),
            controlledId: input?.getAttribute('aria-controls'),
            hostRect: host?.getBoundingClientRect().toJSON(),
            focused: document.activeElement?.outerHTML.slice(0, 300),
            dropdownHosts: [...document.querySelectorAll('tui-dropdowns, tui-dropdown')].map((el) => ({
                tag: el.tagName,
                id: el.id,
                html: el.outerHTML.slice(0, 750),
            })),
            visibleText: document.body.innerText.slice(0, 1100),
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
