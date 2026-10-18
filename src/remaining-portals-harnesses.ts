import {expect, type Locator} from '@playwright/test';

export class TuiAlertHarness {
    public constructor(public readonly host: Locator) {}
    public async expectAlert(message: string): Promise<void> {
        await expect(this.host).toBeVisible();
        await expect(this.host).toHaveAttribute('tuiAlert', '');
        await expect(this.host).toContainText(message);
    }
}

export class TuiDropdownHarness {
    public constructor(public readonly host: Locator) {}
    public async expectMenuOption(label: string): Promise<void> {
        await expect(this.host).toBeVisible();
        await expect(this.host.getByRole('option', {name: label})).toBeVisible();
    }
}

export class TuiHintHarness {
    public constructor(public readonly host: Locator) {}
    public async expectHint(text: string): Promise<void> {
        await expect(this.host).toHaveRole('tooltip');
        await expect(this.host).toContainText(text);
    }
}

export class TuiModalHarness {
    public constructor(public readonly host: Locator) {}
    public async expectDialog(text: string): Promise<void> {
        await expect(this.host).toHaveRole('dialog');
        await expect(this.host).toHaveAttribute('aria-modal', 'true');
        await expect(this.host).toContainText(text);
    }
}

export class TuiPopupHarness {
    public constructor(public readonly host: Locator) {}
    public async expectPortalContent(text: string): Promise<void> {
        await expect(this.host).toBeVisible();
        await expect(this.host).toContainText(text);
    }
}

export const tuiAlert = (host: Locator): TuiAlertHarness => new TuiAlertHarness(host);
export const tuiDropdownPortal = (host: Locator): TuiDropdownHarness => new TuiDropdownHarness(host);
export const tuiHintPortal = (host: Locator): TuiHintHarness => new TuiHintHarness(host);
export const tuiModal = (host: Locator): TuiModalHarness => new TuiModalHarness(host);
export const tuiPopup = (host: Locator): TuiPopupHarness => new TuiPopupHarness(host);
