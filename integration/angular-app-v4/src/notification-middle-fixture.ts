import {Component, inject, signal} from '@angular/core';
import {TuiNotificationMiddleService} from '@taiga-ui/kit';

@Component({
    selector: 'app-v4-notification-middle-fixture',
    template: `
        <section>
            <h2>NotificationMiddle</h2>
            <button type="button" (click)="open()">Show v4 middle notification</button>
            <output data-testid="v4-middle-notification-state">{{ state() }}</output>
        </section>
    `,
})
export class V4NotificationMiddleFixture {
    private readonly notifications = inject(TuiNotificationMiddleService);
    protected readonly state = signal('none');

    protected open(): void {
        this.state.set('open');
        this.notifications.open('Loading v4 report', {closable: true})
            .subscribe({complete: () => this.state.set('closed')});
    }
}
