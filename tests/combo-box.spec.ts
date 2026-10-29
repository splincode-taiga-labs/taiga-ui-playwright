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

test('reopens an expanded ComboBox after its owned async portal is detached', async ({page}) => {
    await page.setContent([
        '<tui-textfield data-testid="async-field">',
        '  <input tuiComboBox aria-label="Async city" aria-expanded="true" aria-controls="stale" value="Os" />',
        '</tui-textfield>',
        '<tui-dropdown id="stale" hidden><tui-data-list><button tuiOption>Oslo</button></tui-data-list></tui-dropdown>',
        '<tui-dropdown data-testid="decoy" style="display:block">',
        '  <tui-data-list><button tuiOption>Oslo</button></tui-data-list>',
        '</tui-dropdown>',
        '<script>',
        'const input = document.querySelector("[tuiComboBox]");',
        'input.addEventListener("keydown", (event) => {',
        '  if (event.key !== "ArrowDown") return;',
        '  document.querySelector("#stale")?.remove();',
        '  const dropdown = document.createElement("tui-dropdown");',
        '  dropdown.id = "remounted";',
        '  dropdown.innerHTML = "<tui-data-list><button tuiOption>Oslo</button></tui-data-list>";',
        '  dropdown.querySelector("button").addEventListener("click", () => {',
        '    input.value = "Oslo";',
        '    dropdown.remove();',
        '  });',
        '  document.body.append(dropdown);',
        '  input.setAttribute("aria-controls", "remounted");',
        '});',
        'document.querySelector("[data-testid=decoy] button").addEventListener("click", () => {',
        '  document.querySelector("[data-testid=decoy]").dataset.selected = "true";',
        '});',
        '</script>',
    ].join('\n'));

    const combo = tuiComboBox(page.getByTestId('async-field'));
    const decoy = page.getByTestId('decoy');

    await combo.selectOption('Oslo');

    await expect(combo.input).toHaveValue('Oslo');
    await expect(decoy).not.toHaveAttribute('data-selected', 'true');
    await expect(decoy).toBeVisible();
});
