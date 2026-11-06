import {Component} from '@angular/core';
import {TuiDocCode, TuiDocPage} from '@taiga-ui/addon-doc';
import {TuiLink} from '@taiga-ui/core';
import {DocsCopyButton} from './copy-button';

@Component({
    selector: 'getting-started',
    imports: [TuiDocCode, TuiDocPage, TuiLink, DocsCopyButton],
    template: `
        <tui-doc-page header="Getting started" [tags]="['Playwright', 'TypeScript']">
            <article class="guide-page">
                <p>Install @taiga-ui-labs/playwright from npm to test Taiga UI with Playwright. This independent library is experimental.</p>
                <h2>Current harnesses</h2>
                <div class="copyable-code">
                    <div class="copyable-code__toolbar"><docs-copy-button label="example" [code]="example" /></div>
                    <tui-doc-code filename="playwright.spec.ts" [code]="example" [lineNumbers]="false" />
                </div>
                <h2>Taiga UI 4 projects</h2>
                <p>Taiga UI 4 uses <code>@taiga-ui-labs/playwright/v4</code>. The <a tuiLink href="v4/">interactive v4 demo</a> is built from the same Angular workspace used by Playwright. Do not assume the entire v5 catalog is supported on v4.</p>
                <h2>Browse individual harnesses</h2>
                <p>Open the Harnesses section on the left to find a component, copy its import, copy a tested Playwright example or copy its full implementation source.</p>
                <h2>How coverage is tracked</h2>
                <p><strong>Done</strong> means an exported helper exists with Playwright tests. <strong>TODO</strong> means no helper yet. The component list is an upstream directory snapshot for Taiga UI 5.28.</p>
                <p>Use the <a tuiLink href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/10" target="_blank" rel="noopener noreferrer">roadmap ↗</a> to follow work, or request another harness from the matrix.</p>
            </article>
        </tui-doc-page>
    `,
})
export class GettingStartedPage {
    protected readonly example = "import {tuiSelect, tuiComboBox, tuiDialog} from '@taiga-ui-labs/playwright';\n\nconst country = tuiSelect(page.getByTestId('country-field'));\nawait country.selectOption('Estonia');\nawait expect(country.input).toHaveValue('Estonia');\n\nconst city = tuiComboBox(page.getByTestId('city-field'));\nawait city.fill('Tall');\nawait city.selectOption('Tallinn');\n\nconst dialog = tuiDialog(page.locator('tui-dialog'));\nawait dialog.clickButton('Confirm');";
}
