import {JsonPipe} from '@angular/common';
import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiButton} from '@taiga-ui/core';
import {TuiCopy, TuiInputChip, TuiLike, TuiProgressBar, TuiRating} from '@taiga-ui/kit';

@Component({
    selector: 'app-interactive-widgets',
    imports: [JsonPipe, ReactiveFormsModule, TuiButton, TuiCopy, TuiInputChip, TuiLike, TuiProgressBar, TuiRating],
    template: `
        <section data-testid="interactive-widgets">
            <h2>Interactive Taiga UI component harnesses</h2>

            <label>
                Rate this demo
                <tui-rating data-testid="rating-widget" [max]="5" [formControl]="rating" />
            </label>
            <output data-testid="rating-model">{{ rating.value }}</output>

            <label>
                Favorite
                <input data-testid="like-widget" tuiLike type="checkbox" [formControl]="liked" />
            </label>
            <output data-testid="like-model">{{ liked.value }}</output>

            <tui-copy data-testid="copy-widget">Copy this exact value: 42</tui-copy>

            <tui-textfield data-testid="chip-widget" multi>
                <input tuiInputChip aria-label="Enter tags" [formControl]="chips" />
                <tui-input-chip *tuiItem />
            </tui-textfield>
            <output data-testid="chip-model">{{ chips.value | json }}</output>

            <progress data-testid="progress-widget" tuiProgressBar [value]="progress()" max="100"></progress>
            <button tuiButton type="button" (click)="advance()">Advance progress</button>
            <output data-testid="progress-model">{{ progress() }}</output>
        </section>
    `,
})
export class InteractiveWidgets {
    protected readonly rating = new FormControl(0, {nonNullable: true});
    protected readonly liked = new FormControl(false, {nonNullable: true});
    protected readonly chips = new FormControl<string[]>([], {nonNullable: true});
    protected readonly progress = signal(25);

    protected advance(): void {
        this.progress.set(75);
    }
}
