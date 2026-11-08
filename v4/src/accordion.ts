import {expect, type Locator} from '@playwright/test';
import {TuiAccordionHarness as BaseAccordionHarness} from '@taiga-ui-labs/playwright';

/**
 * Taiga UI 4 renders tui-accordion-item headers with automation-id and a
 * t-header_open class, not the v5 tuiAccordion/aria-expanded contract.
 */
export class TuiAccordionHarness extends BaseAccordionHarness {
    public override trigger(name: string): Locator {
        return this.host
            .locator('[automation-id="tui-accordion__item-header"]')
            .and(this.host.getByRole('button', {name, exact: true}));
    }

    public override async expand(name: string): Promise<Locator> {
        const trigger = this.trigger(name);
        await expect(trigger).toHaveCount(1);

        if (!(await trigger.evaluate((element) => element.classList.contains('t-header_open')))) {
            await trigger.click();
        }

        await expect(trigger).toHaveClass(/t-header_open/);
        const panel = this.host.locator('tui-accordion-item').filter({has: trigger}).locator('tui-expand');
        await expect(panel.locator('[automation-id="tui-accordion__item-content"]')).toBeVisible();
        return panel;
    }

    public override async collapse(name: string): Promise<void> {
        const trigger = this.trigger(name);
        await expect(trigger).toHaveCount(1);

        if (await trigger.evaluate((element) => element.classList.contains('t-header_open'))) {
            await trigger.click();
        }

        await expect(trigger).not.toHaveClass(/t-header_open/);
    }
}

export const tuiAccordion = (host: Locator): TuiAccordionHarness => new TuiAccordionHarness(host);
