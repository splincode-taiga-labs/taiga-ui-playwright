# Public API contract — proposal for 1.0

**Draft for review, not yet an approved API freeze or a release decision.**

## Exported surface

The official import entrypoint is `@taiga-ui-labs/playwright` (ESM). There are **266 named exports** today: harness factories, harness classes and the type-only `TuiOptionsFieldOptions`. Review [the complete export inventory](public-api.exports.json) before deciding whether every current export should remain supported for 1.x. The 133 Taiga UI component mappings are a catalog, **not a guarantee that 133 independent behaviors are exhaustively tested**.

`npm run test:api` rejects accidental export additions, removals and renames. Intentional public changes require reviewing their SemVer impact and running `npm run test:api -- --update` in a PR. This snapshot checks **names**, not method types, option defaults or behavior; the typed consumer and browser tests provide separate evidence.

## Core API candidates

| Factory | Behavioral contract |
| --- | --- |
| `tuiSelect(host, options?)` | Caller passes the containing `tui-textfield` Locator. `selectOption(label)` selects one exact visible enabled item. `aria-controls` scopes dynamic portals; duplicate labels, disabled options or ambiguous overlays fail rather than guessing. |
| `tuiComboBox(host, options?)` | Same scoping model, plus `fill(value)`. Only DOM-mounted options are selectable; async options can be retried. |
| `tuiDialog(host)` | Caller provides a dialog Locator. `button(name)` and `clickButton(name)` are scoped to that dialog; `close()` requires a real close button and waits for exit. |
| `tuiTabs(host)` | `tab(name)` locates the interactive tab; `select(name)` activates a unique enabled tab. |

Only package-root imports are supported. Deep imports into `dist/` are not public APIs. This package uses native Playwright Locators, not a custom test runner or Angular CDK Harness.

## Verified compatibility baseline

| Dimension | Verified baseline | Outside current test evidence |
| --- | --- | --- |
| Taiga UI | 5.28.0 | Other 5.x versions |
| Angular | 20.3.0, real fixture + fresh Angular consumer | Other Angular major/minor versions |
| Playwright | 1.51.0, 1.64.1 consumer matrix | Every version in the declared `>=1.51 <2` peer range |
| Node.js | 20.19.0 for ESM consumer; 24 for Angular/browser checks | All `>=20` declared engines |
| Browsers | Full Chromium integration; targeted Firefox, WebKit and mobile Chromium smoke | Every browser flow for every harness |
| Published npm | 0.1.1 from registry in isolated Angular consumer | Fixed packaging in 0.1.1 (only future releases get the slimmer tarball) |

This is a **test evidence matrix**, not a blanket promise of compatibility. The package has no direct Angular runtime dependency, but Taiga UI DOM internals can change across versions.

## Release criteria

Before `1.0.0`, the maintainer must decide whether to (a) stabilize all 266 exports or (b) simplify the root exports first, and document the supported API signatures, error semantics, overlay ownership and compatibility policy. Test a published `1.0.0-rc.1` via the registry consumer and full browser CI before a separate release GO. Follow [issue #86](https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/86).
