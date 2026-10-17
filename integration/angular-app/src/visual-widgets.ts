import {Component, signal} from '@angular/core';
import {TuiItem} from '@taiga-ui/cdk';
import {TuiButton, TuiLink, TuiLoader} from '@taiga-ui/core';
import {TuiAvatar, TuiBadgeNotification, TuiBreadcrumbs, TuiStatus} from '@taiga-ui/kit';

@Component({
    selector: 'app-visual-widgets',
    imports: [
        TuiItem, TuiButton, TuiLink, TuiLoader,
        TuiAvatar, TuiBadgeNotification, TuiBreadcrumbs, TuiStatus,
    ],
    template: `
        <section data-testid="visual-widgets">
            <h2>Display, loading and navigation harnesses</h2>

            <tui-loader data-testid="loader-widget" [loading]="loading()" textContent="Loading details">
                <span>Ready content</span>
            </tui-loader>
            <button type="button" tuiButton (click)="loading.set(!loading())">Toggle spinner</button>
            <output data-testid="loader-model">{{ loading() }}</output>

            <span data-testid="avatar-widget" tuiAvatar="AB" size="m" [round]="round()"></span>
            <button type="button" tuiButton (click)="round.set(!round())">Toggle avatar shape</button>

            <tui-badge-notification data-testid="notification-badge" [size]="badgeSize()">
                {{ badgeCount() }}
            </tui-badge-notification>
            <button type="button" tuiButton (click)="badgeCount.set(8); badgeSize.set('m')">
                Update badge
            </button>

            <span data-testid="status-widget" [tuiStatus]="status()">Status sample</span>
            <button type="button" tuiButton (click)="status.set('orange')">Update status</button>

            <tui-breadcrumbs data-testid="breadcrumbs-widget" size="m">
                <a *tuiItem tuiLink href="#visual-home">Home</a>
                <a *tuiItem tuiLink href="#visual-products">Products</a>
                <a *tuiItem tuiLink href="#visual-details">Details</a>
            </tui-breadcrumbs>
            <div id="visual-products">Product destination</div>
        </section>
    `,
})
export class VisualWidgets {
    protected readonly loading = signal(true);
    protected readonly round = signal(true);
    protected readonly badgeCount = signal(3);
    protected readonly badgeSize = signal<'s' | 'm'>('s');
    protected readonly status = signal('lime');
}
