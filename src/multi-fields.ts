import {expect, type Locator} from '@playwright/test';

const OPTION_SELECTOR = 'tui-data-list [tuiOption]';
const DAY_SELECTOR = 'tui-calendar-sheet [automation-id="tui-calendar-sheet__cell"]:not(.t-cell_unavailable):not(.t-cell_disabled)';

function exactText(label: string): RegExp {
    return new RegExp('^\\s*' + label.replace(/[.*+?^$()|[\]{}\\]/g, '\\$&') + '\\s*$');
}

async function ownedPortal(input: Locator): Promise<Locator> {
    if ((await input.getAttribute('aria-expanded')) !== 'true') {
        await input.click();
    }
    const id = await input.getAttribute('aria-controls');
    if (!id || id.trim().split(/\s+/).length !== 1) {
        throw new Error('Input has no unambiguous aria-controls relationship with its popup.');
    }
    const page = input.page();
    const portal = page.locator('tui-dropdown:visible').and(page.locator('[id=' + JSON.stringify(id) + ']'));
    await expect(portal).toBeVisible();
    return portal;
}

export class TuiMultiSelectHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputChip]');
    }

    public get chips(): Locator {
        return this.host.locator('tui-textfield-item');
    }

    public async selectOption(label: string): Promise<void> {
        const portal = await ownedPortal(this.input);
        const option = portal.locator(OPTION_SELECTOR).filter({hasText: exactText(label)}).filter({visible: true});
        await expect(option).toHaveCount(1);
        await expect(option).toBeEnabled();
        await option.click();
        await expect(this.chips.filter({hasText: exactText(label)})).toHaveCount(1);
    }

    public async selectedLabels(): Promise<string[]> {
        return this.chips.allInnerTexts();
    }
}

export class TuiInputDateMultiHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputDateMulti]');
    }

    public get chips(): Locator {
        return this.host.locator('tui-textfield-item');
    }

    public async toggleDay(day: number): Promise<void> {
        if (!Number.isInteger(day) || day < 1 || day > 31) {
            throw new RangeError('DateMulti day must be an integer from 1 through 31.');
        }
        const portal = await ownedPortal(this.input);
        const cell = portal.locator(DAY_SELECTOR).filter({hasText: exactText(String(day))});
        await expect(cell).toHaveCount(1);
        await cell.click();
    }
}

export class TuiInputRangeHarness {
    public constructor(public readonly host: Locator) {}

    public get start(): Locator {
        return this.host.locator('input[tuiInputNumber]').first();
    }

    public get end(): Locator {
        return this.host.locator('input[tuiInputNumber]').last();
    }

    public get range(): Locator {
        return this.host.locator('tui-range');
    }

    public async setStart(value: number): Promise<void> {
        if (!Number.isFinite(value)) {
            throw new RangeError('Start must be a finite number.');
        }
        await expect(this.start).toBeEnabled();
        await this.start.fill(String(value));
        await this.start.press('Tab');
        await expect(this.start).toHaveValue(String(value));
    }

    public async setEnd(value: number): Promise<void> {
        if (!Number.isFinite(value)) {
            throw new RangeError('End must be a finite number.');
        }
        await expect(this.end).toBeEnabled();
        await this.end.fill(String(value));
        await this.end.press('Tab');
        await expect(this.end).toHaveValue(String(value));
    }
}

export const tuiMultiSelect = (host: Locator): TuiMultiSelectHarness => new TuiMultiSelectHarness(host);
export const tuiInputDateMulti = (host: Locator): TuiInputDateMultiHarness => new TuiInputDateMultiHarness(host);
export const tuiInputRange = (host: Locator): TuiInputRangeHarness => new TuiInputRangeHarness(host);
