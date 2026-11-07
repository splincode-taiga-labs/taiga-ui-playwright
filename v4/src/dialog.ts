import {type Locator} from '@playwright/test';
import {TuiDialog as BaseDialog} from '@taiga-ui-labs/playwright';

/** Taiga UI 4 renders its heading inside .t-content rather than header. */
export class TuiDialog extends BaseDialog {
    public override get title(): Locator {
        return this.host.locator('.t-content > h2.t-heading');
    }

    /** v4 renders the close control using an automation-id rather than tuiButtonX. */
    public override get closeButton(): Locator {
        return this.host.locator('[automation-id="tui-dialog__close"]');
    }
}

export function tuiDialog(host: Locator): TuiDialog {
    return new TuiDialog(host);
}
