import {Component, inject, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {WA_IS_MOBILE} from '@ng-web-apis/platform';
import {
    TuiMobileCalendarDropdown, TuiPullToRefresh, TuiSheetDialogService,
} from '@taiga-ui/addon-mobile';
import {TuiDay} from '@taiga-ui/cdk';
import {TuiInputDate} from '@taiga-ui/kit';
import {TuiCalendar, TuiScrollRef, TuiTextfield} from '@taiga-ui/core';

@Component({
    selector: 'app-remaining-mobile-overlays',
    imports: [
        ReactiveFormsModule, TuiTextfield, TuiInputDate, TuiCalendar,
        TuiMobileCalendarDropdown, TuiPullToRefresh, TuiScrollRef,
    ],
    providers: [{provide: WA_IS_MOBILE, useValue: true}],
    template: `
        <section data-testid="remaining-mobile-overlays">
            <h2>Mobile calendar and sheet portals</h2>
            <tui-textfield data-testid="calendar-dropdown-field" tuiMobileCalendar>
                <input tuiInputDate aria-label="Mobile calendar input"
                    [formControl]="date" />
                <tui-calendar *tuiDropdown />
            </tui-textfield>
            <output data-testid="mobile-date">{{date.value}}</output>

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
    protected readonly sheetStatus = signal('closed');

    protected openSheet(): void {
        this.sheetStatus.set('open');
        this.sheets.open('Mobile sheet content', {label: 'Mobile sheet'}).subscribe({
            complete: () => this.sheetStatus.set('closed'),
        });
    }
}
