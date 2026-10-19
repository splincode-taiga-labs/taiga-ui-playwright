# API, compatibility, and upstream review

Review date: 2026-10-19. This is an **experimental, private package**, not an official Taiga UI distribution.

## Upstream comparison

- [Taiga UI PR #14584](https://github.com/taiga-family/taiga-ui/pull/14584) is **open** as of this review; its API has not been released through that PR. Recheck before any release decision.
- The upstream proposal introduces testing locator constants (for example, `TUI_SELECT_LOCATORS`) and `@taiga-ui/testing/playwright` element objects such as `TuiBaseEO`, `TuiSelectEO`, and `TuiDropdownEO`.
- Upstream `TuiBaseEO` accepts `Page`, a selector string and an optional index; `TuiSelectEO` uses a shared `TuiDropdownEO`, with `selectByText` and `selectByIndex`.
- This project's `tuiSelect(host: Locator)` accepts an already-scoped Locator and resolves the owned portal via the **input's `aria-controls`**. It explicitly rejects ambiguous or unrelated overlays, supports an explicit overlay override, and waits for async options. `tuiComboBox` and `tuiDialog` follow the same Locator-first convention.
- The extra value currently demonstrated here is **composition with existing locators, multi-portal ownership, focused error messages and real Angular integration across an inventory of 133 components**. Inventory coverage is not equivalent to exhaustive behavior testing.
- These approaches are related, not API-compatible. Avoid adding a compatibility facade or duplicating all upstream helpers while its public API is unsettled. Prefer sending generic fixes (e.g. portal association) upstream if maintainers accept them.

## Consumer API example

The entrypoint exports helpers and TypeScript declarations as native ESM. A caller supplies the enclosing `tui-textfield` Locator for Select/ComboBox:

```ts
import {expect, test} from '@playwright/test';
import {tuiSelect, tuiComboBox} from '@taiga-ui-labs/playwright';

test('update country and city', async ({page}) => {
    await page.goto('/form');
    const country = tuiSelect(page.getByTestId('country-field'));
    await country.selectOption('Estonia');
    await expect(country.input).toHaveValue('Estonia');

    const city = tuiComboBox(page.getByTestId('city-field'));
    await city.fill('Tall');
    await city.selectOption('Tallinn');
});
```

**Migration from the upstream PR proposal (not a published API):**

| Proposed upstream | This experiment |
| --- | --- |
| `new TuiSelectEO(page, 'input[tuiSelect]')` | `tuiSelect(page.getByTestId('country-field'))` |
| `select.selectByText('Estonia')` | `select.selectOption('Estonia')` |
| `select.dropdown` (shared portal) | `select.overlay` (owned via `aria-controls`) |
| `select.getOptions()` | `select.getOptionLabels()` |

## Verified and declared compatibility

| Dimension | Status |
| --- | --- |
| Taiga UI | Integration tested with **5.28.0** only |
| Angular | Fixture tested with **20.3.0** only |
| Playwright | Peer range **>=1.51 <2** is declared; CI verifies **1.51.0** and the lockfile-resolved version, but not the full range |
| Node | Package declares **>=20**; consumer checks run on **20.19.0** and **24**. Node 20.0–20.18 and all other versions are not yet verified |
| Browsers | Chromium full integration/docs; Chromium, Firefox and WebKit targeted smoke; Pixel 7 emulated mobile Chromium |
| Known exclusion | WebKit + async ComboBox selection is skipped due to a detached option portal; [CI reproduction](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/runs/39205562527) |
| Module format | NodeNext ESM root export (`exports["."].import`) and TypeScript declarations (`exports["."].types`) |
| Package delivery | `private: true`, no npm release workflow; independent `npm pack` + fresh consumer install tested in CI |

The Node 20.19.0 consumer check does not imply that Angular or the complete browser test suite support Node 20; those suites still run on Node 24. The package includes internal Taiga UI markup selectors, so some helpers can break across even minor UI changes. Prefer a narrow version support claim and monitor upstream changes before committing to maintenance SLAs.

## Packaging verification

After `npm ci && npm run build`:

```sh
npm run test:consumer
```

This creates an npm tarball in a temporary directory, checks its files, installs it **outside this repository**, type-checks a NodeNext ESM consumer, and verifies runtime imports. By default it uses the lockfile's Playwright version. Set `CONSUMER_PLAYWRIGHT_VERSION=1.51.0` to test the declared minimum; CI verifies this on Node 20.19.0 as well as the lockfile version on Node 24. No publish, tag, credential or registry write is performed.

## Decision: NO-GO for a public npm release (for now)

Keep this project as a **private PoC** and continue contributing reusable portal/locator improvements upstream. The upstream API is still under discussion, no independent consumer has validated long-term use, browser compatibility is incomplete, and 133 catalog entries do not imply a frozen or supported public API.

Reconsider a release **only after**: (1) upstream PR #14584 is resolved or its design stabilizes; (2) at least one external consumer uses the packed artifact successfully; (3) supported Taiga UI/Angular/Playwright/Node ranges have been tested; (4) a maintainer accepts ongoing compatibility responsibility; and (5) npm scope ownership and publication workflow are explicitly approved under #9.

This is a project recommendation, not authorization to publish.
