import {Component, signal} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {
    TuiAppBar, TuiBlockDetails, TuiBlockStatus, TuiCard, TuiCell, TuiForm,
    TuiHeader, TuiItemGroup, TuiProgressiveBlur,
} from '@taiga-ui/layout';

@Component({
    selector: 'app-v4-layout-fixture',
    imports: [
        TuiButton, TuiAppBar, TuiBlockDetails, TuiBlockStatus, TuiCard, TuiCell,
        TuiForm, TuiHeader, TuiItemGroup, TuiProgressiveBlur,
    ],
    template: `
        <section>
            <h2>BlockStatus</h2>
            <h2>Card</h2>
            <h2>Cell</h2>
            <h2>Header</h2>
            <h2>AppBar</h2>
            <h2>BlockDetails</h2>
            <h2>Form</h2>
            <h2>ItemGroup</h2>
            <h2>ProgressiveBlur</h2>
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

                <tui-app-bar data-testid="v4-app-bar" [size]="appBarSize()" style="width:320px">
                    <button tuiSlot="left" type="button">Back</button>
                    Account
                    <button tuiSlot="right" type="button" (click)="recordAppAction()">Save account</button>
                </tui-app-bar>
                <button type="button" (click)="appBarSize.set('l')">Large v4 app bar</button>
                <output data-testid="v4-app-bar-model">{{ appActions() }}</output>

                <div tuiBlockDetails data-testid="v4-block-details">
                    {{ details() }}
                </div>
                <button type="button" (click)="details.set('Updated account')">Update v4 block details</button>

                <form [tuiForm]="formSize()" data-testid="v4-layout-form" (submit)="submit($event)">
                    <button tuiButton type="submit">Save form</button>
                </form>
                <button type="button" (click)="formSize.set('s')">Compact v4 form</button>
                <output data-testid="v4-layout-form-model">{{ submissions() }}</output>

                <div tuiItemGroup data-testid="v4-item-group" [horizontal]="horizontal()" [autoscroll]="true"
                    style="width:180px">
                    <button type="button" style="flex:0 0 110px">One</button>
                    <button type="button" style="flex:0 0 110px">Two</button>
                    <button type="button" style="flex:0 0 110px">Three</button>
                    <button type="button" style="flex:0 0 110px" (click)="lastClicked.set(true)">Four</button>
                </div>
                <button type="button" (click)="horizontal.set(false)">Vertical v4 item group</button>
                <output data-testid="v4-item-group-model">{{ lastClicked() }}</output>

                <div style="position:relative;height:48px;width:180px">
                    <tui-progressive-blur data-testid="v4-progressive-blur" />
                </div>
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

    protected readonly appBarSize = signal<'m' | 'l'>('m');
    protected readonly appActions = signal(0);
    protected readonly details = signal('Account summary');
    protected readonly formSize = signal<'l' | 's'>('l');
    protected readonly submissions = signal(0);
    protected readonly horizontal = signal(true);
    protected readonly lastClicked = signal(false);

    protected recordAppAction(): void {
        this.appActions.update((count) => count + 1);
    }

    protected submit(event: Event): void {
        event.preventDefault();
        this.submissions.update((count) => count + 1);
    }

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
