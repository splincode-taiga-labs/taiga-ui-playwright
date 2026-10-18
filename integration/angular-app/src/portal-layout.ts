import {Component, inject, signal} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {TuiConfirmService, TuiShrinkWrap, TuiToastService} from '@taiga-ui/kit';
import {TuiForm, TuiItemGroup} from '@taiga-ui/layout';

@Component({
    selector: 'app-portal-layout',
    imports: [TuiButton, TuiForm, TuiItemGroup, TuiShrinkWrap],
    providers: [TuiConfirmService],
    template: `
        <section data-testid="portal-layout">
            <h2>Dialog, toast and layout fixtures</h2>

            <button tuiButton type="button" (click)="askConfirmation()">Request confirmation</button>
            <button tuiButton type="button" (click)="askWithoutChanges()">Confirm pristine</button>
            <output data-testid="confirm-result">{{ confirmResult() }}</output>

            <button tuiButton type="button" (click)="showToast()">Show toast</button>
            <output data-testid="toast-result">{{ toastResult() }}</output>

            <form data-testid="form-widget" [tuiForm]="formSize()" (submit)="submit($event)">
                <button tuiButton type="submit">Save form</button>
            </form>
            <button tuiButton type="button" (click)="formSize.set('s')">Compact form</button>
            <output data-testid="form-result">{{ savedCount() }}</output>

            <div data-testid="item-group-widget" tuiItemGroup
                [horizontal]="horizontal()" [autoscroll]="true"
                style="width:180px;display:flex;overflow-x:auto;white-space:nowrap;gap:12px">
                <button type="button" style="flex:0 0 110px">Option one</button>
                <button type="button" style="flex:0 0 110px">Option two</button>
                <button type="button" style="flex:0 0 110px">Option three</button>
                <button type="button" style="flex:0 0 110px" (click)="lastClicked.set(true)">
                    Option four
                </button>
            </div>
            <button tuiButton type="button" (click)="horizontal.set(false)">
                Vertical item group
            </button>
            <output data-testid="item-group-result">{{ lastClicked() }}</output>

            <div data-testid="shrink-wrap-widget" [tuiShrinkWrap]="maxWidth()"
                style="display:block;width:300px;box-sizing:border-box">
                Shrinkable content for a wide container
            </div>
            <button tuiButton type="button" (click)="maxWidth.set('100px')">
                Narrow shrink wrap
            </button>
        </section>
    `,
})
export class PortalLayout {
    private readonly confirmation = inject(TuiConfirmService);
    private readonly toasts = inject(TuiToastService);
    protected readonly confirmResult = signal('pending');
    protected readonly toastResult = signal('closed');
    protected readonly formSize = signal<'l' | 's'>('l');
    protected readonly savedCount = signal(0);
    protected readonly horizontal = signal(true);
    protected readonly lastClicked = signal(false);
    protected readonly maxWidth = signal('180px');

    protected askConfirmation(): void {
        this.confirmResult.set('pending');
        this.confirmation.markAsDirty();
        this.confirmation.withConfirm({
            label: 'Confirm operation',
            data: {content: 'Are you sure?', yes: 'Proceed', no: 'Cancel'},
        }).subscribe((accepted) => this.confirmResult.set(accepted ? 'yes' : 'no'));
    }

    protected askWithoutChanges(): void {
        this.confirmation.markAsPristine();
        this.confirmResult.set('pending');
        this.confirmation.withConfirm({label: 'No changes'}).subscribe((accepted) =>
            this.confirmResult.set(accepted ? 'yes' : 'no'),
        );
    }

    protected showToast(): void {
        this.toastResult.set('open');
        this.toasts.open('Changes saved', {
            appearance: 'positive',
            autoClose: 0,
            closable: true,
        }).subscribe({complete: () => this.toastResult.set('closed')});
    }

    protected submit(event: Event): void {
        event.preventDefault();
        this.savedCount.update((count) => count + 1);
    }
}
