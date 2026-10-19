import {type Locator} from '@playwright/test';

import {TuiOptionsField, type TuiOptionsFieldOptions} from './options-field.js';

export class TuiSelect extends TuiOptionsField {
    public constructor(host: Locator, options: TuiOptionsFieldOptions = {}) {
        super(host, 'input[tuiSelect]', options);
    }
}

export function tuiSelect(host: Locator, options: TuiOptionsFieldOptions = {}): TuiSelect {
    return new TuiSelect(host, options);
}
