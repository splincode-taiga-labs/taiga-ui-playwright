# Taiga UI Playwright

[![npm version](https://img.shields.io/npm/v/%40taiga-ui-labs%2Fplaywright?logo=npm)](https://www.npmjs.com/package/@taiga-ui-labs/playwright)
[![CI](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/workflows/ci.yml/badge.svg)](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/workflows/ci.yml)

**Playwright helpers for [Taiga UI](https://taiga-ui.dev/) components.** Work with familiar Playwright `Locator` objects instead of repeating dropdown, dialog and calendar interactions in every test.

- **Locator-first:** pass an existing, component-scoped Playwright locator.
- **Easy to read:** `selectOption('Estonia')`, `fill('Tall')`, `select('Details')`.
- **Ready to explore:** [Browse the component harnesses and examples](https://splincode-taiga-labs.github.io/taiga-ui-playwright/).

> Community-maintained and **unofficial**. The **1.0 public API** preserves 266 named exports. Tested with Angular 20.3 / Taiga UI 5.28; targeted tests for 26 controls also pass with Taiga UI 4.106.0. Other components and versions require validation.

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

## Taiga UI v4 compatibility

For **Taiga UI 4.x**, use the versioned secondary entrypoint **after installing a package version that includes it** (v1.0.1 does not):

```ts
import {tuiSelect, tuiComboBox} from '@taiga-ui-labs/playwright/v4';
```

The demo includes a [source-based v4 component inventory](docs/taiga-v4-inventory.md), separating verified controls from untested and unmapped components. The [single documentation site](https://splincode-taiga-labs.github.io/taiga-ui-playwright/) shows separate v4 TODO coverage and version-specific imports/examples for every mapped harness. The v4 Angular fixture runs in CI only and is not published. See the [v4 test matrix](docs/taiga-v4-coverage.md).

For **Taiga UI 5.x**, continue using the root import `@taiga-ui-labs/playwright`.
Both entrypoints share the same Locator-first API. The v4 demo workspace tests 26 controls on **Angular 20.3 / Taiga UI 4.106.0**. The `/v4` entrypoint exposes all 266 public API exports, but the remaining harnesses and other 4.x versions are **not yet browser-verified**. Read the [compatibility policy](docs/api-upstream-compatibility.md).

## Build and packaging

The library uses **ng-packagr 20.3.2** to publish Angular Package Format (APF).
The primary entrypoint is `src/index.ts`; `v4/src/public-api.ts` defines
the `/v4` secondary entrypoint without duplicating the primary implementation.

```bash
npm ci
npm run build
npm run test:pack
npm run test:compat
npm pack ./dist/package
```

The distributable npm package is **`dist/package/`**, not the repository root.
The release workflow publishes `./dist/package` using the GitHub Release tag.

The `integration/angular-app` and `integration/angular-app-v4` npm workspaces contain
permanent Taiga UI **5.28** and **4.106** demos. Run `npm run test:compat` to
start both and exercise the real built APF root and `/v4` entrypoints.

The **v4 workspace** is test-only. `npm run test:compat` runs both real Angular
demos locally through Playwright. `npm run build:docs:pages` publishes only the
v5-based documentation shell, with separate v5/v4 coverage matrices and
per-harness usage examples. No v4 Angular HTML bundle is deployed.

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

**1.x compatibility policy:** 266 package-root exports are covered by the [API contract](docs/public-api.md) and the [tested support matrix](docs/api-upstream-compatibility.md). The 133 mapped harnesses are not a claim of exhaustive browser coverage.

MIT licensed. This project is not affiliated with the Taiga UI maintainers.
