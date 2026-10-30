---
name: taiga-ui-playwright
description: Write, debug, and review reliable Playwright tests for Angular applications using Taiga UI v5. Use when interacting with Select, ComboBox, Dialog, calendar, tabs, overlays, or other Taiga UI components; prefer the @taiga-ui-labs/playwright Locator-first harnesses and native Playwright assertions.
---

# Taiga UI Playwright

Use `@taiga-ui-labs/playwright` to test **real Taiga UI behavior** with Playwright locators. This is an independent library, not an official Taiga UI package or a replacement for `@playwright/test`. The 1.0 public API is under RC review; check the installed package version and its exported declarations before generating code.

## Before writing a test

1. Identify the Taiga UI component, the enclosing DOM host, and the expected application state. Inspect the Angular template or existing E2E selectors. Do not invent test IDs or assume that an overlay belongs to a field.
2. Check that `@playwright/test` is installed and that `@taiga-ui-labs/playwright` is in the project's dev dependencies. If not, suggest or run `npm install --save-dev @taiga-ui-labs/playwright` with the user's consent.
3. Discover available helpers through installed package declarations or the [harness catalog](https://splincode-taiga-labs.github.io/taiga-ui-playwright/). Import only names actually exported by the installed version; don't invent methods or selectors.

## Preferred usage

Keep harness creation local to the test, and pass **a component-scoped `Locator`** to the helper. For Select and ComboBox, provide the containing `tui-textfield` host, not the input or `tui-dropdown`.

```ts
import {expect, test} from '@playwright/test';
import {tuiComboBox, tuiDialog, tuiSelect, tuiTabs} from '@taiga-ui-labs/playwright';

test('edit a Taiga UI form', async ({page}) => {
    await page.goto('/settings');

    const country = tuiSelect(page.getByTestId('country-field'));
    await country.selectOption('Estonia');
    await expect(country.input).toHaveValue('Estonia');

    const city = tuiComboBox(page.getByTestId('city-field'));
    await city.fill('Tall');
    await city.selectOption('Tallinn');

    const tabs = tuiTabs(page.getByTestId('settings-tabs'));
    await tabs.select('Details');

    const dialog = tuiDialog(page.locator('tui-dialog'));
    await dialog.clickButton('Save');
});
```

These test IDs, URL and labels are **examples**, not selectors that can be copied blindly. Replace them with verified selectors and expected values in the target application.

## Test-writing rules

- Prefer a specific host via `page.getByTestId`, `getByRole` or another stable, app-owned selector. Keep locators scoped.
- For Select/ComboBox, use `selectOption(label)`, `fill(text)` and the helper's `input`. Treat visible-option matching as exact; do not assume substrings uniquely identify options.
- Let helpers track the field-owned overlay through `aria-controls`. If a custom component does not expose ownership, pass an explicit `overlay` locator; never click the first global dropdown.
- For dialogs, use `tuiDialog(host)` and `clickButton(name)` scoped to the correct dialog.
- For tabs, use `tuiTabs(host)` and `select(name)`; its `tab(name)` resolves the interactive tab element, not nested label text.
- When the helper does not support a behavior, use native Playwright locators, keyboard APIs and `expect` rather than inventing a helper method.
- Verify observable user-visible state **and**, when available, Angular form state. Check disabled, asynchronous and ambiguous-option cases.
- Avoid `waitForTimeout`, `force: true`, brittle CSS internals and unscoped `.first()` workarounds. Use auto-waiting and explicit, meaningful assertions.
- If options are virtualized, only DOM-mounted options can be selected; scroll or search using the app's real UI.
- Do not imply that 133 catalog mappings mean complete behavior coverage. The tested baseline is Angular 20.3 / Taiga UI 5.28, Playwright **1.51.0 and 1.64.1**; the broader declared peer range `>=1.51 <2` is not fully tested. Validate other versions in the target project.

## Verify

Run the relevant test and report both outcomes and limitations:

```bash
npx playwright test path/to/test.spec.ts
```

If troubleshooting or extending this library itself, read its [contributing guide](https://github.com/splincode-taiga-labs/taiga-ui-playwright/blob/main/CONTRIBUTING.md) and use `npm run typecheck`, `npm run build`, and the relevant browser integration tests.

## References

- [Interactive harness catalog and examples](https://splincode-taiga-labs.github.io/taiga-ui-playwright/)
- [GitHub source and TypeScript exports](https://github.com/splincode-taiga-labs/taiga-ui-playwright/blob/main/src/index.ts)
- [npm package](https://www.npmjs.com/package/@taiga-ui-labs/playwright)
- [Proposed 1.0 API contract](https://github.com/splincode-taiga-labs/taiga-ui-playwright/blob/main/docs/public-api.md)
