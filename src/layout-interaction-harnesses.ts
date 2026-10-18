import {expect, type Locator} from '@playwright/test';

/** Cell layout attributes are driven by reactive Taiga UI inputs. */
export class TuiCellHarness {
    public constructor(public readonly host: Locator) {}

    public async expectLayout(size: string, height: 'compact' | 'normal' | 'spacious'): Promise<void> {
        await expect(this.host).toHaveAttribute('tuiCell', '');
        await expect(this.host).toHaveAttribute('data-size', size);
        await expect(this.host).toHaveAttribute('data-height', height);
    }
}

/** Label's orientation and native for/id association must remain usable. */
export class TuiLabelHarness {
    public constructor(public readonly host: Locator) {}

    public async expectOrientation(orientation: 'horizontal' | 'vertical'): Promise<void> {
        await expect(this.host).toHaveAttribute('data-orientation', orientation);
    }

    public async expectAssociatedInput(): Promise<Locator> {
        const id = await this.host.getAttribute('for');
        if (!id) {
            throw new Error('TuiLabel lacks a for attribute; it cannot associate with a target input.');
        }
        const control = this.host.page().locator('[id=' + JSON.stringify(id) + ']');
        await expect(control).toHaveCount(1);
        await expect(control).toBeVisible();
        return control;
    }

    public async focusInput(): Promise<void> {
        const control = await this.expectAssociatedInput();
        await this.host.click();
        await expect(control).toBeFocused();
    }
}

/** The data-size input chooses the actual typography variant. */
export class TuiTitleHarness {
    public constructor(public readonly host: Locator) {}

    public async expectSize(size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('tuiTitle', '');
        await expect(this.host).toHaveAttribute('data-size', size);
    }
}

/** Inspect the real rendered set, including hidden and overflow item wrappers. */
export class TuiItemsWithMoreHarness {
    public constructor(public readonly host: Locator) {}

    public get shown(): Locator {
        return this.host.locator(':scope > .t-item:not(.t-item_hidden):not(.t-item_more)');
    }

    public get hidden(): Locator {
        return this.host.locator(':scope > .t-item_hidden');
    }

    public get more(): Locator {
        return this.host.locator(':scope > .t-item_more');
    }

    public async expectVisibleItems(labels: readonly string[]): Promise<void> {
        await expect(this.shown).toHaveCount(labels.length);
        for (let index = 0; index < labels.length; index++) {
            await expect(this.shown.nth(index)).toContainText(labels[index] ?? '');
        }
    }

    public async expectOverflow(hiddenCount: number): Promise<void> {
        await expect(this.hidden).toHaveCount(hiddenCount);
        if (hiddenCount) {
            await expect(this.more).toBeVisible();
        } else {
            await expect(this.more).toHaveCount(0);
        }
    }
}

/** Drag a real Taiga tile handle across another tile and assert Angular's order map externally. */
export class TuiTilesHarness {
    public constructor(public readonly host: Locator) {}

    public get tiles(): Locator {
        return this.host.locator(':scope > tui-tile');
    }

    public async drag(sourceIndex: number, targetIndex: number): Promise<void> {
        if (!Number.isInteger(sourceIndex) || !Number.isInteger(targetIndex) ||
            sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
            throw new RangeError('Tile indices must be different non-negative integers.');
        }
        const source = this.tiles.nth(sourceIndex);
        const target = this.tiles.nth(targetIndex);
        const handle = source.locator('[tuiTileHandle]');
        await expect(handle).toBeVisible();
        await expect(target).toBeVisible();
        await handle.dragTo(target, {targetPosition: {x: 25, y: 25}, steps: 12});
        await expect(this.host).not.toHaveClass(/(?:^|\s)_dragged(?:\s|$)/);
    }

    public async expectOrder(index: number, order: number): Promise<void> {
        await expect(this.tiles.nth(index)).toHaveCSS('order', String(order));
    }
}

export const tuiCell = (host: Locator): TuiCellHarness => new TuiCellHarness(host);
export const tuiLabel = (host: Locator): TuiLabelHarness => new TuiLabelHarness(host);
export const tuiTitle = (host: Locator): TuiTitleHarness => new TuiTitleHarness(host);
export const tuiItemsWithMore = (host: Locator): TuiItemsWithMoreHarness =>
    new TuiItemsWithMoreHarness(host);
export const tuiTiles = (host: Locator): TuiTilesHarness => new TuiTilesHarness(host);
