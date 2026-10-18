import {expect, type Locator} from '@playwright/test';

export class TuiBottomSheetHarness {
    public constructor(public readonly host: Locator) {}
    public async expectStops(stops: number, bar: boolean): Promise<void> {
        await expect(this.host.locator('.t-stop')).toHaveCount(stops);
        if (bar) {
            await expect(this.host).toHaveClass(/(?:^|\s)_bar(?:\s|$)/);
        } else {
            await expect(this.host).not.toHaveClass(/(?:^|\s)_bar(?:\s|$)/);
        }
    }
}

export class TuiKeypadHarness {
    public constructor(public readonly host: Locator) {}
    public async expectColumns(columns: number): Promise<void> {
        await expect(this.host).toHaveCSS('--t-columns', String(columns));
    }
    public async press(label: string): Promise<void> {
        await this.host.getByRole('button', {name: label, exact: true}).click();
    }
}

export class TuiMobileCalendarHarness {
    public constructor(public readonly host: Locator) {}
    public get calendarSheets(): Locator {
        return this.host.locator('tui-mobile-calendar-sheet');
    }
    public async expectInitialized(): Promise<void> {
        await expect(this.host).toHaveClass(/(?:^|\s)_initialized(?:\s|$)/);
        await expect(this.host.locator('cdk-virtual-scroll-viewport')).toHaveCount(2);
        await expect(this.calendarSheets.first()).toBeVisible();
    }
}

export class TuiMobileCalendarSheetHarness {
    public constructor(public readonly host: Locator) {}
    public get days(): Locator {
        return this.host.locator('.t-cell:not(.t-cell_empty):not(.t-cell_disabled)');
    }
    public async expectDays(): Promise<void> {
        await expect.poll(() => this.host.locator('.t-row').count()).toBeGreaterThan(3);
        await expect(this.days.first()).toBeVisible();
    }
}

export class TuiSearchBarHarness {
    public constructor(public readonly host: Locator) {}
    public async expectAppearance(value: string): Promise<void> {
        await expect(this.host).toHaveAttribute('data-appearance', value);
    }
    public async fill(text: string): Promise<void> {
        await this.host.getByRole('searchbox').fill(text);
        await expect(this.host.getByRole('searchbox')).toHaveValue(text);
    }
}

export class TuiSwipeActionsHarness {
    public constructor(public readonly host: Locator) {}
    public async expectProjectedAction(text: string): Promise<void> {
        await expect(this.host.locator('.t-actions')).toContainText(text);
        await expect(this.host.locator('.t-content')).toBeVisible();
    }
}

export class TuiTabBarHarness {
    public constructor(public readonly host: Locator) {}
    public get items(): Locator { return this.host.locator('[tuiTabBarItem]'); }
    public async selectTab(label: string): Promise<void> {
        await this.host.getByRole('button', {name: label, exact: true}).click();
    }
    public async expectSkeletons(quantity: number): Promise<void> {
        await expect(this.host.locator('.t-skeleton')).toHaveCount(quantity);
    }
}
export const tuiBottomSheet = (host: Locator): TuiBottomSheetHarness => new TuiBottomSheetHarness(host);
export const tuiKeypad = (host: Locator): TuiKeypadHarness => new TuiKeypadHarness(host);
export const tuiMobileCalendar = (host: Locator): TuiMobileCalendarHarness => new TuiMobileCalendarHarness(host);
export const tuiMobileCalendarSheet = (host: Locator): TuiMobileCalendarSheetHarness => new TuiMobileCalendarSheetHarness(host);
export const tuiSearchBar = (host: Locator): TuiSearchBarHarness => new TuiSearchBarHarness(host);
export const tuiSwipeActions = (host: Locator): TuiSwipeActionsHarness => new TuiSwipeActionsHarness(host);
export const tuiTabBar = (host: Locator): TuiTabBarHarness => new TuiTabBarHarness(host);
