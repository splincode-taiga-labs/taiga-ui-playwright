import {expect, type Locator} from '@playwright/test';

const DAY_CELL = '[automation-id="tui-calendar-sheet__cell"]:not(.t-cell_unavailable):not(.t-cell_disabled)';

function ownedPortal(input: Locator): Promise<Locator> {
    return (async () => {
        await input.click();
        const id = await input.getAttribute('aria-controls');
        if (!id) {
            throw new Error('Date field is missing aria-controls; cannot scope the calendar portal.');
        }
        const page = input.page();
        const portal = page.locator('tui-dropdown:visible').and(page.locator('[id=' + JSON.stringify(id) + ']'));
        await expect(portal).toBeVisible();
        return portal;
    })();
}

/** CalendarRange renders two months, so select only days in the FIRST month. */
export class TuiCalendarRangeHarness {
    public constructor(public readonly host: Locator) {}

    public day(day: number): Locator {
        if (!Number.isInteger(day) || day < 1 || day > 31) {
            throw new RangeError('Range day must be an integer from 1 through 31.');
        }
        return this.host.locator('tui-calendar').first().locator(DAY_CELL)
            .filter({hasText: new RegExp('^\\s*' + day + '\\s*$')});
    }

    public async selectRange(startDay: number, endDay: number): Promise<void> {
        if (startDay > endDay) {
            throw new RangeError('Start day must be no later than end day within the same month.');
        }
        await this.day(startDay).click();
        await this.day(endDay).click();
        await expect(this.day(startDay)).toHaveAttribute('data-range', 'start');
        await expect(this.day(endDay)).toHaveAttribute('data-range', 'end');
    }
}

/** InputDateRange uses a portal with two calendars, not a simple day input. */
export class TuiInputDateRangeHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputDateRange]');
    }

    public async selectRange(startDay: number, endDay: number): Promise<void> {
        if (startDay > endDay) {
            throw new RangeError('Start day must be no later than end day within the same month.');
        }
        const portal = await ownedPortal(this.input);
        const range = new TuiCalendarRangeHarness(portal.locator('tui-calendar-range'));
        await range.day(startDay).click();
        await range.day(endDay).click();
        // InputDateRange closes its portal as soon as the range is complete.
        // Do not inspect detached calendar cells after the second click.
        await expect(this.input).not.toHaveValue('');
    }
}

/** InputDateTime combines an in-month calendar with a preserved time model. */
export class TuiInputDateTimeHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputDateTime]');
    }

    public async selectDay(day: number): Promise<void> {
        if (!Number.isInteger(day) || day < 1 || day > 31) {
            throw new RangeError('DateTime day must be an integer from 1 through 31.');
        }
        const portal = await ownedPortal(this.input);
        const cell = portal.locator('tui-calendar [automation-id="tui-calendar-sheet__cell"]:not(.t-cell_unavailable):not(.t-cell_disabled)')
            .filter({hasText: new RegExp('^\\s*' + day + '\\s*$')});
        await expect(cell).toHaveCount(1);
        await cell.click();
        await expect(this.input).not.toHaveValue('');
    }
}

/** Month input's popup is scoped through the input aria-controls relation. */
export class TuiInputMonthHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputMonth]');
    }

    public async selectMonth(index: number): Promise<void> {
        if (!Number.isInteger(index) || index < 0 || index > 11) {
            throw new RangeError('InputMonth expects a month index from 0 through 11.');
        }
        const portal = await ownedPortal(this.input);
        const month = portal.locator('tui-calendar-month .t-row > .t-cell').nth(index);
        await expect(month).toBeVisible();
        await expect(month).not.toHaveClass(/t-cell_disabled/);
        await month.click();
    }
}

export const tuiCalendarRange = (host: Locator): TuiCalendarRangeHarness => new TuiCalendarRangeHarness(host);
export const tuiInputDateRange = (host: Locator): TuiInputDateRangeHarness => new TuiInputDateRangeHarness(host);
export const tuiInputDateTime = (host: Locator): TuiInputDateTimeHarness => new TuiInputDateTimeHarness(host);
export const tuiInputMonth = (host: Locator): TuiInputMonthHarness => new TuiInputMonthHarness(host);
