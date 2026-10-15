import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiDay, TuiMonth, TuiTime, TuiYear} from '@taiga-ui/cdk';
import {TuiCalendar, TuiTextfield} from '@taiga-ui/core';
import {TuiCalendarMonth, TuiInputDate, TuiInputTime, TuiInputYear} from '@taiga-ui/kit';

@Component({
    selector: 'app-calendar-inputs',
    imports: [
        ReactiveFormsModule,
        TuiCalendar,
        TuiCalendarMonth,
        TuiInputDate,
        TuiInputTime,
        TuiInputYear,
        TuiTextfield,
    ],
    template: `
        <section data-testid="calendar-inputs">
            <h2>Real Taiga UI calendars and date/time inputs</h2>

            <tui-calendar
                data-testid="standalone-calendar"
                [value]="calendarValue()"
                (dayClick)="calendarValue.set($event)"
            />
            <output data-testid="calendar-model">
                {{ calendarValue()?.year }}-{{ calendarValue()?.month }}-{{ calendarValue()?.day }}
            </output>

            <tui-calendar-month
                data-testid="standalone-month-calendar"
                [year]="monthYear"
                [value]="monthValue()"
                (monthClick)="monthValue.set($event)"
            />
            <output data-testid="month-model">
                {{ monthValue()?.year }}-{{ monthValue()?.month }}
            </output>

            <tui-textfield data-testid="date-input-field">
                <input tuiInputDate aria-label="Appointment date" [formControl]="date" />
                <tui-calendar *tuiDropdown />
            </tui-textfield>
            <output data-testid="date-model">{{ date.value?.year }}-{{ date.value?.month }}-{{ date.value?.day }}</output>

            <tui-textfield data-testid="year-input-field">
                <input tuiInputYear aria-label="Graduation year" [formControl]="year" />
                <tui-calendar-year *tuiDropdown />
            </tui-textfield>
            <output data-testid="year-model">{{ year.value ?? 'null' }}</output>

            <tui-textfield data-testid="time-input-field">
                <input tuiInputTime aria-label="Meeting time" mode="HH:MM" [formControl]="time" />
            </tui-textfield>
            <output data-testid="time-model">{{ time.value?.hours }}:{{ time.value?.minutes }}</output>
        </section>
    `,
})
export class CalendarInputs {
    protected readonly calendarValue = signal<TuiDay | null>(new TuiDay(2026, 0, 15));
    protected readonly monthYear = new TuiYear(2026);
    protected readonly monthValue = signal<TuiMonth | null>(new TuiMonth(2026, 0));
    protected readonly date = new FormControl<TuiDay | null>(new TuiDay(2026, 0, 15));
    protected readonly year = new FormControl<number | null>(null);
    protected readonly time = new FormControl<TuiTime | null>(null);
}
