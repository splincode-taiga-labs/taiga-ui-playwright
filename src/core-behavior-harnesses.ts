import {expect, type Locator} from '@playwright/test';

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

export class TuiCarouselHarness {
    public constructor(public readonly host: Locator) {}

    public slide(label: string): Locator {
        return this.host.locator('.t-item').filter({hasText: label});
    }

    /** v4 throttles horizontal wheel by 500ms; retry only until the active slide changes. */
    private async moveV4(direction: -1 | 1): Promise<void> {
        const slides = this.host.locator('fieldset.t-item');
        const active = async (): Promise<number> => slides.evaluateAll((nodes) =>
            nodes.findIndex((node) => !(node as HTMLFieldSetElement).disabled),
        );
        const initial = await active();
        const target = Math.max(0, Math.min(initial + direction, await slides.count() - 1));

        if (target === initial) {
            return;
        }

        await this.host.locator('.t-scroller').hover();
        await expect.poll(async () => {
            const current = await active();
            if (current !== target) {
                await this.host.page().mouse.wheel(direction * 100, 0);
            }
            return current;
        }, {intervals: [150, 250, 400], timeout: 5000}).toBe(target);
    }

    public async moveNext(): Promise<void> {
        await expect(this.host).toBeVisible();
        const v4Scroller = this.host.locator('.t-scroller');
        if (await v4Scroller.count()) {
            await this.moveV4(1);
            return;
        }
        await this.host.evaluate((element) =>
            element.scrollTo({left: element.scrollWidth, behavior: 'instant'}),
        );
    }

    /** Wait for Taiga UI to complete the interior-slide recentering frame. */
    public async expectCenteredSlide(): Promise<void> {
        await expect.poll(() => this.host.evaluate((element) => {
            const overflow = getComputedStyle(element).overflowX;
            return overflow === 'scroll' &&
                element.clientWidth > 0 &&
                Math.abs(element.scrollLeft - element.clientWidth) <= 1;
        })).toBe(true);
    }

    public async movePrevious(): Promise<void> {
        await expect(this.host).toBeVisible();
        const v4Scroller = this.host.locator('.t-scroller');
        if (await v4Scroller.count()) {
            await this.moveV4(-1);
            return;
        }
        await this.host.evaluate((element) => element.scrollTo({left: 0, behavior: 'instant'}));
    }
}

export const tuiError = (host: Locator): TuiErrorHarness => new TuiErrorHarness(host);
export const tuiDataList = (host: Locator): TuiDataListHarness => new TuiDataListHarness(host);
export const tuiTextfield = (host: Locator): TuiTextfieldHarness => new TuiTextfieldHarness(host);
export const tuiScrollbar = (host: Locator): TuiScrollbarHarness => new TuiScrollbarHarness(host);
export const tuiCarousel = (host: Locator): TuiCarouselHarness => new TuiCarouselHarness(host);
