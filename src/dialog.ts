import {expect, type Locator} from '@playwright/test';

export class TuiDialog {
    public constructor(public readonly host: Locator) {}

    public get title(): Locator {
        return this.host.locator('header h2');
    }

    public get closeButton(): Locator {
        return this.host.locator('button[tuiButtonX]');
    }

    public button(name: string): Locator {
        return this.host.getByRole('button', {name, exact: true});
    }

    /**
     * Close through Taiga UI's own close button, waiting for async guards and
     * exit animations. Non-closable dialogs fail explicitly rather than timing out.
     */
    public async close(): Promise<void> {
        await expect(this.host).toBeVisible();

        if (await this.closeButton.count() === 0) {
            throw new Error('This Taiga UI dialog has no close button (closable: false). Use a dialog action or dismiss it with its configured mechanism.');
        }

        await expect(this.closeButton).toBeEnabled();
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
