import {Component} from '@angular/core';
import {TuiDocPage} from '@taiga-ui/addon-doc';
import {TuiLink} from '@taiga-ui/core';

@Component({
    selector: 'getting-started',
    imports: [TuiDocPage, TuiLink],
    template: `
        <tui-doc-page header="Getting started" [tags]="['Playwright', 'TypeScript']">
            <article class="guide-page">
                <p>This experimental library provides Locator-first element objects for Taiga UI. Not yet published to npm.</p>
                <h2>Current harnesses</h2>
                <pre><code>import {tuiSelect, tuiComboBox, tuiDialog} from '@taiga-ui-labs/playwright';

const country = tuiSelect(page.getByTestId('country-field'));
await country.selectOption('Estonia');
await expect(country.input).toHaveValue('Estonia');

const city = tuiComboBox(page.getByTestId('city-field'));
await city.fill('Tall');
await city.selectOption('Tallinn');

const dialog = tuiDialog(page.locator('tui-dialog'));
await dialog.clickButton('Confirm');</code></pre>
                <h2>How coverage is tracked</h2>
                <p><strong>Done</strong> means an exported helper exists with Playwright tests. <strong>TODO</strong> means no helper yet. The component list is an upstream directory snapshot for Taiga UI 5.28.</p>
                <p>Use the <a tuiLink href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/10" target="_blank" rel="noopener noreferrer">roadmap ↗</a> to follow work, or request another harness from the matrix.</p>
            </article>
        </tui-doc-page>
    `,
})
export class GettingStartedPage {}
