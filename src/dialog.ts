import {expect, type Locator} from '@playwright/test';

/** Scoped helper for a Taiga UI v5 tui-dialog portal. */
export class TuiDialog {
    public constructor(public readonly host: Locator) {}

    public get title(): Locator {
        return this.host.locator('header h2').first();
    }

    public get closeButton(): Locator {
        return this.host.locator('button[tuiButtonX]');
    }

    public button(name: string): Locator {
        return this.host.getByRole('button', {name, exact: true});
    }

    public async close(): Promise<void> {
        await this.closeButton.click();
        await expect(this.host).toBeHidden();
    }

    public async clickButton(name: string): Promise<void> {
        await this.button(name).click();
    }
}

export function tuiDialog(host: Locator): TuiDialog {
    return new TuiDialog(host);
}
