import {expect, type Locator} from '@playwright/test';
import {
    TuiComboBox as BaseComboBox,
    type TuiOptionsFieldOptions,
} from '@taiga-ui-labs/playwright';

/**
 * Taiga UI 4's strict ComboBox may clear incomplete text when it loses focus.
 * With a single filtered option, Enter selects it through the native v4
 * ComboBox keydown handler without triggering blur before selection.
 */
export class TuiComboBox extends BaseComboBox {
    public override async selectOption(label: string): Promise<void> {
        await this.open();

        const option = this.option(label);

        await expect(option).toBeVisible();
        await expect(option).toBeEnabled();

        if (await this.options.count() === 1) {
            await this.input.press('Enter');
            return;
        }

        await super.selectOption(label);
    }
}

export function tuiComboBox(
    host: Locator,
    options: TuiOptionsFieldOptions = {},
): TuiComboBox {
    return new TuiComboBox(host, options);
}
