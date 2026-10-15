import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiDocMain} from '@taiga-ui/addon-doc';
import {TuiLink} from '@taiga-ui/core';

@Component({
    selector: 'harness-docs',
    imports: [TuiDocMain, RouterLink, TuiLink],
    template: `
        <tui-doc-main>
            <nav ngProjectAs="tuiDocHeader" class="docs-links">
                <a tuiLink routerLink="/">Matrix</a>
                <a tuiLink routerLink="/guide">Guide</a>
                <a
                    tuiLink
                    href="https://github.com/splincode-taiga-labs/taiga-ui-playwright"
                    target="_blank"
                    rel="noopener noreferrer"
                >GitHub ↗</a>
            </nav>
        </tui-doc-main>
    `,
})
export class DocsApp {}
