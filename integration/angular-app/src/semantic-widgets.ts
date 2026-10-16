import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiLink, TuiSpinButton, TuiTextfield} from '@taiga-ui/core';
import {
    TuiBadge,
    TuiButtonLoading,
    TuiChip,
    TuiMeter,
    TuiPager,
    TuiPin,
    TuiPincode,
} from '@taiga-ui/kit';

@Component({
    selector: 'app-semantic-widgets',
    imports: [
        ReactiveFormsModule, TuiButton, TuiLink, TuiSpinButton, TuiTextfield,
        TuiBadge, TuiButtonLoading, TuiChip, TuiMeter, TuiPager, TuiPin, TuiPincode,
    ],
    template: `
        <section data-testid="semantic-widgets">
            <h2>Taiga UI navigation and status harnesses</h2>

            <tui-spin-button data-testid="spin-widget"
                [leftDisabled]="spinIndex() === 0"
                [rightDisabled]="spinIndex() === 2"
                (leftClick)="decreaseSpin()" (rightClick)="increaseSpin()">
                {{ spinIndex() }}
            </tui-spin-button>
            <output data-testid="spin-model">{{ spinIndex() }}</output>

            <tui-textfield data-testid="pincode-field">
                <input tuiPincode aria-label="Security code" [maxLength]="4" [formControl]="pinCode" />
            </tui-textfield>
            <output data-testid="pincode-model">{{ pinCode.value }}</output>

            <button data-testid="loading-button" tuiButton [loading]="loading()" type="button"
                (click)="incrementClicks()">Submit</button>
            <button tuiButton type="button" (click)="toggleLoading()">Toggle loading</button>
            <output data-testid="loading-count">{{ loadingClicks() }}</output>
            <output data-testid="loading-model">{{ loading() }}</output>

            <tui-pager data-testid="pager-widget" [index]="pagerIndex()" [count]="8" [max]="4" />
            <button tuiButton type="button" (click)="nextPager()">Next pager</button>
            <output data-testid="pager-model">{{ pagerIndex() }}</output>

            <a data-testid="link-widget" tuiLink href="#semantic-link-destination">Open anchor</a>
            <div id="semantic-link-destination">Anchor target</div>

            <span data-testid="chip-widget" tuiChip [attr.appearance]="chipAppearance()">Dynamic chip</span>
            <button tuiButton type="button" (click)="toggleChip()">Toggle chip</button>

            <span data-testid="badge-widget" tuiBadge appearance="positive" [size]="badgeSize()">
                Status badge
            </span>
            <button tuiButton type="button" (click)="toggleBadge()">Toggle badge</button>

            <span data-testid="pin-widget" [tuiPin]="pinOpen()">Map marker</span>
            <button tuiButton type="button" (click)="togglePin()">Toggle pin</button>

            <meter data-testid="meter-widget" tuiMeter min="0" max="100" optimum="80"
                [value]="meterValue()"></meter>
            <button tuiButton type="button" (click)="increaseMeter()">Increase meter</button>
            <output data-testid="meter-model">{{ meterValue() }}</output>
        </section>
    `,
})
export class SemanticWidgets {
    protected readonly spinIndex = signal(1);
    protected readonly pinCode = new FormControl('', {nonNullable: true});
    protected readonly loading = signal(false);
    protected readonly loadingClicks = signal(0);
    protected readonly pagerIndex = signal(0);
    protected readonly chipAppearance = signal('neutral');
    protected readonly badgeSize = signal<'m' | 's'>('m');
    protected readonly pinOpen = signal(false);
    protected readonly meterValue = signal('25');

    protected decreaseSpin(): void { this.spinIndex.update((value) => value - 1); }
    protected increaseSpin(): void { this.spinIndex.update((value) => value + 1); }
    protected toggleLoading(): void { this.loading.update((value) => !value); }
    protected incrementClicks(): void { this.loadingClicks.update((value) => value + 1); }
    protected nextPager(): void { this.pagerIndex.update((value) => Math.min(value + 1, 7)); }
    protected toggleChip(): void { this.chipAppearance.update((value) => value === 'neutral' ? 'positive' : 'neutral'); }
    protected toggleBadge(): void { this.badgeSize.update((value) => value === 'm' ? 's' : 'm'); }
    protected togglePin(): void { this.pinOpen.update((value) => !value); }
    protected increaseMeter(): void { this.meterValue.set('75'); }
}
