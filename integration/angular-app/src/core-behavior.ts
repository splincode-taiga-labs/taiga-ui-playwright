import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiItem} from '@taiga-ui/cdk';
import {
    TuiButton, TuiCarousel, TuiDataList, TuiError, TuiInput, TuiScrollbar, TuiTextfield,
} from '@taiga-ui/core';

@Component({
    selector: 'app-core-behavior',
    imports: [
        ReactiveFormsModule, TuiButton, TuiCarousel, TuiItem, TuiDataList,
        TuiError, TuiInput, TuiScrollbar, TuiTextfield,
    ],
    template: `
        <section data-testid="core-behavior">
            <h2>Core behavior harnesses</h2>

            <tui-error data-testid="validation-error" [error]="validationError()" />
            <button tuiButton type="button" (click)="validationError.set('Invalid value')">
                Show validation error
            </button>
            <button tuiButton type="button" (click)="validationError.set(null)">
                Clear validation error
            </button>

            <tui-data-list data-testid="choice-list" size="s">
                <button tuiOption type="button" (click)="selected.set('Alpha')">Alpha</button>
                <button tuiOption type="button" (click)="selected.set('Beta')">Beta</button>
                <button tuiOption type="button" [disabled]="true">Unavailable</button>
                <button tuiOption type="button" (click)="selected.set('Gamma')">Gamma</button>
            </tui-data-list>
            <output data-testid="choice-model">{{ selected() }}</output>

            <tui-textfield data-testid="clearable-textfield">
                <input tuiInput aria-label="Clearable text" [formControl]="textValue" />
            </tui-textfield>
            <output data-testid="textfield-model">{{ textValue.value }}</output>
            <tui-textfield data-testid="disabled-textfield">
                <input tuiInput aria-label="Disabled text" [formControl]="disabledText" />
            </tui-textfield>

            <tui-scrollbar data-testid="scrollbar-widget"
                style="display:flex;max-height:120px;max-width:280px;border:1px solid #ccc">
                <div style="height:900px;min-height:900px">
                    <p>Scroll content top</p>
                    <div style="height:780px"></div>
                    <p data-testid="scroll-content-bottom">Scroll content bottom</p>
                </div>
            </tui-scrollbar>

            <div style="width:280px">
                <tui-carousel data-testid="carousel-widget" [min]="0" [max]="2" [(index)]="carouselIndex">
                    <div *tuiItem="let index" style="height:100px;width:100%">
                        Slide {{ index + 1 }}
                    </div>
                </tui-carousel>
            </div>
            <output data-testid="carousel-model">{{ carouselIndex() }}</output>
        </section>
    `,
})
export class CoreBehavior {
    protected readonly validationError = signal<string | null>(null);
    protected readonly selected = signal('');
    protected readonly textValue = new FormControl('Initial text', {nonNullable: true});
    protected readonly disabledText = new FormControl({value: 'Read only', disabled: true});
    protected readonly carouselIndex = signal(0);
}
