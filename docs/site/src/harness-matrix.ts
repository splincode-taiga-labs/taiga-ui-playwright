import {Component, computed, signal} from '@angular/core';
import {TuiDocPage} from '@taiga-ui/addon-doc';
import {TuiInput, TuiLink, TuiTextfield} from '@taiga-ui/core';
import {TuiBadge, TuiSegmented} from '@taiga-ui/kit';

import {HARNESS_CATALOG, IMPLEMENTATIONS, type HarnessCategory, type HarnessEntry, type HarnessStatus} from './harness-catalog';

type StatusFilter = 'all' | HarnessStatus;
type GroupFilter = 'All' | HarnessCategory;

@Component({
    selector: 'harness-matrix',
    imports: [TuiDocPage, TuiInput, TuiTextfield, TuiLink, TuiBadge, TuiSegmented],
    template: `
        <tui-doc-page header="Playwright harness matrix" [tags]="['Community', 'Taiga UI v5']">
            <div class="matrix-page">
                <div class="intro">
                    <div class="eyebrow">TESTING / COVERAGE</div>
                    <h2>Reliable tests, one component at a time.</h2>
                    <p>
                        Locator-first Playwright helpers for Taiga UI. The matrix inventories
                        component directories across seven upstream packages. <strong>Done</strong>
                        means an actual helper is exported and tested; everything else is
                        clearly marked TODO.
                    </p>
                    <div class="intro-links">
                        <a tuiLink href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/10" target="_blank" rel="noopener noreferrer">Development roadmap ↗</a>
                        <a tuiLink href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/new" target="_blank" rel="noopener noreferrer">Request a harness ↗</a>
                    </div>
                </div>

                <div class="metrics" aria-label="Coverage summary">
                    <div class="metric"><strong data-testid="coverage-total">{{ total }}</strong><span>Components</span></div>
                    <div class="metric"><strong data-testid="coverage-done">{{ done }}</strong><span>Implemented</span></div>
                    <div class="metric"><strong>{{ inProgress }}</strong><span>In progress</span></div>
                    <div class="metric"><strong>{{ todo }}</strong><span>TODO</span></div>
                </div>
                <div class="progress" role="progressbar" aria-label="Harness coverage" [attr.aria-valuenow]="done" [attr.aria-valuemax]="total" aria-valuemin="0">
                    <div [style.width.%]="done / total * 100"></div>
                </div>
                <div class="summary">{{ (done / total * 100).toFixed(1) }}% implemented · Catalog snapshot: Taiga UI v5.28.0 · Updated manually with each merged helper</div>

                <section aria-labelledby="coverage-heading">
                    <div class="section-heading">
                        <div>
                            <h2 id="coverage-heading">Component inventory</h2>
                            <p>Search and filter to find what's ready and what's next.</p>
                        </div>
                        <span class="result-count" data-testid="filtered-count">{{ filtered().length }} results</span>
                    </div>
                    <div class="filters">
                        <tui-textfield class="search">
                            <input
                                tuiInput
                                aria-label="Search components"
                                placeholder="Search components or package"
                                [value]="query()"
                                (input)="query.set($any($event.target).value)"
                            />
                        </tui-textfield>
                        <label class="select-label">
                            Package
                            <select
                                aria-label="Filter by package"
                                [value]="group()"
                                (change)="group.set($any($event.target).value)"
                            >
                                @for (category of groups; track category) {
                                    <option [value]="category">{{ category }}</option>
                                }
                            </select>
                        </label>
                    </div>
                    <tui-segmented class="status-control" aria-label="Filter by status" [activeItemIndex]="statusIndex()" (activeItemIndexChange)="setStatusIndex($event)">
                        @for (item of statuses; track item) {
                            <button type="button">{{ item.label }}</button>
                        }
                    </tui-segmented>

                    <div class="table-scroll">
                        <table class="coverage-table">
                            <thead><tr><th scope="col">Component</th><th scope="col">Package</th><th scope="col">Coverage</th><th scope="col">Implementation / Action</th></tr></thead>
                            <tbody>
                                @for (item of filtered(); track item.id) {
                                    <tr [attr.data-harness]="item.id" [attr.data-status]="item.status">
                                        <td><strong>{{ displayName(item.name) }}</strong><small>{{ item.name }}</small></td>
                                        <td>{{ item.category }}</td>
                                        <td><span tuiBadge size="s" [appearance]="appearance(item.status)">{{ statusLabel(item.status) }}</span></td>
                                        <td>
                                            @if (implementation(item.id); as api) {
                                                <a tuiLink [href]="'https://github.com/splincode-taiga-labs/taiga-ui-playwright/tree/main/src/' + api.file" target="_blank" rel="noopener noreferrer"><code>{{ api.name }}</code> ↗</a>
                                            } @else {
                                                <a tuiLink [href]="issueUrl(item)" target="_blank" rel="noopener noreferrer">Create issue ↗</a>
                                            }
                                            <a class="source-link" [href]="'https://github.com/taiga-family/taiga-ui/tree/main/' + item.path" target="_blank" rel="noopener noreferrer">Source</a>
                                        </td>
                                    </tr>
                                } @empty {
                                    <tr><td colspan="4" class="no-results">No matching components. Clear the filters to see the full catalog.</td></tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </section>
                <p class="footnote">Unofficial community project. Inventory is derived from upstream component directories, not the number of Angular CDK harnesses or all Taiga UI directives. Some directories are primitives or infrastructure that may not warrant a separate E2E helper.</p>
            </div>
        </tui-doc-page>
    `,
})
export class HarnessMatrixPage {
    protected readonly query = signal('');
    protected readonly group = signal<GroupFilter>('All');
    protected readonly statusIndex = signal(0);

    protected readonly groups: readonly GroupFilter[] = ['All', 'Core', 'Kit', 'Portals', 'Mobile', 'Layout', 'Table', 'Commerce'];
    protected readonly statuses: ReadonlyArray<{value: StatusFilter; label: string}> = [
        {value: 'all', label: 'All'},
        {value: 'done', label: 'Done'},
        {value: 'in-progress', label: 'In progress'},
        {value: 'todo', label: 'TODO'},
    ];

    protected readonly total = HARNESS_CATALOG.length;
    protected readonly done = HARNESS_CATALOG.filter((item) => item.status === 'done').length;
    protected readonly inProgress = HARNESS_CATALOG.filter((item) => item.status === 'in-progress').length;
    protected readonly todo = this.total - this.done - this.inProgress;
    protected readonly filtered = computed(() => {
        const query = this.query().trim().toLowerCase();
        const group = this.group();
        const status = this.statuses[this.statusIndex()]?.value ?? 'all';

        return HARNESS_CATALOG.filter((item) =>
            (group === 'All' || item.category === group) &&
            (status === 'all' || item.status === status) &&
            (!query || item.name.includes(query) || item.category.toLowerCase().includes(query))
        );
    });

    protected setStatusIndex(value: number): void {
        this.statusIndex.set(value);
    }

    protected statusLabel(status: HarnessStatus): string {
        return status === 'done' ? 'Done' : status === 'in-progress' ? 'In progress' : 'TODO';
    }

    protected appearance(status: HarnessStatus): 'positive' | 'info' | 'neutral' {
        return status === 'done' ? 'positive' : status === 'in-progress' ? 'info' : 'neutral';
    }

    protected displayName(name: string): string {
        return name.split('-').map((word) => word[0]?.toUpperCase() + word.slice(1)).join(' ');
    }

    protected implementation(id: string): {name: string; file: string} | null {
        const name = IMPLEMENTATIONS[id];
        if (!name) {
            return null;
        }
        const file = id === 'kit/combo-box' ? 'combo-box.ts' : id === 'kit/select' ? 'select.ts' : id === 'portals/dialog' ? 'dialog.ts' : 'basic-harnesses.ts';
        return {name, file};
    }

    protected issueUrl(item: HarnessEntry): string {
        const title = encodeURIComponent('feat: add Playwright harness for ' + item.name);
        const body = encodeURIComponent('Package: ' + item.category + '\nUpstream: https://github.com/taiga-family/taiga-ui/tree/main/' + item.path + '\n\nAcceptance criteria:\n- Locator-first helper\n- Real Angular integration tests\n- Documentation and CI');
        return 'https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/new?title=' + title + '&body=' + body;
    }
}
