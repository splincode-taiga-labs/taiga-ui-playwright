# Taiga UI Playwright

> Experimental, **unofficial** Playwright-native element objects for Taiga UI v5, maintained by [splincode-taiga-labs](https://github.com/splincode-taiga-labs). This project is not affiliated with the Taiga UI maintainers.

This is a proof of concept, **not a published npm package**. The goal is to explore Locator-first helpers for common, complex UI interactions and contribute useful ideas upstream.

## Why?

Taiga UI already has [internal Playwright Element Objects](https://github.com/taiga-family/taiga-ui/tree/main/projects/demo-playwright/utils/element-objects), and an [upstream proposal to expose public testing APIs](https://github.com/taiga-family/taiga-ui/pull/14584). This project experiments with accepting existing Locators, relying on Playwright's auto-waiting, and keeping the API deliberately small.

## Local development

Requires Node.js 20+.

~~~bash
npm ci
npx playwright install chromium
npm run verify
~~~

### Real Angular integration fixture

`integration/angular-app/` is a minimal Angular 20 application using **real Taiga UI 5.28.0 components**. Run `npm run test:integration` for live Angular E2E and `npm run test:dom` for synthetic DOM regression tests. Playwright starts the fixture automatically on `127.0.0.1:4201`; it does not depend on taiga-ui.dev or any live external website. CI additionally executes `npm run build:fixture`.

Tests assert reactive form model output for Select and ComboBox and the dialog lifecycle after interacting through the exported helper functions. Node.js 24 is used by CI.


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

Taiga UI v5 supplies an `aria-controls` relationship between the textfield input and the dynamically rendered portal. The helpers **follow that relationship**, re-reading its ID on each operation to avoid selecting another field's dropdown. This works across detached/recreated portals and supported `tui-dropdown`, `tui-dropdown-mobile` and `tui-sheet-dialog` elements. If your markup does not provide `aria-controls`, a single focused field with one visible overlay can still work, but multiple or unowned overlays fail clearly; supply an explicit `overlay` instead.

Pass an explicit overlay when a custom component does not expose `aria-controls`:

~~~ts
const select = tuiSelect(page.getByTestId('country-field'), {
    overlay: page.getByTestId('country-options'),
});
~~~

Call `await select.getOverlay()` to resolve the current owned overlay after dynamic DOM changes. The existing `select.overlay` property remains a synchronous lazy Locator, scoped to the most recently resolved `aria-controls` ID. After an `open()` or `close()` call it is up to date.

For custom option markup, pass `optionSelector` (default: `tui-data-list [tuiOption]`). `selectOption` matches the **full visible label, case-sensitively**, escapes regexp characters, waits for an async option to appear, rejects ambiguous labels and verifies that the option is enabled before clicking. Disabled and hidden options are never silently selected. If two visible options have the same label, use `select.options` and your own scoped Locator to disambiguate.

The visible-option Locator filter requires Playwright **1.51 or newer**. Keyboard actions intentionally remain Playwright-native: `await select.input.press('ArrowDown')`, `await page.keyboard.press('Enter')`, or `await select.close()` for Escape.

For a virtualized data list, only DOM-mounted options are selectable. Scroll the virtual viewport to mount an offscreen item before calling `selectOption()`; the helper does not attempt to search the entire virtual data source or scroll arbitrary containers.

The real Angular fixture covers strict ComboBox (unmatched text not committed), non-strict ComboBox (custom text allowed), disabled Select options, no matches and asynchronously loaded ComboBox options.

| Object | API |
| --- | --- |
| `tuiSelect(host)` | `host`, `input`, `overlay`, `options`, `option(label)`, `open()`, `close()`, `getOverlay()`, `selectOption(label)`, `getOptionLabels()`, `getValue()` |
| `tuiComboBox(host)` | Select's API plus `fill(text)` |
| `tuiDialog(host)` | `host`, `title`, `closeButton`, `button(name)`, `clickButton(name)`, `close()` |

Dialog helpers are scoped to a caller-provided `tui-dialog` Locator; `title` is an optional heading Locator, while `close()` uses the real `tuiButtonX`, reports `closable: false` clearly, and waits for async close guards/exit animations. Native Playwright `page.keyboard.press('Escape')` covers dismissible dialogs. For disabled/custom buttons use `dialog.button('Save')` with `expect(...).toBeDisabled()` or other Playwright assertions.

No arbitrary timeouts, global singleton state, or custom Playwright runner.

## Additional tested v5 component harnesses

The following eleven native/compound Taiga UI components expose Locator-first helpers:
`tuiButton`, `tuiCheckbox`, `tuiRadio`, `tuiInput`, `tuiSwitch`,
`tuiTextarea`, `tuiTabs`, `tuiSegmented`, `tuiAccordion`,
`tuiPagination` and `tuiStepper`.

Use a component-scoped Locator, then perform semantic actions. Each helper is
validated on the actual Angular/Taiga UI v5 fixture, including FormControl updates,
active selection, disabled controls, and accordion aria-controls pairing.

```ts
const tabs = tuiTabs(page.getByTestId('basic-tabs'));
await tabs.select('Details');

const accordion = tuiAccordion(page.getByTestId('basic-accordion'));
await accordion.expand('Shipping');

await tuiCheckbox(page.getByTestId('basic-checkbox')).check();
```

These are native Playwright-based helpers, not Angular CDK ComponentHarnesses.
Coverage is marked Done only after verified browser integration.

## Specialized input harnesses

`tuiInputNumber`, `tuiInputPhone`, `tuiInputPin`, `tuiInputColor`, `tuiInputSlider` and `tuiSlider` wrap real Taiga UI input directives. Values and keyboard events are tested against Angular `FormControl`, including phone masking and the native range slider. A field helper takes the containing `tui-textfield` Locator; the range slider accepts the `input[tuiSlider]` Locator.

## Quality gates and limitations

CI runs strict TypeScript typechecking, ESM declaration build, Angular fixture build, synthetic DOM tests and Chromium E2E tests against a **real Angular/Taiga UI application**. An additional smoke job covers Chromium, Firefox, WebKit and mobile-emulated Chromium using the same Angular fixture. Broader Angular and browser-version compatibility still needs evaluation before a release.

## Harness coverage documentation

The community coverage matrix is a real Angular documentation app powered by `@taiga-ui/addon-doc`, with the Taiga UI navigation, theme, and components.

- Local docs: `npm run start:docs`
- Production Pages build: `npm run build:docs:pages`
- Published URL after enabling GitHub Pages / merging the docs PR: [Harness coverage](https://splincode-taiga-labs.github.io/taiga-ui-playwright/)
- Logo: `docs/site/public/assets/brand.svg` (provided via `TUI_DOC_LOGO`); navigation uses `/matrix` and `/guide`, with `/#/` redirecting to `/matrix`. Code samples use Taiga UI `TuiDocCode` with TypeScript syntax highlighting.
- Coverage data: `docs/site/src/harness-catalog.ts` (based on upstream Taiga UI v5.28 component directories). This is a component inventory, **not** a claim that every component already has a Playwright helper.
- Each completed row must map to a real exported helper and have tests. Planned work remains TODO until implemented.

GitHub Pages requires repository Settings → Pages → Source: **GitHub Actions**. After this is enabled, the deploy workflow publishes `dist/docs/browser` on pushes to `main`.

## Roadmap

- [x] Locator-first Select, ComboBox, Dialog PoC
- [x] DOM-based behavior tests and CI
- [x] Validate against a real Angular 20 app using Taiga UI 5.28.0
- [ ] Check mobile overlays, repeated fields and virtualized options
- [ ] Compare to upstream Element Objects and propose improvements
- [ ] Decide whether a separate npm package is warranted at all

Related: [Taiga UI issue #476](https://github.com/taiga-family/taiga-ui/issues/476) and [PR #14584](https://github.com/taiga-family/taiga-ui/pull/14584).

MIT license.


## Calendar and date/time element objects

Five helper APIs are tested with the real Taiga UI v5 calendars: `tuiCalendar` (scoped current-month day selection), `tuiCalendarMonth` (month selection), `tuiInputDate` (owns an aria-controls-linked calendar portal), `tuiInputYear` (numeric form value), and `tuiInputTime` (24-hour HH:MM form value). Integration tests assert TuiDay/TuiMonth/TuiTime or form models, not just displayed input strings.

Calendar day selection requires a uniquely visible **in-month** cell and rejects invalid day numbers. CalendarMonth takes a zero-based month index rather than a localized label. More complex range/multi-date calendars need their own specialized helpers.


## Date ranges and combined fields

`tuiCalendarRange`, `tuiInputDateRange`, `tuiInputDateTime`, and `tuiInputMonth` are scoped Locator-first APIs. Range helpers select two dates in the first visible month, validating the start/end order and calendar cell states. InputDateRange, InputDateTime and InputMonth resolve an owned overlay using `aria-controls` and are covered by real Angular form model integration. This first version does not support cross-month range selection or mobile native pickers.

## Interactive widgets batch

The real Angular 20 + Taiga UI 5.28.0 fixture also verifies five specialized helpers: `tuiRating` (keyboard-driven rating), `tuiLike` (checkbox semantics), `tuiCopy` (actual browser Clipboard API), `tuiInputChip` (tag creation/removal with the reactive form model), and `tuiProgress` (native progress value/max and Angular updates). The browser context must grant clipboard permissions when reading copied content. All five have actual Playwright integration tests before being marked Done in the coverage matrix.

## Form and navigation helpers

Five further source-backed Taiga UI v5 harnesses have real Angular integration: `tuiCounter` (min/max state), `tuiRadioList` (native radio semantics and FormControl), `tuiInputInline` (mirror/placeholder), `tuiRange` (keyboard-driven two-thumb value) and `tuiExpand` (expanded/collapsed lifecycle). These are tested against actual Angular 20 + Taiga UI 5.28.0 components.

## Individual harness documentation

Each verified helper has its own native addon-doc route at `/#/harness/<category>/<name>`, listed in the collapsible `Harnesses` sidebar. Each route offers a working `Copy import`, `Copy example` and `Copy implementation` control. The implementation is served unchanged from `src/*.ts` as Pages assets, so the site does not hand-maintain another copy of library source. Documentation search is enabled in the addon-doc sidebar. `npm run test:docs` exercises navigation, copy and source download with real Chromium.


## Multi-value and range harnesses

`tuiMultiSelect` chooses a unique option in an ARIA-linked dropdown, `tuiInputDateMulti` toggles dates in a multi-value calendar, and `tuiInputRange` edits two numeric endpoints. The real Angular 20/Taiga UI 5 fixture and addon-doc pages cover these exported helpers. Cross-month and mobile date-picker interactions are not yet tested.


## Semantic navigation and status harnesses

Nine additional Taiga UI v5 components have source-backed Locator helpers and real Angular E2E: `tuiSpinButton` (bounded increment/decrement and arrow keys), `tuiPincode` (numeric length-constrained entry), `tuiButtonLoading` (disabled interaction and status), `tuiPager` (active indicator index), `tuiLink` (native navigation), `tuiChip`/`tuiBadge` (dynamic appearance/size), `tuiPin` (open class) and `tuiMeter` (native values and bounds). Each has its own addon-doc reference with import and example.

## Visual and navigation harnesses

Five additional components are verified in the real Angular fixture:
`tuiLoader` (loading and disabled content), `tuiAvatar` (shape and size),
`tuiBadgeNotification` (count and size), `tuiStatus` (status color), and
`tuiBreadcrumbs` (native navigation). Each has a dedicated addon-doc page.

The documentation's copy toolbar is outside the `TuiDocCode` overlay to keep
Copy import/example/implementation clickable. Full source stays collapsed by
default for users of this as-yet unpublished package; the expanded source uses
`TuiScrollbar` with a 500px height cap and a GitHub source link.

## Core behavior batch

Five additional verified Locator-first APIs:
- `tuiError` — assert validation message lifecycle.
- `tuiDataList` — keyboard option navigation and enabled-only selection.
- `tuiTextfield` — clear a FormControl through the component action, focus, disabled state.
- `tuiScrollbar` — scroll the live Taiga UI container in both directions.
- `tuiCarousel` — move slides with real scroll snapping and check Angular index updates.

The Angular 20 / Taiga UI 5.28 fixture and addon-doc references provide real browser coverage for all five.

## Kit interaction harnesses

Five more Taiga UI components are exercised in real Angular Playwright tests:
`tuiDataListWrapper` checks option clicks and async loading; `tuiLineClamp` verifies
CSS line limits; `tuiBlock` drives native checked/disabled state;
`tuiTimeline` uses keyboard interaction and exposes layout orientation;
`tuiInputMonthRange` scopes the date popup to its owning input and commits an actual range.

## Visual and action batch

Five additional verified Taiga UI v5.28 helpers: `tuiIcon` (real SVG resolver
and HTTP asset availability), `tuiFilter` (FormControl checkbox selection),
`tuiActionBar` (menu expansion and real action clicks), `tuiPulse`
(reactive playing state), and `tuiCompass` (reactive CSS angle).
Each has an Angular fixture, Chromium integration test and addon-doc page.

## Layout and overflow harnesses

Five additional real Angular/Taiga UI v5 helpers have verified integration tests:
`tuiCell` (size/height changes), `tuiLabel` (input association, orientation),
`tuiTitle` (reactive typography variant), `tuiItemsWithMore` (adaptive visibility
and item limits), and `tuiTiles` (drag-and-drop order map).
Individual reference pages link to their actual implementation.

## Notifications, badges and layout

Five more Locator-first helpers have real Angular and Chromium tests:
`tuiNotification` (appearance/size), `tuiBadgedContent` (slot projection),
`tuiBlockStatus` (card and projected action), `tuiCard` (collapsed layout),
and `tuiInputSearch` (portal open, typing and Escape/selection closure).
Each has a source-backed documentation page. The catalog is now 81/133 once merged.

## Portal and layout batch

New browser-tested helpers: `tuiConfirm` (dirty and pristine confirmation flows),
`tuiToast` (appearance and dismissal), `tuiForm` (size projection and submit),
`tuiItemGroup` (horizontal autoscroll), and `tuiShrinkWrap` (responsive max-inline-size).
Each is backed by an actual Angular fixture, integration test, and addon-doc reference.

## Layout and dismissal batch

`tuiList` verifies native list items and size changes; `tuiSlides` verifies
directional content switching; `tuiElasticContainer` measures real growth
when a child is added; `tuiFloatingContainer` asserts its reactive background;
and `tuiClose` checks Escape and outside click dismissal.
Each has real Angular v5.28 integration and a source-backed docs page.

## Remaining v5 harnesses — consolidated PR

The remaining components are being implemented in one consolidated branch.
The first ten real Angular fixtures cover Core Root, Kit Comment/Message/Drawer,
Layout Header/BlockDetails/Surface/Search/AppBar and ProgressiveBlur.
Coverage is recorded per verified component; additional groups will join this PR.

## Cross-browser and mobile smoke tests

Run a small, repeatable set of **real Angular + Taiga UI 5.28** interactions separately from the full Chromium suite:

```bash
npx playwright install chromium firefox webkit
npm run test:smoke
npm run test:smoke -- --repeat-each=3
npm run test:smoke -- --project=webkit
```

`playwright.smoke.config.ts` configures desktop Chromium, Firefox, WebKit and an emulated Pixel 7 (Chromium/touch/mobile viewport). It verifies independent Select portals, delayed ComboBox options and dialog reopen/close lifecycle. Mobile-only scenarios additionally exercise real mobile calendar and sheet dialog overlays. They are skipped in desktop projects, not silently treated as browser coverage.

The smoke suite is excluded from `npm test` to avoid running it twice. WebKit runs the synchronous ComboBox selection scenario, but the async ComboBox scenario is explicitly skipped on WebKit: Taiga UI v5.28 intermittently detaches the option portal during a click ([reproduction in CI](https://github.com/splincode-taiga-labs/taiga-ui-playwright/actions/runs/39205562527)). Chromium and Firefox cover async option loading. This remains an open compatibility limitation in #7. GitHub Actions runs each browser project twice and collects screenshots on failure and traces on first retry. No hard-coded sleeps, forced clicks or global unscoped option selection are used.

**Scope:** these smoke checks validate selected workflows, not every harness or all browser/OS combinations. Unsupported combinations or regressions must be reported explicitly before broadening the matrix.


## Public API and package compatibility review

The repo is **still private and unpublished**. See [API and upstream compatibility review](docs/api-upstream-compatibility.md) for tested version combinations, differences from upstream, example migrations, known limitations, and the no-go release decision.

After `npm ci` and `npm run build`, run `npm run test:consumer` to pack the current code (without publishing it), install the archive into an independent temporary ESM project, check root runtime imports, and type-check a real TypeScript consumer using NodeNext resolution. CI runs this check before the Angular/browser suites.
