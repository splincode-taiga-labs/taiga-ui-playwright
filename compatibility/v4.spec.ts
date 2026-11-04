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
    await page.waitForTimeout(150); // Diagnostic only: inspect portal after Taiga's position subscription.
    console.log('v4 portal details:', JSON.stringify(await page.evaluate(() => {
        const host = document.querySelector('[data-testid="country-field"]')!;
        const input = host.querySelector('input')!;
        const css = getComputedStyle(host);
        const portals = [...document.querySelectorAll('tui-dropdown')];
        return {
            host: host.outerHTML.slice(0, 450),
            hostRect: host.getBoundingClientRect().toJSON(),
            hostCSS: {display: css.display, minBlockSize: css.minBlockSize, height: css.height},
            focused: document.activeElement === input,
            expanded: input.getAttribute('aria-expanded'),
            controls: input.getAttribute('aria-controls'),
            portalCount: portals.length,
            portals: portals.map((el) => ({
                id: el.id,
                rect: el.getBoundingClientRect().toJSON(),
                visible: getComputedStyle(el).visibility,
                display: getComputedStyle(el).display,
                content: el.textContent?.slice(0, 200),
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
