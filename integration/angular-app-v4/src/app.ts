import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiRoot, TuiTextfield, TuiTextfieldDropdownDirective} from '@taiga-ui/core';
import {TuiChevron, TuiComboBox, TuiDataListWrapper, TuiFilterByInputPipe, TuiSelect} from '@taiga-ui/kit';

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
                    <strong>Targeted compatibility, not full v4 coverage.</strong>
                    Only Button, Select and ComboBox are currently verified in Chromium
                    on Taiga UI 4.106.0. Other v4 versions and components are not verified.
                </p>
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
    protected readonly importCode = "import {tuiButton, tuiSelect, tuiComboBox} from '@taiga-ui-labs/playwright/v4';";
    protected readonly countries = ['Austria', 'Estonia'];
    protected readonly cities = ['Tallinn', 'Vienna'];
    protected readonly country = new FormControl<string | null>(null);
    protected readonly city = new FormControl<string | null>(null);
    protected readonly saved = signal(0);

    protected save(): void {
        this.saved.update((value) => value + 1);
    }
}
