import {expect, type Locator} from '@playwright/test';

const DAY_SELECTOR = 'tui-calendar-sheet [automation-id="tui-calendar-sheet__cell"]:not(.t-cell_unavailable):not(.t-cell_disabled)';

function exactLabel(text: string): RegExp {
    return new RegExp('^\\s*' + text.replace(/[.*+?^$()|[\]{}\\]/g, '\\$&') + '\\s*$');
}

/** Calendar dates are scoped to the calendar host, not a page-wide portal. */
export class TuiCalendarHarness {
    public constructor(public readonly host: Locator) {}

    public day(day: number): Locator {
        if (!Number.isInteger(day) || day < 1 || day > 31) {
            throw new RangeError('Calendar day must be an integer from 1 through 31.');
        }
        return this.host.locator(DAY_SELECTOR).filter({hasText: exactLabel(String(day))});
    }

    public async selectDay(day: number): Promise<void> {
        const cell = this.day(day);
        await expect(cell).toHaveCount(1);
        await cell.click();
        await expect(cell).toHaveAttribute('data-range', 'active');
    }
}

/** CalendarMonth has month cells rather than native buttons. */
export class TuiCalendarMonthHarness {
    public constructor(public readonly host: Locator) {}

    public month(name: string): Locator {
        return this.host.locator('.t-cell:not(.t-cell_disabled)').filter({hasText: exactLabel(name)});
    }

    public async selectMonth(name: string): Promise<void> {
        const month = this.month(name);
        await expect(month).toHaveCount(1);
        await month.click();
    }
}

/** An InputDate's calendar is portaled outside its tui-textfield host. */
export class TuiInputDateHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputDate]');
    }

    public async calendar(): Promise<TuiCalendarHarness> {
        await this.input.click();
        const controls = await this.input.getAttribute('aria-controls');
        if (!controls) {
            throw new Error('InputDate has no aria-controls; cannot safely identify its calendar portal.');
        }
        const portal = this.host.page().locator('tui-dropdown:visible').and(
            this.host.page().locator('[id=' + JSON.stringify(controls) + ']'),
        );
        await expect(portal).toBeVisible();
        return new TuiCalendarHarness(portal.locator('tui-calendar'));
    }

    public async selectDay(day: number): Promise<void> {
        const calendar = await this.calendar();
        await calendar.selectDay(day);
        await expect(this.host.page().locator('tui-dropdown:visible').filter({
            has: calendar.host,
        })).toHaveCount(0);
    }
}

/** InputYear parses year values into a numeric Angular form model. */
export class TuiInputYearHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputYear]');
    }

    public async fillYear(year: number): Promise<void> {
        if (!Number.isInteger(year) || year < 1000 || year > 9999) {
            throw new RangeError('InputYear requires a four-digit year.');
        }
        await this.input.fill(String(year));
        await expect(this.input).toHaveValue(String(year));
    }
}

/** InputTime masks time segments; use an explicit HH:MM value. */
export class TuiInputTimeHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputTime]');
    }

    public async fillTime(time: string): Promise<void> {
        if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) {
            throw new RangeError('InputTime expects 24-hour HH:MM.');
        }
        await this.input.fill(time);
        await expect(this.input).toHaveValue(time);
    }
}

export const tuiCalendar = (host: Locator): TuiCalendarHarness => new TuiCalendarHarness(host);
export const tuiCalendarMonth = (host: Locator): TuiCalendarMonthHarness => new TuiCalendarMonthHarness(host);
export const tuiInputDate = (host: Locator): TuiInputDateHarness => new TuiInputDateHarness(host);
export const tuiInputYear = (host: Locator): TuiInputYearHarness => new TuiInputYearHarness(host);
export const tuiInputTime = (host: Locator): TuiInputTimeHarness => new TuiInputTimeHarness(host);
