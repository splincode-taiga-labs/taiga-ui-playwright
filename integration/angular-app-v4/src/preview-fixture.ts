import {Component, signal} from '@angular/core';
import {TuiPreviewComponent} from '@taiga-ui/kit';

@Component({
    selector: 'app-v4-preview-fixture',
    imports: [TuiPreviewComponent],
    template: `
        <section>
            <h2>Preview</h2>
            <button type="button" (click)="mounted.set(true)">Mount v4 preview</button>
            @if (mounted()) {
                <tui-preview
                    data-testid="v4-preview"
                    style="display:block;width:320px;height:220px"
                    [rotatable]="true"
                    [zoomable]="false"
                >
                    <div style="width:130px;height:110px;padding:12px;background:#eee;color:#222">
                        Preview v4 document
                    </div>
                </tui-preview>
            }
        </section>
    `,
})
export class V4PreviewFixture {
    protected readonly mounted = signal(false);
}
