import {expect, type Locator} from '@playwright/test';

/** Native list semantics plus reactive tuiList sizing. */
export class TuiListHarness {
    public constructor(public readonly host: Locator) {}

    public get items(): Locator {
        return this.host.locator(':scope > li');
    }

    public async expectSize(size: 's' | 'l'): Promise<void> {
        await expect(this.host).toHaveAttribute('tuiList', '');
        await expect(this.host).toHaveAttribute('data-size', size);
        await expect(this.host).toHaveAttribute('role', 'list');
    }

    public async expectItems(labels: readonly string[]): Promise<void> {
        await expect(this.items).toHaveCount(labels.length);
        for (const [index, label] of labels.entries()) {
            await expect(this.items.nth(index)).toHaveText(label);
        }
    }
}

/** TuiSlides computes the direction sign from the current Angular input. */
export class TuiSlidesHarness {
    public constructor(public readonly host: Locator) {}

    public async expectDirection(direction: -1 | 0 | 1): Promise<void> {
        await expect(this.host).toHaveAttribute('tuiSlides', '');
        await expect(this.host).toHaveAttribute('data-direction', String(direction));
    }

    public async expectSlide(title: string): Promise<void> {
        await expect(this.host.locator(':scope > *')).toHaveCount(1);
        await expect(this.host).toContainText(title);
    }
}

/** Measures the actual resize of the Taiga auto-height elastic container. */
export class TuiElasticContainerHarness {
    public constructor(public readonly host: Locator) {}

    public get wrapper(): Locator {
        return this.host.locator(':scope > .t-wrapper');
    }

    public async getHeight(): Promise<number> {
        await expect(this.wrapper).toBeVisible();
        return this.host.evaluate((element) => element.getBoundingClientRect().height);
    }

    public async expectHeightGreaterThan(before: number): Promise<void> {
        await expect.poll(() => this.getHeight()).toBeGreaterThan(before);
    }
}

/** TuiFloatingContainer exposes its color input through a custom property. */
export class TuiFloatingContainerHarness {
    public constructor(public readonly host: Locator) {}

    public async expectBackground(value: string): Promise<void> {
        await expect(this.host).toHaveAttribute('tuiFloatingContainer', '');
        await expect.poll(() => this.host.evaluate((node) =>
            getComputedStyle(node).getPropertyValue('--t-background').trim(),
        )).toBe(value);
    }
}

/** TuiClose emits for Escape or an outside mousedown/mouseup pair. */
export class TuiCloseHarness {
    public constructor(public readonly host: Locator) {}

    public async dismissByEscape(): Promise<void> {
        await expect(this.host).toBeVisible();
        await this.host.press('Escape');
        await expect(this.host).toBeHidden();
    }

    public async dismissByOutsideClick(outside: Locator): Promise<void> {
        await expect(this.host).toBeVisible();
        await expect(outside).toBeVisible();
        await outside.click();
        await expect(this.host).toBeHidden();
    }
}

export const tuiList = (host: Locator): TuiListHarness => new TuiListHarness(host);
export const tuiSlides = (host: Locator): TuiSlidesHarness => new TuiSlidesHarness(host);
export const tuiElasticContainer = (host: Locator): TuiElasticContainerHarness =>
    new TuiElasticContainerHarness(host);
export const tuiFloatingContainer = (host: Locator): TuiFloatingContainerHarness =>
    new TuiFloatingContainerHarness(host);
export const tuiClose = (host: Locator): TuiCloseHarness => new TuiCloseHarness(host);
