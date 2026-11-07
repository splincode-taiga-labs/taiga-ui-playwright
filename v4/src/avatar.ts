import {expect, type Locator} from '@playwright/test';
import {TuiAvatarHarness as BaseAvatarHarness} from '@taiga-ui-labs/playwright';

/** Taiga UI v4 uses _round and data-type, unlike v5's data-shape / _fallback. */
export class TuiAvatarHarness extends BaseAvatarHarness {
    public override async expectShape(shape: 'round' | 'square'): Promise<void> {
        if (shape === 'round') {
            await expect(this.host).toHaveClass(/(?:^|\s)_round(?:\s|$)/);
        } else {
            await expect(this.host).not.toHaveClass(/(?:^|\s)_round(?:\s|$)/);
        }
        await expect(this.host).toBeVisible();
    }

    public override async expectImageFallback(): Promise<void> {
        await expect(this.host).toHaveAttribute('data-type', 'content');
    }
}

export const tuiAvatar = (host: Locator): TuiAvatarHarness => new TuiAvatarHarness(host);
