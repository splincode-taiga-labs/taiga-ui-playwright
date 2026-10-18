import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiNotification, TuiTextfield} from '@taiga-ui/core';
import {TuiBadgeNotification, TuiBadgedContent} from '@taiga-ui/kit';
import {TuiBlockStatus, TuiCard, TuiInputSearch} from '@taiga-ui/layout';

@Component({
    selector: 'app-notification-layout',
    imports: [
        ReactiveFormsModule, TuiButton, TuiNotification, TuiTextfield,
        TuiBadgeNotification, TuiBadgedContent, TuiBlockStatus, TuiCard,
        TuiInputSearch,
    ],
    template: `
        <section data-testid="notification-layout">
            <h2>Notifications and layout harnesses</h2>

            <div data-testid="inline-notification" tuiNotification
                [appearance]="notificationAppearance()" [size]="notificationSize()">
                Updates are available
            </div>
            <button tuiButton type="button" (click)="updateNotification()">
                Change notification
            </button>

            <tui-badged-content data-testid="badged-wrapper">
                <div style="width:64px;height:64px">Inbox</div>
                <tui-badge-notification tuiSlot="top">{{ badgeCount() }}</tui-badge-notification>
                @if (bottomBadge()) {
                    <tui-badge-notification tuiSlot="bottom">5</tui-badge-notification>
                }
            </tui-badged-content>
            <button tuiButton type="button" (click)="badgeCount.set(7)">
                Update top badge
            </button>
            <button tuiButton type="button" (click)="bottomBadge.set(false)">
                Hide bottom badge
            </button>

            <tui-block-status data-testid="block-status-widget"
                [card]="cardMode()" [size]="blockSize()">
                <span tuiSlot="top">No results illustration</span>
                <h3>No results</h3>
                Try changing your filters
                <button tuiButton type="button" (click)="restore()">
                    Restore results
                </button>
            </tui-block-status>
            <output data-testid="block-status-action-model">{{ restored() }}</output>
            <button tuiButton type="button" (click)="changeStatus()">Compact status</button>

            <section data-testid="card-layout-widget"
                tuiCardLarge="normal" [tuiCardCollapsed]="collapsed()">
                <h3>Card layout</h3>
                <p>Expandable content for the card.</p>
            </section>
            <button tuiButton type="button" (click)="collapsed.set(!collapsed())">
                Toggle collapsed card
            </button>

            <tui-textfield data-testid="input-search-widget">
                <input tuiInputSearch [tuiInputSearch]="results"
                    placeholder="Search" aria-label="Global search"
                    [formControl]="search" [(tuiInputSearchOpen)]="searchOpen" />
                <ng-template #results>
                    <button tuiButton type="button" (click)="selectSearchResult('Alpha')">
                        Alpha result
                    </button>
                </ng-template>
            </tui-textfield>
            <output data-testid="input-search-value">{{ search.value }}</output>
            <output data-testid="input-search-open">{{ searchOpen() }}</output>
            <output data-testid="input-search-selection">{{ selectedResult() }}</output>
        </section>
    `,
})
export class NotificationLayout {
    protected readonly notificationAppearance = signal('info');
    protected readonly notificationSize = signal<'s' | 'l'>('s');
    protected readonly badgeCount = signal(2);
    protected readonly bottomBadge = signal(true);
    protected readonly cardMode = signal(false);
    protected readonly blockSize = signal<'l' | 'm'>('l');
    protected readonly restored = signal(0);
    protected readonly collapsed = signal(false);
    protected readonly search = new FormControl('', {nonNullable: true});
    protected readonly searchOpen = signal(false);
    protected readonly selectedResult = signal('');

    protected updateNotification(): void {
        this.notificationAppearance.set('warning');
        this.notificationSize.set('l');
    }

    protected restore(): void {
        this.restored.update((value) => value + 1);
    }

    protected changeStatus(): void {
        this.cardMode.set(true);
        this.blockSize.set('m');
    }

    protected selectSearchResult(value: string): void {
        this.selectedResult.set(value);
        this.searchOpen.set(false);
    }
}
