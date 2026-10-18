import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiDataList, TuiIcon} from '@taiga-ui/core';
import {TuiActionBar, TuiCompass, TuiFilter, TuiPulse} from '@taiga-ui/kit';

@Component({
    selector: 'app-visual-actions',
    imports: [
        ReactiveFormsModule, TuiButton, TuiDataList, TuiIcon,
        TuiActionBar, TuiCompass, TuiFilter, TuiPulse,
    ],
    template: `
        <section data-testid="visual-actions">
            <h2>Visual and action harnesses</h2>

            <tui-icon data-testid="icon-widget" [icon]="currentIcon()" />
            <button tuiButton type="button" (click)="currentIcon.set('@tui.check')">
                Change icon
            </button>

            <tui-filter
                data-testid="filter-widget"
                [items]="filters"
                size="s"
                [formControl]="chosenFilters"
            />
            <output data-testid="filter-model">{{ chosenFilters.value.join(',') }}</output>

            <tui-pulse data-testid="pulse-widget" [playing]="pulsePlaying()" />
            <button tuiButton type="button" (click)="pulsePlaying.set(!pulsePlaying())">
                Toggle pulse
            </button>

            <tui-compass data-testid="compass-widget" [degrees]="degrees()" />
            <button tuiButton type="button" (click)="degrees.set(135)">Rotate compass</button>

            <button tuiButton type="button" (click)="actionVisible.set(true)">
                Show action bar
            </button>
            <button tuiButton type="button" (click)="actionExpanded.set(!actionExpanded())">
                Toggle action menu
            </button>
            <output data-testid="action-model">{{ actionCount() }}</output>

            @if (actionVisible()) {
                <tui-action-bar
                    data-testid="action-bar-widget"
                    size="s"
                    [expanded]="actionExpanded()"
                >
                    <tui-data-list>
                        <button tuiOption type="button" (click)="archive()">
                            Archive selection
                        </button>
                    </tui-data-list>
                    <span>1 item selected</span>
                    <button tuiButton type="button" (click)="apply()">
                        Apply changes
                    </button>
                </tui-action-bar>
            }
        </section>
    `,
})
export class VisualActions {
    protected readonly currentIcon = signal('@tui.search');
    protected readonly filters = ['Alpha', 'Beta', 'Gamma'];
    protected readonly chosenFilters = new FormControl<readonly string[]>([], {nonNullable: true});
    protected readonly pulsePlaying = signal(true);
    protected readonly degrees = signal(45);
    protected readonly actionVisible = signal(false);
    protected readonly actionExpanded = signal(false);
    protected readonly actionCount = signal(0);

    protected archive(): void {
        this.actionCount.update((count) => count + 10);
    }

    protected apply(): void {
        this.actionCount.update((count) => count + 1);
    }
}
