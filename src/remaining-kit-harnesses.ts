import {expect, type Locator} from '@playwright/test';

export class TuiFilesHarness {
    public constructor(public readonly host: Locator) {}
    public async expand(): Promise<void> {
        await this.host.locator('.t-bottom button').click();
        await expect(this.host.locator('tui-expand')).toHaveClass(/(?:^|\s)_expanded(?:\s|$)/);
    }
    public async expectFile(name: string): Promise<void> {
        await expect(this.host).toContainText(name);
    }
}

export class TuiTreeHarness {
    public constructor(public readonly host: Locator) {}
    public async expectNode(text: string): Promise<void> {
        await expect(this.host).toHaveRole('tree');
        await expect(this.host.locator('tui-tree-item')).toContainText(text);
    }
}

export class TuiInternationalPhoneHarness {
    public constructor(public readonly host: Locator) {}
    public get input(): Locator { return this.host.locator('input[tuiInputPhoneInternational]'); }
    public async fill(value: string): Promise<void> {
        await this.input.fill(value);
        await expect(this.input).toHaveValue(/\d/);
    }
}

export class TuiNotificationMiddleHarness {
    public constructor(public readonly host: Locator) {}
    public async expectOpen(message: string): Promise<void> {
        await expect(this.host).toBeVisible();
        await expect(this.host).toContainText(message);
        await expect(this.host.locator('tui-loader')).toBeVisible();
    }
    public async dismiss(): Promise<void> {
        await this.host.page().keyboard.press('Escape');
        await expect(this.host).toBeHidden();
    }
}

export class TuiPreviewHarness {
    public constructor(public readonly host: Locator) {}
    public get viewport(): Locator { return this.host.locator('.t-wrapper'); }
    public async rotate(): Promise<void> {
        const initial = await this.viewport.evaluate((node) => getComputedStyle(node).transform);
        await this.host.locator('button.t-rotate-button').click();
        await expect.poll(() => this.viewport.evaluate((node) =>
            getComputedStyle(node).transform,
        )).not.toBe(initial);
    }
}

export class TuiPushHarness {
    public constructor(public readonly host: Locator) {}
    public async expectHeading(text: string): Promise<void> {
        await expect(this.host.locator('.t-heading')).toHaveText(text);
    }
    public async close(): Promise<void> {
        await this.host.locator('.t-close').click();
        await expect(this.host).toHaveCount(0);
    }
}
export const tuiFiles = (host: Locator): TuiFilesHarness => new TuiFilesHarness(host);
export const tuiTree = (host: Locator): TuiTreeHarness => new TuiTreeHarness(host);
export const tuiInternationalPhone = (host: Locator): TuiInternationalPhoneHarness => new TuiInternationalPhoneHarness(host);
export const tuiNotificationMiddle = (host: Locator): TuiNotificationMiddleHarness => new TuiNotificationMiddleHarness(host);
export const tuiPreview = (host: Locator): TuiPreviewHarness => new TuiPreviewHarness(host);
export const tuiPush = (host: Locator): TuiPushHarness => new TuiPushHarness(host);
