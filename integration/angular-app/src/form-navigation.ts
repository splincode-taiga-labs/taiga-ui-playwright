import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiExpand} from '@taiga-ui/core';
import {TuiCounter, TuiInputInline, TuiRadioList, TuiRange} from '@taiga-ui/kit';

@Component({
    selector: 'app-form-navigation',
    imports: [ReactiveFormsModule, TuiButton, TuiExpand, TuiCounter, TuiInputInline, TuiRadioList, TuiRange],
    template: `
        <section data-testid="form-navigation-widgets">
            <h2>Taiga UI form/navigation interactions</h2>

            <tui-counter data-testid="counter-widget" [min]="0" [max]="2" [formControl]="counter" />
            <output data-testid="counter-model">{{ counter.value }}</output>

            <tui-radio-list data-testid="radio-list-widget" [items]="sizes" [formControl]="size" />
            <output data-testid="radio-list-model">{{ size.value }}</output>

            <tui-input-inline data-testid="inline-widget">
                Empty text
                <input aria-label="Inline text" [formControl]="inlineValue" />
            </tui-input-inline>
            <output data-testid="inline-model">{{ inlineValue.value }}</output>

            <tui-range data-testid="range-widget" [min]="0" [max]="100" [step]="1" [formControl]="range" />
            <output data-testid="range-model">{{ range.value?.join(',') }}</output>

            <button tuiButton type="button" (click)="toggleExpand()">Toggle details</button>
            <tui-expand data-testid="expand-widget" [expanded]="expanded()">
                <span data-testid="expanded-content">Additional shipping details</span>
            </tui-expand>
            <output data-testid="expand-model">{{ expanded() }}</output>
        </section>
    `,
})
export class FormNavigation {
    protected readonly counter = new FormControl(1, {nonNullable: true});
    protected readonly sizes = ['Small', 'Medium', 'Large'];
    protected readonly size = new FormControl('Small', {nonNullable: true});
    protected readonly inlineValue = new FormControl('', {nonNullable: true});
    protected readonly range = new FormControl<[number, number]>([30, 70], {nonNullable: true});
    protected readonly expanded = signal(false);

    protected toggleExpand(): void {
        this.expanded.update((state) => !state);
    }
}
