import {expect, type Locator} from '@playwright/test';

/** Native range keyboard interaction, scoped to the Taiga UI rating host. */
export class TuiRatingHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[type="range"]');
    }

    public async rate(value: number): Promise<void> {
        const max = Number(await this.input.getAttribute('max'));

        if (!Number.isInteger(value) || value < 1 || value > max) {
            throw new RangeError(`Rating must be an integer from 1 to ${max}.`);
        }

        await expect(this.input).toBeEnabled();
        await expect(this.input).not.toHaveAttribute('aria-disabled', 'true');
        await this.input.focus();
        await this.input.press('Home');

        for (let current = 1; current < value; current++) {
            await this.input.press('ArrowRight');
        }

        await expect(this.input).toHaveValue(String(value));
    }

    public async value(): Promise<number> {
        return Number(await this.input.inputValue());
    }
}

/** Taiga UI Like is a decorated native checkbox; use native checkbox semantics. */
export class TuiLikeHarness {
    public constructor(public readonly host: Locator) {}

    public async setLiked(liked: boolean): Promise<void> {
        await this.host.setChecked(liked);
        if (liked) {
            await expect(this.host).toBeChecked();
        } else {
            await expect(this.host).not.toBeChecked();
        }
    }
}

/** Clipboard permission and reading remain under Playwright's browser context. */
export class TuiCopyHarness {
    public constructor(public readonly host: Locator) {}

    public get button(): Locator {
        return this.host.locator('button.t-button');
    }

    public get content(): Locator {
        return this.host.locator('.t-content');
    }

    public async copy(): Promise<void> {
        await expect(this.button).toBeEnabled();
        await this.button.click();
    }
}

/** InputChip commits entered values into an Angular array control. */
export class TuiInputChipHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputChip]');
    }

    public chip(text: string): Locator {
        return this.host.locator('tui-input-chip').filter({hasText: text});
    }

    public async add(text: string): Promise<void> {
        if (!text.trim()) {
            throw new Error('Chip text must not be empty.');
        }

        await this.input.fill(text);
        await this.input.press('Enter');
        console.log('InputChip diagnostics:', JSON.stringify({
            input: await this.input.inputValue(),
            model: await this.host.page().getByTestId('chip-model').textContent(),
            html: (await this.host.innerHTML()).slice(0, 4000),
        }));
        await expect(this.chip(text)).toHaveCount(1);
    }

    public async remove(text: string): Promise<void> {
        const chip = this.chip(text);
        await expect(chip).toHaveCount(1);
        await chip.press('Backspace');
        await expect(chip).toHaveCount(0);
    }
}

/** Native progress value and max are observable DOM properties. */
export class TuiProgressHarness {
    public constructor(public readonly host: Locator) {}

    public async value(): Promise<number> {
        return this.host.evaluate((element) => (element as HTMLProgressElement).value);
    }

    public async max(): Promise<number> {
        return this.host.evaluate((element) => (element as HTMLProgressElement).max);
    }

    public async expectValue(value: number): Promise<void> {
        await expect(this.host).toHaveJSProperty('value', value);
    }
}

export const tuiRating = (host: Locator): TuiRatingHarness => new TuiRatingHarness(host);
export const tuiLike = (host: Locator): TuiLikeHarness => new TuiLikeHarness(host);
export const tuiCopy = (host: Locator): TuiCopyHarness => new TuiCopyHarness(host);
export const tuiInputChip = (host: Locator): TuiInputChipHarness => new TuiInputChipHarness(host);
export const tuiProgress = (host: Locator): TuiProgressHarness => new TuiProgressHarness(host);
