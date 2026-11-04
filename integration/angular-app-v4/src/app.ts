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
            <main>
                <h1>Taiga UI 4 demo</h1>
                <button tuiButton type="button" data-testid="save-button" (click)="save()">
                    Save
                </button>
                <output data-testid="save-model">{{ saved() }}</output>

                <section>
                    <tui-textfield data-testid="country-field" tuiChevron>
                        <input aria-label="Country" tuiSelect [formControl]="country" />
                        <tui-data-list-wrapper *tuiTextfieldDropdown [items]="countries" />
                    </tui-textfield>
                    <output data-testid="country-model">{{ country.value ?? 'null' }}</output>
                </section>
                <section>
                    <tui-textfield data-testid="city-field" tuiChevron>
                        <input aria-label="City" tuiComboBox [formControl]="city" />
                        <tui-data-list-wrapper *tuiTextfieldDropdown [items]="cities | tuiFilterByInput" />
                    </tui-textfield>
                    <output data-testid="city-model">{{ city.value ?? 'null' }}</output>
                </section>
            </main>
        </tui-root>
`,
})
export class DemoV4 {
    protected readonly countries = ['Austria', 'Estonia'];
    protected readonly cities = ['Tallinn', 'Vienna'];
    protected readonly country = new FormControl<string | null>(null);
    protected readonly city = new FormControl<string | null>(null);
    protected readonly saved = signal(0);

    protected save(): void {
        this.saved.update((value) => value + 1);
    }
}
