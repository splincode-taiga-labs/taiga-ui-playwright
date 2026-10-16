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
                <p>This experimental library provides Locator-first element objects for Taiga UI. Not yet published to npm.</p>
                <h2>Current harnesses</h2>
                <tui-doc-code filename="playwright.spec.ts" [code]="example" [lineNumbers]="false"><docs-copy-button label="example" [code]="example" /></tui-doc-code>
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
