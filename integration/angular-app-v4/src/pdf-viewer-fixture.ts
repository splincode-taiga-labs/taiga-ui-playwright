import {Component, inject, signal} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {TuiPdfViewerService} from '@taiga-ui/kit';

@Component({
    selector: 'app-v4-pdf-viewer-fixture',
    template: `
        <section>
            <h2>PdfViewer</h2>
            <button type="button" (click)="show()">Open v4 PDF viewer</button>
            <output data-testid="v4-pdf-viewer-model">{{ status() }}</output>
        </section>
    `,
})
export class V4PdfViewerFixture {
    private readonly viewer = inject(TuiPdfViewerService);
    private readonly sanitizer = inject(DomSanitizer);
    protected readonly status = signal('closed');

    protected show(): void {
        this.status.set('open');
        // about:blank tests the viewer's real iframe and portal without loading a
        // remote PDF, so browser availability does not depend on a document server.
        this.viewer.open(this.sanitizer.bypassSecurityTrustResourceUrl('about:blank'), {
            label: 'Sample v4.pdf',
        }).subscribe({complete: () => this.status.set('closed')});
    }
}
