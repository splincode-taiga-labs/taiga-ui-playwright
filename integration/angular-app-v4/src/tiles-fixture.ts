import {Component, signal} from '@angular/core';
import {TuiTile, TuiTileHandle, TuiTilesComponent} from '@taiga-ui/kit';

@Component({
    selector: 'app-v4-tiles-fixture',
    imports: [TuiTile, TuiTileHandle, TuiTilesComponent],
    template: `
        <section>
            <h2>Tiles</h2>
            <button type="button" (click)="mounted.set(true)">Mount v4 tiles</button>
            @if (mounted()) {
                <tui-tiles
                    data-testid="v4-tiles"
                    style="display:grid;grid-template-columns:repeat(3,110px);grid-auto-rows:80px;gap:8px;width:350px"
                    [order]="order()"
                    (orderChange)="order.set($event)"
                >
                    <tui-tile [style.order]="order().get(0) ?? 0">
                        <button tuiTileHandle type="button" aria-label="Drag v4 tile A" style="width:100%;height:100%">Tile A</button>
                    </tui-tile>
                    <tui-tile [style.order]="order().get(1) ?? 1">
                        <button tuiTileHandle type="button" aria-label="Drag v4 tile B" style="width:100%;height:100%">Tile B</button>
                    </tui-tile>
                    <tui-tile [style.order]="order().get(2) ?? 2">
                        <button tuiTileHandle type="button" aria-label="Drag v4 tile C" style="width:100%;height:100%">Tile C</button>
                    </tui-tile>
                </tui-tiles>
                <output data-testid="v4-tiles-model">{{ order().get(0) }}/{{ order().get(1) }}/{{ order().get(2) }}</output>
            }
        </section>
    `,
})
export class V4TilesFixture {
    protected readonly mounted = signal(false);
    protected readonly order = signal(new Map<number, number>([[0, 0], [1, 1], [2, 2]]));
}
