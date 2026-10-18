import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiCell, TuiInput, TuiLabel, TuiTextfield, TuiTitle} from '@taiga-ui/core';
import {TuiItemsWithMore, TuiTiles} from '@taiga-ui/kit';

@Component({
    selector: 'app-layout-interactions',
    imports: [
        ReactiveFormsModule, TuiButton, TuiCell, TuiInput, TuiLabel, TuiTextfield,
        TuiTitle, TuiItemsWithMore, TuiTiles,
    ],
    template: `
        <section data-testid="layout-interactions">
            <h2>Layout and overflow harnesses</h2>

            <div data-testid="cell-widget" [tuiCell]="cellSize()" [tuiCellHeight]="cellHeight()">
                <strong>Cell details</strong>
                <span>Content</span>
            </div>
            <button tuiButton type="button" (click)="setCompactCell()">Compact cell</button>

            <label tuiLabel for="contact-name" data-testid="plain-label">Contact name</label>
            <input id="contact-name" aria-label="Contact name" [formControl]="contact" />
            <tui-textfield data-testid="floating-field">
                <label tuiLabel data-testid="floating-label">Display name</label>
                <input tuiInput [formControl]="floating" aria-label="Display name" />
            </tui-textfield>

            <h3 data-testid="title-widget" [tuiTitle]="titleSize()">Text heading</h3>
            <button tuiButton type="button" (click)="titleSize.set('s')">Small title</button>

            <div style="width: 550px">
                <tui-items-with-more
                    data-testid="overflow-widget"
                    [itemsLimit]="itemsLimit()"
                >
                    @for (item of labels; track item) {
                        <span *tuiItem style="padding: 0 8px; white-space: nowrap">
                            {{ item }}
                        </span>
                    }
                    <span *tuiMore>More items</span>
                </tui-items-with-more>
            </div>
            <button tuiButton type="button" (click)="itemsLimit.set(4)">Show four items</button>
            <button tuiButton type="button" (click)="itemsLimit.set(5)">Show all items</button>

            <tui-tiles
                data-testid="tiles-widget"
                style="grid-template-columns:repeat(3, 100px);grid-auto-rows:92px;gap:12px;width:336px"
                [(order)]="tileOrder"
            >
                @for (tile of tileLabels; track tile; let i = $index) {
                    <tui-tile
                        style="position:relative;height:92px;display:block;background:#ececec"
                        [style.order]="tileOrder().get(i) ?? i"
                    >
                        <button
                            tuiTileHandle
                            type="button"
                            [attr.aria-label]="'Drag ' + tile"
                            style="width:100%;height:100%;touch-action:none"
                        >{{ tile }}</button>
                    </tui-tile>
                }
            </tui-tiles>
            <output data-testid="tile-order">{{ orderLabel() }}</output>
        </section>
    `,
})
export class LayoutInteractions {
    protected readonly cellSize = signal<'l' | 's'>('l');
    protected readonly cellHeight = signal<'normal' | 'compact'>('normal');
    protected readonly contact = new FormControl('', {nonNullable: true});
    protected readonly floating = new FormControl('', {nonNullable: true});
    protected readonly titleSize = signal<'l' | 's'>('l');
    protected readonly labels = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
    protected readonly itemsLimit = signal(2);
    protected readonly tileLabels = ['Tile A', 'Tile B', 'Tile C'];
    protected readonly tileOrder = signal(new Map<number, number>());

    protected setCompactCell(): void {
        this.cellSize.set('s');
        this.cellHeight.set('compact');
    }

    protected orderLabel(): string {
        return this.tileLabels.map((_, i) => this.tileOrder().get(i) ?? i).join(',');
    }
}
