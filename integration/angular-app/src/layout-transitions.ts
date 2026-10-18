import {Component, signal} from '@angular/core';
import {TuiButton, TuiClose} from '@taiga-ui/core';
import {TuiElasticContainer, TuiFloatingContainer, TuiList, TuiSlides} from '@taiga-ui/layout';

@Component({
    selector: 'app-layout-transitions',
    imports: [
        TuiButton, TuiClose, TuiElasticContainer,
        TuiFloatingContainer, TuiList, TuiSlides,
    ],
    template: `
        <section data-testid="layout-transitions">
            <h2>List, layout transitions and close harnesses</h2>

            <ul data-testid="responsive-list" [tuiList]="listSize()">
                <li>First</li>
                <li>Second</li>
                @if (listHasThird()) {
                    <li>Third</li>
                }
            </ul>
            <button tuiButton type="button" (click)="listSize.set('s')">Compact list</button>
            <button tuiButton type="button" (click)="listHasThird.set(true)">Append list item</button>

            <div data-testid="slides-widget" [tuiSlides]="slideDirection()"
                style="width:300px">
                @if (activeSlide() === 0) {
                    <div>Slide alpha</div>
                } @else {
                    <div>Slide beta</div>
                }
            </div>
            <button tuiButton type="button" (click)="goForward()">Next content slide</button>
            <button tuiButton type="button" (click)="goBackward()">Previous content slide</button>

            <div style="width:300px">
                <tui-elastic-container data-testid="elastic-widget">
                    <div style="height:60px">Always visible content</div>
                    @if (expanded()) {
                        <div style="height:180px">Expanded content</div>
                    }
                </tui-elastic-container>
            </div>
            <button tuiButton type="button" (click)="expanded.set(true)">
                Expand elastic content
            </button>

            <div data-testid="floating-widget"
                [tuiFloatingContainer]="floatingColor()"
                style="width:200px;height:50px">
                Floating content
            </div>
            <button tuiButton type="button"
                (click)="floatingColor.set('rgb(20, 40, 60)')">
                Change floating background
            </button>

            <button tuiButton type="button" (click)="showPanel()">
                Open closable panel
            </button>
            <button tuiButton type="button">Outside close area</button>
            @if (panelOpen()) {
                <div data-testid="closable-widget" tuiClose
                    (tuiClose)="onPanelClose()"
                    tabindex="-1"
                    style="width:240px;height:120px;background:#ddd">
                    Close with Escape or outside click
                </div>
            }
            <output data-testid="close-model">{{ closeCount() }}</output>
        </section>
    `,
})
export class LayoutTransitions {
    protected readonly listSize = signal<'l' | 's'>('l');
    protected readonly listHasThird = signal(false);
    protected readonly activeSlide = signal(0);
    protected readonly slideDirection = signal(0);
    protected readonly expanded = signal(false);
    protected readonly floatingColor = signal('rgb(255, 255, 255)');
    protected readonly panelOpen = signal(false);
    protected readonly closeCount = signal(0);

    protected goForward(): void {
        this.slideDirection.set(1);
        this.activeSlide.set(1);
    }

    protected goBackward(): void {
        this.slideDirection.set(-1);
        this.activeSlide.set(0);
    }

    protected showPanel(): void {
        this.panelOpen.set(true);
    }

    protected onPanelClose(): void {
        this.closeCount.update((count) => count + 1);
        this.panelOpen.set(false);
    }
}
