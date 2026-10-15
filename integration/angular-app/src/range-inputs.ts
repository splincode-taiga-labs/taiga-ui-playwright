import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiDay, TuiDayRange, TuiMonth, TuiTime} from '@taiga-ui/cdk';
import {TuiTextfield} from '@taiga-ui/core';
import {
    TuiCalendarRange,
    TuiInputDateRange,
    TuiInputDateTime,
    TuiInputMonth,
} from '@taiga-ui/kit';

@Component({
    selector: 'app-range-inputs',
    imports: [
        ReactiveFormsModule,
        TuiTextfield,
        TuiCalendarRange,
        TuiInputDateRange,
        TuiInputDateTime,
        TuiInputMonth,
    ],
    template: `
        <section data-testid="range-inputs">
            <h2>Real Taiga UI range and combined date controls</h2>

            <tui-calendar-range
                data-testid="standalone-calendar-range"
                [value]="selectedRange()"
                (valueChange)="selectedRange.set($event)"
            />
            <output data-testid="calendar-range-model">
                {{ selectedRange()?.from?.day }}-{{ selectedRange()?.to?.day }}
            </output>

            <tui-textfield data-testid="date-range-field">
                <input tuiInputDateRange aria-label="Vacation range" [formControl]="dateRange" />
                <tui-calendar-range *tuiDropdown />
            </tui-textfield>
            <output data-testid="date-range-model">
                {{ dateRange.value?.from?.day }}-{{ dateRange.value?.to?.day }}
            </output>

            <tui-textfield data-testid="datetime-field">
                <input tuiInputDateTime aria-label="Meeting date-time" [formControl]="dateTime" />
                <tui-calendar *tuiDropdown />
            </tui-textfield>
            <output data-testid="datetime-model">
                {{ dateTime.value?.[0]?.day }}-{{ dateTime.value?.[1]?.hours }}:{{ dateTime.value?.[1]?.minutes }}
            </output>

            <tui-textfield data-testid="month-input-field">
                <input tuiInputMonth aria-label="Vacation month" [formControl]="month" />
                <tui-calendar-month *tuiDropdown />
            </tui-textfield>
            <output data-testid="input-month-model">
                {{ month.value?.year }}-{{ month.value?.month }}
            </output>
        </section>
    `,
})
export class RangeInputs {
    protected readonly selectedRange = signal<TuiDayRange | null>(
        new TuiDayRange(new TuiDay(2026, 0, 15), new TuiDay(2026, 0, 16)),
    );
    protected readonly dateRange = new FormControl<TuiDayRange | null>(
        new TuiDayRange(new TuiDay(2026, 0, 15), new TuiDay(2026, 0, 16)),
    );
    protected readonly dateTime = new FormControl<readonly [TuiDay, TuiTime | null] | null>(
        [new TuiDay(2026, 0, 15), new TuiTime(11, 30)],
    );
    protected readonly month = new FormControl<TuiMonth | null>(new TuiMonth(2026, 0));
}
