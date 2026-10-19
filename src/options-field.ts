import {expect, type Locator} from '@playwright/test';

/**
 * Taiga UI renders dropdowns in a portal, outside the field's DOM subtree.
 * Prefer the real input's aria-controls association over a page-wide search.
 */
export interface TuiOptionsFieldOptions {
    /** Explicit overlay Locator for custom/unsupported dropdown implementations. */
    readonly overlay?: Locator;
    /** Override when an app renders custom option content. */
    readonly optionSelector?: string;
}

const OVERLAY_SELECTOR =
    'tui-dropdown:visible, tui-dropdown-mobile:visible, tui-sheet-dialog:visible';
// Taiga adds a decorative .t-empty element with tuiOption when no results match.
// Its own keyboard selector explicitly ignores .t-empty as a non-interactive placeholder.
const DEFAULT_OPTION_SELECTOR = 'tui-data-list [tuiOption]:not(.t-empty)';
const AMBIGUOUS_OVERLAY =
    'Cannot identify this field\'s Taiga UI dropdown: multiple overlays are visible. ' +
    'Use an input with aria-controls or pass {overlay: page.locator(...)}.';
const UNOWNED_OVERLAY =
    'Cannot associate the visible Taiga UI dropdown with this field (missing aria-controls). ' +
    'Pass {overlay: page.locator(...)} to scope the interaction.';

function exactText(text: string): RegExp {
    const escaped = text.replace(/[.*+?^$()|[\]{}\\]/g, '\\$&');
    return new RegExp('^\\s*' + escaped + '\\s*$');
}

/** Restrict id lookups to exact attribute matches, not CSS id parsing. */
function idSelector(id: string): string {
    return `[id=${JSON.stringify(id)}]`;
}

export abstract class TuiOptionsField {
    private linkedOverlayId: string | null = null;

    protected constructor(
        public readonly host: Locator,
        private readonly inputSelector: string,
        private readonly config: TuiOptionsFieldOptions = {},
    ) {}

    public get input(): Locator {
        return this.host.locator(this.inputSelector);
    }

    /**
     * Lazy Locator for the last resolved overlay. Call open() or getOverlay()
     * before accessing it when multiple portals can be visible.
     */
    public get overlay(): Locator {
        if (this.config.overlay) {
            return this.config.overlay;
        }

        const portals = this.host.page().locator(OVERLAY_SELECTOR);

        return this.linkedOverlayId
            ? portals.and(this.host.page().locator(idSelector(this.linkedOverlayId)))
            : portals;
    }

    public get options(): Locator {
        return this.overlay.locator(this.config.optionSelector ?? DEFAULT_OPTION_SELECTOR);
    }

    /** Exact case-sensitive visible option, with regexp metacharacters escaped. */
    public option(label: string): Locator {
        return this.options.filter({hasText: exactText(label)}).filter({visible: true});
    }

    /** Re-read aria-controls on every operation; the overlay may be recreated. */
    public async getOverlay(): Promise<Locator> {
        if (this.config.overlay) {
            return this.config.overlay;
        }

        const ids = (await this.input.getAttribute('aria-controls'))?.trim().split(/\s+/);

        if (ids && ids.length > 1) {
            throw new Error('Taiga UI input references multiple overlays in aria-controls. Pass {overlay} explicitly.');
        }

        this.linkedOverlayId = ids?.[0] || null;

        return this.overlay;
    }

    private async isInputFocused(): Promise<boolean> {
        return this.input.evaluate((element) => element === element.ownerDocument.activeElement);
    }

    private async assertUnambiguous(overlay: Locator): Promise<void> {
        if (!this.config.overlay && !this.linkedOverlayId && (await overlay.count()) > 1) {
            throw new Error(AMBIGUOUS_OVERLAY);
        }

        await expect(overlay).toBeVisible();
    }

    /** Waits for a portal to mount. Never toggles an already expanded field closed. */
    public async open(): Promise<void> {
        const overlay = await this.getOverlay();
        const expanded = await this.input.getAttribute('aria-expanded');

        if (expanded === 'true' || (this.config.overlay && await overlay.isVisible())) {
            await this.assertUnambiguous(overlay);
            return;
        }

        if (!this.config.overlay && !this.linkedOverlayId) {
            const visibleCount = await overlay.count();

            if (visibleCount > 1) {
                throw new Error(AMBIGUOUS_OVERLAY);
            }

            if (visibleCount === 1) {
                if (!(await this.isInputFocused())) {
                    throw new Error(UNOWNED_OVERLAY);
                }

                await expect(overlay).toBeVisible();
                return;
            }
        }

        await this.input.click();
        await this.assertUnambiguous(await this.getOverlay());
    }

    public async close(): Promise<void> {
        const overlay = await this.getOverlay();

        if (!this.config.overlay && !this.linkedOverlayId) {
            const visibleCount = await overlay.count();

            if (visibleCount > 1) {
                throw new Error(AMBIGUOUS_OVERLAY);
            }

            if (visibleCount > 0 && !(await this.isInputFocused())) {
                throw new Error(UNOWNED_OVERLAY);
            }
        }

        if (!(await overlay.isVisible())) {
            return;
        }

        await this.input.press('Escape');
        await expect(overlay).toBeHidden();
    }

    /**
     * Choose exactly one visible and enabled item by its full displayed label.
     * Playwright retries while asynchronous items arrive, without fixed sleeps.
     * Duplicate labels fail instead of silently selecting an arbitrary item.
     */
    public async selectOption(label: string): Promise<void> {
        await this.open();

        await expect.poll(async () => {
            const overlay = await this.getOverlay();

            if (!(await overlay.isVisible())) {
                await this.open();
            }

            return this.option(label).count();
        }, {message: `Expected a visible option named "${label}" in the current dropdown`})
            .toBeGreaterThan(0);

        await this.getOverlay();
        const option = this.option(label);
        const matches = await option.count();

        if (matches > 1) {
            throw new Error(`Multiple visible Taiga UI options match "${label}" (${matches}). Scope the option or use its Locator directly.`);
        }

        await expect(option, `Expected a single visible option named "${label}"`).toHaveCount(1);
        await expect(option, `Taiga UI option "${label}" must be enabled`).toBeEnabled();
        await option.click();
    }

    public async getOptionLabels(): Promise<string[]> {
        await this.open();
        return (await this.options.allInnerTexts()).map((label) => label.trim());
    }

    public async getValue(): Promise<string> {
        return this.input.inputValue();
    }
}
