import {expect, test} from '@playwright/test';

import {tuiSelect} from '../src/index.js';
import {setupOptionsFixture} from './fixtures.js';

test.beforeEach(async ({page}) => setupOptionsFixture(page));

test('selects an exact option rather than a substring match', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));

    await select.selectOption('Austria');

    await expect(select.input).toHaveValue('Austria');
    await expect(select.overlay).toBeHidden();
});

test('escapes regular expression characters in option text', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));

    await select.selectOption('C++');

    await expect(select.input).toHaveValue('C++');
});

test('opening an already open select does not toggle it closed', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));

    await select.open();
    await select.open();
    await expect(select.overlay).toBeVisible();
    expect(await select.getOptionLabels()).toEqual(['Austria', 'Australia', 'C++']);

    await select.close();
    await expect(select.overlay).toBeHidden();
});

test('explicit overlay scope works with two visible portals', async ({page}) => {
    const country = tuiSelect(page.getByTestId('country-field'), {
        overlay: page.getByTestId('country-overlay'),
    });

    await country.open();
    await page.getByTestId('city-field').locator('input').click();
    await expect(page.getByTestId('city-overlay')).toBeVisible();

    await country.selectOption('Australia');

    await expect(country.input).toHaveValue('Australia');
    await expect(page.getByTestId('city-overlay')).toBeVisible();
});

test('custom option selector supports application-specific markup', async ({page}) => {
    await page.locator('[data-testid="country-overlay"] tui-data-list').evaluate((element) => {
        element.innerHTML = '<button data-item="custom">Estonia</button>';
        element.querySelector('button')?.addEventListener('click', () => {
            (document.querySelector('[tuiSelect]') as HTMLInputElement).value = 'Estonia';
        });
    });

    const select = tuiSelect(page.getByTestId('country-field'), {
        optionSelector: '[data-item="custom"]',
    });

    await select.selectOption('Estonia');
    await expect(select.input).toHaveValue('Estonia');
});

test('duplicate visible labels produce an actionable error', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));
    await page.locator('[data-testid="country-overlay"] tui-data-list').evaluate((element) => {
        const duplicate = element.querySelector('[tuiOption]')?.cloneNode(true);

        if (duplicate) {
            element.appendChild(duplicate);
        }
    });

    await expect(select.selectOption('Austria')).rejects.toThrow(/Multiple visible Taiga UI options match "Austria"/);
    await expect(select.input).toHaveValue('');
});

test('hidden duplicates are ignored when choosing a visible option', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));
    await page.locator('[data-testid="country-overlay"] tui-data-list').evaluate((element) => {
        const duplicate = element.querySelector('[tuiOption]')?.cloneNode(true);

        if (duplicate instanceof HTMLElement) {
            duplicate.hidden = true;
            element.appendChild(duplicate);
        }
    });

    await select.selectOption('Austria');
    await expect(select.input).toHaveValue('Austria');
});

test('non-rendered virtual-scroll items are not mistaken for mounted options', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));

    // Virtual scrolling only renders a window. Consumers should scroll the
    // virtual viewport to mount offscreen items before calling selectOption.
    await select.open();
    await expect(select.option('Offscreen virtual item')).toHaveCount(0);
    await expect(select.option('Austria')).toBeVisible();
});
