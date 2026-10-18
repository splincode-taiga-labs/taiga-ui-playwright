import {Component, inject, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {TuiDialog, TuiTextfield, TuiTitle} from '@taiga-ui/core';
import {TuiFullscreen, TuiInputDate, TuiCalendar} from '@taiga-ui/kit';
import {TuiDynamicHeader, TuiNavigation, TuiPdfViewer} from '@taiga-ui/layout';

@Component({
    selector: 'app-remaining-platform',
    imports: [
        RouterOutlet, TuiDialog, TuiTextfield, TuiTitle,
        TuiFullscreen, TuiInputDate, TuiCalendar, TuiDynamicHeader,
        TuiNavigation, TuiPdfViewer,
    ],
    template: `
        <section data-testid="remaining-platform">
            <h2>Platform layout fixtures</h2>

            <div data-testid="fullscreen-widget" [tuiFullscreen]="false">
                Fullscreen sample
            </div>

            <button type="button" (click)="openRoute()">Open routable dialog</button>
            <router-outlet />

            <div data-testid="dynamic-header-container" tuiDynamicHeaderContainer
                style="height:110px;overflow:auto">
                <div data-testid="dynamic-header-widget" tuiDynamicHeader>
                    Dynamic header content
                </div>
                <div style="height:300px">Long scrollable region</div>
            </div>

            <aside data-testid="navigation-widget"
                [tuiNavigationAside]="navigationExpanded()">
                <nav tuiNavigationNav>
                    <a href="#home">Navigation home</a>
                    <a href="#settings">Settings</a>
                </nav>
            </aside>
            <button type="button" (click)="navigationExpanded.set(true)">
                Expand aside navigation
            </button>

            <button type="button" (click)="pdfOpen.set(true)">Open PDF viewer</button>
            <ng-template let-observer [(tuiDialog)]="pdfOpen"
                [tuiDialogOptions]="{appearance: 'fullscreen'}">
                <tui-pdf-viewer data-testid="pdf-viewer-widget">
                    <h2 tuiTitle>Sample.pdf</h2>
                    <button type="button" (click)="observer.complete()">
                        Close PDF viewer
                    </button>
                    <p>Embedded PDF viewer test contents</p>
                </tui-pdf-viewer>
            </ng-template>
        </section>
    `,
})
export class RemainingPlatform {
    private readonly router = inject(Router);
    protected readonly navigationExpanded = signal(false);
    protected readonly pdfOpen = signal(false);

    protected openRoute(): void {
        void this.router.navigateByUrl('/routable-fixture');
    }
}
