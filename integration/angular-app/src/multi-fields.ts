import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiDay} from '@taiga-ui/cdk';
import {TuiSelectLike, TuiTextfield} from '@taiga-ui/core';
import {
    TuiChevron,
    TuiDataListWrapper,
    TuiInputChip,
    TuiInputDateMulti,
    TuiInputRange,
    TuiMultiSelect,
} from '@taiga-ui/kit';

@Component({
    selector: 'app-multi-fields',
    imports: [
        ReactiveFormsModule,
        TuiTextfield,
        TuiChevron,
        TuiSelectLike,
        TuiDataListWrapper,
        TuiInputChip,
        TuiInputDateMulti,
        TuiInputRange,
        TuiMultiSelect,
    ],
    template: `
        <section data-testid="multi-fields">
            <h2>Real Taiga UI multi-value controls</h2>
            <tui-textfield multi tuiChevron data-testid="multi-select-field">
                <input tuiInputChip tuiSelectLike aria-label="MultiSelect country"
                    placeholder="Choose countries" [formControl]="countries" />
                <tui-data-list-wrapper *tuiDropdown tuiMultiSelectGroup
                    [items]="countryOptions" />
            </tui-textfield>
            <output data-testid="multi-select-model">{{ countries.value.join(',') }}</output>

            <tui-textfield multi data-testid="date-multi-field">
                <input tuiInputDateMulti aria-label="Multi date" [formControl]="dates" />
                <tui-calendar *tuiDropdown />
            </tui-textfield>
            <output data-testid="date-multi-model">{{ dateLabels }}</output>

            <tui-input-range data-testid="input-range-field"
                [min]="0" [max]="100" [step]="1" [formControl]="range">
                Budget range
            </tui-input-range>
            <output data-testid="input-range-model">{{ range.value.join(',') }}</output>
        </section>
    `,
})
export class MultiFields {
    protected readonly countryOptions = ['Austria', 'Estonia', 'Latvia'];
    protected readonly countries = new FormControl<string[]>([], {nonNullable: true});
    protected readonly dates = new FormControl<TuiDay[]>([new TuiDay(2026, 0, 15)], {nonNullable: true});
    protected readonly range = new FormControl<[number, number]>([20, 60], {nonNullable: true});

    protected get dateLabels(): string {
        return this.dates.value.map((date) => date.day).join(',');
    }
}
