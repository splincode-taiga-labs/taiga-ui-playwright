import {expect, type Locator} from '@playwright/test';

/** Confirm opens in a real tui-dialog portal and returns a boolean decision. */
export class TuiConfirmHarness {
    public constructor(public readonly host: Locator) {}

    public get dialog(): Locator {
        return this.host.page().locator('tui-dialog:visible');
    }

    public async decide(accept: boolean, label = accept ? 'Proceed' : 'Cancel'): Promise<void> {
        await expect(this.dialog).toBeVisible();
        const button = this.dialog.getByRole('button', {name: label, exact: true});
        await expect(button).toBeEnabled();
        await button.click();
        await expect(this.dialog).toBeHidden();
    }

    public async expectContent(content: string): Promise<void> {
        await expect(this.dialog.locator('.t-content')).toContainText(content);
    }
}

/** Toast is rendered in a portal; its close control completes the toast Observable. */
export class TuiToastHarness {
    public constructor(public readonly host: Locator) {}

    public get closeButton(): Locator {
        return this.host.locator('button[tuiButtonX]');
    }

    public async expectState(message: string, appearance: string): Promise<void> {
        await expect(this.host).toBeVisible();
        await expect(this.host).toHaveAttribute('role', 'status');
        await expect(this.host).toHaveAttribute('data-appearance', appearance);
        await expect(this.host).toContainText(message);
    }

    public async close(): Promise<void> {
        await expect(this.closeButton).toBeEnabled();
        await this.closeButton.click();
        await expect(this.host).toBeHidden();
    }
}

/** Form size is applied to both its host and descendant component defaults. */
export class TuiFormHarness {
    public constructor(public readonly host: Locator) {}

    public get submitButton(): Locator {
        return this.host.getByRole('button', {name: 'Save form', exact: true});
    }

    public async expectSize(size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('tuiForm', '');
        await expect(this.host).toHaveAttribute('data-size', size);
        await expect(this.submitButton).toHaveAttribute('data-size', size);
    }

    public async submit(): Promise<void> {
        await expect(this.submitButton).toBeEnabled();
        await this.submitButton.click();
    }
}

/** Validate the real item-group initialized/horizontal CSS contract and autoscroll. */
export class TuiItemGroupHarness {
    public constructor(public readonly host: Locator) {}

    public async expectOrientation(horizontal: boolean): Promise<void> {
        await expect(this.host).toHaveClass(/(?:^|\s)_initialized(?:\s|$)/);
        if (horizontal) {
            await expect(this.host).toHaveClass(/(?:^|\s)_horizontal(?:\s|$)/);
        } else {
            await expect(this.host).not.toHaveClass(/(?:^|\s)_horizontal(?:\s|$)/);
        }
    }

    public async clickLastAndExpectScroll(): Promise<void> {
        await this.expectOrientation(true);
        await this.host.evaluate((element) => {
            element.scrollLeft = 0;
            const item = element.querySelector('button:last-child');
            if (!(item instanceof HTMLButtonElement)) {
                throw new Error('ItemGroup has no final button');
            }
            item.click();
        });
        await expect.poll(() => this.host.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    }
}

/** ShrinkWrap changes max-inline-size via its reactive directive input. */
export class TuiShrinkWrapHarness {
    public constructor(public readonly host: Locator) {}

    public async expectMaxInlineSize(pixels: number): Promise<void> {
        if (!Number.isFinite(pixels) || pixels < 0) {
            throw new RangeError('Expected a nonnegative finite width');
        }
        await expect(this.host).toHaveAttribute('tuiShrinkWrap', '');
        await expect.poll(() => this.host.evaluate((element) =>
            Number.parseFloat(getComputedStyle(element).maxInlineSize),
        )).toBe(pixels);
    }
}

export const tuiConfirm = (host: Locator): TuiConfirmHarness => new TuiConfirmHarness(host);
export const tuiToast = (host: Locator): TuiToastHarness => new TuiToastHarness(host);
export const tuiForm = (host: Locator): TuiFormHarness => new TuiFormHarness(host);
export const tuiItemGroup = (host: Locator): TuiItemGroupHarness => new TuiItemGroupHarness(host);
export const tuiShrinkWrap = (host: Locator): TuiShrinkWrapHarness => new TuiShrinkWrapHarness(host);
