import {Component, signal} from '@angular/core';
import {
    TuiBottomSheet, TuiKeypad, TuiMobileCalendar,
    TuiSearchBar, TuiSwipeActions, TuiTabBar,
} from '@taiga-ui/addon-mobile';
import {TuiDay} from '@taiga-ui/cdk';

@Component({
    selector: 'app-remaining-mobile',
    imports: [
        TuiBottomSheet, TuiKeypad, TuiMobileCalendar,
        TuiSearchBar, TuiSwipeActions, TuiTabBar,
    ],
    template: `
        <section data-testid="remaining-mobile">
            <h2>Mobile Taiga UI fixtures</h2>
            <tui-bottom-sheet data-testid="bottom-sheet-widget"
                [stops]="sheetStops()" [bar]="sheetBar()">
                <p>Sheet content</p>
            </tui-bottom-sheet>
            <button type="button" (click)="expandSheet()">Add sheet stop</button>

            <tui-keypad data-testid="keypad-widget" [columns]="keypadColumns()">
                <button type="button" (click)="keypadValue.set('1')">1</button>
                <button type="button" (click)="keypadValue.set('2')">2</button>
            </tui-keypad>
            <button type="button" (click)="keypadColumns.set(2)">Two keypad columns</button>
            <output data-testid="keypad-value">{{ keypadValue() }}</output>

            <button type="button" (click)="calendarOpen.set(true)">Open mobile calendar</button>
            @if (calendarOpen()) {
                <tui-mobile-calendar data-testid="mobile-calendar-widget"
                    [(value)]="calendarDay"
                    (cancel)="calendarOpen.set(false)"
                    (confirm)="calendarOpen.set(false)" />
            }

            <search tuiSearchBar data-testid="mobile-search-widget"
                [appearance]="searchAppearance()">
                <input type="search" aria-label="Mobile search" />
            </search>
            <button type="button" (click)="searchAppearance.set('floating')">
                Floating mobile search
            </button>

            <tui-swipe-actions data-testid="swipe-actions-widget">
                <div>Swipeable message</div>
                <button tuiSwipeAction type="button"
                    (click)="archiveCount.update(increment)">
                    Archive
                </button>
            </tui-swipe-actions>
            <output data-testid="archive-count">{{ archiveCount() }}</output>

            <nav tuiTabBar data-testid="tab-bar-widget"
                [quantity]="tabQuantity()" [(activeItemIndex)]="activeTab">
                <button tuiTabBarItem type="button">Home</button>
                <button tuiTabBarItem type="button">Profile</button>
            </nav>
            <button type="button" (click)="tabQuantity.set(2)">Use two tabs</button>
            <output data-testid="active-tab">{{ activeTab() }}</output>
        </section>
    `,
})
export class RemainingMobile {
    protected readonly sheetStops = signal(['80px', '160px']);
    protected readonly sheetBar = signal(true);
    protected readonly keypadColumns = signal(3);
    protected readonly keypadValue = signal('');
    protected readonly calendarOpen = signal(false);
    protected readonly calendarDay = signal<TuiDay | null>(new TuiDay(2026, 9, 18));
    protected readonly searchAppearance = signal<'neutral' | 'floating'>('neutral');
    protected readonly archiveCount = signal(0);
    protected readonly activeTab = signal(0);
    protected readonly tabQuantity = signal(4);
    protected readonly increment = (value: number): number => value + 1;

    protected expandSheet(): void {
        this.sheetStops.set(['80px', '160px', '260px']);
        this.sheetBar.set(false);
    }
}
