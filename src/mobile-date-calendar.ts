import {expect, type Locator} from '@playwright/test';

const ACTIVE_DAY = '.t-cell[data-range="active"], .t-cell[data-range="start"], .t-cell[data-range="end"]';
const DAY_CELL = '[automation-id="tui-primitive-calendar-mobile__cell"]';

function validDay(day: number): void {
    if (!Number.isInteger(day) || day < 1 || day > 31) {
        throw new RangeError('Mobile calendar day must be an integer from 1 through 31.');
    }
}

/**
 * Select dates from an already-opened tuiMobileCalendar popup.
 * Opening the calendar is application-specific: a mobile field does not toggle
 * its popup on input click like its desktop counterpart.
 */
export class TuiMobileDateCalendarHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputDate], input[tuiInputDateRange]');
    }

    public async portal(): Promise<Locator> {
        await expect(this.input).toHaveCount(1);

        if ((await this.input.getAttribute('aria-expanded')) !== 'true') {
            throw new Error('Mobile calendar is closed; open tuiMobileCalendar before selecting a date.');
        }

        const id = (await this.input.getAttribute('aria-controls'))?.trim();

        if (!id || id.split(/\s+/).length !== 1) {
            throw new Error('Mobile calendar requires one aria-controls ID for its owning input.');
        }

        const page = this.host.page();
        const portal = page.locator('tui-mobile-calendar-dropdown:visible')
            .and(page.locator('[id=' + JSON.stringify(id) + ']'));

        await expect(portal).toHaveCount(1);
        await expect(portal.locator('tui-mobile-calendar')).toBeVisible();

        return portal;
    }

    private async chooseDay(portal: Locator, day: number): Promise<void> {
        validDay(day);

        // The mobile calendar virtualizes months. Use the currently selected
        // month rather than an arbitrary similarly named day in another month.
        const selectedMonth = portal.locator('tui-mobile-calendar-sheet')
            .filter({has: portal.locator(ACTIVE_DAY)});
        await expect(selectedMonth).toHaveCount(1);

        const cell = selectedMonth.locator(DAY_CELL)
            .filter({hasText: new RegExp('^\\s*' + day + '\\s*$')});

        await expect(cell).toHaveCount(1);
        await expect(cell).toBeVisible();
        await expect(cell).not.toHaveClass(/t-cell_disabled/);
        await cell.click();
    }

    private async confirm(portal: Locator): Promise<void> {
        const confirm = portal.locator('[automation-id="tui-mobile-calendar__confirm"]');
        await expect(confirm).toBeEnabled();
        await confirm.click();
        await expect(portal).toBeHidden();
    }

    public async selectDay(day: number): Promise<void> {
        if (await this.input.getAttribute('tuiInputDateRange') !== null) {
            throw new Error('Use selectRange() for a mobile InputDateRange field.');
        }

        const portal = await this.portal();
        await this.chooseDay(portal, day);
        await this.confirm(portal);
        await expect(this.input).not.toHaveValue('');
    }

    public async selectRange(start: number, end: number): Promise<void> {
        if (await this.input.getAttribute('tuiInputDateRange') === null) {
            throw new Error('Use selectDay() for a mobile InputDate field.');
        }

        validDay(start);
        validDay(end);

        if (start > end) {
            throw new RangeError('Start day must not exceed end day in the same month.');
        }

        const portal = await this.portal();
        await this.chooseDay(portal, start);
        await this.chooseDay(portal, end);
        await this.confirm(portal);
        await expect(this.input).not.toHaveValue('');
    }
}

export const tuiMobileDateCalendar = (host: Locator): TuiMobileDateCalendarHarness =>
    new TuiMobileDateCalendarHarness(host);
