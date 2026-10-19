import {Component, inject, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {WA_IS_MOBILE} from '@ng-web-apis/platform';
import {
    TuiMobileCalendarDropdown, TuiPullToRefresh, TuiSheetDialogService,
} from '@taiga-ui/addon-mobile';
import {TuiDay, TuiDayRange} from '@taiga-ui/cdk';
import {TuiInputDate, TuiInputDateRange, TuiCalendarRange} from '@taiga-ui/kit';
import {TuiCalendar, TuiScrollRef, TuiTextfield} from '@taiga-ui/core';

@Component({
    selector: 'app-remaining-mobile-overlays',
    imports: [
        ReactiveFormsModule, TuiTextfield, TuiInputDate, TuiCalendar,
        TuiMobileCalendarDropdown, TuiPullToRefresh, TuiScrollRef,
        TuiInputDateRange, TuiCalendarRange,
    ],
    providers: [{provide: WA_IS_MOBILE, useValue: true}],
    template: `
        <section data-testid="remaining-mobile-overlays">
            <h2>Mobile calendar and sheet portals</h2>
            <tui-textfield data-testid="calendar-dropdown-field" tuiMobileCalendar
                [(open)]="calendarDropdownOpen">
                <input tuiInputDate aria-label="Mobile calendar input"
                    [formControl]="date" />
                <tui-calendar *tuiDropdown />
            </tui-textfield>
            <button type="button" (click)="calendarDropdownOpen.set(true)">
                Open mobile calendar dropdown
            </button>
            <output data-testid="mobile-date">{{date.value}}</output>
            <output data-testid="mobile-date-model">
                {{ date.value?.year }}-{{ date.value?.month }}-{{ date.value?.day }}
            </output>

            <tui-textfield data-testid="mobile-date-range-field" tuiMobileCalendar
                [(open)]="calendarRangeOpen">
                <input tuiInputDateRange aria-label="Mobile vacation range"
                    [formControl]="dateRange" />
                <tui-calendar-range *tuiDropdown />
            </tui-textfield>
            <button type="button" (click)="calendarRangeOpen.set(true)">
                Open mobile date range calendar
            </button>
            <output data-testid="mobile-date-range-model">
                {{ dateRange.value?.from?.day }}-{{ dateRange.value?.to?.day }}
            </output>
            <output data-testid="mobile-date-range-full-model">
                {{ dateRange.value?.from?.year }}-{{ dateRange.value?.from?.month }}-{{ dateRange.value?.from?.day }}:
                {{ dateRange.value?.to?.year }}-{{ dateRange.value?.to?.month }}-{{ dateRange.value?.to?.day }}
            </output>
            <button type="button" (click)="useDecemberRange()">Set December date range</button>

            <div tuiScrollRef style="height:130px;overflow:auto">
                <tui-pull-to-refresh data-testid="pull-widget">
                    <div style="height:250px">Pullable scrolling content</div>
                </tui-pull-to-refresh>
            </div>

            <button type="button" (click)="openSheet()">Open sheet dialog</button>
            <output data-testid="sheet-status">{{sheetStatus()}}</output>
        </section>
    `,
})
export class RemainingMobileOverlays {
    private readonly sheets = inject(TuiSheetDialogService);
    protected readonly date = new FormControl<TuiDay | null>(new TuiDay(2026, 9, 18));
    protected readonly calendarDropdownOpen = signal(false);
    protected readonly dateRange = new FormControl<TuiDayRange | null>(
        new TuiDayRange(new TuiDay(2026, 9, 18), new TuiDay(2026, 9, 19)),
    );
    protected readonly calendarRangeOpen = signal(false);
    protected readonly sheetStatus = signal('closed');

    protected useDecemberRange(): void {
        this.dateRange.setValue(
            new TuiDayRange(new TuiDay(2026, 11, 30), new TuiDay(2026, 11, 31)),
        );
    }

    protected openSheet(): void {
        this.sheetStatus.set('open');
        this.sheets.open('Mobile sheet content', {label: 'Mobile sheet'}).subscribe({
            complete: () => this.sheetStatus.set('closed'),
        });
    }
}
