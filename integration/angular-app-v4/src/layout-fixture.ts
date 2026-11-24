import {Component, signal} from '@angular/core';
import {TuiBlockStatus, TuiCard, TuiCell, TuiHeader} from '@taiga-ui/layout';

@Component({
    selector: 'app-v4-layout-fixture',
    imports: [TuiBlockStatus, TuiCard, TuiCell, TuiHeader],
    template: `
        <section>
            <h2>BlockStatus</h2>
            <h2>Card</h2>
            <h2>Cell</h2>
            <h2>Header</h2>
            <button type="button" (click)="mounted.set(true)">Mount v4 layout fixtures</button>
            @if (mounted()) {
                <tui-block-status data-testid="v4-block-status" [card]="blockCard()" [size]="blockSize()">
                    <span tuiSlot="top">Empty results graphic</span>
                    <h3>No results</h3>
                    Try changing your filters
                    <button type="button" (click)="restore()">
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

                <div data-testid="v4-cell" [tuiCell]="cellSize()" [tuiCellHeight]="cellHeight()">
                    <strong>Account details</strong>
                    <span>Active account</span>
                </div>
                <button type="button" (click)="toggleCell()">Toggle v4 cell layout</button>

                <header data-testid="v4-header" [tuiHeader]="headerSize()">
                    <h3>Account summary</h3>
                </header>
                <button type="button" (click)="headerSize.set(headerSize() === 'h5' ? 'h3' : 'h5')">
                    Toggle v4 header size
                </button>
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

    protected readonly cellSize = signal<'l' | 's'>('l');
    protected readonly cellHeight = signal<'normal' | 'compact'>('normal');
    protected readonly headerSize = signal<'h5' | 'h3'>('h5');

    protected toggleCell(): void {
        const compact = this.cellHeight() === 'compact';

        this.cellSize.set(compact ? 'l' : 's');
        this.cellHeight.set(compact ? 'normal' : 'compact');
    }

    protected restore(): void {
        this.restored.update((count) => count + 1);
    }

    protected compactBlock(): void {
        this.blockSize.set('m');
        this.blockCard.set(true);
    }
}
