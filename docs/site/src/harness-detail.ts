import {DOCUMENT} from '@angular/common';
import {Component, computed, effect, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TuiDocCode, TuiDocPage} from '@taiga-ui/addon-doc';
import {TuiLink} from '@taiga-ui/core';

import {DocsCopyButton} from './copy-button';
import {HARNESS_REFERENCES, makeExample} from './harness-reference';

@Component({
    selector: 'harness-detail',
    imports: [TuiDocCode, TuiDocPage, TuiLink, RouterLink, DocsCopyButton],
    template: [
        '@if (reference(); as item) {',
        '  <tui-doc-page [header]="item.api" [package]="item.category" [tags]="[\'Playwright\', \'Done\']">',
        '    <article class="harness-page">',
        '      <p class="page-lead">An exported, tested Locator-first helper for the Taiga UI {{ item.name }} component.</p>',
        '      <p class="reference-links">',
        '        <a tuiLink routerLink="/matrix">Coverage matrix</a>',
        '        <a tuiLink [href]="\'https://github.com/splincode-taiga-labs/taiga-ui-playwright/blob/main/src/\' + item.sourceFile" target="_blank" rel="noopener noreferrer">Source on GitHub ↗</a>',
        '        <a tuiLink [href]="\'https://github.com/taiga-family/taiga-ui/tree/main/\' + upstreamPath()" target="_blank" rel="noopener noreferrer">Taiga UI source ↗</a>',
        '      </p>',
        '      <h2>Import</h2>',
        '      <tui-doc-code filename="import.ts" [lineNumbers]="false" [code]="importCode()">',
        '        <docs-copy-button label="import" [code]="importCode()" />',
        '      </tui-doc-code>',
        '      <h2>Playwright example</h2>',
        '      <p>Replace the example test-id with your component locator. The package is currently private; you can copy its implementation below.</p>',
        '      <tui-doc-code filename="playwright.spec.ts" [lineNumbers]="false" [code]="example()">',
        '        <docs-copy-button label="example" [code]="example()" />',
        '      </tui-doc-code>',
        '      <details class="source-details">',
        '        <summary>Full harness source ({{ item.sourceFile }})</summary>',
        '        <p>The source file may contain other related harnesses. Copy it together with any local imports.</p>',
        '        @if (source()) {',
        '          <tui-doc-code [filename]="item.sourceFile" [lineNumbers]="false" [code]="source()">',
        '            <docs-copy-button label="implementation" [code]="source()" />',
        '          </tui-doc-code>',
        '        } @else {',
        '          <p role="status">Loading the tested implementation…</p>',
        '        }',
        '      </details>',
        '    </article>',
        '  </tui-doc-page>',
        '} @else {',
        '  <tui-doc-page header="Harness not found">',
        '    <p class="harness-page">No verified harness matches this URL. <a tuiLink routerLink="/matrix">Browse the coverage matrix</a>.</p>',
        '  </tui-doc-page>',
        '}',
    ].join('\n'),
})
export class HarnessDetailPage {
    private readonly route = inject(ActivatedRoute);
    private readonly doc = inject(DOCUMENT);
    private readonly params = toSignal(this.route.paramMap, {
        initialValue: this.route.snapshot.paramMap,
    });

    protected readonly reference = computed(() => HARNESS_REFERENCES.find(
        (item) => item.id === this.params().get('category') + '/' + this.params().get('name'),
    ));
    protected readonly source = signal('');
    protected readonly importCode = computed(() =>
        this.reference() ? "import {" + this.reference()!.api + "} from '@taiga-ui-labs/playwright';" : '',
    );
    protected readonly example = computed(() =>
        this.reference() ? makeExample(this.reference()!) : '',
    );
    protected readonly upstreamPath = computed(() => {
        const item = this.reference();
        if (!item) {
            return '';
        }
        const paths: Record<string, string> = {
            Core: 'projects/core/components',
            Kit: 'projects/kit/components',
            Portals: 'projects/core/portals',
            Mobile: 'projects/addon-mobile/components',
            Layout: 'projects/layout/components',
            Table: 'projects/addon-table/components',
            Commerce: 'projects/addon-commerce/components',
        };
        return paths[item.category] + '/' + item.name;
    });

    constructor() {
        effect(() => {
            const item = this.reference();
            this.source.set('');
            if (!item) {
                return;
            }

            const url = new URL('assets/harness-sources/' + item.sourceFile, this.doc.baseURI);
            void fetch(url)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Source could not be loaded.');
                    }
                    return response.text();
                })
                .then((code) => {
                    if (this.reference()?.id === item.id) {
                        this.source.set(code);
                    }
                })
                .catch(() => {
                    if (this.reference()?.id === item.id) {
                        this.source.set('// Unable to load the source file. Open GitHub source instead.');
                    }
                });
        });
    }
}
