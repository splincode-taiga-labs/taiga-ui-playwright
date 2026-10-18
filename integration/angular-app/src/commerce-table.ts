import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiInputCard, TuiInputCardGroup, TuiThumbnailCard} from '@taiga-ui/addon-commerce';
import {TuiReorder, TuiTable, TuiTablePagination} from '@taiga-ui/addon-table';
import {TuiTextfield} from '@taiga-ui/core';

@Component({
    selector: 'app-commerce-table',
    imports: [
        ReactiveFormsModule, TuiTextfield, TuiInputCard,
        TuiInputCardGroup, TuiThumbnailCard,
        TuiReorder, TuiTable, TuiTablePagination,
    ],
    template: `
        <section data-testid="commerce-table">
            <h2>Payment and table harnesses</h2>
            <tui-textfield data-testid="input-card-widget">
                <input tuiInputCard aria-label="Card number" [formControl]="cardNumber" />
            </tui-textfield>
            <output data-testid="card-number-model">{{ cardNumber.value }}</output>

            <tui-input-card-group data-testid="card-group-widget"
                [formControl]="cardGroup" [compact]="compact()" />
            <button type="button" (click)="compact.set(true)">Compact payment input</button>

            <tui-thumbnail-card data-testid="thumbnail-widget" [size]="thumbnailSize()"
                paymentSystem="visa">
                Card thumbnail
            </tui-thumbnail-card>
            <button type="button" (click)="thumbnailSize.set('l')">Large thumbnail</button>

            <tui-reorder data-testid="reorder-widget"
                [(items)]="columns" [(enabled)]="enabledColumns" />
            <output data-testid="reorder-enabled">{{ enabledColumns().join(',') }}</output>

            <table tuiTable data-testid="table-widget" [size]="tableSize()">
                <thead>
                    <tr><th>Name</th><th>Value</th></tr>
                </thead>
                <tbody>
                    @for (item of tableRows(); track item) {
                        <tr><td>{{item}}</td><td>Active</td></tr>
                    }
                </tbody>
            </table>
            <button type="button" (click)="makeTableCompact()">Compact data table</button>
            <button type="button" (click)="addTableRow()">Add data row</button>

            <tui-table-pagination data-testid="pagination-widget"
                [total]="30" [items]="[5, 10]"
                [(page)]="page" [(size)]="pageSize" />
            <output data-testid="pagination-page">{{ page() }}</output>
        </section>
    `,
})
export class CommerceTable {
    protected readonly cardNumber = new FormControl('', {nonNullable: true});
    protected readonly cardGroup = new FormControl<{card: string; cvc: string; expire: string} | null>(null);
    protected readonly compact = signal(false);
    protected readonly thumbnailSize = signal<'s' | 'l'>('s');
    protected readonly columns = signal<readonly string[]>(['Name', 'Value', 'Status']);
    protected readonly enabledColumns = signal<readonly string[]>(['Name', 'Value', 'Status']);
    protected readonly tableSize = signal<'l' | 's'>('l');
    protected readonly tableRows = signal(['Alpha', 'Beta']);
    protected readonly page = signal(0);
    protected readonly pageSize = signal(5);

    protected makeTableCompact(): void {
        this.tableSize.set('s');
    }
    protected addTableRow(): void {
        this.tableRows.update((items) => [...items, 'Gamma']);
    }
}
