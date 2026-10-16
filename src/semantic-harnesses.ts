import {expect, type Locator} from '@playwright/test';

/** Real spin arrows reflect bounds through Taiga UI's hidden-arrow classes. */
export class TuiSpinButtonHarness {
    public constructor(public readonly host: Locator) {}

    public get previous(): Locator {
        return this.host.locator('[automation-id="tui-spin-button__left"]');
    }

    public get next(): Locator {
        return this.host.locator('[automation-id="tui-spin-button__right"]');
    }

    public async increase(): Promise<void> {
        await expect(this.next).not.toHaveClass(/t-button_hidden/);
        await this.next.click();
    }

    public async decrease(): Promise<void> {
        await expect(this.previous).not.toHaveClass(/t-button_hidden/);
        await this.previous.click();
    }

    public async arrowRight(): Promise<void> {
        await expect(this.next).not.toHaveClass(/t-button_hidden/);
        await this.next.focus();
        await this.next.press('ArrowRight');
    }
}

/** Pincode is a numeric Maskito input with a live Angular control value. */
export class TuiPincodeHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiPincode]');
    }

    public async enter(value: string): Promise<void> {
        if (!/^\d+$/.test(value)) {
            throw new Error('Pincode accepts only numeric digits.');
        }
        const limit = Number(await this.input.getAttribute('maxlength'));
        if (value.length > limit) {
            throw new RangeError('Pincode exceeds the configured length of ' + limit + '.');
        }
        await this.input.fill(value);
        await expect(this.input).toHaveValue(value);
    }
}

/** Loading buttons block clicks and expose the loader's live region. */
export class TuiButtonLoadingHarness {
    public constructor(public readonly host: Locator) {}

    public get loader(): Locator {
        return this.host.locator('tui-loader[role="status"]');
    }

    public async expectLoading(): Promise<void> {
        await expect(this.host).toHaveAttribute('aria-disabled', 'true');
        await expect(this.loader).toBeVisible();
    }

    public async click(): Promise<void> {
        await expect(this.host).toHaveAttribute('aria-disabled', 'false');
        await this.host.click();
    }
}

/** Pager is a presentational index indicator, not a clickable pagination control. */
export class TuiPagerHarness {
    public constructor(public readonly host: Locator) {}

    public get items(): Locator {
        return this.host.locator('.t-item');
    }

    public get active(): Locator {
        return this.host.locator('.t-item._active');
    }

    public async expectIndex(index: number): Promise<void> {
        await expect(this.active).toHaveCount(1);
        await expect(this.active).toHaveAttribute('data-index', String(index));
    }
}

export class TuiLinkHarness {
    public constructor(public readonly host: Locator) {}

    public async follow(): Promise<void> {
        await expect(this.host).toHaveAttribute('href', /.+/);
        await this.host.click();
    }

    public async href(): Promise<string | null> {
        return this.host.getAttribute('href');
    }
}

/** Chip and badge expose Taiga appearance/size without custom DOM probing. */
export class TuiChipHarness {
    public constructor(public readonly host: Locator) {}

    public async expectAppearance(appearance: string): Promise<void> {
        await expect(this.host).toHaveAttribute('appearance', appearance);
        await expect(this.host).toBeVisible();
    }
}

export class TuiBadgeHarness {
    public constructor(public readonly host: Locator) {}

    public async expectAppearanceAndSize(appearance: string, size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('appearance', appearance);
        await expect(this.host).toHaveAttribute('data-size', size);
        await expect(this.host).toBeVisible();
    }
}

export class TuiPinHarness {
    public constructor(public readonly host: Locator) {}

    public async expectOpen(open: boolean): Promise<void> {
        if (open) {
            await expect(this.host).toHaveClass(/(?:^|\s)_open(?:\s|$)/);
        } else {
            await expect(this.host).not.toHaveClass(/(?:^|\s)_open(?:\s|$)/);
        }
    }
}

/** HTMLMeterElement exposes a native numeric value, unlike purely visual progress bars. */
export class TuiMeterHarness {
    public constructor(public readonly host: Locator) {}

    public async expectValue(value: number): Promise<void> {
        await expect(this.host).toHaveJSProperty('value', value);
    }

    public async bounds(): Promise<{min: number; max: number}> {
        return this.host.evaluate((node) => {
            const meter = node as HTMLMeterElement;
            return {min: meter.min, max: meter.max};
        });
    }
}

export const tuiSpinButton = (host: Locator): TuiSpinButtonHarness => new TuiSpinButtonHarness(host);
export const tuiPincode = (host: Locator): TuiPincodeHarness => new TuiPincodeHarness(host);
export const tuiButtonLoading = (host: Locator): TuiButtonLoadingHarness => new TuiButtonLoadingHarness(host);
export const tuiPager = (host: Locator): TuiPagerHarness => new TuiPagerHarness(host);
export const tuiLink = (host: Locator): TuiLinkHarness => new TuiLinkHarness(host);
export const tuiChip = (host: Locator): TuiChipHarness => new TuiChipHarness(host);
export const tuiBadge = (host: Locator): TuiBadgeHarness => new TuiBadgeHarness(host);
export const tuiPin = (host: Locator): TuiPinHarness => new TuiPinHarness(host);
export const tuiMeter = (host: Locator): TuiMeterHarness => new TuiMeterHarness(host);
