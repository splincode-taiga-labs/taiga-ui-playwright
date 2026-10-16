import {Clipboard} from '@angular/cdk/clipboard';
import {Component, inject, input, signal} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';

/** Reliable user-gesture copy control; uses Angular CDK Clipboard in the browser. */
@Component({
    selector: 'docs-copy-button',
    imports: [TuiButton],
    template: [
        '<button',
        '    tuiIconButton',
        '    type="button"',
        '    appearance=""',
        '    size="s"',
        '    [iconStart]="copied() ? \'@tui.check\' : \'@tui.copy\'"',
        '    [attr.aria-label]="(copied() ? \'Copied \' : \'Copy \') + label()"',
        '    [disabled]="!code()"',
        '    (click)="copy()"',
        '>{{ copied() ? \'Copied\' : \'Copy\' }}</button>',
    ].join('\n'),
})
export class DocsCopyButton {
    private readonly clipboard = inject(Clipboard);

    public readonly code = input('');
    public readonly label = input('code');
    protected readonly copied = signal(false);

    protected copy(): void {
        this.copied.set(this.clipboard.copy(this.code()));
    }
}
