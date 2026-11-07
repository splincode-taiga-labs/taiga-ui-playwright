import {Component, computed, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiDocPage} from '@taiga-ui/addon-doc';
import {TuiInput, TuiLink, TuiTextfield} from '@taiga-ui/core';
import {TuiBadge, TuiSegmented} from '@taiga-ui/kit';

import {HARNESS_CATALOG, type HarnessCategory, type HarnessEntry, type HarnessStatus} from './harness-catalog';
import {HARNESS_REFERENCES} from './harness-reference';
import {V4_CATALOG} from './v4-catalog';

type StatusFilter = 'all' | HarnessStatus;
type GroupFilter = 'All' | HarnessCategory;

@Component({
    selector: 'harness-matrix',
    imports: [TuiDocPage, TuiInput, TuiTextfield, TuiLink, TuiBadge, TuiSegmented, RouterLink],
    template: `
        <tui-doc-page header="Playwright harness matrix" [tags]="['Community', version() === 'v4' ? 'Taiga UI v4' : 'Taiga UI v5']">
            <div class="matrix-page">
                <div class="intro">
                    <div class="eyebrow">TESTING / COVERAGE</div>
                    <h2>Reliable tests, one component at a time.</h2>
                    <p>
                        Locator-first Playwright helpers for Taiga UI. The matrix inventories
                        component inventories for both major versions. <strong>Done</strong>
                        in v5 means an exported and tested helper. <strong>Verified</strong> in v4
                        requires a real v4 browser test; untested behaviors remain TODO.
                    </p>
                    <div class="intro-links">
                        <a tuiLink href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/10" target="_blank" rel="noopener noreferrer">Development roadmap ↗</a>
                        <a tuiLink href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/new" target="_blank" rel="noopener noreferrer">Request a harness ↗</a>
                    </div>
                </div>

                <div class="version-choices" role="region" aria-label="Supported Taiga UI versions">
                    <div class="version-choice" [class.version-choice--current]="version() === 'v5'">
                        <span class="version-choice__eyebrow">COMPONENT CATALOG</span>
                        <h3>Taiga UI 5 <small>v5.28.0</small></h3>
                        <p>{{ v5Total }} catalog helpers · {{ v5Done }} implemented · <strong data-testid="v5-todo">{{ v5Todo }} TODO</strong>. Individual behavior coverage varies.</p>
                        <button type="button" class="version-choice__action" [attr.aria-pressed]="version() === 'v5'" (click)="selectVersion('v5')">View v5 matrix</button>
                    </div>
                    <div class="version-choice" [class.version-choice--current]="version() === 'v4'">
                        <span class="version-choice__eyebrow">COMPATIBILITY</span>
                        <h3>Taiga UI 4 <small>v4.106.0</small></h3>
                        <p>{{ v4Total }} upstream components · {{ v4Verified }} browser-verified · <strong data-testid="v4-todo">{{ v4Todo }} TODO</strong>. The v4 Angular app runs in CI only.</p>
                        <button type="button" class="version-choice__action" [attr.aria-pressed]="version() === 'v4'" (click)="selectVersion('v4')">View v4 matrix</button>
                    </div>
                </div>

                <div class="metrics" [attr.aria-label]="version() === 'v4' ? 'Taiga UI v4 coverage summary' : 'Taiga UI v5 coverage summary'">
                    <div class="metric"><strong data-testid="coverage-total">{{ total() }}</strong><span>Components</span></div>
                    <div class="metric"><strong data-testid="coverage-done">{{ done() }}</strong><span>{{ version() === 'v4' ? 'Verified' : 'Implemented' }}</span></div>
                    <div class="metric"><strong>{{ inProgress() }}</strong><span>In progress</span></div>
                    <div class="metric"><strong data-testid="coverage-todo">{{ todo() }}</strong><span>TODO</span></div>
                </div>
                <div class="progress" role="progressbar" aria-label="Harness coverage" [attr.aria-valuenow]="done()" [attr.aria-valuemax]="total()" aria-valuemin="0">
                    <div [style.width.%]="total() ? done() / total() * 100 : 0"></div>
                </div>
                <div class="summary">{{ (total() ? done() / total() * 100 : 0).toFixed(1) }}% {{ version() === 'v4' ? 'browser-verified · v4 source inventory · Taiga UI 4.106.0' : 'implemented · v5 catalog snapshot · Taiga UI 5.28.0' }}</div>

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
                                @for (category of groups(); track category) {
                                    <option [value]="category">{{ category }}</option>
                                }
                            </select>
                        </label>
                    </div>
                    <tui-segmented class="status-control" aria-label="Filter by status" [activeItemIndex]="statusIndex()" (activeItemIndexChange)="setStatusIndex($event)">
                        @for (item of statuses(); track item) {
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
                                                <a tuiLink [routerLink]="api.route" [queryParams]="version() === 'v4' ? {version: 'v4'} : {}"><code>{{ api.api }}</code> →</a>
                                            } @else {
                                                <a tuiLink [href]="issueUrl(item)" target="_blank" rel="noopener noreferrer">Create issue ↗</a>
                                            }
                                            <a class="source-link" [href]="'https://github.com/taiga-family/taiga-ui/tree/' + (version() === 'v4' ? 'v4.x/' : 'main/') + item.path" target="_blank" rel="noopener noreferrer">Source</a>
                                        </td>
                                    </tr>
                                } @empty {
                                    <tr><td colspan="4" class="no-results">No matching components. Clear the filters to see the full catalog.</td></tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </section>
                <p class="footnote">Unofficial community project. Inventory is derived from upstream component directories, not the number of Angular CDK harnesses or all Taiga UI directives. Some directories are primitives or infrastructure that may not warrant a separate E2E helper. v4 TODO means behavior has not been browser-verified, even when an export exists.</p>
            </div>
        </tui-doc-page>
    `,
})
export class HarnessMatrixPage {
    protected readonly query = signal('');
    protected readonly group = signal<GroupFilter>('All');
    protected readonly statusIndex = signal(0);

    protected readonly version = signal<'v5' | 'v4'>('v5');
    protected readonly v5Total = HARNESS_CATALOG.length;
    protected readonly v5Done = HARNESS_CATALOG.filter((item) => item.status === 'done').length;
    protected readonly v5Todo = HARNESS_CATALOG.filter((item) => item.status === 'todo').length;
    protected readonly v4Total = V4_CATALOG.length;
    protected readonly v4Verified = V4_CATALOG.filter((item) => item.status === 'done').length;
    protected readonly v4Todo = V4_CATALOG.filter((item) => item.status === 'todo').length;
    protected readonly groups = computed<readonly GroupFilter[]>(() => this.version() === 'v4'
        ? ['All', 'Core', 'Kit', 'Mobile', 'Layout', 'Table', 'Commerce']
        : ['All', 'Core', 'Kit', 'Portals', 'Mobile', 'Layout', 'Table', 'Commerce']);
    protected readonly statuses = computed<ReadonlyArray<{value: StatusFilter; label: string}>>(() => [
        {value: 'all', label: 'All'},
        {value: 'done', label: this.version() === 'v4' ? 'Verified' : 'Done'},
        {value: 'in-progress', label: 'In progress'},
        {value: 'todo', label: 'TODO'},
    ]);
    protected readonly catalog = computed<readonly HarnessEntry[]>(() =>
        this.version() === 'v4' ? V4_CATALOG : HARNESS_CATALOG);
    protected readonly total = computed(() => this.catalog().length);
    protected readonly done = computed(() => this.catalog().filter((item) => item.status === 'done').length);
    protected readonly inProgress = computed(() => this.catalog().filter((item) => item.status === 'in-progress').length);
    protected readonly todo = computed(() => this.total() - this.done() - this.inProgress());
    protected readonly filtered = computed(() => {
        const query = this.query().trim().toLowerCase();
        const group = this.group();
        const status = this.statuses()[this.statusIndex()]?.value ?? 'all';

        return this.catalog().filter((item) =>
            (group === 'All' || item.category === group) &&
            (status === 'all' || item.status === status) &&
            (!query || item.name.includes(query) || item.category.toLowerCase().includes(query))
        );
    });

    protected selectVersion(version: 'v5' | 'v4'): void {
        this.version.set(version);
        this.statusIndex.set(0);
        this.group.set('All');
        this.query.set('');
    }

    protected setStatusIndex(value: number): void {
        this.statusIndex.set(value);
    }

    protected statusLabel(status: HarnessStatus): string {
        return status === 'done' ? (this.version() === 'v4' ? 'Verified' : 'Done') : status === 'in-progress' ? 'In progress' : 'TODO';
    }

    protected appearance(status: HarnessStatus): 'positive' | 'info' | 'neutral' {
        return status === 'done' ? 'positive' : status === 'in-progress' ? 'info' : 'neutral';
    }

    protected displayName(name: string): string {
        return name.split('-').map((word) => word[0]?.toUpperCase() + word.slice(1)).join(' ');
    }

    protected implementation(id: string) {
        if (this.version() === 'v4') {
            const api = V4_CATALOG.find((item) => item.id === id)?.api;
            return api ? HARNESS_REFERENCES.find((item) => item.api === api) ?? null : null;
        }
        return HARNESS_REFERENCES.find((item) => item.id === id) ?? null;
    }

    protected issueUrl(item: HarnessEntry): string {
        const title = encodeURIComponent((this.version() === 'v4' ? 'test: verify v4 harness for ' : 'feat: add Playwright harness for ') + item.name);
        const body = encodeURIComponent('Package: ' + item.category + '\nUpstream: https://github.com/taiga-family/taiga-ui/tree/' + (this.version() === 'v4' ? 'v4.x/' : 'main/') + item.path + '\n\nAcceptance criteria:\n- Locator-first helper\n- Real Angular integration tests\n- Documentation and CI');
        return 'https://github.com/splincode-taiga-labs/taiga-ui-playwright/issues/new?title=' + title + '&body=' + body;
    }
}
