import {expect, type Locator} from '@playwright/test';
import {exactText} from './locator-text.js';

export class TuiIconHarness {
    public constructor(public readonly host: Locator) {}

    public async expectIcon(name: string): Promise<void> {
        if (!/^[a-z][a-z0-9-]*$/.test(name)) {
            throw new Error('Icon name must be a safe Taiga UI asset name.');
        }
        await expect(this.host).toBeVisible();
        await expect.poll(() => this.host.evaluate((node) =>
            getComputedStyle(node).getPropertyValue('--t-icon-start').trim(),
        )).toContain('/' + name + '.svg');
    }

    public async iconUrl(): Promise<string> {
        const value = await this.host.evaluate((node) =>
            getComputedStyle(node).getPropertyValue('--t-icon-start').trim(),
        );
        const match = value.match(/^url\(["']?([^"')]+)["']?\)$/);
        if (!match?.[1]) {
            throw new Error('Taiga icon resolver did not provide a CSS mask URL.');
        }
        return new URL(match[1], this.host.page().url()).href;
    }
}

export class TuiFilterHarness {
    public constructor(public readonly host: Locator) {}

    public get items(): Locator {
        return this.host.locator('label.t-item');
    }

    public checkbox(name: string): Locator {
        return this.items.filter({hasText: exactText(name)}).getByRole('checkbox');
    }

    public async setChecked(name: string, checked: boolean): Promise<void> {
        const item = this.items.filter({hasText: exactText(name)});
        const checkbox = this.checkbox(name);
        await expect(item).toHaveCount(1);
        await expect(checkbox).toBeEnabled();
        const isChecked = await checkbox.isChecked();
        if (isChecked !== checked) {
            // Taiga UI overlays the native checkbox with its label content.
            // Click the accessible label, not the obscured input center.
            await item.click();
        }
        if (checked) {
            await expect(checkbox).toBeChecked();
        } else {
            await expect(checkbox).not.toBeChecked();
        }
    }

    public async expectSize(size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('data-size', size);
    }
}

export class TuiActionBarHarness {
    public constructor(public readonly host: Locator) {}

    public get expandable(): Locator {
        return this.host.locator('tui-expand');
    }

    public async expectExpanded(expanded: boolean): Promise<void> {
        if (expanded) {
            await expect(this.expandable).toHaveClass(/(?:^|\s)_expanded(?:\s|$)/);
        } else {
            await expect(this.expandable).not.toHaveClass(/(?:^|\s)_expanded(?:\s|$)/);
        }
    }

    public async clickAction(name: string): Promise<void> {
        const action = this.host.getByRole('button', {name, exact: true});
        await expect(action).toBeEnabled();
        await action.click();
    }

    public async clickMenuOption(name: string): Promise<void> {
        await this.expectExpanded(true);
        const option = this.expandable.getByRole('option', {name, exact: true});
        await expect(option).toHaveCount(1);
        await expect(option).toBeEnabled();
        await option.click();
    }

    public async expectSize(size: string): Promise<void> {
        await expect(this.host).toHaveAttribute('data-size', size);
    }
}

export class TuiPulseHarness {
    public constructor(public readonly host: Locator) {}

    public async expectPlaying(playing: boolean): Promise<void> {
        if (playing) {
            await expect(this.host).toHaveClass(/(?:^|\s)_playing(?:\s|$)/);
        } else {
            await expect(this.host).not.toHaveClass(/(?:^|\s)_playing(?:\s|$)/);
        }
    }
}

export class TuiCompassHarness {
    public constructor(public readonly host: Locator) {}

    public async expectDegrees(degrees: number): Promise<void> {
        if (!Number.isFinite(degrees)) {
            throw new RangeError('Compass degrees must be finite.');
        }
        await expect(this.host).toHaveCSS('--t-degrees', degrees + 'deg');
    }
}

export const tuiIcon = (host: Locator): TuiIconHarness => new TuiIconHarness(host);
export const tuiFilter = (host: Locator): TuiFilterHarness => new TuiFilterHarness(host);
export const tuiActionBar = (host: Locator): TuiActionBarHarness => new TuiActionBarHarness(host);
export const tuiPulse = (host: Locator): TuiPulseHarness => new TuiPulseHarness(host);
export const tuiCompass = (host: Locator): TuiCompassHarness => new TuiCompassHarness(host);
