# Taiga UI 4.x coverage

The npm secondary entrypoint `@taiga-ui-labs/playwright/v4` exports the **same 266 named symbols** as the package root. It does not automatically make every v5 DOM locator work on every version of Taiga UI v4.

## Browser-verified on Taiga UI 4.106.0

The local v4 Angular fixture runs real Taiga UI v4 controls in CI, and `compatibility/v4.spec.ts` imports the **built APF /v4 entrypoint**. Each test exercises a live component and checks DOM state or its Angular model.

| Component | Export | Verification |
| --- | --- | --- |
| Button | `tuiButton` | Click increments signal |
| Select | `tuiSelect` | Select option updates FormControl |
| ComboBox | `tuiComboBox` | Fill and select update FormControl; one filtered option uses the native v4 Enter handler to avoid strict-mode blur clearing |
| Checkbox | `tuiCheckbox` | Check/uncheck update FormControl |
| Radio | `tuiRadio` | Check updates FormControl |
| Switch | `tuiSwitch` | Toggle updates FormControl |
| Tabs | `tuiTabs` | Click activates the requested tab |
| Segmented | `tuiSegmented` | Click switches active option |
| Textarea | `tuiTextarea` | Fill updates FormControl |
| Pagination | `tuiPagination` | Change page updates Angular index |
| Stepper | `tuiStepper` | Activate step updates Angular index |
| InputNumber | `tuiInputNumber` | Fill updates numeric FormControl |
| Link | `tuiLink` | Follow native anchor |
| Badge | `tuiBadge` | Check appearance and size |
| Chip | `tuiChip` | Check appearance |
| BadgeNotification | `tuiBadgeNotification` | Check count and size |
| Like | `tuiLike` | Toggle FormControl |
| Progress | `tuiProgress` | Check native progress and Angular state |
| Loader | `tuiLoader` | Loading and idle states |
| Expand | `tuiExpand` | Open/close content |
| Avatar | `tuiAvatar` | v4-specific round class, size and content fallback |
| Textfield | `tuiTextfield` | Focus native v4 input |
| Calendar | `tuiCalendar` | Select a day in a real v4 calendar |
| InputDate | `tuiInputDate` | Select a date from the owned v4 dropdown |
| MultiSelect | `tuiMultiSelect` | Select multiple items through a real v4 portal |
| Dialog | `tuiDialog` | Confirm and close a real v4 dialog via version-specific locators |
| Accordion | `tuiAccordion` | Expand/collapse real v4 panels using its version-specific header and open state |
| Rating | `tuiRating` | Keyboard rating updates a FormControl |
| Breadcrumbs | `tuiBreadcrumbs` | Render and follow projected links; check size |

**Tested stack:** Angular 20.3.0, Taiga UI 4.106.0, Playwright 1.64.1, Node 24, Chromium. All other 104 catalog harnesses and earlier/later Taiga UI 4.x releases require separate browser verification. Some v5-only components may not exist in v4; the 133-item website catalog inventories **v5**, not v4.

## v4 component inventory

The [v4 source inventory](taiga-v4-inventory.md) lists 123 real Taiga UI v4 component directories (not directives or legacy controls). The [public documentation](https://splincode-taiga-labs.github.io/taiga-ui-playwright/) includes a separate v4 TODO matrix for this inventory. **A mapped helper does not mean its v4 behavior was verified.**

## Consumer usage

```ts
import {tuiSelect, tuiCheckbox, tuiTabs} from '@taiga-ui-labs/playwright/v4';

const country = tuiSelect(page.getByTestId('country-field'));
await country.selectOption('Estonia');

await tuiCheckbox(page.getByTestId('terms')).check();
await tuiTabs(page.getByTestId('tabs')).select('Details');
```

## Verify changes

```sh
npm ci
npm run build
npm run test:pack
npm run test:compat
npm run build:docs:pages
```

When implementing another v4 harness, first add its **actual v4 component** to `integration/angular-app-v4/src/app.ts`, then a `compatibility/v4.spec.ts` test asserting the resulting Angular state or DOM. Run that same workspace in the v4 Playwright CI project; only then add the helper to this table. Do not deploy the fixture HTML to GitHub Pages. Do not infer compatibility solely from an exported TypeScript symbol or a passing v5 test.

The v5 entrypoint `@taiga-ui-labs/playwright` is unchanged. This library is independent of Taiga UI and not an officially supported Taiga UI package.
