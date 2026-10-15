import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton, TuiCheckbox, TuiInput, TuiRadio, TuiTextfield} from '@taiga-ui/core';
import {
    TuiAccordion,
    TuiPagination,
    TuiSegmented,
    TuiStepper,
    TuiSwitch,
    TuiTabs,
    TuiTextarea,
} from '@taiga-ui/kit';

@Component({
    selector: 'app-harness-controls',
    imports: [
        ReactiveFormsModule,
        TuiButton,
        TuiCheckbox,
        TuiInput,
        TuiRadio,
        TuiTextfield,
        TuiAccordion,
        TuiPagination,
        TuiSegmented,
        TuiStepper,
        TuiSwitch,
        TuiTabs,
        TuiTextarea,
    ],
    template: `
        <section data-testid="harness-controls">
            <h2>Additional real Taiga UI harnesses</h2>

            <button data-testid="basic-button" tuiButton type="button" (click)="clicks.update(n => n + 1)">Save</button>
            <output data-testid="basic-button-model">{{ clicks() }}</output>
            <button data-testid="disabled-button" tuiButton type="button" disabled>Disabled</button>

            <label>
                <input data-testid="basic-checkbox" tuiCheckbox type="checkbox" [formControl]="checkbox" />
                Subscribe
            </label>
            <output data-testid="basic-checkbox-model">{{ checkbox.value }}</output>

            <label>
                <input data-testid="basic-radio-a" tuiRadio type="radio" value="A" [formControl]="radio" />
                Option A
            </label>
            <label>
                <input data-testid="basic-radio-b" tuiRadio type="radio" value="B" [formControl]="radio" />
                Option B
            </label>
            <output data-testid="basic-radio-model">{{ radio.value }}</output>

            <tui-textfield data-testid="basic-input-field">
                <input tuiInput aria-label="Basic text" [formControl]="text" />
            </tui-textfield>
            <output data-testid="basic-input-model">{{ text.value }}</output>

            <label>
                <input data-testid="basic-switch" tuiSwitch type="checkbox" [formControl]="switched" />
                Notifications
            </label>
            <output data-testid="basic-switch-model">{{ switched.value }}</output>

            <tui-textfield data-testid="basic-textarea-field">
                <textarea tuiTextarea aria-label="Notes" [formControl]="notes"></textarea>
            </tui-textfield>
            <output data-testid="basic-textarea-model">{{ notes.value }}</output>

            <tui-tabs data-testid="basic-tabs" [(activeItemIndex)]="tabIndex">
                <button tuiTab type="button">Overview</button>
                <button tuiTab type="button">Details</button>
                <button tuiTab type="button" disabled>Disabled tab</button>
            </tui-tabs>
            <output data-testid="basic-tabs-model">{{ tabIndex }}</output>

            <tui-segmented data-testid="basic-segmented" [(activeItemIndex)]="segmentIndex">
                <button type="button">Day</button>
                <button type="button">Week</button>
                <button type="button">Month</button>
            </tui-segmented>
            <output data-testid="basic-segmented-model">{{ segmentIndex }}</output>

            <tui-accordion data-testid="basic-accordion">
                <button [tuiAccordion]="false">Shipping</button>
                <tui-expand>Ships within 3 days</tui-expand>
                <button [tuiAccordion]="false">Returns</button>
                <tui-expand>30-day return window</tui-expand>
            </tui-accordion>

            <tui-pagination data-testid="basic-pagination" [length]="3" [(index)]="paginationIndex" />
            <output data-testid="basic-pagination-model">{{ paginationIndex }}</output>

            <tui-stepper data-testid="basic-stepper" [(activeItemIndex)]="stepIndex">
                <button tuiStep type="button">Account</button>
                <button tuiStep type="button">Shipping</button>
                <button tuiStep type="button" disabled>Payment</button>
            </tui-stepper>
            <output data-testid="basic-stepper-model">{{ stepIndex }}</output>
        </section>
    `,
})
export class HarnessControls {
    protected readonly clicks = signal(0);
    protected readonly checkbox = new FormControl(false, {nonNullable: true});
    protected readonly radio = new FormControl('A', {nonNullable: true});
    protected readonly text = new FormControl('', {nonNullable: true});
    protected readonly switched = new FormControl(false, {nonNullable: true});
    protected readonly notes = new FormControl('', {nonNullable: true});
    protected tabIndex = 0;
    protected segmentIndex = 0;
    protected paginationIndex = 0;
    protected stepIndex = 0;
}
