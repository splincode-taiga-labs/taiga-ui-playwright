import {Component, inject, signal} from '@angular/core';
import {TuiSheetDialogService} from '@taiga-ui/addon-mobile';
import {TuiDataList, TuiDropdown, TuiHint, TuiPopup} from '@taiga-ui/core';
import {TuiToastService} from '@taiga-ui/kit';

@Component({
    selector: 'app-remaining-portals',
    imports: [TuiDataList, TuiDropdown, TuiHint, TuiPopup],
    template: `
        <section data-testid="remaining-portals">
            <h2>Portal system fixtures</h2>
            <button type="button" (click)="showAlert()">Open alert</button>

            <button type="button" [tuiDropdown]="dropdownContent"
                [tuiDropdownManual]="dropdownOpen()" (click)="toggleDropdown()">
                Open dropdown portal
            </button>
            <ng-template #dropdownContent>
                <tui-data-list>
                    <button tuiOption type="button" (click)="selectDropdown()">
                        Portal option
                    </button>
                </tui-data-list>
            </ng-template>
            <output data-testid="portal-dropdown-value">{{dropdownSelection()}}</output>

            <button type="button" tuiHint="Manual hint text"
                [tuiHintManual]="hintOpen()">
                Manual hint trigger
            </button>
            <button type="button" (click)="hintOpen.set(!hintOpen())">
                Toggle portal hint
            </button>

            <button type="button" (click)="openModal()">Open modal portal</button>

            <button type="button" (click)="popupOpen.set(!popupOpen())">
                Toggle popup template
            </button>
            <ng-template [tuiPopup]="popupOpen()">
                <div data-testid="portal-popup-content">Projected popup portal content</div>
            </ng-template>
        </section>
    `,
})
export class RemainingPortals {
    private readonly toast = inject(TuiToastService);
    private readonly sheet = inject(TuiSheetDialogService);
    protected readonly dropdownOpen = signal(false);
    protected readonly dropdownSelection = signal('');
    protected readonly hintOpen = signal(false);
    protected readonly popupOpen = signal(false);

    protected showAlert(): void {
        this.toast.open('Portal alert content', {autoClose: 0, closable: true}).subscribe();
    }

    protected toggleDropdown(): void {
        this.dropdownOpen.update((value) => !value);
    }

    protected selectDropdown(): void {
        this.dropdownSelection.set('Portal option');
        this.dropdownOpen.set(false);
    }

    protected openModal(): void {
        this.sheet.open('The modal portal content', {label: 'Modal panel'}).subscribe();
    }
}
