import {expect, type Locator} from '@playwright/test';

/**
 * Taiga UI native controls retain their native browser semantics.
 * Pass a Locator scoped to one real component, not a page-wide selector.
 */
export class TuiButtonHarness {
    public constructor(public readonly host: Locator) {}

    public async click(): Promise<void> {
        await expect(this.host).toBeEnabled();
        await this.host.click();
    }
}

export class TuiCheckboxHarness {
    public constructor(public readonly host: Locator) {}

    public async check(): Promise<void> {
        await this.host.check();
        await expect(this.host).toBeChecked();
    }

    public async uncheck(): Promise<void> {
        await this.host.uncheck();
        await expect(this.host).not.toBeChecked();
    }

    public get checked(): Locator {
        return this.host;
    }
}

export class TuiRadioHarness {
    public constructor(public readonly host: Locator) {}

    public async check(): Promise<void> {
        await this.host.check();
        await expect(this.host).toBeChecked();
    }
}

export class TuiInputHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInput]');
    }

    public async fill(value: string): Promise<void> {
        await this.input.fill(value);
        await expect(this.input).toHaveValue(value);
    }
}

export class TuiSwitchHarness {
    public constructor(public readonly host: Locator) {}

    public async setChecked(checked: boolean): Promise<void> {
        await this.host.setChecked(checked);
        if (checked) {
            await expect(this.host).toBeChecked();
        } else {
            await expect(this.host).not.toBeChecked();
        }
    }
}

export class TuiTextareaHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('textarea[tuiTextarea]');
    }

    public async fill(value: string): Promise<void> {
        await this.input.fill(value);
        await expect(this.input).toHaveValue(value);
    }
}

export class TuiTabsHarness {
    public constructor(public readonly host: Locator) {}

    public tab(name: string): Locator {
        return this.host.locator('[tuiTab]').getByText(name, {exact: true});
    }

    public async select(name: string): Promise<void> {
        const tab = this.host.locator('[tuiTab]').filter({hasText: name});
        await expect(tab).toHaveCount(1);
        await expect(tab).toBeEnabled();
        await tab.click();
        await expect(tab).toHaveClass(/(?:^|\\s)_active(?:\\s|$)/);
    }
}

export class TuiSegmentedHarness {
    public constructor(public readonly host: Locator) {}

    public option(name: string): Locator {
        return this.host.getByRole('button', {name, exact: true});
    }

    public async select(name: string): Promise<void> {
        const option = this.option(name);
        await expect(option).toBeEnabled();
        await option.click();
        await expect(option).toHaveClass(/(?:^|\\s)tui-segmented_active(?:\\s|$)/);
    }
}

export class TuiAccordionHarness {
    public constructor(public readonly host: Locator) {}

    public trigger(name: string): Locator {
        return this.host.locator('button[tuiAccordion]').filter({hasText: name});
    }

    public async expand(name: string): Promise<Locator> {
        const trigger = this.trigger(name);
        await expect(trigger).toHaveCount(1);
        if (await trigger.getAttribute('aria-expanded') !== 'true') {
            await trigger.click();
        }
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        const id = await trigger.getAttribute('aria-controls');
        if (!id) throw new Error('Accordion trigger is missing aria-controls');
        const panel = this.host.locator('tui-expand').and(this.host.page().locator('[id=' + JSON.stringify(id) + ']'));
        await expect(panel).toBeVisible();
        return panel;
    }

    public async collapse(name: string): Promise<void> {
        const trigger = this.trigger(name);
        if (await trigger.getAttribute('aria-expanded') === 'true') {
            await trigger.click();
        }
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    }
}

export class TuiPaginationHarness {
    public constructor(public readonly host: Locator) {}

    public page(number: number): Locator {
        return this.host.locator('button[automation-id="tui-pagination__element"]').filter({
            hasText: new RegExp('^\\s*' + number + '\\s*$'),
        });
    }

    public async goTo(number: number): Promise<void> {
        if (!Number.isInteger(number) || number < 1) {
            throw new RangeError('Page numbers must be positive integers (1-based).');
        }
        const page = this.page(number);
        await expect(page).toHaveCount(1);
        await page.click();
        await expect(page).toHaveAttribute('data-appearance', 'primary');
    }
}

export class TuiStepperHarness {
    public constructor(public readonly host: Locator) {}

    public step(name: string): Locator {
        return this.host.locator('[tuiStep]').filter({hasText: name});
    }

    public async activate(name: string): Promise<void> {
        const step = this.step(name);
        await expect(step).toHaveCount(1);
        await expect(step).toBeEnabled();
        await step.click();
        await expect(step).toHaveClass(/(?:^|\\s)_active(?:\\s|$)/);
    }
}

export const tuiButton = (host: Locator): TuiButtonHarness => new TuiButtonHarness(host);
export const tuiCheckbox = (host: Locator): TuiCheckboxHarness => new TuiCheckboxHarness(host);
export const tuiRadio = (host: Locator): TuiRadioHarness => new TuiRadioHarness(host);
export const tuiInput = (host: Locator): TuiInputHarness => new TuiInputHarness(host);
export const tuiSwitch = (host: Locator): TuiSwitchHarness => new TuiSwitchHarness(host);
export const tuiTextarea = (host: Locator): TuiTextareaHarness => new TuiTextareaHarness(host);
export const tuiTabs = (host: Locator): TuiTabsHarness => new TuiTabsHarness(host);
export const tuiSegmented = (host: Locator): TuiSegmentedHarness => new TuiSegmentedHarness(host);
export const tuiAccordion = (host: Locator): TuiAccordionHarness => new TuiAccordionHarness(host);
export const tuiPagination = (host: Locator): TuiPaginationHarness => new TuiPaginationHarness(host);
export const tuiStepper = (host: Locator): TuiStepperHarness => new TuiStepperHarness(host);
