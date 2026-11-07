# API, compatibility, and upstream review

Initial compatibility review: 2026-10-19. 1.0 release candidate preparation: 2026-10-30. This is an **independently maintained package**, not an official Taiga UI distribution. The frozen 1.x API contract is documented in [public-api.md](public-api.md); final publication remains gated on verified release artifacts.

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
| Taiga UI | Root: **5.28.0**; `/v4`: **4.106.0**. Permanent demo workspaces exercise the package's built API in Chromium. 26 real v4 controls are tested; other components and versions remain unverified |
| Angular | Fixture tested with **20.3.0** only |
| Playwright | Peer range **>=1.51 <2** is declared; the current v4/v5 compatibility suite runs on **1.64.1**, not the entire peer range |
| Node | Package declares **>=20**; current workspace/browser CI runs on **24**. Node 20 verification was performed in the earlier consumer pipeline but is no longer rerun by this PR |
| Browsers | Chromium full integration/docs; Chromium, Firefox and WebKit targeted smoke; Pixel 7 emulated mobile Chromium |
| WebKit async ComboBox | Tested with real delayed options; dropdown reopens if its owned portal closes during loading. [Five no-retry repeats](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/runs/39223806979) passed. This is targeted coverage, not a guarantee for all upstream versions |
| Module format | `ng-packagr` APF ESM bundles and generated TypeScript declarations for root and `/v4` exports |
| Package delivery | **0.1.2** published through npm OIDC with signed provenance; **123 files / 47,760 packed bytes**, with no Angular fixture/docs bundles. The actual npm 0.1.2 was installed and tested in a clean Angular consumer in PR #90; RC publication remains a separate future gate. |

The historical Node 20.19.0 consumer check does not imply that Angular or the browser test suite supports Node 20. The `engines.node: >=20` and Playwright `>=1.51 <2` peer range are **declarations**, not evidence that entire ranges are verified. Current workspace compatibility CI uses Angular 20.3.0, Taiga UI 4.106.0/5.28.0, Playwright 1.64.1 and Node 24. The package includes internal Taiga UI markup selectors, so helpers can be affected by minor Taiga UI DOM changes. Other versions need explicit validation before being called supported.

## Taiga UI v4 secondary entrypoint

Import from `@taiga-ui-labs/playwright/v4` for Taiga UI 4.x projects.
This additive export exposes the same helpers as the original 1.x package root,
without forking their implementation or changing existing v5 imports.

The dedicated Angular 20.3 workspace installs Taiga UI **4.106.0**, Maskito
**3.x**, and `@ng-web-apis` **4.x** instead of the v5 dependency family.
It uses v4's `*tuiTextfieldDropdown` syntax and drives 26 real controls in Chromium, asserting Angular state and reactive form values.

**Verified scope:** Button, Select, ComboBox, Checkbox, Radio, Switch, Tabs, Segmented, Textarea, Pagination, Stepper, InputNumber, Link, Badge, Chip, BadgeNotification, Like, Progress, Loader, Expand, Avatar, Textfield, Calendar, InputDate, MultiSelect and Dialog on 4.106.0. The rest of the public API is available through the secondary entrypoint but is not yet integration-verified on v4. Other v4 versions need independent testing. See [the v4 coverage matrix](taiga-v4-coverage.md).

```sh
npm run test:compat
```

## Packaging and workspace browser verification

After `npm ci && npm run build`:

```sh
npm run test:pack
npm run test:compat
```

Both demos are version-pinned **npm workspaces**: `integration/angular-app`
(Taiga UI 5.28) and `integration/angular-app-v4` (Taiga UI 4.106).
Playwright runs against both independent Angular apps and imports built APF
root and `/v4` JavaScript, rather than temporary generated consumers.

The npm package output is `dist/package`, separate from fixture/docs build output.

## Release validation

**0.1.2 is published** through the protected [GitHub Actions workflow](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/runs/41048920224) with npm Trusted Publishing, signed provenance and a **123-file** runtime-only archive. The previous `0.1.1` package remains immutable and includes unrelated fixture/docs output; PR #85's packaging fix shipped in `0.1.2`.

**Historical published registry verification:** the now-retired `test:consumer:angular` script installed `0.1.2` from npm, checked package integrity and exercised Taiga UI 5 Select and ComboBox; this is not part of the current workspace-based CI. [PR #90 CI](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/runs/41050281269) passed.

The **1.0 contract** retains the existing 266 named package-root exports and is checked by the public API inventory, APF packlist and workspace browser tests. See [the frozen 1.0 API contract](public-api.md). This is a SemVer commitment to the API once the **final 1.0 release is published**, not an assertion that every behavior of 133 mapped components has exhaustive browser coverage.

The maintainer approved final 1.0 on 2026-11-01. Before tagging it, independently verify the published `1.0.0-rc.2` on npm `next` with **CI > Run workflow > npm_version=1.0.0-rc.2**, confirm provenance and browser behavior, then require green CI on the final release commit. After publishing stable `1.0.0` to npm `latest`, repeat the workspace browser checks against the release artifact before closing [#86](https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/86). Upstream PR #14584 is not an interchangeable published API.
