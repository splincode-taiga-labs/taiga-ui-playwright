import {Component, signal} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiComment, TuiDrawer, TuiMessage} from '@taiga-ui/kit';
import {
    TuiAppBar, TuiBlockDetails, TuiHeader,
    TuiProgressiveBlur, TuiSearch, TuiSurface,
} from '@taiga-ui/layout';

@Component({
    selector: 'app-remaining-layout',
    imports: [
        TuiButton, TuiComment, TuiDrawer, TuiMessage,
        TuiAppBar, TuiBlockDetails, TuiHeader,
        TuiProgressiveBlur, TuiSearch, TuiSurface,
    ],
    template: `
        <section data-testid="remaining-layout">
            <h2>Additional Taiga UI layout integration</h2>

            <div data-testid="comment-widget" [tuiComment]="commentDirection()">
                Example comment
            </div>
            <button tuiButton type="button" (click)="commentDirection.set('bottom')">
                Flip comment
            </button>

            <div data-testid="message-widget" tuiMessage>
                Example validation message
            </div>
            <tui-drawer data-testid="drawer-widget" [direction]="drawerDirection()"
                [overlay]="drawerOverlay()">
                <p>Drawer contents</p>
            </tui-drawer>
            <button tuiButton type="button" (click)="toggleDrawer()">
                Toggle drawer configuration
            </button>

            <header data-testid="header-widget" [tuiHeader]="headerSize()">
                Section heading
            </header>
            <button tuiButton type="button" (click)="headerSize.set('h3')">
                Promote heading
            </button>

            <div data-testid="block-details-widget" tuiBlockDetails>
                Account summary details
            </div>
            <div data-testid="surface-widget" tuiSurface>
                Surface content
            </div>

            <search data-testid="search-widget" tuiSearch>
                <input type="search" aria-label="Layout search" />
                <button tuiButton type="button" (click)="recordSearch()">
                    Search now
                </button>
            </search>
            <output data-testid="search-clicks">{{ searchClicks() }}</output>

            <tui-app-bar data-testid="app-bar-widget" [size]="appBarSize()">
                <button tuiSlot="start" type="button">Back</button>
                App bar title
                <button tuiSlot="end" type="button" (click)="recordAppAction()">
                    End action
                </button>
            </tui-app-bar>
            <button tuiButton type="button" (click)="appBarSize.set('l')">
                Large app bar
            </button>
            <output data-testid="app-bar-actions">{{ appActions() }}</output>

            <tui-progressive-blur data-testid="blur-widget" />
        </section>
    `,
})
export class RemainingLayout {
    protected readonly commentDirection = signal<'top' | 'bottom'>('top');
    protected readonly drawerDirection = signal<'start' | 'end'>('end');
    protected readonly drawerOverlay = signal(false);
    protected readonly headerSize = signal<'h5' | 'h3'>('h5');
    protected readonly appBarSize = signal<'m' | 'l'>('m');
    protected readonly searchClicks = signal(0);
    protected readonly appActions = signal(0);

    protected recordSearch(): void {
        this.searchClicks.update((count) => count + 1);
    }

    protected recordAppAction(): void {
        this.appActions.update((count) => count + 1);
    }

    protected toggleDrawer(): void {
        this.drawerDirection.set('start');
        this.drawerOverlay.set(true);
    }
}
