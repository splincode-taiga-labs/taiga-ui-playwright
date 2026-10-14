import {Component, inject, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiDialogService, TuiFilterByInputPipe, TuiRoot, TuiTextfield} from '@taiga-ui/core';
import {TuiChevron, TuiComboBox, TuiDataListWrapper, TuiSelect} from '@taiga-ui/kit';

@Component({
    selector: 'app-fixture',
    imports: [
        ReactiveFormsModule,
        TuiRoot,
        TuiTextfield,
        TuiButton,
        TuiFilterByInputPipe,
        TuiChevron,
        TuiComboBox,
        TuiDataListWrapper,
        TuiSelect,
    ],
    template: `
        <tui-root>
            <main>
                <h1>Taiga UI Playwright integration fixture</h1>

                <section>
                    <label for="country">Country</label>
                    <tui-textfield data-testid="country-field" tuiChevron>
                        <input
                            id="country"
                            aria-label="Country"
                            tuiSelect
                            [formControl]="country"
                        />
                        <tui-data-list-wrapper *tuiDropdown [items]="countries" />
                    </tui-textfield>
                    <output data-testid="country-model">{{ country.value ?? 'null' }}</output>
                </section>

                <section>
                    <label for="country-secondary">Secondary country</label>
                    <tui-textfield data-testid="secondary-country-field" tuiChevron>
                        <input
                            id="country-secondary"
                            aria-label="Secondary country"
                            tuiSelect
                            [formControl]="secondaryCountry"
                        />
                        <tui-data-list-wrapper *tuiDropdown [items]="countries" />
                    </tui-textfield>
                    <output data-testid="secondary-country-model">{{ secondaryCountry.value ?? 'null' }}</output>
                </section>

                <section>
                    <label for="city">City</label>
                    <tui-textfield data-testid="city-field" tuiChevron>
                        <input
                            id="city"
                            aria-label="City"
                            tuiComboBox
                            [formControl]="city"
                        />
                        <tui-data-list-wrapper
                            *tuiDropdown
                            [items]="cities | tuiFilterByInput"
                        />
                    </tui-textfield>
                    <output data-testid="city-model">{{ city.value ?? 'null' }}</output>
                </section>

                <section>
                    <button tuiButton type="button" (click)="openDialog()">Open dialog</button>
                    <output data-testid="dialog-model">{{ dialogState() }}</output>
                </section>
            </main>
        </tui-root>
    `,
})
export class FixtureApp {
    private readonly dialogs = inject(TuiDialogService);

    protected readonly countries = ['Austria', 'Estonia', 'United Arab Emirates'];
    protected readonly cities = ['Tallinn', 'Tartu', 'Vienna'];

    protected readonly country = new FormControl<string | null>(null);
    protected readonly secondaryCountry = new FormControl<string | null>(null);
    protected readonly city = new FormControl<string | null>(null);
    protected readonly dialogState = signal('closed');

    protected openDialog(): void {
        this.dialogState.set('open');

        this.dialogs
            .open('Please confirm your action', {label: 'Review changes', size: 's', data: 'Confirm'})
            .subscribe({complete: () => this.dialogState.set('closed')});
    }
}
