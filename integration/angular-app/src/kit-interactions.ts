import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiMonth, TuiMonthRange, TuiYear} from '@taiga-ui/cdk';
import {TuiButton, TuiTextfield} from '@taiga-ui/core';
import {
    TuiBlock, TuiCalendarMonth, TuiDataListWrapper,
    TuiInputMonthRange, TuiLineClamp, TuiTimeline,
} from '@taiga-ui/kit';

@Component({
    selector: 'app-kit-interactions',
    imports: [
        ReactiveFormsModule, TuiButton, TuiTextfield,
        TuiBlock, TuiCalendarMonth, TuiDataListWrapper,
        TuiInputMonthRange, TuiLineClamp, TuiTimeline,
    ],
    template: `
        <section data-testid="kit-interactions">
            <h2>Kit interaction harnesses</h2>

            <tui-data-list-wrapper
                data-testid="standalone-data-list-wrapper"
                [items]="items()"
                (itemClick)="selected.set($event)"
            />
            <button tuiButton type="button" (click)="items.set(null)">Load options</button>
            <button tuiButton type="button" (click)="items.set(['Gamma', 'Delta'])">
                Resolve options
            </button>
            <output data-testid="data-list-wrapper-model">{{ selected() }}</output>

            <div style="width: 145px">
                <tui-line-clamp
                    data-testid="kit-line-clamp"
                    [content]="longDescription"
                    [linesLimit]="clampLines()"
                    [lineHeight]="24"
                />
            </div>
            <button tuiButton type="button" (click)="clampLines.set(3)">
                Expand text to 3 lines
            </button>

            <label tuiBlock data-testid="kit-block" [tuiBlock]="blockSize()">
                <input type="checkbox" aria-label="Enable alerts" [formControl]="blockEnabled" />
                Enable alerts
            </label>
            <button tuiButton type="button" (click)="blockSize.set('s')">Make block small</button>
            <button tuiButton type="button" (click)="blockEnabled.disable()">
                Disable block
            </button>
            <output data-testid="block-model">{{ blockEnabled.value }}</output>

            <div style="width: 320px;height: 50px">
                <tui-timeline
                    data-testid="kit-timeline"
                    [max]="100"
                    [orientation]="orientation()"
                >
                    <label tuiTimelineItem [(value)]="interval">Release window</label>
                </tui-timeline>
            </div>
            <button tuiButton type="button" (click)="orientation.set('vertical')">
                Vertical timeline
            </button>
            <output data-testid="timeline-model">{{ interval()[0] }}-{{ interval()[1] }}</output>

            <tui-textfield data-testid="month-range-field">
                <input
                    tuiInputMonthRange
                    aria-label="Quarter months"
                    [formControl]="monthRange"
                />
                <tui-calendar-month *tuiDropdown [year]="calendarYear" />
            </tui-textfield>
            <output data-testid="month-range-model">
                {{ monthRange.value?.from?.year }}:{{ monthRange.value?.from?.month }}-{{ monthRange.value?.to?.month }}
            </output>
        </section>
    `,
})
export class KitInteractions {
    protected readonly items = signal<readonly string[] | null>(['Alpha', 'Beta']);
    protected readonly selected = signal('');
    protected readonly longDescription =
        'Long content for the line clamp test that must wrap across multiple lines. ' +
        'The full text remains in the document, but the clamp changes the visible amount.';
    protected readonly clampLines = signal(1);
    protected readonly blockSize = signal<'l' | 's'>('l');
    protected readonly blockEnabled = new FormControl(false, {nonNullable: true});
    protected readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
    protected readonly interval = signal<readonly [number, number]>([10, 30]);
    protected readonly calendarYear = new TuiYear(2026);
    protected readonly monthRange = new FormControl<TuiMonthRange | null>(
        new TuiMonthRange(new TuiMonth(2026, 0), new TuiMonth(2026, 1)),
    );
}
