import {expect, type Locator} from '@playwright/test';

export class TuiTypedFieldHarness {
    public constructor(
        public readonly host: Locator,
        private readonly selector: string,
    ) {}

    public get input(): Locator {
        return this.host.locator(this.selector);
    }

    public async fill(value: string): Promise<void> {
        await this.input.fill(value);
    }

    public async value(): Promise<string> {
        return this.input.inputValue();
    }
}

export class TuiSliderHarness {
    public constructor(public readonly host: Locator) {}

    public async stepRight(): Promise<void> {
        await expect(this.host).toBeEnabled();
        await this.host.focus();
        await this.host.press('ArrowRight');
    }

    public async stepLeft(): Promise<void> {
        await expect(this.host).toBeEnabled();
        await this.host.focus();
        await this.host.press('ArrowLeft');
    }

    public async value(): Promise<number> {
        return Number(await this.host.inputValue());
    }
}

export const tuiInputNumber = (host: Locator): TuiTypedFieldHarness =>
    new TuiTypedFieldHarness(host, 'input[tuiInputNumber]');
export const tuiInputPhone = (host: Locator): TuiTypedFieldHarness =>
    new TuiTypedFieldHarness(host, 'input[tuiInputPhone]');
export const tuiInputPin = (host: Locator): TuiTypedFieldHarness =>
    new TuiTypedFieldHarness(host, 'input[tuiInputPin]');
export const tuiInputColor = (host: Locator): TuiTypedFieldHarness =>
    new TuiTypedFieldHarness(host, 'input[tuiInputColor]');
export const tuiInputSlider = (host: Locator): TuiTypedFieldHarness =>
    new TuiTypedFieldHarness(host, 'input[tuiInputSlider]');
export const tuiSlider = (host: Locator): TuiSliderHarness => new TuiSliderHarness(host);
