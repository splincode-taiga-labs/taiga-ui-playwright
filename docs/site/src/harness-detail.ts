import {Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TuiDocCode, TuiDocPage} from '@taiga-ui/addon-doc';
import {TuiLink} from '@taiga-ui/core';

import {DocsCopyButton} from './copy-button';
import {HARNESS_REFERENCES, makeExample} from './harness-reference';
import {V4_CATALOG} from './v4-catalog';

@Component({
    selector: 'harness-detail',
    imports: [TuiDocCode, TuiDocPage, TuiLink, RouterLink, DocsCopyButton],
    template: `
@if (reference(); as item) {
  <tui-doc-page [header]="item.api" [package]="item.category" [tags]="['Playwright', version() === 'v4' ? (v4Coverage() === 'verified' ? 'Verified' : 'TODO') : 'Done']">
    <article class="harness-page">
      <div class="harness-version-switch" role="group" aria-label="Taiga UI version">
        <button type="button" [attr.aria-pressed]="version() === 'v5'" (click)="changeVersion('v5')">Taiga UI 5</button>
        <button type="button" [attr.aria-pressed]="version() === 'v4'" (click)="changeVersion('v4')">Taiga UI 4</button>
      </div>
      <p class="page-lead">Locator-first Playwright helper for the Taiga UI {{ item.name }} component.</p>
      @if (version() === 'v4') {
        @if (v4Coverage() === 'verified') {
          <p class="compatibility-note">Browser-verified with Taiga UI 4.106.0 using the /v4 npm entrypoint.</p>
        } @else if (v4Coverage() === 'todo') {
          <p class="compatibility-note">TODO: v4 DOM behavior has not been browser-verified. The /v4 import exists, but this example needs a real v4 integration test.</p>
        } @else {
          <p class="compatibility-note">No matching v4 component in the upstream v4 inventory. This /v4 import is exposed but compatibility is unknown.</p>
        }
        @if (item.api === 'tuiAccordion') {
          <p class="compatibility-note">v4 Accordion uses <code>tui-accordion-item</code> headers and the <code>t-header_open</code> class instead of v5 aria-expanded attributes. The /v4 adapter handles those differences. <a tuiLink href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/blob/main/v4/src/accordion.ts" target="_blank" rel="noopener noreferrer">View v4 adapter ↗</a></p>
        }
        @if (item.api === 'tuiAvatar') {
          <p class="compatibility-note">v4 Avatar uses the <code>_round</code> class and <code>data-type</code> instead of the v5 DOM attributes. The /v4 adapter handles these differences. <a tuiLink href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/blob/main/v4/src/avatar.ts" target="_blank" rel="noopener noreferrer">View v4 adapter ↗</a></p>
        }
        @if (item.api === 'tuiComboBox') {
          <p class="compatibility-note">v4 ComboBox can clear incomplete text on blur in strict mode. When filtering leaves one option, the /v4 adapter selects it with the native Enter handler. <a tuiLink href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/blob/main/v4/src/combo-box.ts" target="_blank" rel="noopener noreferrer">View v4 adapter ↗</a></p>
        }
        @if (item.api === 'tuiDialog') {
          <p class="compatibility-note">v4 Dialog has a different heading and close-button locator. The /v4 adapter handles both. <a tuiLink href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/blob/main/v4/src/dialog.ts" target="_blank" rel="noopener noreferrer">View v4 adapter ↗</a></p>
        }
      }
      <p class="reference-links">
        <a tuiLink routerLink="/matrix">Coverage matrix</a>
        <a tuiLink [href]="'https://github.com/splincode-taiga-labs/taiga-ui-playwright/blob/main/src/' + item.sourceFile" target="_blank" rel="noopener noreferrer">Source on GitHub ↗</a>
        @if (version() === 'v5' || v4Entry()) {
          <a tuiLink [href]="'https://github.com/taiga-family/taiga-ui/tree/' + (version() === 'v4' ? 'v4.x/' : 'main/') + upstreamPath()" target="_blank" rel="noopener noreferrer">Taiga UI source ↗</a>
        }
      </p>
      <h2>Playwright example</h2>
      <p>Replace the example test-id with your application locator. Choose the installed Taiga UI major version above. Only browser-verified v4 behaviors are confirmed by the v4 test suite.</p>
      <div class="copyable-code">
        <div class="copyable-code__toolbar"><docs-copy-button label="example" [code]="example()" /></div>
        <tui-doc-code filename="test.pw.spec.ts" [lineNumbers]="false" [code]="example()" />
      </div>
    </article>
  </tui-doc-page>
} @else {
  <tui-doc-page header="Harness not found">
    <p class="harness-page">No verified harness matches this URL. <a tuiLink routerLink="/matrix">Browse the coverage matrix</a>.</p>
  </tui-doc-page>
}
    `,
})
export class HarnessDetailPage {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly params = toSignal(this.route.paramMap, {
        initialValue: this.route.snapshot.paramMap,
    });

    protected readonly reference = computed(() => HARNESS_REFERENCES.find(
        (item) => item.id === this.params().get('category') + '/' + this.params().get('name'),
    ));
    private readonly queryParams = toSignal(this.route.queryParamMap, {
        initialValue: this.route.snapshot.queryParamMap,
    });
    protected readonly version = computed<'v5' | 'v4'>(() =>
        this.queryParams().get('version') === 'v4' ? 'v4' : 'v5');
    protected readonly v4Entry = computed(() =>
        V4_CATALOG.find((item) => item.api === this.reference()?.api));
    protected readonly v4Coverage = computed(() =>
        this.v4Entry() ? (this.v4Entry()!.status === 'done' ? 'verified' : 'todo') : 'unmapped');
    protected readonly example = computed(() =>
        this.reference() ? makeExample(this.reference()!, this.version()) : '',
    );
    protected readonly upstreamPath = computed(() => {
        const item = this.reference();
        if (this.version() === 'v4' && this.v4Entry()) {
            return this.v4Entry()!.path;
        }
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

    protected changeVersion(version: 'v5' | 'v4'): void {
        void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {version},
            queryParamsHandling: 'merge',
        });
    }

}
