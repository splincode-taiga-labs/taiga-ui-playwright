import {Component, signal} from '@angular/core';
import {TuiTablePagination} from '@taiga-ui/addon-table';

@Component({
    selector: 'app-v4-table-pagination-fixture',
    imports: [TuiTablePagination],
    template: `
        <section>
            <h2>TablePagination</h2>
            <button type="button" (click)="mounted.set(true)">Mount v4 table pagination</button>
            @if (mounted()) {
                <tui-table-pagination
                    data-testid="v4-table-pagination"
                    [page]="page()"
                    [size]="size()"
                    [total]="25"
                    (paginationChange)="page.set($event.page); size.set($event.size)"
                />
                <output data-testid="v4-table-pagination-model">{{ page() }} / {{ size() }}</output>
            }
        </section>
    `,
})
export class V4TablePaginationFixture {
    protected readonly mounted = signal(false);
    protected readonly page = signal(0);
    protected readonly size = signal(10);
}
