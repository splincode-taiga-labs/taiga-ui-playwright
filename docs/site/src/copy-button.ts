import {Clipboard} from '@angular/cdk/clipboard';
import {DOCUMENT} from '@angular/common';
import {Component, inject, input, signal} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';

/** Copy actions live outside TuiDocCode's own code-action overlay. */
@Component({
    selector: 'docs-copy-button',
    imports: [TuiButton],
    template: `
        <button
            tuiButton
            type="button"
            appearance="flat"
            size="s"
            [iconStart]="state() === 'copied' ? '@tui.check' : '@tui.copy'"
            [attr.aria-label]="(state() === 'copied' ? 'Copied ' : state() === 'failed' ? 'Copy failed: ' : 'Copy ') + label()"
            [disabled]="!code()"
            (click)="copy()"
        >{{ state() === 'copied' ? 'Copied' : state() === 'failed' ? 'Retry copy' : 'Copy' }}</button>
    `,
})
export class DocsCopyButton {
    private readonly clipboard = inject(Clipboard);
    private readonly document = inject(DOCUMENT);

    public readonly code = input('');
    public readonly label = input('code');
    protected readonly state = signal<'idle' | 'copied' | 'failed'>('idle');

    protected async copy(): Promise<void> {
        const code = this.code();
        if (!code) return;

        try {
            // Called synchronously from the click user gesture on secure origins.
            const nativeClipboard = this.document.defaultView?.navigator.clipboard;
            if (nativeClipboard?.writeText) {
                await nativeClipboard.writeText(code);
                this.state.set('copied');
                return;
            }
        } catch {
            // Embedded browsers and denied permissions can require the CDK fallback.
        }

        this.state.set(this.clipboard.copy(code) ? 'copied' : 'failed');
    }
}
