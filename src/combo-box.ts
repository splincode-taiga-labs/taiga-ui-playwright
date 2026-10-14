import {type Locator} from '@playwright/test';

import {TuiOptionsField, type TuiOptionsFieldOptions} from './options-field.js';

/** Playwright-native element object for Taiga UI v5 input[tuiComboBox]. */
export class TuiComboBox extends TuiOptionsField {
    public constructor(host: Locator, options: TuiOptionsFieldOptions = {}) {
        super(host, 'input[tuiComboBox]', options);
    }

    /** Enter filter text using native Playwright input events. */
    public async fill(value: string): Promise<void> {
        await this.input.fill(value);
    }
}

export function tuiComboBox(host: Locator, options: TuiOptionsFieldOptions = {}): TuiComboBox {
    return new TuiComboBox(host, options);
}
