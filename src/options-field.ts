import {expect, type Locator} from '@playwright/test';

/**
 * Taiga UI renders dropdowns in a portal, outside the field's DOM subtree.
 * When more than one overlay is visible, pass an explicit overlay Locator.
 */
export interface TuiOptionsFieldOptions {
    readonly overlay?: Locator;
    /** Override when an app renders custom option content. */
    readonly optionSelector?: string;
}

const OVERLAY_SELECTOR =
    'tui-dropdown:visible, tui-dropdown-mobile:visible, tui-sheet-dialog:visible';
const DEFAULT_OPTION_SELECTOR = 'tui-data-list [tuiOption]';

function exactText(text: string): RegExp {
    const escaped = text.replace(/[.*+?^$()|[\]{}\\]/g, '\\$&');
    return new RegExp('^\\s*' + escaped + '\\s*$');
}

/** Base for interactive Taiga UI textfields that expose a data-list. */
export abstract class TuiOptionsField {
    protected constructor(
        public readonly host: Locator,
        private readonly inputSelector: string,
        private readonly config: TuiOptionsFieldOptions = {},
    ) {}

    public get input(): Locator {
        return this.host.locator(this.inputSelector);
    }

    /** Lazily resolved; only an open overlay matches by default. */
    public get overlay(): Locator {
        return this.config.overlay ?? this.host.page().locator(OVERLAY_SELECTOR);
    }

    public get options(): Locator {
        return this.overlay.locator(this.config.optionSelector ?? DEFAULT_OPTION_SELECTOR);
    }

    /** Exact, case-sensitive match, escaping regexp metacharacters. */
    public option(label: string): Locator {
        return this.options.filter({hasText: exactText(label)});
    }

    /** Avoid clicking if already open: another click could toggle the dropdown closed. */
    public async open(): Promise<void> {
        if (!(await this.overlay.isVisible())) {
            await this.input.click();
        }

        await expect(this.overlay).toBeVisible();
    }

    public async close(): Promise<void> {
        if (await this.overlay.isVisible()) {
            await this.input.press('Escape');
            await expect(this.overlay).toBeHidden();
        }
    }

    public async selectOption(label: string): Promise<void> {
        await this.open();
        await this.option(label).click();
    }

    public async getOptionLabels(): Promise<string[]> {
        await this.open();
        return (await this.options.allInnerTexts()).map((label) => label.trim());
    }

    public async getValue(): Promise<string> {
        return this.input.inputValue();
    }
}
