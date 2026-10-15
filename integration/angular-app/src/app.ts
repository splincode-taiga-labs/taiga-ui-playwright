import {Component, inject, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiDialogService, TuiFilterByInputPipe, TuiRoot, TuiTextfield} from '@taiga-ui/core';
import {TuiChevron, TuiComboBox, TuiDataListWrapper, TuiSelect} from '@taiga-ui/kit';
import {map, timer} from 'rxjs';

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
                    <label for="country-disabled">Country with disabled option</label>
                    <tui-textfield
                        data-testid="disabled-country-field"
                        tuiChevron
                        [disabledItemHandler]="isCountryDisabled"
                    >
                        <input
                            id="country-disabled"
                            aria-label="Country with disabled option"
                            tuiSelect
                            [formControl]="disabledCountry"
                        />
                        <tui-data-list-wrapper *tuiDropdown [items]="countries" />
                    </tui-textfield>
                    <output data-testid="disabled-country-model">{{ disabledCountry.value ?? 'null' }}</output>
                </section>

                <section>
                    <label for="city-free">City (non-strict)</label>
                    <tui-textfield data-testid="free-city-field" tuiChevron>
                        <input
                            id="city-free"
                            aria-label="City (non-strict)"
                            tuiComboBox
                            [strict]="false"
                            [formControl]="freeCity"
                        />
                        <tui-data-list-wrapper
                            *tuiDropdown
                            [items]="cities | tuiFilterByInput"
                        />
                    </tui-textfield>
                    <output data-testid="free-city-model">{{ freeCity.value ?? 'null' }}</output>
                </section>

                <section>
                    <label for="city-async">City (async)</label>
                    <tui-textfield data-testid="async-city-field" tuiChevron>
                        <input
                            id="city-async"
                            aria-label="City (async)"
                            tuiComboBox
                            [formControl]="asyncCity"
                            (input)="loadAsyncCities()"
                        />
                        <tui-data-list-wrapper
                            *tuiDropdown
                            [items]="asyncCities() | tuiFilterByInput"
                        />
                    </tui-textfield>
                    <output data-testid="async-city-model">{{ asyncCity.value ?? 'null' }}</output>
                </section>

                <section>
                    <button tuiButton type="button" (click)="openDialog()">Open dialog</button>
                    <button tuiButton type="button" (click)="openLockedDialog()">Open locked dialog</button>
                    <button tuiButton type="button" (click)="openDismissibleDialog()">Open dismissible dialog</button>
                    <button tuiButton type="button" (click)="openGuardedDialog()">Open guarded dialog</button>
                    <output data-testid="dialog-model">{{ dialogState() }}</output>
                </section>
            </main>
        </tui-root>
    `,
})
export class FixtureApp {
    private readonly dialogs = inject(TuiDialogService);

    protected readonly countries = ['Austria', 'Estonia', 'United Arab Emirates', 'C++'];
    protected readonly cities = ['Tallinn', 'Tartu', 'Vienna'];

    protected readonly country = new FormControl<string | null>(null);
    protected readonly secondaryCountry = new FormControl<string | null>(null);
    protected readonly city = new FormControl<string | null>(null);
    protected readonly disabledCountry = new FormControl<string | null>(null);
    protected readonly freeCity = new FormControl<string | null>(null);
    protected readonly asyncCity = new FormControl<string | null>(null);
    protected readonly asyncCities = signal<string[]>([]);
    protected readonly isCountryDisabled = (country: string): boolean => country === 'Austria';

    protected loadAsyncCities(): void {
        if (this.asyncCities().length) {
            return;
        }

        // Emulates an asynchronous API response; tests use Playwright assertions, not sleeps.
        setTimeout(() => this.asyncCities.set(['Oslo', 'Odense']), 200);
    }

    protected readonly dialogState = signal('closed');

    protected openDialog(): void {
        this.dialogState.set('open');

        this.dialogs
            .open('Please confirm your action', {label: 'Review changes', size: 's', data: 'Confirm'})
            .subscribe({complete: () => this.dialogState.set('closed')});
    }

    protected openLockedDialog(): void {
        this.dialogState.set('open');

        this.dialogs
            .open('This dialog cannot be closed by the user.', {
                label: 'Locked dialog',
                size: 's',
                closable: false,
                dismissible: false,
            })
            .subscribe({complete: () => this.dialogState.set('closed')});
    }

    protected openDismissibleDialog(): void {
        this.dialogState.set('open');

        this.dialogs
            .open('Escape should dismiss this dialog.', {
                label: 'Dismissible dialog',
                size: 's',
                closable: false,
                dismissible: true,
            })
            .subscribe({complete: () => this.dialogState.set('closed')});
    }

    protected openGuardedDialog(): void {
        this.dialogState.set('open');

        this.dialogs
            .open('Closing waits for the asynchronous guard.', {
                label: 'Guarded dialog',
                size: 's',
                closable: timer(200).pipe(map(() => true)),
            })
            .subscribe({complete: () => this.dialogState.set('closed')});
    }
}
