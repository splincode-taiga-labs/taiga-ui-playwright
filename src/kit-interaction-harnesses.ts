import {expect, type Locator} from '@playwright/test';

function validateMonthIndex(index: number): void {
    if (!Number.isInteger(index) || index < 0 || index > 11) {
        throw new RangeError('Month index must be an integer between 0 (January) and 11 (December).');
    }
}

export class TuiDataListWrapperHarness {
    public constructor(public readonly host: Locator) {}

    public get options(): Locator {
        return this.host.locator('tui-data-list [tuiOption]');
    }

    public get loader(): Locator {
        return this.host.locator('tui-loader');
    }

    public async selectOption(label: string): Promise<void> {
        const option = this.host.getByRole('option', {name: label, exact: true});
        await expect(option).toHaveCount(1);
        await expect(option).toBeEnabled();
        await option.click();
    }

    public async expectLoading(): Promise<void> {
        await expect(this.loader).toBeVisible();
        await expect(this.options).toHaveCount(0);
    }
}

export class TuiLineClampHarness {
    public constructor(public readonly host: Locator) {}

    public get content(): Locator {
        return this.host.locator('.t-wrapper');
    }

    public async expectLines(lines: number): Promise<void> {
        if (!Number.isInteger(lines) || lines < 1) {
            throw new RangeError('LineClamp requires a positive integer line limit.');
        }
        await expect(this.content).toHaveCSS('-webkit-line-clamp', String(lines));
    }

    public async maxHeight(): Promise<number> {
        return this.host.evaluate((element) => parseFloat(getComputedStyle(element).maxHeight));
    }
}

export class TuiBlockHarness {
    public constructor(public readonly host: Locator) {}

    public get checkbox(): Locator {
        return this.host.getByRole('checkbox');
    }

    public async setChecked(value: boolean): Promise<void> {
        await expect(this.checkbox).toBeEnabled();
        if (value) {
            await this.checkbox.check();
        } else {
            await this.checkbox.uncheck();
        }
        if (value) {
            await expect(this.checkbox).toBeChecked();
        } else {
            await expect(this.checkbox).not.toBeChecked();
        }
    }

    public async expectDisabled(): Promise<void> {
        await expect(this.checkbox).toBeDisabled();
        await expect(this.host).toHaveClass(/(?:^|\s)_disabled(?:\s|$)/);
    }

    public async expectSize(size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('data-size', size);
    }
}

export class TuiTimelineHarness {
    public constructor(public readonly host: Locator) {}

    public get dragHandle(): Locator {
        return this.host.locator('label[tuiTimelineItem] input[type="range"].t-input_drag');
    }

    public async moveStartOneStepRight(): Promise<void> {
        await expect(this.dragHandle).toHaveCount(1);
        await this.dragHandle.focus();
        const before = Number(await this.dragHandle.inputValue());
        await this.dragHandle.press('ArrowRight');
        await expect(this.dragHandle).toHaveValue(String(before + 1));
    }

    public async expectOrientation(orientation: 'horizontal' | 'vertical'): Promise<void> {
        await expect(this.host).toHaveAttribute('data-orientation', orientation);
    }
}

export class TuiInputMonthRangeHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputMonthRange]');
    }

    public async selectRange(start: number, end: number): Promise<void> {
        validateMonthIndex(start);
        validateMonthIndex(end);
        if (start > end) {
            throw new RangeError('Start month must not exceed end month.');
        }

        if ((await this.input.getAttribute('aria-expanded')) !== 'true') {
            await this.input.click();
        }

        const id = (await this.input.getAttribute('aria-controls'))?.trim();
        if (!id || id.split(/\s+/).length !== 1) {
            throw new Error('InputMonthRange requires a single aria-controls ID to scope its calendar portal.');
        }
        const page = this.host.page();
        const overlay = page.locator('tui-dropdown:visible')
            .and(page.locator('[id=' + JSON.stringify(id) + ']'));
        await expect(overlay).toBeVisible();
        const cells = overlay.locator('tui-calendar-month .t-row > .t-cell');

        const first = cells.nth(start);
        await expect(first).toBeVisible();
        await expect(first).not.toHaveClass(/t-cell_disabled/);
        await first.click();

        const last = cells.nth(end);
        await expect(last).toBeVisible();
        await expect(last).not.toHaveClass(/t-cell_disabled/);
        await last.click();
        await expect(this.input).not.toHaveValue('');
        await expect(overlay).toBeHidden();
    }
}

export const tuiDataListWrapper = (host: Locator): TuiDataListWrapperHarness =>
    new TuiDataListWrapperHarness(host);
export const tuiLineClamp = (host: Locator): TuiLineClampHarness => new TuiLineClampHarness(host);
export const tuiBlock = (host: Locator): TuiBlockHarness => new TuiBlockHarness(host);
export const tuiTimeline = (host: Locator): TuiTimelineHarness => new TuiTimelineHarness(host);
export const tuiInputMonthRange = (host: Locator): TuiInputMonthRangeHarness =>
    new TuiInputMonthRangeHarness(host);
