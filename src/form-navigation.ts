import {expect, type Locator} from '@playwright/test';

export class TuiCounterHarness {
    public constructor(public readonly host: Locator) {}

    public get decrement(): Locator {
        return this.host.locator('button.t-button').first();
    }

    public get increment(): Locator {
        return this.host.locator('button.t-button').last();
    }

    public async increase(): Promise<void> {
        await expect(this.increment).toBeEnabled();
        await this.increment.click();
    }

    public async decrease(): Promise<void> {
        await expect(this.decrement).toBeEnabled();
        await this.decrement.click();
    }

    public async value(): Promise<number> {
        return Number((await this.host.locator('output.t-content').innerText()).trim());
    }
}

/** Selects the real native radio input inside Taiga UI RadioList. */
export class TuiRadioListHarness {
    public constructor(public readonly host: Locator) {}

    public option(name: string): Locator {
        return this.host.getByRole('radio', {name, exact: true});
    }

    public async select(name: string): Promise<void> {
        const option = this.option(name);
        await expect(option).toBeEnabled();
        await option.check();
        await expect(option).toBeChecked();
    }
}

/** Inline control exposes a native input and a mirrored display value. */
export class TuiInputInlineHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input');
    }

    public get mirror(): Locator {
        return this.host.locator('.t-before');
    }

    public async fill(text: string): Promise<void> {
        await this.input.fill(text);
        await expect(this.input).toHaveValue(text);
        await expect(this.mirror).toHaveText(text);
    }
}

/** Taiga Range hosts two native slider thumbs; keyboard changes the array model. */
export class TuiRangeHarness {
    public constructor(public readonly host: Locator) {}

    public get start(): Locator {
        return this.host.locator('input[automation-id="tui-range__left"]');
    }

    public get end(): Locator {
        return this.host.locator('input[automation-id="tui-range__right"]');
    }

    public async stepStartRight(): Promise<void> {
        await expect(this.start).toBeEnabled();
        await this.start.focus();
        await this.start.press('ArrowRight');
    }

    public async stepEndLeft(): Promise<void> {
        await expect(this.end).toBeEnabled();
        await this.end.focus();
        await this.end.press('ArrowLeft');
    }
}

/** Expansion tracks host lifecycle via Taiga UI's _expanded state. */
export class TuiExpandHarness {
    public constructor(public readonly host: Locator) {}

    public async expectExpanded(): Promise<void> {
        await expect(this.host).toHaveClass(/(?:^|\s)_expanded(?:\s|$)/);
        await expect(this.host).toBeVisible();
    }

    public async expectCollapsed(): Promise<void> {
        await expect(this.host).not.toHaveClass(/(?:^|\s)_expanded(?:\s|$)/);
    }
}

export const tuiCounter = (host: Locator): TuiCounterHarness => new TuiCounterHarness(host);
export const tuiRadioList = (host: Locator): TuiRadioListHarness => new TuiRadioListHarness(host);
export const tuiInputInline = (host: Locator): TuiInputInlineHarness => new TuiInputInlineHarness(host);
export const tuiRange = (host: Locator): TuiRangeHarness => new TuiRangeHarness(host);
export const tuiExpand = (host: Locator): TuiExpandHarness => new TuiExpandHarness(host);
