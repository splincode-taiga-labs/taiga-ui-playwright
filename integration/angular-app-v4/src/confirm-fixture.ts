import {Component, inject, signal} from '@angular/core';
import {TuiConfirmService} from '@taiga-ui/kit';

@Component({
    selector: 'app-v4-confirm-fixture',
    providers: [TuiConfirmService],
    template: `
        <section>
            <h2>Confirm</h2>
            <button type="button" (click)="open()">Open v4 confirmation</button>
            <output data-testid="v4-confirm-result">{{ result() }}</output>
        </section>
    `,
})
export class V4ConfirmFixture {
    private readonly confirm = inject(TuiConfirmService);
    protected readonly result = signal('none');

    protected open(): void {
        this.result.set('pending');
        this.confirm.markAsDirty();
        this.confirm.withConfirm({
            label: 'V4 confirmation',
            data: {
                content: 'Publish this v4 draft?',
                yes: 'Proceed',
                no: 'Cancel',
            },
        }).subscribe((accepted) => this.result.set(accepted ? 'accepted' : 'rejected'));
    }
}
