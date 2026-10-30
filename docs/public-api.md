# Public API contract — 1.0 release candidate

**Status:** proposed 1.0 contract for `1.0.0-rc.1`, subject to review and [maintainer GO in #86](https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/86). An RC is not the final 1.0 compatibility commitment.

## Stable surface proposed for 1.x

The only supported entrypoint is the ESM package root, `@taiga-ui-labs/playwright`. The existing **266 named exports** remain available without renaming or removal relative to `0.1.2` (including the type-only `TuiOptionsFieldOptions`). These exported factories, classes and public TypeScript declarations are **all part of the proposed 1.x API**. We are **not** treating some root exports as undocumented internal APIs.

The [reviewed export inventory](public-api.exports.json) and `npm run test:api` prohibit unreviewed name changes. `npm run test:consumer` checks that every runtime export resolves from a standalone **packed** npm package, and type-checks representative public methods using NodeNext. Runtime behavior is covered by fixture/browser tests at the verified baseline.

There are **133 mapped Taiga UI components**, but a mapping is not a promise of exhaustive behavioral test coverage. Do not claim that every exported helper has been tested in every browser or across all Taiga UI minor versions.

## Core interaction contracts

| API | Input, behavior and result |
| --- | --- |
| `tuiSelect(host, options?)` / `new TuiSelect(host, options?)` | `host` is a component-scoped `Locator` for the enclosing `tui-textfield`. `input` is the `input[tuiSelect]` Locator. `selectOption(label)` selects a single visible enabled exact-label option, returning `Promise<void>`. |
| `tuiComboBox(host, options?)` / `new TuiComboBox(host, options?)` | Same `tui-textfield` host and overlay behavior. `input` locates `input[tuiComboBox]`; `fill(value)` uses the actual input; `selectOption(label)` selects a mounted option, including when it appears asynchronously. |
| `TuiOptionsField` inherited methods | `open()` / `close()` return `Promise<void>`; `getOverlay()` returns `Promise<Locator>`; `getOptionLabels()` returns `Promise<string[]>`; `getValue()` returns `Promise<string>`; `options`, `overlay`, and `option(label)` are Playwright Locators. |
| `TuiOptionsFieldOptions` | Optional `overlay?: Locator` for explicitly scoped custom portals and `optionSelector?: string` for custom option markup. Both are optional; callers supply a correctly scoped locator or selector. |
| `tuiDialog(host)` / `new TuiDialog(host)` | `host` is the target dialog `Locator`. `title`, `closeButton` and `button(name)` are scoped Locators; `clickButton(name)` clicks a named button, and `close()` clicks the real close control and waits for the dialog to disappear. |
| `tuiTabs(host)` | `tab(name)` returns a matching tab Locator; `select(name)` requires one enabled match, clicks it and asserts active state. |

### Portal ownership and failures

- Taiga dropdown portals can render outside the field. The field's `aria-controls` is used to associate the correct portal; it is read again for subsequent operations because the portal may be recreated.
- With multiple visible portals and no ownership association, the library fails **instead of guessing**. If a visible unassociated portal exists, operations require the field to be focused; otherwise they fail. For custom markup use `{overlay}`.
- `selectOption` matches full displayed option labels case-sensitively (allowing surrounding whitespace), rejects duplicate visible matches, waits for enabled options and may retry transient async portal changes. It does **not** select virtualized options not mounted in the DOM.
- Error types include Playwright assertion/timeout errors and explicit `Error` for ambiguous ownership, duplicate options or missing dialog close controls. **Human-readable error messages are diagnostic, not exact-string compatibility contracts.** Do not assert entire error messages in consumer tests.
- Helpers use Playwright locators and auto-waiting; they do not control Angular change detection or install a separate test runner.

## Compatibility policy proposed for 1.0

| Layer | Verified and supportable baseline | Not verified by this release |
| --- | --- | --- |
| Angular | **20.3.0**, real fixture and isolated consumer | Other Angular versions |
| Taiga UI | **5.28.0**, real DOM integration | Other 5.x versions |
| Playwright | **1.51.0** and **1.64.1** consumer matrix | Every intermediate version accepted by the declared `>=1.51.0 <2` peer range |
| Node.js | **20.19.0** for ESM consumer; **24** for browser/Angular tests | All other versions allowed by the `>=20` engine range |
| Browsers | Full Chromium fixture/docs; targeted Firefox, WebKit and mobile Chromium smoke | Full behavior of every helper across every browser |
| npm package | Published **0.1.2** registry consumer; 123-file runtime/declaration tarball with signed OIDC provenance | Published 1.0 RC until it is cut and independently tested |

This matrix is the **tested support baseline**, not a claim that every other compatible version fails. The broad npm peer/engine ranges indicate installability, not the breadth of integration evidence. Taiga UI DOM changes can affect a helper even in a minor version; assess newly supported versions in CI before documenting them as verified. There is no official upstream endorsement or guaranteed response-time SLA.

## Compatibility and change policy

For the final 1.x release, preserve package-root exported names, import paths, public TypeScript call signatures, option meanings, and documented interaction semantics in minor/patch releases. Fixes for defects and upstream DOM drift may update locator implementation and diagnostic messages without breaking the contract. Incompatible exported-name removal, constructor/method signature changes, or behavior changes require a new major version. Additive helpers may be introduced in a minor release with corresponding browser and consumer tests.

Do not use deep `dist/` imports. There is no compatibility facade for the proposed [Taiga UI upstream Playwright implementation](https://github.com/taiga-family/taiga-ui/pull/14584).

## Final-release gate

Before `1.0.0`: publish `1.0.0-rc.1` under npm dist-tag `next` through the protected workflow; run CI against that **registry** version, verify signed provenance and exact archive contents, and confirm the full browser/consumer matrix. Final `1.0.0` requires an explicit maintainer GO in [issue #86](https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/86). Do not tag final 1.0 solely because the RC was built.
