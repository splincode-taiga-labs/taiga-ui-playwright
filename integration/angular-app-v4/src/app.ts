import {Component, inject, signal} from '@angular/core';

import {V4_COMPONENTS} from './component-inventory';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiDay, TuiItem} from '@taiga-ui/cdk';
import {
    TuiButton,
    TuiCalendar,
    TuiDialogService,
    TuiExpandComponent,
    TuiLink,
    TuiLoader,
    TuiRoot,
    TuiSelectLike,
    TuiTextfield,
    TuiTextfieldDropdownDirective,
} from '@taiga-ui/core';
import {
    TuiAccordion,
    TuiAvatar,
    TuiBadge,
    TuiBreadcrumbs,
    TuiBadgeNotification,
    TuiCheckbox,
    TuiChip,
    TuiChevron,
    TuiComboBox,
    TuiInputChip,
    TuiInputDate,
    TuiMultiSelect,
    TuiDataListWrapper,
    TuiFilterByInputPipe,
    TuiInputNumberDirective,
    TuiLike,
    TuiPagination,
    TuiProgressBar,
    TuiRating,
    TuiRadioComponent,
    TuiSegmented,
    TuiSelect,
    TuiStep,
    TuiStepperComponent,
    TuiSwitch,
    TuiTab,
    TuiTabsHorizontal,
    TuiTextarea,
} from '@taiga-ui/kit';

@Component({
    selector: 'app-demo-v4',
    imports: [
        ReactiveFormsModule,
        TuiRoot,
        TuiTextfield,
        TuiTextfieldDropdownDirective,
        TuiButton,
        TuiCalendar,
        TuiSelectLike,
        TuiInputDate,
        TuiInputChip,
        TuiMultiSelect,
        TuiLink,
        TuiLoader,
        TuiExpandComponent,
        TuiAccordion,
        TuiAvatar,
        TuiBadge,
        TuiBreadcrumbs,
        TuiBadgeNotification,
        TuiChip,
        TuiItem,
        TuiLike,
        TuiProgressBar,
        TuiChevron,
        TuiSelect,
        TuiDataListWrapper,
        TuiComboBox,
        TuiFilterByInputPipe,
        TuiCheckbox,
        TuiRating,
        TuiRadioComponent,
        TuiSwitch,
        TuiTab,
        TuiTabsHorizontal,
        TuiSegmented,
        TuiTextarea,
        TuiPagination,
        TuiStepperComponent,
        TuiStep,
        TuiInputNumberDirective,
    ],
    template: `
        <tui-root>
            <header class="demo-header">
                <a href="../">← Back to Taiga UI 5 docs</a>
                <span>Taiga UI 4.106.0 · Angular 20.3.0</span>
            </header>
            <main>
                <p class="eyebrow">INTERACTIVE COMPATIBILITY</p>
                <h1>Taiga UI 4 demo</h1>
                <p class="intro">
                    Real Taiga UI 4 components. Use these controls to explore the
                    same Angular application that our Playwright tests run against.
                </p>
                <p class="notice">
                    <strong>Tested controls, not blanket v4 compatibility.</strong>
                    This demo exercises 29 real Taiga UI controls with the packaged /v4 API
                    in Chromium on 4.106.0. Other components and earlier 4.x versions
                    still need their own integration tests.
                </p>
                <details class="component-inventory">
                    <summary>Browse the Taiga UI 4 component inventory ({{ componentInventory.length }} directories; {{ verifiedCount }} browser-verified)</summary>
                    <p>Actual upstream v4.x component directories from Core, Kit, Mobile, Layout, Table and Commerce.
                       Directives, pipes, legacy and experimental packages are excluded. An exported helper alone does not mean verified behavior.</p>
                    <div class="inventory-scroll">
                        <table>
                            <thead><tr><th>Package</th><th>Component</th><th>Harness</th><th>Browser test</th></tr></thead>
                            <tbody>
                                @for (item of componentInventory; track item.path) {
                                    <tr [attr.data-v4-component]="item.group + '/' + item.name" [attr.data-verified]="item.verified">
                                        <td>{{ item.group }}</td>
                                        <td><a [href]="'https://github.com/taiga-family/taiga-ui/tree/v4.x/' + item.path" target="_blank" rel="noopener noreferrer">{{ item.name }}</a></td>
                                        <td>@if (item.helper) { <code>{{ item.helper }}</code> } @else { — }</td>
                                        <td>{{ item.verified ? 'Verified' : 'Not verified' }}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </details>
                <h2>Playwright import</h2>
                <pre><code [textContent]="importCode"></code></pre>
                <h2>Button</h2>
                <button tuiButton type="button" data-testid="save-button" (click)="save()">
                    Save
                </button>
                <output data-testid="save-model">{{ saved() }}</output>

                <section>
                    <h2>Select</h2>
                    <tui-textfield data-testid="country-field" tuiChevron>
                        <input aria-label="Country" tuiSelect [formControl]="country" />
                        <tui-data-list-wrapper new *tuiTextfieldDropdown [items]="countries" />
                    </tui-textfield>
                    <output data-testid="country-model">{{ country.value ?? 'null' }}</output>
                </section>
                <section>
                    <h2>ComboBox</h2>
                    <tui-textfield data-testid="city-field" tuiChevron>
                        <input aria-label="City" tuiComboBox [formControl]="city" />
                        <tui-data-list-wrapper new *tuiTextfieldDropdown [items]="cities | tuiFilterByInput" />
                    </tui-textfield>
                    <output data-testid="city-model">{{ city.value ?? 'null' }}</output>
                </section>

                <section>
                    <h2>Checkbox</h2>
                    <label><input tuiCheckbox type="checkbox" data-testid="checkbox" [formControl]="accepted" /> Accept terms</label>
                    <output data-testid="checkbox-model">{{ accepted.value }}</output>
                </section>
                <section>
                    <h2>Radio</h2>
                    <label><input tuiRadio type="radio" name="plan" value="basic" data-testid="radio-basic" [formControl]="plan" /> Basic</label>
                    <label><input tuiRadio type="radio" name="plan" value="pro" data-testid="radio-pro" [formControl]="plan" /> Pro</label>
                    <output data-testid="radio-model">{{ plan.value }}</output>
                </section>
                <section>
                    <h2>Switch</h2>
                    <label><input tuiSwitch type="checkbox" data-testid="switch" [formControl]="enabled" /> Notifications</label>
                    <output data-testid="switch-model">{{ enabled.value }}</output>
                </section>
                <section>
                    <h2>Tabs</h2>
                    <nav tuiTabs data-testid="tabs" [(activeItemIndex)]="activeTab">
                        <button tuiTab type="button">Overview</button>
                        <button tuiTab type="button">Details</button>
                    </nav>
                    <output data-testid="tabs-model">{{ activeTab }}</output>
                </section>
                <section>
                    <h2>Segmented</h2>
                    <tui-segmented data-testid="segmented" [(activeItemIndex)]="activeSegment">
                        <button type="button">List</button>
                        <button type="button">Cards</button>
                    </tui-segmented>
                    <output data-testid="segmented-model">{{ activeSegment }}</output>
                </section>
                <section>
                    <h2>Textarea</h2>
                    <tui-textfield data-testid="notes-field">
                        <textarea tuiTextarea aria-label="Notes" [formControl]="notes"></textarea>
                    </tui-textfield>
                    <output data-testid="notes-model">{{ notes.value }}</output>
                </section>
                <section>
                    <h2>Pagination</h2>
                    <tui-pagination data-testid="pagination" [length]="4" [(index)]="pageIndex" />
                    <output data-testid="pagination-model">{{ pageIndex }}</output>
                </section>
                <section>
                    <h2>Stepper</h2>
                    <tui-stepper data-testid="stepper" [(activeItemIndex)]="stepIndex">
                        <button tuiStep type="button">Plan</button>
                        <button tuiStep type="button">Review</button>
                        <button tuiStep type="button">Done</button>
                    </tui-stepper>
                    <output data-testid="stepper-model">{{ stepIndex }}</output>
                </section>
                <section>
                    <h2>InputNumber</h2>
                    <tui-textfield data-testid="number-field">
                        <input tuiInputNumber aria-label="Amount" [formControl]="amount" />
                    </tui-textfield>
                    <output data-testid="number-model">{{ amount.value }}</output>
                </section>

                <section>
                    <h2>Link</h2>
                    <a tuiLink href="#v4-link-target" data-testid="link">Go to target</a>
                    <p id="v4-link-target">V4 link target</p>
                </section>
                <section>
                    <h2>Badge</h2>
                    <span tuiBadge appearance="primary" size="m" data-testid="badge">Active</span>
                </section>
                <section>
                    <h2>Chip</h2>
                    <span tuiChip appearance="neutral" size="s" data-testid="chip">Angular</span>
                </section>
                <section>
                    <h2>BadgeNotification</h2>
                    <tui-badge-notification size="l" data-testid="notification-badge">7</tui-badge-notification>
                </section>
                <section>
                    <h2>Like</h2>
                    <label><input tuiLike type="checkbox" data-testid="like" [formControl]="liked" /> Like</label>
                    <output data-testid="like-model">{{ liked.value }}</output>
                </section>
                <section>
                    <h2>Progress</h2>
                    <progress tuiProgressBar data-testid="progress" [value]="progress()" max="100"></progress>
                    <button tuiButton type="button" (click)="progress.set(75)">Set progress to 75</button>
                    <output data-testid="progress-model">{{ progress() }}</output>
                </section>
                <section>
                    <h2>Loader</h2>
                    <tui-loader data-testid="loader" [showLoader]="loading()">Loading content</tui-loader>
                    <button tuiButton type="button" (click)="loading.set(!loading())">Toggle loading</button>
                </section>
                <section>
                    <h2>Expand</h2>
                    <button tuiButton type="button" (click)="expanded.set(!expanded())">Toggle section</button>
                    <tui-expand data-testid="expand" [expanded]="expanded()">Expandable content</tui-expand>
                </section>
                <section>
                    <h2>Avatar</h2>
                    <tui-avatar data-testid="avatar" [round]="false" size="m">AB</tui-avatar>
                    <tui-avatar data-testid="avatar-round" size="s">CD</tui-avatar>
                </section>
                <section>
                    <h2>Textfield</h2>
                    <p>The existing numeric input uses the real Taiga UI 4 textfield.</p>
                    <button tuiButton type="button" (click)="amount.setValue(12)">Set amount</button>
                </section>

                <section>
                    <h2>Calendar</h2>
                    <tui-calendar data-testid="v4-calendar" [value]="calendarValue()" (dayClick)="calendarValue.set($event)" />
                    <output data-testid="v4-calendar-model">{{ calendarValue()?.year }}-{{ calendarValue()?.month }}-{{ calendarValue()?.day }}</output>
                </section>
                <section>
                    <h2>InputDate</h2>
                    <tui-textfield data-testid="v4-date-field">
                        <input tuiInputDate aria-label="Appointment date" [formControl]="appointmentDate" />
                        <tui-calendar *tuiTextfieldDropdown />
                    </tui-textfield>
                    <output data-testid="v4-date-model">{{ appointmentDate.value?.year }}-{{ appointmentDate.value?.month }}-{{ appointmentDate.value?.day }}</output>
                </section>
                <section>
                    <h2>MultiSelect</h2>
                    <tui-textfield multi tuiChevron data-testid="v4-multi-field">
                        <input tuiInputChip tuiSelectLike aria-label="Countries" [formControl]="selectedCountries" />
                        <tui-data-list-wrapper new tuiMultiSelectGroup *tuiTextfieldDropdown [items]="multiCountriesOptions" />
                    </tui-textfield>
                    <output data-testid="v4-multi-model">{{ selectedCountries.value.join(',') }}</output>
                </section>
                <section>
                    <h2>Dialog</h2>
                    <button tuiButton type="button" (click)="showConfirmation()">Open v4 dialog</button>
                    <output data-testid="v4-dialog-model">{{ dialogResult() }}</output>
                </section>
                <section>
                    <h2>Accordion</h2>
                    <tui-accordion data-testid="v4-accordion">
                        <tui-accordion-item [(open)]="deliveryOpen">
                            Delivery
                            <ng-template tuiAccordionItemContent>Delivery details</ng-template>
                        </tui-accordion-item>
                        <tui-accordion-item [(open)]="paymentOpen">
                            Payment
                            <ng-template tuiAccordionItemContent>Payment details</ng-template>
                        </tui-accordion-item>
                    </tui-accordion>
                    <output data-testid="v4-accordion-model">{{ deliveryOpen }} / {{ paymentOpen }}</output>
                </section>
                <section>
                    <h2>Rating</h2>
                    <tui-rating aria-label="Service rating" data-testid="v4-rating" [formControl]="rating" />
                    <output data-testid="v4-rating-model">{{ rating.value }}</output>
                </section>
                <section>
                    <h2>Breadcrumbs</h2>
                    <tui-breadcrumbs size="m" data-testid="v4-breadcrumbs">
                        <ng-container *tuiItem><a tuiLink href="#v4-breadcrumb-start">Home</a></ng-container>
                        <ng-container *tuiItem><a tuiLink href="#v4-breadcrumb-target">Preferences</a></ng-container>
                    </tui-breadcrumbs>
                    <p id="v4-breadcrumb-target">Preferences target</p>
                </section>
                <p class="footnote">
                    Open source · <a href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/blob/main/compatibility/v4.spec.ts"
                        target="_blank" rel="noopener noreferrer">Playwright tests ↗</a>
                    · <a href="https://github.com/splincode-taiga-labs/taiga-ui-playwright/tree/main/integration/angular-app-v4"
                        target="_blank" rel="noopener noreferrer">Demo source ↗</a>
                </p>
            </main>
        </tui-root>
`,
})
export class DemoV4 {
    private readonly dialog = inject(TuiDialogService);
    protected readonly importCode = "import {tuiButton, tuiSelect, tuiComboBox, tuiCheckbox, tuiRadio, tuiSwitch, tuiTabs, tuiSegmented, tuiTextarea, tuiPagination, tuiStepper, tuiInputNumber, tuiLink, tuiBadge, tuiChip, tuiBadgeNotification, tuiLike, tuiProgress, tuiLoader, tuiExpand, tuiAvatar, tuiTextfield, tuiCalendar, tuiInputDate, tuiMultiSelect, tuiDialog, tuiAccordion, tuiRating, tuiBreadcrumbs} from '@taiga-ui-labs/playwright/v4';";
    protected readonly componentInventory = V4_COMPONENTS;
    protected readonly verifiedCount = V4_COMPONENTS.filter((component) => component.verified).length;
    protected readonly countries = ['Austria', 'Estonia'];
    protected readonly cities = ['Tallinn', 'Vienna'];
    protected readonly country = new FormControl<string | null>(null);
    protected readonly city = new FormControl<string | null>(null);
    protected readonly saved = signal(0);
    protected readonly accepted = new FormControl(false, {nonNullable: true});
    protected readonly plan = new FormControl('basic', {nonNullable: true});
    protected readonly enabled = new FormControl(false, {nonNullable: true});
    protected readonly notes = new FormControl('', {nonNullable: true});
    protected readonly amount = new FormControl<number | null>(null);
    protected readonly liked = new FormControl(false, {nonNullable: true});
    protected readonly progress = signal(25);
    protected readonly loading = signal(true);
    protected readonly expanded = signal(false);
    protected readonly calendarValue = signal<TuiDay | null>(new TuiDay(2026, 0, 15));
    protected readonly appointmentDate = new FormControl<TuiDay | null>(new TuiDay(2026, 0, 15));
    protected readonly multiCountriesOptions = ['Austria', 'Estonia', 'Latvia'];
    protected readonly selectedCountries = new FormControl<string[]>([], {nonNullable: true});
    protected readonly dialogResult = signal('pending');
    protected readonly rating = new FormControl(0, {nonNullable: true});
    protected deliveryOpen = false;
    protected paymentOpen = false;
    protected activeTab = 0;
    protected activeSegment = 0;
    protected pageIndex = 0;
    protected stepIndex = 0;

    protected showConfirmation(): void {
        this.dialogResult.set('pending');
        this.dialog.open('Confirm the operation?', {
            label: 'V4 confirmation',
            data: {button: 'Confirm'},
        }).subscribe({complete: () => this.dialogResult.set('closed')});
    }

    protected save(): void {
        this.saved.update((value) => value + 1);
    }
}
