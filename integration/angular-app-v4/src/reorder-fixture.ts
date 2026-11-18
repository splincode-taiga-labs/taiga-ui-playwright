import {Component, signal} from '@angular/core';
import {TuiReorder} from '@taiga-ui/addon-table';

@Component({
    selector: 'app-v4-reorder-fixture',
    imports: [TuiReorder],
    template: `
        <section>
            <h2>Reorder</h2>
            <button type="button" (click)="mounted.set(true)">Mount v4 reorder</button>
            @if (mounted()) {
                <tui-reorder
                    data-testid="v4-reorder"
                    style="display:block;width:320px"
                    [items]="items()"
                    [enabled]="enabled()"
                    (itemsChange)="items.set($event)"
                    (enabledChange)="enabled.set($event)"
                />
                <output data-testid="v4-reorder-model">{{ items().join(' / ') }}</output>
                <output data-testid="v4-reorder-enabled">{{ enabled().join(' / ') }}</output>
            }
        </section>
    `,
})
export class V4ReorderFixture {
    protected readonly mounted = signal(false);
    protected readonly items = signal(['Alpha', 'Beta', 'Gamma']);
    protected readonly enabled = signal(['Alpha', 'Beta', 'Gamma']);
}
