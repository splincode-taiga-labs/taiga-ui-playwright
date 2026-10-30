# API, compatibility, and upstream review

Initial compatibility review: 2026-10-19. 1.0 release candidate preparation: 2026-10-30. This is an **independently maintained package**, not an official Taiga UI distribution. The 1.0 API contract is proposed in [public-api.md](public-api.md), pending RC validation and maintainer GO.

## Upstream comparison

- [Taiga UI PR #14584](https://github.com/taiga-family/taiga-ui/pull/14584) remains **open and unmerged as of 2026-10-30**; its API has not been released through that PR. Recheck before a final 1.0 decision.
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
| Package delivery | **0.1.2** published through npm OIDC with signed provenance; **123 files / 47,760 packed bytes**, with no Angular fixture/docs bundles. The actual npm 0.1.2 was installed and tested in a clean Angular consumer in PR #90; RC publication remains a separate future gate. |

The Node 20.19.0 consumer check does not imply that Angular or the complete browser test suite support Node 20; those suites still run on Node 24. The npm `engines.node: >=20` and Playwright `>=1.51 <2` peer range are **declarations**, not evidence that the whole ranges have been verified. The 1.0 tested baseline is specifically Angular 20.3.0, Taiga UI 5.28.0, Playwright 1.51.0 and 1.64.1, Node 20.19.0 (ESM consumer) and Node 24 (browser integration). The package includes internal Taiga UI markup selectors, so helpers can be affected by minor Taiga UI DOM changes. Other versions need explicit validation before being called supported.

## Packaging verification

After `npm ci && npm run build`:

```sh
npm run test:consumer
```

This creates an npm tarball in a temporary directory, checks its files, installs it **outside this repository**, type-checks a NodeNext ESM consumer, and verifies runtime imports. By default it uses the lockfile's Playwright version. Set `CONSUMER_PLAYWRIGHT_VERSION=1.51.0` to test the declared minimum; CI verifies this on Node 20.19.0 as well as the lockfile version on Node 24. No publish, tag, credential or registry write is performed.

## Release status and 1.0 readiness

**0.1.2 is published** through the protected [GitHub Actions workflow](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/runs/41048920224) with npm Trusted Publishing, signed provenance and a **123-file** runtime-only archive. The previous `0.1.1` package remains immutable and includes unrelated fixture/docs output; PR #85's packaging fix shipped in `0.1.2`.

**Published registry consumer verified:** `CONSUMER_REGISTRY_VERSION=0.1.2 npm run test:consumer:angular` installs exact `0.1.2` from npm (not a `file:` archive), checks the resolved tarball URL and integrity, type-checks package imports, and runs real Angular 20 / Taiga UI 5 Select and ComboBox interactions. [PR #90 CI](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/runs/41050281269) passed.

The **1.0 candidate** retains the existing 266 named package-root exports and strengthens packaged ESM and TypeScript method-contract checks. See [the proposed 1.0 API contract](public-api.md). This is a SemVer commitment to the API after the **final 1.0 release**, not an assertion that every behavior of 133 mapped components has exhaustive browser coverage.

Before the final 1.0 tag: publish `1.0.0-rc.2` under npm dist-tag `next` (without disturbing `latest`), trigger **CI > Run workflow > npm_version=1.0.0-rc.2**, verify the registry artifact's source, signature and real browser behavior, and obtain an explicit maintainer GO in [issue #86](https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/86). Upstream PR #14584 is still not an interchangeable published API.
