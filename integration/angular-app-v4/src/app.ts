import {Component, signal} from '@angular/core';

import {V4_COMPONENTS} from './component-inventory';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiRoot, TuiTextfield, TuiTextfieldDropdownDirective} from '@taiga-ui/core';
import {
    TuiCheckbox,
    TuiChevron,
    TuiComboBox,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiInputNumberDirective,
    TuiPagination,
    TuiRadioComponent,
    TuiSegmented,
    TuiSelect,
    TuiStep,
    TuiStepperComponent,
    TuiSwitch,
    TuiTab,
    TuiTabsHorizontal,
    TuiTextarea,
} from '@taiga-ui/kit';

@Component({
    selector: 'app-demo-v4',
    imports: [
        ReactiveFormsModule,
        TuiRoot,
        TuiTextfield,
        TuiTextfieldDropdownDirective,
        TuiButton,
        TuiChevron,
        TuiSelect,
        TuiDataListWrapper,
        TuiComboBox,
        TuiFilterByInputPipe,
        TuiCheckbox,
        TuiRadioComponent,
        TuiSwitch,
        TuiTab,
        TuiTabsHorizontal,
        TuiSegmented,
        TuiTextarea,
        TuiPagination,
        TuiStepperComponent,
        TuiStep,
        TuiInputNumberDirective,
    ],
    template: `
        <tui-root>
            <header class="demo-header">
                <a href="../">← Back to Taiga UI 5 docs</a>
                <span>Taiga UI 4.106.0 · Angular 20.3.0</span>
            </header>
            <main>
                <p class="eyebrow">INTERACTIVE COMPATIBILITY</p>
                <h1>Taiga UI 4 demo</h1>
                <p class="intro">
                    Real Taiga UI 4 components. Use these controls to explore the
                    same Angular application that our Playwright tests run against.
                </p>
                <p class="notice">
                    <strong>Tested controls, not blanket v4 compatibility.</strong>
                    This demo exercises twelve real Taiga UI controls with the packaged /v4 API
                    in Chromium on 4.106.0. Other components and earlier 4.x versions
                    still need their own integration tests.
                </p>
                <details class="component-inventory">
                    <summary>Browse the Taiga UI 4 component inventory ({{ componentInventory.length }} directories; {{ verifiedCount }} browser-verified)</summary>
                    <p>Actual upstream v4.x component directories from Core, Kit, Mobile, Layout, Table and Commerce.
                       Directives, pipes, legacy and experimental packages are excluded. An exported helper alone does not mean verified behavior.</p>
                    <div class="inventory-scroll">
                        <table>
                            <thead><tr><th>Package</th><th>Component</th><th>Harness</th><th>Browser test</th></tr></thead>
                            <tbody>
                                @for (item of componentInventory; track item.path) {
                                    <tr [attr.data-v4-component]="item.group + '/' + item.name" [attr.data-verified]="item.verified">
                                        <td>{{ item.group }}</td>
                                        <td><a [href]="'https://github.com/taiga-family/taiga-ui/tree/v4.x/' + item.path" target="_blank" rel="noopener noreferrer">{{ item.name }}</a></td>
                                        <td>@if (item.helper) { <code>{{ item.helper }}</code> } @else { — }</td>
                                        <td>{{ item.verified ? 'Verified' : 'Not verified' }}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </details>
                <h2>Playwright import</h2>
                <pre><code [textContent]="importCode"></code></pre>
                <h2>Button</h2>
                <button tuiButton type="button" data-testid="save-button" (click)="save()">
                    Save
                </button>
                <output data-testid="save-model">{{ saved() }}</output>

                <section>
                    <h2>Select</h2>
                    <tui-textfield data-testid="country-field" tuiChevron>
                        <input aria-label="Country" tuiSelect [formControl]="country" />
                        <tui-data-list-wrapper new *tuiTextfieldDropdown [items]="countries" />
                    </tui-textfield>
                    <output data-testid="country-model">{{ country.value ?? 'null' }}</output>
                </section>
                <section>
                    <h2>ComboBox</h2>
                    <tui-textfield data-testid="city-field" tuiChevron>
                        <input aria-label="City" tuiComboBox [formControl]="city" />
                        <tui-data-list-wrapper new *tuiTextfieldDropdown [items]="cities | tuiFilterByInput" />
                    </tui-textfield>
                    <output data-testid="city-model">{{ city.value ?? 'null' }}</output>
                </section>

                <section>
                    <h2>Checkbox</h2>
                    <label><input tuiCheckbox type="checkbox" data-testid="checkbox" [formControl]="accepted" /> Accept terms</label>
                    <output data-testid="checkbox-model">{{ accepted.value }}</output>
                </section>
                <section>
                    <h2>Radio</h2>
                    <label><input tuiRadio type="radio" name="plan" value="basic" data-testid="radio-basic" [formControl]="plan" /> Basic</label>
                    <label><input tuiRadio type="radio" name="plan" value="pro" data-testid="radio-pro" [formControl]="plan" /> Pro</label>
                    <output data-testid="radio-model">{{ plan.value }}</output>
                </section>
                <section>
                    <h2>Switch</h2>
                    <label><input tuiSwitch type="checkbox" data-testid="switch" [formControl]="enabled" /> Notifications</label>
                    <output data-testid="switch-model">{{ enabled.value }}</output>
                </section>
                <section>
                    <h2>Tabs</h2>
                    <nav tuiTabs data-testid="tabs" [(activeItemIndex)]="activeTab">
                        <button tuiTab type="button">Overview</button>
                        <button tuiTab type="button">Details</button>
                    </nav>
                    <output data-testid="tabs-model">{{ activeTab }}</output>
                </section>
                <section>
                    <h2>Segmented</h2>
                    <tui-segmented data-testid="segmented" [(activeItemIndex)]="activeSegment">
                        <button type="button">List</button>
                        <button type="button">Cards</button>
                    </tui-segmented>
                    <output data-testid="segmented-model">{{ activeSegment }}</output>
                </section>
                <section>
                    <h2>Textarea</h2>
                    <tui-textfield data-testid="notes-field">
                        <textarea tuiTextarea aria-label="Notes" [formControl]="notes"></textarea>
                    </tui-textfield>
                    <output data-testid="notes-model">{{ notes.value }}</output>
                </section>
                <section>
                    <h2>Pagination</h2>
                    <tui-pagination data-testid="pagination" [length]="4" [(index)]="pageIndex" />
                    <output data-testid="pagination-model">{{ pageIndex }}</output>
                </section>
                <section>
                    <h2>Stepper</h2>
                    <tui-stepper data-testid="stepper" [(activeItemIndex)]="stepIndex">
                        <button tuiStep type="button">Plan</button>
                        <button tuiStep type="button">Review</button>
                        <button tuiStep type="button">Done</button>
                    </tui-stepper>
                    <output data-testid="stepper-model">{{ stepIndex }}</output>
                </section>
                <section>
                    <h2>InputNumber</h2>
                    <tui-textfield data-testid="number-field">
                        <input tuiInputNumber aria-label="Amount" [formControl]="amount" />
                    </tui-textfield>
                    <output data-testid="number-model">{{ amount.value }}</output>
                </section>
                <p class="footnote">
                    Open source · <a href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/blob/main/compatibility/v4.spec.ts"
                        target="_blank" rel="noopener noreferrer">Playwright tests ↗</a>
                    · <a href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/tree/main/integration/angular-app-v4"
                        target="_blank" rel="noopener noreferrer">Demo source ↗</a>
                </p>
            </main>
        </tui-root>
`,
})
export class DemoV4 {
    protected readonly importCode = "import {tuiButton, tuiSelect, tuiComboBox, tuiCheckbox, tuiRadio, tuiSwitch, tuiTabs, tuiSegmented, tuiTextarea, tuiPagination, tuiStepper, tuiInputNumber} from '@taiga-ui-labs/playwright/v4';";
    protected readonly componentInventory = V4_COMPONENTS;
    protected readonly verifiedCount = V4_COMPONENTS.filter((component) => component.verified).length;
    protected readonly countries = ['Austria', 'Estonia'];
    protected readonly cities = ['Tallinn', 'Vienna'];
    protected readonly country = new FormControl<string | null>(null);
    protected readonly city = new FormControl<string | null>(null);
    protected readonly saved = signal(0);
    protected readonly accepted = new FormControl(false, {nonNullable: true});
    protected readonly plan = new FormControl('basic', {nonNullable: true});
    protected readonly enabled = new FormControl(false, {nonNullable: true});
    protected readonly notes = new FormControl('', {nonNullable: true});
    protected readonly amount = new FormControl<number | null>(null);
    protected activeTab = 0;
    protected activeSegment = 0;
    protected pageIndex = 0;
    protected stepIndex = 0;

    protected save(): void {
        this.saved.update((value) => value + 1);
    }
}
