import {expect, type Locator} from '@playwright/test';

export class TuiInputCardHarness {
    public constructor(public readonly host: Locator) {}
    public get input(): Locator { return this.host.locator('input[tuiInputCard]'); }
    public async fillCard(number: string): Promise<void> {
        await this.input.fill(number);
        await expect(this.input).toHaveValue(/\d/);
    }
}

export class TuiInputCardGroupHarness {
    public constructor(public readonly host: Locator) {}
    public get number(): Locator { return this.host.locator('input[autocomplete="cc-number"]'); }
    public async fillNumber(number: string): Promise<void> {
        await this.number.fill(number);
        await expect(this.number).toHaveValue(/\d/);
    }
}

export class TuiThumbnailCardHarness {
    public constructor(public readonly host: Locator) {}
    public async expectSize(size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('data-size', size);
        await expect(this.host.locator('.t-content')).toContainText(/\S/);
    }
}

export class TuiReorderHarness {
    public constructor(public readonly host: Locator) {}
    public get tiles(): Locator { return this.host.locator('tui-tile'); }
    public async expectItems(count: number): Promise<void> {
        await expect(this.tiles).toHaveCount(count);
    }
    public async toggleFirst(): Promise<void> {
        await this.host.locator('tui-tile button').first().click();
    }
}

export class TuiTableHarness {
    public constructor(public readonly host: Locator) {}
    public async expectSize(size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('tuiTable', '');
        await expect(this.host).toHaveAttribute('data-size', size);
    }
    public get rows(): Locator { return this.host.getByRole('row'); }
}

export class TuiTablePaginationHarness {
    public constructor(public readonly host: Locator) {}
    public async expectRange(from: number, to: number): Promise<void> {
        await expect(this.host.locator('strong').filter({hasText: from + '–' + to})).toHaveCount(1);
    }
    public async nextPage(): Promise<void> {
        await this.host.locator('button.t-button:not(.t-button_back)').click();
    }
}

export const tuiInputCard = (host: Locator): TuiInputCardHarness => new TuiInputCardHarness(host);
export const tuiInputCardGroup = (host: Locator): TuiInputCardGroupHarness => new TuiInputCardGroupHarness(host);
export const tuiThumbnailCard = (host: Locator): TuiThumbnailCardHarness => new TuiThumbnailCardHarness(host);
export const tuiReorder = (host: Locator): TuiReorderHarness => new TuiReorderHarness(host);
export const tuiTable = (host: Locator): TuiTableHarness => new TuiTableHarness(host);
export const tuiTablePagination = (host: Locator): TuiTablePaginationHarness => new TuiTablePaginationHarness(host);
