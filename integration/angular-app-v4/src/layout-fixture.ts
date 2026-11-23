import {Component, signal} from '@angular/core';
import {TuiBlockStatus, TuiCard} from '@taiga-ui/layout';

@Component({
    selector: 'app-v4-layout-fixture',
    imports: [TuiBlockStatus, TuiCard],
    template: `
        <section>
            <h2>BlockStatus</h2>
            <h2>Card</h2>
            <button type="button" (click)="mounted.set(true)">Mount v4 layout fixtures</button>
            @if (mounted()) {
                <tui-block-status data-testid="v4-block-status" [card]="blockCard()" [size]="blockSize()">
                    <span tuiSlot="top">Empty results graphic</span>
                    <h3>No results</h3>
                    Try changing your filters
                    <button type="button" (click)="restored.update((count) => count + 1)">
                        Restore v4 results
                    </button>
                </tui-block-status>
                <output data-testid="v4-block-status-count">{{ restored() }}</output>
                <button type="button" (click)="compactBlock()">Compact v4 block status</button>

                <section
                    data-testid="v4-card"
                    [tuiCardLarge]="cardSpace()"
                    [tuiCardCollapsed]="cardCollapsed()"
                    style="width:280px"
                >
                    <h3>V4 card</h3>
                    <p>Expandable card content</p>
                </section>
                <button type="button" (click)="cardSpace.set('compact')">Compact v4 card</button>
                <button type="button" (click)="cardCollapsed.set(!cardCollapsed())">Toggle v4 card collapse</button>
                <output data-testid="v4-card-model">{{ cardSpace() }}/{{ cardCollapsed() }}</output>
            }
        </section>
    `,
})
export class V4LayoutFixture {
    protected readonly mounted = signal(false);
    protected readonly blockSize = signal<'l' | 'm'>('l');
    protected readonly blockCard = signal(false);
    protected readonly restored = signal(0);
    protected readonly cardSpace = signal<'normal' | 'compact'>('normal');
    protected readonly cardCollapsed = signal(false);

    protected compactBlock(): void {
        this.blockSize.set('m');
        this.blockCard.set(true);
    }
}
