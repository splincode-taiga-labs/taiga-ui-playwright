import {expect, type Locator} from '@playwright/test';

export class TuiLoaderHarness {
    public constructor(public readonly host: Locator) {}

    public get spinner(): Locator {
        return this.host.locator('.t-loader');
    }

    public get content(): Locator {
        return this.host.locator('fieldset.t-content');
    }

    public async expectLoading(): Promise<void> {
        await expect(this.host).toHaveClass(/(?:^|\s)_loading(?:\s|$)/);
        await expect(this.spinner).toBeVisible();
        await expect(this.content).toHaveAttribute('inert', 'true');
    }

    public async expectIdle(): Promise<void> {
        await expect(this.host).not.toHaveClass(/(?:^|\s)_loading(?:\s|$)/);
        await expect(this.spinner).toHaveCount(0);
        await expect(this.content).not.toHaveAttribute('inert', 'true');
    }
}

export class TuiAvatarHarness {
    public constructor(public readonly host: Locator) {}

    public async expectShape(shape: 'round' | 'square'): Promise<void> {
        await expect(this.host).toHaveAttribute('data-shape', shape);
        await expect(this.host).toBeVisible();
    }

    public async expectSize(size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('data-size', size);
    }

    public async expectImageFallback(): Promise<void> {
        await expect(this.host).toHaveClass(/(?:^|\s)_fallback(?:\s|$)/);
    }
}

export class TuiBadgeNotificationHarness {
    public constructor(public readonly host: Locator) {}

    public async expectCount(count: number): Promise<void> {
        if (!Number.isInteger(count) || count < 0) {
            throw new RangeError('Badge count must be a non-negative integer.');
        }
        await expect(this.host).toHaveText(String(count));
    }

    public async expectSize(size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('data-size', size);
    }
}

export class TuiStatusHarness {
    public constructor(public readonly host: Locator) {}

    public async expectColor(color: string): Promise<void> {
        await expect(this.host).toHaveCSS('--t-status', color);
    }
}

export class TuiBreadcrumbsHarness {
    public constructor(public readonly host: Locator) {}

    public get links(): Locator {
        return this.host.getByRole('link');
    }

    public link(name: string): Locator {
        return this.host.getByRole('link', {name, exact: true});
    }

    public async follow(name: string): Promise<void> {
        const link = this.link(name);
        await expect(link).toHaveCount(1);
        await expect(link).toBeEnabled();
        await link.click();
    }

    public async expectSize(size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('data-size', size);
    }
}

export const tuiLoader = (host: Locator): TuiLoaderHarness => new TuiLoaderHarness(host);
export const tuiAvatar = (host: Locator): TuiAvatarHarness => new TuiAvatarHarness(host);
export const tuiBadgeNotification = (host: Locator): TuiBadgeNotificationHarness =>
    new TuiBadgeNotificationHarness(host);
export const tuiStatus = (host: Locator): TuiStatusHarness => new TuiStatusHarness(host);
export const tuiBreadcrumbs = (host: Locator): TuiBreadcrumbsHarness =>
    new TuiBreadcrumbsHarness(host);
