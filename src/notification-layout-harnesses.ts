import {expect, type Locator} from '@playwright/test';

/** Verifies that an inline Taiga notification reflects its reactive appearance and size. */
export class TuiNotificationHarness {
    public constructor(public readonly host: Locator) {}

    public async expectState(appearance: string, size: string): Promise<void> {
        await expect(this.host).toBeVisible();
        await expect(this.host).toHaveAttribute('tuiNotification', '');
        await expect(this.host).toHaveAttribute('data-appearance', appearance);
        await expect(this.host).toHaveAttribute('data-size', size);
    }
}

/** Checks real content projection into the top and bottom badge slots. */
export class TuiBadgedContentHarness {
    public constructor(public readonly host: Locator) {}

    public get top(): Locator {
        return this.host.locator('.t-badge_top');
    }

    public get bottom(): Locator {
        return this.host.locator('.t-badge_bottom');
    }

    public async expectBadge(slot: 'top' | 'bottom', text: string): Promise<void> {
        const badge = slot === 'top' ? this.top : this.bottom;
        await expect(badge.locator('tui-badge-notification')).toBeVisible();
        await expect(badge.locator('tui-badge-notification')).toHaveText(text);
    }

    public async expectBadgeAbsent(slot: 'top' | 'bottom'): Promise<void> {
        const badge = slot === 'top' ? this.top : this.bottom;
        await expect(badge.locator('tui-badge-notification')).toHaveCount(0);
    }
}

/** Exercises block status card state, adaptive size, and projected action. */
export class TuiBlockStatusHarness {
    public constructor(public readonly host: Locator) {}

    public get heading(): Locator {
        return this.host.getByRole('heading');
    }

    public async expectState(size: string, card: boolean): Promise<void> {
        await expect(this.host).toHaveAttribute('data-size', size);
        if (card) {
            await expect(this.host).toHaveClass(/(?:^|\s)_card(?:\s|$)/);
        } else {
            await expect(this.host).not.toHaveClass(/(?:^|\s)_card(?:\s|$)/);
        }
    }

    public async clickAction(name: string): Promise<void> {
        const action = this.host.locator('.t-block-actions').getByRole('button', {name, exact: true});
        await expect(action).toBeEnabled();
        await action.click();
    }
}

/** CardCollapsed changes layout through its real clip-path input. */
export class TuiCardHarness {
    public constructor(public readonly host: Locator) {}

    public async expectSpace(space: 'normal' | 'compact' | ''): Promise<void> {
        await expect(this.host).toHaveAttribute('data-space', space);
    }

    public async expectCollapsed(collapsed: boolean): Promise<void> {
        await expect.poll(() => this.host.evaluate((element) =>
            getComputedStyle(element).clipPath,
        )).toBe(collapsed ? 'inset(-12px)' : 'inset(0px)');
    }
}

/**
 * Search field moves its own textfield into a popup, so use a globally scoped
 * Locator rather than assuming the textfield remains in its original section.
 */
export class TuiInputSearchHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputSearch]');
    }

    public get popup(): Locator {
        return this.host.page().locator('tui-input-search-content');
    }

    public async open(): Promise<void> {
        await this.input.focus();
        await expect(this.popup).toBeVisible();
        await expect(this.input).toBeFocused();
    }

    public async fill(value: string): Promise<void> {
        await this.open();
        await this.input.fill(value);
        await expect(this.input).toHaveValue(value);
    }

    public async chooseResult(name: string): Promise<void> {
        const result = this.popup.getByRole('button', {name, exact: true});
        await expect(result).toBeEnabled();
        await result.click();
    }

    public async close(): Promise<void> {
        await expect(this.popup).toBeVisible();
        await this.input.press('Escape');
        await expect(this.popup).toHaveCount(0);
    }
}

export const tuiNotification = (host: Locator): TuiNotificationHarness =>
    new TuiNotificationHarness(host);
export const tuiBadgedContent = (host: Locator): TuiBadgedContentHarness =>
    new TuiBadgedContentHarness(host);
export const tuiBlockStatus = (host: Locator): TuiBlockStatusHarness =>
    new TuiBlockStatusHarness(host);
export const tuiCard = (host: Locator): TuiCardHarness => new TuiCardHarness(host);
export const tuiInputSearch = (host: Locator): TuiInputSearchHarness =>
    new TuiInputSearchHarness(host);
