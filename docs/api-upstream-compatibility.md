# API, compatibility, and upstream review

Initial compatibility review: 2026-10-19. Release preparation: 2026-10-27. This is an **experimental, independently maintained package**, not an official Taiga UI distribution.

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
| WebKit async ComboBox | Tested with real delayed options; dropdown reopens if its owned portal closes during loading. [Five no-retry repeats](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/runs/39223806979) passed. This is targeted coverage, not a guarantee for all upstream versions |
| Module format | NodeNext ESM root export (`exports["."].import`) and TypeScript declarations (`exports["."].types`) |
| Package delivery | Experimental **0.1.1** published via npm OIDC with provenance; runtime-only packaging guard merged in PR #85 (effective on the next published version). Local `npm pack` and a **public registry** Angular consumer are tested separately in CI |

The Node 20.19.0 consumer check does not imply that Angular or the complete browser test suite support Node 20; those suites still run on Node 24. The package includes internal Taiga UI markup selectors, so some helpers can break across even minor UI changes. Prefer a narrow version support claim and monitor upstream changes before committing to maintenance SLAs.

## Packaging verification

After `npm ci && npm run build`:

```sh
npm run test:consumer
```

This creates an npm tarball in a temporary directory, checks its files, installs it **outside this repository**, type-checks a NodeNext ESM consumer, and verifies runtime imports. By default it uses the lockfile's Playwright version. Set `CONSUMER_PLAYWRIGHT_VERSION=1.51.0` to test the declared minimum; CI verifies this on Node 20.19.0 as well as the lockfile version on Node 24. No publish, tag, credential or registry write is performed.

## Release status and 1.0 readiness

**0.1.1 was published successfully** through the protected GitHub Actions workflow with npm Trusted Publishing and signed provenance. It remains **experimental**. Upstream PR #14584 has not established an interchangeable public API, and a catalog of 133 mapped components does not imply exhaustive behavior coverage. The package is independent of Taiga UI and not officially endorsed.

The old 0.1.1 npm tarball contained built docs and fixture files. [PR #85](https://github.com/splincode-taiga-labs/taiga-ui-playwright/pull/85) corrected `files` and added a packlist CI guard; that fix will take effect in the next published version, not retroactively in 0.1.1.

CI now also supports a **real registry installation** smoke check: `CONSUMER_REGISTRY_VERSION=0.1.1 npm run test:consumer:angular` installs that exact version from npm (not a local `file:` archive), verifies the resolved registry/integrity, type-checks imports, and exercises actual Angular Select/ComboBox form interactions. To validate a published prerelease, run the **CI** workflow manually with input `npm_version=1.0.0-rc.1` once that prerelease exists on npm. This proves compatibility for that selected consumer, not adoption or wider version support.

Before committing to 1.0, review the [public API contract proposal and export inventory](public-api.md), agree on a maintenance policy, test broader version ranges we intend to promise, and verify the 1.0 release candidate. Track remaining work in [issue #86](https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/86).
