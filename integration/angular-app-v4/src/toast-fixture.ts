import {Component, inject} from '@angular/core';
import {TuiToastService} from '@taiga-ui/kit';

@Component({
    selector: 'app-v4-toast-fixture',
    template: `
        <section>
            <h2>Toast</h2>
            <button type="button" (click)="show()">Show v4 toast</button>
        </section>
    `,
})
export class V4ToastFixture {
    private readonly toasts = inject(TuiToastService);

    protected show(): void {
        this.toasts.open('Saved v4 settings', {
            appearance: 'positive',
            autoClose: 0,
            closable: true,
        }).subscribe();
    }
}
