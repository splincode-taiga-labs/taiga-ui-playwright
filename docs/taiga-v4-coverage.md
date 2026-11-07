# Taiga UI 4.x coverage

The npm secondary entrypoint `@taiga-ui-labs/playwright/v4` exports the **same 266 named symbols** as the package root. It does not automatically make every v5 DOM locator work on every version of Taiga UI v4.

## Browser-verified on Taiga UI 4.106.0

The [live v4 demo](https://splincode-taiga-labs.github.io/taiga-ui-playwright/v4/) runs real Taiga UI v4 controls, and `compatibility/v4.spec.ts` imports the **built APF /v4 entrypoint**. Each test exercises a live component and checks DOM state or its Angular model.

| Component | Export | Verification |
| --- | --- | --- |
| Button | `tuiButton` | Click increments signal |
| Select | `tuiSelect` | Select option updates FormControl |
| ComboBox | `tuiComboBox` | Fill and select update FormControl |
| Checkbox | `tuiCheckbox` | Check/uncheck update FormControl |
| Radio | `tuiRadio` | Check updates FormControl |
| Switch | `tuiSwitch` | Toggle updates FormControl |
| Tabs | `tuiTabs` | Click activates the requested tab |
| Segmented | `tuiSegmented` | Click switches active option |
| Textarea | `tuiTextarea` | Fill updates FormControl |
| Pagination | `tuiPagination` | Change page updates Angular index |
| Stepper | `tuiStepper` | Activate step updates Angular index |
| InputNumber | `tuiInputNumber` | Fill updates numeric FormControl |

**Tested stack:** Angular 20.3.0, Taiga UI 4.106.0, Playwright 1.64.1, Node 24, Chromium. All other 121 catalog harnesses and earlier/later Taiga UI 4.x releases require separate browser verification. Some v5-only components may not exist in v4; the 133-item website catalog inventories **v5**, not v4.

## v4 component inventory

The [v4 source inventory](taiga-v4-inventory.md) lists 123 real Taiga UI v4 component directories (not directives or legacy controls). The live /v4 demo contains the same list. **A mapped helper does not mean its v4 behavior was verified.**

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

When implementing another v4 harness, first add its **actual v4 component** to `integration/angular-app-v4/src/app.ts`, then a `compatibility/v4.spec.ts` test asserting the resulting Angular state or DOM. Run that same workspace in the published /v4 demo; only then add the helper to this table. Do not infer compatibility solely from an exported TypeScript symbol or a passing v5 test.

The v5 entrypoint `@taiga-ui-labs/playwright` is unchanged. This library is independent of Taiga UI and not an officially supported Taiga UI package.
