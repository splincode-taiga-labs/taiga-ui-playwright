import {Component, signal} from '@angular/core';
import {TuiTableDirective, TuiTableTd} from '@taiga-ui/addon-table';

interface V4TableRow {
    readonly id: number;
    readonly name: string;
}

@Component({
    selector: 'app-v4-table-fixture',
    imports: [TuiTableDirective, TuiTableTd],
    template: `
        <section>
            <h2>Table</h2>
            <button type="button" (click)="mounted.set(true)">Mount v4 table</button>
            @if (mounted()) {
                <table tuiTable data-testid="v4-table" [size]="size()" style="width:340px">
                    <thead><tr><th>Name</th><th>ID</th></tr></thead>
                    <tbody>
                        @for (row of rows(); track row.id) {
                            <tr>
                                <td tuiTd>{{ row.name }}</td>
                                <td tuiTd>{{ row.id }}</td>
                            </tr>
                        }
                    </tbody>
                </table>
                <button type="button" (click)="size.set('l')">Expand v4 table size</button>
                <button type="button" (click)="removeLast()">Remove last v4 table row</button>
                <output data-testid="v4-table-model">{{ names() }}</output>
            }
        </section>
    `,
})
export class V4TableFixture {
    protected readonly mounted = signal(false);
    protected readonly size = signal<'s' | 'l'>('s');
    protected readonly rows = signal<readonly V4TableRow[]>([
        {id: 1, name: 'Alice'},
        {id: 2, name: 'Bob'},
        {id: 3, name: 'Carol'},
    ]);

    protected names(): string {
        return this.rows().map((row) => row.name).join(' / ');
    }

    protected removeLast(): void {
        this.rows.update((rows) => rows.slice(0, -1));
    }
}
