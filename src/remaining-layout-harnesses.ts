import {expect, type Locator} from '@playwright/test';

export class TuiRootHarness {
    public constructor(public readonly host: Locator) {}
    public async expectBootstrapped(): Promise<void> {
        await expect(this.host).toHaveAttribute('data-tui-version', /^\d+\./);
        await expect(this.host.locator(':scope > .t-root-content')).toBeVisible();
        await expect(this.host.locator('tui-popups')).toHaveCount(1);
    }
}

export class TuiCommentHarness {
    public constructor(public readonly host: Locator) {}
    public async expectDirection(direction: string): Promise<void> {
        await expect(this.host).toHaveAttribute('tuiComment', '');
        await expect(this.host).toHaveAttribute('data-direction', direction);
    }
}

export class TuiMessageHarness {
    public constructor(public readonly host: Locator) {}
    public async expectMessage(text: string): Promise<void> {
        await expect(this.host).toHaveAttribute('tuiMessage', '');
        await expect(this.host).toContainText(text);
        await expect(this.host).toBeVisible();
    }
}

export class TuiDrawerHarness {
    public constructor(public readonly host: Locator) {}
    public async expectState(direction: string, overlay: boolean): Promise<void> {
        await expect(this.host).toHaveAttribute('data-direction', direction);
        if (overlay) {
            await expect(this.host).toHaveClass(/(?:^|\s)_overlay(?:\s|$)/);
        } else {
            await expect(this.host).not.toHaveClass(/(?:^|\s)_overlay(?:\s|$)/);
        }
    }
}

export class TuiHeaderHarness {
    public constructor(public readonly host: Locator) {}
    public async expectSize(size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('tuiHeader', '');
        await expect(this.host).toHaveAttribute('data-size', size);
    }
}

export class TuiBlockDetailsHarness {
    public constructor(public readonly host: Locator) {}
    public async expectDetails(text: string): Promise<void> {
        await expect(this.host).toHaveAttribute('data-tui-version', /^\d+\./);
        await expect(this.host).toHaveAttribute('tuiBlockDetails', '');
        await expect(this.host).toContainText(text);
    }
}

export class TuiSurfaceHarness {
    public constructor(public readonly host: Locator) {}
    public async expectSurface(): Promise<void> {
        await expect(this.host).toHaveAttribute('tuiSurface', '');
        await expect(this.host).toHaveAttribute('data-tui-version', /^\d+\./);
    }
}

export class TuiSearchHarness {
    public constructor(public readonly host: Locator) {}
    public async search(text: string): Promise<void> {
        await expect(this.host).toHaveAttribute('tuiSearch', '');
        const input = this.host.getByRole('searchbox');
        await input.fill(text);
        await expect(input).toHaveValue(text);
    }
}

export class TuiAppBarHarness {
    public constructor(public readonly host: Locator) {}
    public async expectSize(size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('data-size', size);
        await expect(this.host.locator('.t-content')).toBeVisible();
    }
    public async clickEndAction(name: string): Promise<void> {
        await this.host.getByRole('button', {name, exact: true}).click();
    }
}

export class TuiProgressiveBlurHarness {
    public constructor(public readonly host: Locator) {}
    public async expectGradientSteps(): Promise<void> {
        await expect(this.host.locator('span')).toHaveCount(20);
        await expect(this.host.locator('span').first()).toHaveCSS('--t-step', '0');
        await expect(this.host.locator('span').last()).toHaveCSS('--t-step', '19');
    }
}

export const tuiRoot = (host: Locator): TuiRootHarness => new TuiRootHarness(host);
export const tuiComment = (host: Locator): TuiCommentHarness => new TuiCommentHarness(host);
export const tuiMessage = (host: Locator): TuiMessageHarness => new TuiMessageHarness(host);
export const tuiDrawer = (host: Locator): TuiDrawerHarness => new TuiDrawerHarness(host);
export const tuiHeader = (host: Locator): TuiHeaderHarness => new TuiHeaderHarness(host);
export const tuiBlockDetails = (host: Locator): TuiBlockDetailsHarness => new TuiBlockDetailsHarness(host);
export const tuiSurface = (host: Locator): TuiSurfaceHarness => new TuiSurfaceHarness(host);
export const tuiSearch = (host: Locator): TuiSearchHarness => new TuiSearchHarness(host);
export const tuiAppBar = (host: Locator): TuiAppBarHarness => new TuiAppBarHarness(host);
export const tuiProgressiveBlur = (host: Locator): TuiProgressiveBlurHarness =>
    new TuiProgressiveBlurHarness(host);
