# Taiga UI Playwright

> Experimental, **unofficial** Playwright-native element objects for Taiga UI v5, maintained by [splincode-taiga-labs](https://github.com/splincode-taiga-labs). This project is not affiliated with the Taiga UI maintainers.

This is a proof of concept, **not a published npm package**. The goal is to explore Locator-first helpers for common, complex UI interactions and contribute useful ideas upstream.

## Why?

Taiga UI already has [internal Playwright Element Objects](https://github.com/taiga-family/taiga-ui/tree/main/projects/demo-playwright/utils/element-objects), and an [upstream proposal to expose public testing APIs](https://github.com/taiga-family/taiga-ui/pull/14584). This project experiments with accepting existing Locators, relying on Playwright's auto-waiting, and keeping the API deliberately small.

## Local development

Requires Node.js 20+.

~~~bash
npm install
npx playwright install chromium
npm run verify
~~~

No npm publishing workflow exists. The package is intentionally marked private until integration tests with an actual Angular/Taiga UI app are ready.

## Example

~~~ts
import {expect, test} from '@playwright/test';
import {tuiComboBox, tuiDialog, tuiSelect} from '@taiga-ui-labs/playwright';

test('select country and confirm', async ({page}) => {
    await page.goto('/settings');

    // Supply the tui-textfield host, not the input itself.
    const country = tuiSelect(page.getByTestId('country-field'));
    await country.selectOption('Estonia');
    await expect(country.input).toHaveValue('Estonia');

    const city = tuiComboBox(page.getByTestId('city-field'));
    await city.fill('Tall');
    await city.selectOption('Tallinn');

    const dialog = tuiDialog(page.locator('tui-dialog'));
    await dialog.clickButton('Save');
});
~~~

## Overlay scoping

Taiga UI renders dropdowns outside the textfield DOM subtree. The default overlay targets a **visible** `tui-dropdown`, `tui-dropdown-mobile`, or `tui-sheet-dialog`. If several overlays are visible, Playwright strictness intentionally fails instead of silently choosing the first.

Pass an explicit overlay when needed:

~~~ts
const select = tuiSelect(page.getByTestId('country-field'), {
    overlay: page.getByTestId('country-options'),
});
~~~

For custom option markup, pass `optionSelector` (default: `tui-data-list [tuiOption]`). `selectOption` performs an exact, case-sensitive text match.

| Object | API |
| --- | --- |
| `tuiSelect(host)` | `host`, `input`, `overlay`, `options`, `option(label)`, `open()`, `close()`, `selectOption(label)`, `getOptionLabels()`, `getValue()` |
| `tuiComboBox(host)` | Select's API plus `fill(text)` |
| `tuiDialog(host)` | `host`, `title`, `closeButton`, `button(name)`, `clickButton(name)`, `close()` |

No arbitrary timeouts, global singleton state, or custom Playwright runner.

## Quality gates and limitations

CI runs strict TypeScript typechecking, ESM declaration build, and Chromium Playwright tests using **synthetic DOM fixtures**. These tests verify the helpers' behavior but **do not prove integration with a real compiled Taiga UI application**. An Angular v5 demo integration test and mobile overlays are required before any npm release.

## Roadmap

- [x] Locator-first Select, ComboBox, Dialog PoC
- [x] DOM-based behavior tests and CI
- [ ] Validate against a real Angular app using the current Taiga UI v5
- [ ] Check mobile overlays, repeated fields and virtualized options
- [ ] Compare to upstream Element Objects and propose improvements
- [ ] Decide whether a separate npm package is warranted at all

Related: [Taiga UI issue #476](https://github.com/taiga-family/taiga-ui/issues/476) and [PR #14584](https://github.com/taiga-family/taiga-ui/pull/14584).

MIT license.
