import {expect, type Locator} from '@playwright/test';

export class TuiFullscreenHarness {
    public constructor(public readonly host: Locator) {}
    public async expectRoot(): Promise<void> {
        await expect(this.host.locator('tui-root')).toBeVisible();
        await expect(this.host).toContainText('Fullscreen sample');
    }
}

export class TuiRoutableDialogHarness {
    public constructor(public readonly host: Locator) {}
    public async expectRouted(text: string): Promise<void> {
        await expect(this.host).toBeVisible();
        await expect(this.host).toContainText(text);
    }
    public async close(): Promise<void> {
        await this.host.page().keyboard.press('Escape');
        await expect(this.host).toBeHidden();
    }
}

export class TuiDynamicHeaderHarness {
    public constructor(public readonly host: Locator) {}
    public async expectTitle(text: string): Promise<void> {
        await expect(this.host).toContainText(text);
    }
    public async expectDirection(value: string): Promise<void> {
        await expect(this.host).toHaveCSS('--t-dir', value);
    }
}

export class TuiNavigationHarness {
    public constructor(public readonly host: Locator) {}
    public async expectExpanded(expanded: boolean): Promise<void> {
        if (expanded) {
            await expect(this.host).toHaveClass(/(?:^|\s)_expanded(?:\s|$)/);
        } else {
            await expect(this.host).not.toHaveClass(/(?:^|\s)_expanded(?:\s|$)/);
        }
    }
}

export class TuiPdfViewerHarness {
    public constructor(public readonly host: Locator) {}
    public async expectPdf(title: string): Promise<void> {
        await expect(this.host).toBeVisible();
        await expect(this.host.locator('[tuiTitle]')).toContainText(title);
        await expect(this.host.locator('section.t-content')).toBeVisible();
    }
}

export class TuiMobileCalendarDropdownHarness {
    public constructor(public readonly host: Locator) {}
    public async expectCalendar(): Promise<void> {
        await expect(this.host).toBeVisible();
        await expect(this.host.locator('tui-mobile-calendar')).toBeVisible();
    }
}

export class TuiPullToRefreshHarness {
    public constructor(public readonly host: Locator) {}
    public async expectContent(text: string): Promise<void> {
        await expect(this.host).toContainText(text);
        await expect(this.host.locator('div')).toBeVisible();
    }
}

export class TuiSheetDialogHarness {
    public constructor(public readonly host: Locator) {}
    public async expectSheet(text: string): Promise<void> {
        await expect(this.host).toBeVisible();
        await expect(this.host).toContainText(text);
    }
}
export const tuiFullscreen = (host: Locator): TuiFullscreenHarness => new TuiFullscreenHarness(host);
export const tuiRoutableDialog = (host: Locator): TuiRoutableDialogHarness => new TuiRoutableDialogHarness(host);
export const tuiDynamicHeader = (host: Locator): TuiDynamicHeaderHarness => new TuiDynamicHeaderHarness(host);
export const tuiNavigation = (host: Locator): TuiNavigationHarness => new TuiNavigationHarness(host);
export const tuiPdfViewer = (host: Locator): TuiPdfViewerHarness => new TuiPdfViewerHarness(host);
export const tuiMobileCalendarDropdown = (host: Locator): TuiMobileCalendarDropdownHarness => new TuiMobileCalendarDropdownHarness(host);
export const tuiPullToRefresh = (host: Locator): TuiPullToRefreshHarness => new TuiPullToRefreshHarness(host);
export const tuiSheetDialog = (host: Locator): TuiSheetDialogHarness => new TuiSheetDialogHarness(host);
