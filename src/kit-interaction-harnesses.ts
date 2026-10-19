import {expect, type Locator} from '@playwright/test';

import {clickOwnedCalendarCell} from './calendar-portal.js';

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

        await clickOwnedCalendarCell(this.input, 'InputMonthRange', (portal) =>
            portal.locator('tui-calendar-month .t-row > .t-cell').nth(start),
        );
        await clickOwnedCalendarCell(this.input, 'InputMonthRange', (portal) =>
            portal.locator('tui-calendar-month .t-row > .t-cell').nth(end),
        );
        await expect(this.input).not.toHaveValue('');
        await expect(this.input).toHaveAttribute('aria-expanded', 'false');
    }
}

export const tuiDataListWrapper = (host: Locator): TuiDataListWrapperHarness =>
    new TuiDataListWrapperHarness(host);
export const tuiLineClamp = (host: Locator): TuiLineClampHarness => new TuiLineClampHarness(host);
export const tuiBlock = (host: Locator): TuiBlockHarness => new TuiBlockHarness(host);
export const tuiTimeline = (host: Locator): TuiTimelineHarness => new TuiTimelineHarness(host);
export const tuiInputMonthRange = (host: Locator): TuiInputMonthRangeHarness =>
    new TuiInputMonthRangeHarness(host);
