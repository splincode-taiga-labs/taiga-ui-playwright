import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiSlider, TuiTextfield} from '@taiga-ui/core';
import {
    TuiInputColor,
    TuiInputNumber,
    TuiInputPhone,
    TuiInputPin,
    TuiInputSlider,
} from '@taiga-ui/kit';

@Component({
    selector: 'app-specialized-inputs',
    imports: [
        ReactiveFormsModule,
        TuiTextfield,
        TuiInputColor,
        TuiInputNumber,
        TuiInputPhone,
        TuiInputPin,
        TuiInputSlider,
        TuiSlider,
    ],
    template: `
        <section data-testid="specialized-inputs">
            <h2>Specialized Taiga UI input harnesses</h2>

            <tui-textfield data-testid="number-field">
                <input tuiInputNumber aria-label="Number" [formControl]="number" />
            </tui-textfield>
            <output data-testid="number-model">{{ number.value }}</output>

            <tui-textfield data-testid="phone-field">
                <input tuiInputPhone aria-label="Phone" mask="+7 ### ###-##-##" [formControl]="phone" />
            </tui-textfield>
            <output data-testid="phone-model">{{ phone.value }}</output>

            <tui-textfield data-testid="pin-field">
                <input tuiInputPin aria-label="PIN" [formControl]="pin" />
            </tui-textfield>
            <output data-testid="pin-model">{{ pin.value }}</output>

            <tui-textfield data-testid="color-field">
                <input tuiInputColor aria-label="Color" [formControl]="color" />
            </tui-textfield>
            <output data-testid="color-model">{{ color.value }}</output>

            <tui-textfield data-testid="input-slider-field">
                <input tuiInputSlider aria-label="Slider number" [min]="0" [max]="100" [formControl]="inputSlider" />
                <input tuiSlider type="range" />
            </tui-textfield>
            <output data-testid="input-slider-model">{{ inputSlider.value }}</output>

            <label>
                Volume
                <input data-testid="range-slider" tuiSlider type="range" [min]="0" [max]="100" [step]="1" [formControl]="slider" />
            </label>
            <output data-testid="range-slider-model">{{ slider.value }}</output>
        </section>
    `,
})
export class SpecializedInputs {
    protected readonly number = new FormControl<number | null>(null);
    protected readonly phone = new FormControl('');
    protected readonly pin = new FormControl('');
    protected readonly color = new FormControl('');
    protected readonly inputSlider = new FormControl(50);
    protected readonly slider = new FormControl(10);
}
