import {expect, type Locator} from '@playwright/test';

/** A user-visible validation message, including its dismissed/empty state. */
export class TuiErrorHarness {
    public constructor(public readonly host: Locator) {}

    public get message(): Locator {
        return this.host.locator('.t-content');
    }

    public async expectError(message: string): Promise<void> {
        await expect(this.host).toHaveClass(/(?:^|\s)_error(?:\s|$)/);
        await expect(this.message).toHaveText(message);
    }

    public async expectCleared(): Promise<void> {
        await expect(this.host).not.toHaveClass(/(?:^|\s)_error(?:\s|$)/);
        await expect(this.message).toHaveCount(0);
    }
}

/** Navigate a Taiga UI option list with actual keyboard focus or click. */
export class TuiDataListHarness {
    public constructor(public readonly host: Locator) {}

    public get options(): Locator {
        return this.host.locator('[tuiOption]:not(.t-empty)');
    }

    public option(name: string): Locator {
        return this.host.getByRole('option', {name, exact: true});
    }

    public async select(name: string): Promise<void> {
        const option = this.option(name);
        await expect(option).toHaveCount(1);
        await expect(option).toBeEnabled();
        await option.click();
    }

    public async focusNext(name: string, next: string): Promise<void> {
        const current = this.option(name);
        await expect(current).toBeEnabled();
        await current.focus();
        await current.press('ArrowDown');
        await expect(this.option(next)).toBeFocused();
    }
}

/** Textfield's clear action updates its Angular accessor, not only the displayed input. */
export class TuiTextfieldHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input:not([aria-hidden="true"]), textarea, select').first();
    }

    public get clearButton(): Locator {
        return this.host.locator('button[tuiButtonX]');
    }

    public async focus(): Promise<void> {
        await this.input.focus();
        await expect(this.input).toBeFocused();
    }

    public async clear(): Promise<void> {
        await expect(this.clearButton).toBeVisible();
        await expect(this.clearButton).toBeEnabled();
        await this.clearButton.click();
        await expect(this.input).toHaveValue('');
    }

    public async expectDisabled(): Promise<void> {
        await expect(this.input).toBeDisabled();
        await expect(this.host).toHaveClass(/(?:^|\s)_disabled(?:\s|$)/);
    }
}

/** The host is the scroll container for Taiga UI's non-delegated scrollbar. */
export class TuiScrollbarHarness {
    public constructor(public readonly host: Locator) {}

    public async scrollToBottom(): Promise<void> {
        await this.host.scrollIntoViewIfNeeded();
        await this.host.evaluate((element) => element.scrollTo({top: element.scrollHeight, behavior: 'instant'}));
        await expect.poll(() => this.host.evaluate(
            (element) => element.scrollTop + element.clientHeight >= element.scrollHeight - 1,
        )).toBe(true);
    }

    public async scrollToTop(): Promise<void> {
        await this.host.evaluate((element) => element.scrollTo({top: 0, behavior: 'instant'}));
        await expect.poll(() => this.host.evaluate((element) => element.scrollTop)).toBe(0);
    }

    public async scrollOffset(): Promise<number> {
        return this.host.evaluate((element) => element.scrollTop);
    }
}

/** Carousel changes active slide through its scroll-snap interaction. */
export class TuiCarouselHarness {
    public constructor(public readonly host: Locator) {}

    public slide(label: string): Locator {
        return this.host.locator('.t-item').filter({hasText: label});
    }

    public async moveNext(): Promise<void> {
        await expect(this.host).toBeVisible();
        await this.host.evaluate((element) =>
            element.scrollTo({left: element.scrollWidth, behavior: 'instant'}),
        );
    }

    public async movePrevious(): Promise<void> {
        await expect(this.host).toBeVisible();
        await this.host.evaluate((element) => element.scrollTo({left: 0, behavior: 'instant'}));
    }
}

export const tuiError = (host: Locator): TuiErrorHarness => new TuiErrorHarness(host);
export const tuiDataList = (host: Locator): TuiDataListHarness => new TuiDataListHarness(host);
export const tuiTextfield = (host: Locator): TuiTextfieldHarness => new TuiTextfieldHarness(host);
export const tuiScrollbar = (host: Locator): TuiScrollbarHarness => new TuiScrollbarHarness(host);
export const tuiCarousel = (host: Locator): TuiCarouselHarness => new TuiCarouselHarness(host);
