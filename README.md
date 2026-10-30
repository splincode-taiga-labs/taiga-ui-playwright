# Taiga UI Playwright

[![npm version](https://img.shields.io/npm/v/%40taiga-ui-labs%2Fplaywright?logo=npm)](https://www.npmjs.com/package/@taiga-ui-labs/playwright)
[![CI](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/workflows/ci.yml/badge.svg)](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/workflows/ci.yml)

**Playwright helpers for [Taiga UI](https://taiga-ui.dev/) components.** Work with familiar Playwright `Locator` objects instead of repeating dropdown, dialog and calendar interactions in every test.

- **Locator-first:** pass an existing, component-scoped Playwright locator.
- **Easy to read:** `selectOption('Estonia')`, `fill('Tall')`, `select('Details')`.
- **Ready to explore:** [Browse the component harnesses and examples](https://splincode-taiga-labs.github.io/taiga-ui-playwright/).

> Community-maintained and **unofficial**. Preparing a **1.0.0-rc.1** API contract; the current npm `latest` remains `0.1.2` until a separate final release decision. Tested with Angular 20.3 / Taiga UI 5.28; other versions require validation.

## Install

In an existing Playwright project:

```bash
npm install --save-dev @taiga-ui-labs/playwright
```

If you haven't installed Playwright yet:

```bash
npm install --save-dev @playwright/test @taiga-ui-labs/playwright
npx playwright install
```

## Example

```ts
import {expect, test} from '@playwright/test';
import {tuiComboBox, tuiSelect, tuiTabs} from '@taiga-ui-labs/playwright';

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
});
```

Provide the **component host** to the helper: for Select or ComboBox, pass the containing `tui-textfield`, not an unscoped overlay or input. Adapt test IDs to your application. All helpers use native Playwright APIs and auto-waiting.

## AI agent skill

Teach Codex, Claude Code, Cursor, or another compatible coding agent how to write Taiga UI Playwright tests using this package.

Install the skill into your project:

```bash
npx skills add splincode-taiga-labs/taiga-ui-playwright --skill taiga-ui-playwright
```

Or install it globally:

```bash
npx skills add splincode-taiga-labs/taiga-ui-playwright --skill taiga-ui-playwright -g
```

Then ask your agent:

> Use the taiga-ui-playwright skill to write Playwright tests for the Select, ComboBox and Dialog components in my Angular application.

The [agent skill](skills/taiga-ui-playwright/SKILL.md) provides reusable instructions; it does **not** install the npm package automatically. The `skills` CLI requires Node.js 22.20+; the Playwright library itself has separate runtime requirements.

## Documentation

See the [interactive harness catalog](https://splincode-taiga-labs.github.io/taiga-ui-playwright/) for supported components, imports and examples, including Select, ComboBox, Dialog, tabs, dates and mobile controls.

For contributors and maintainers:

- [Contributing](CONTRIBUTING.md) · [1.0 API contract proposal](docs/public-api.md) · [Compatibility](docs/api-upstream-compatibility.md)
- [Changelog](CHANGELOG.md) · [npm release process](docs/npm-release.md) · [Issues and feature requests](https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues)

Local development:

```bash
npm ci
npx playwright install chromium
npm run verify
```

**1.0 release policy:** all 266 package-root exports are retained for the candidate. See the [API contract](docs/public-api.md), [tested support matrix](docs/api-upstream-compatibility.md) and [release gate #86](https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/86). The 133 mapped harnesses are not a claim of exhaustive browser coverage.

MIT licensed. This project is not affiliated with the Taiga UI maintainers.
