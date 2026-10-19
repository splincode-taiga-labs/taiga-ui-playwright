import {expect, type Locator} from '@playwright/test';

const DAY_SELECTOR = 'tui-calendar-sheet [automation-id="tui-calendar-sheet__cell"]:not(.t-cell_unavailable):not(.t-cell_disabled)';

function exactLabel(text: string): RegExp {
    return new RegExp('^\\s*' + text.replace(/[.*+?^$()|[\]{}\\]/g, '\\$&') + '\\s*$');
}

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

export class TuiCalendarMonthHarness {
    public constructor(public readonly host: Locator) {}

    /** Zero-based month index (0 = January); independent of UI localization. */
    public month(index: number): Locator {
        if (!Number.isInteger(index) || index < 0 || index > 11) {
            throw new RangeError('CalendarMonth index must be an integer from 0 through 11.');
        }
        return this.host.locator('.t-row > .t-cell').nth(index);
    }

    public async selectMonth(index: number): Promise<void> {
        const month = this.month(index);
        await expect(month).toBeVisible();
        await expect(month).not.toHaveClass(/t-cell_disabled/);
        await month.click();
    }
}

export class TuiInputDateHarness {
    public constructor(public readonly host: Locator) {}

    public get input(): Locator {
        return this.host.locator('input[tuiInputDate]');
    }

    public async calendar(): Promise<TuiCalendarHarness> {
        if ((await this.input.getAttribute('aria-expanded')) !== 'true') {
            await this.input.click();
        }
        const controls = (await this.input.getAttribute('aria-controls'))?.trim();
        if (!controls || controls.split(/\s+/).length !== 1) {
            throw new Error('InputDate requires a single aria-controls ID to identify its calendar portal.');
        }
        const portal = this.host.page().locator('tui-dropdown:visible').and(
            this.host.page().locator('[id=' + JSON.stringify(controls) + ']'),
        );
        await expect(portal).toBeVisible();
        return new TuiCalendarHarness(portal.locator('tui-calendar'));
    }

    public async selectDay(day: number): Promise<void> {
        const calendar = await this.calendar();
        const cell = calendar.day(day);
        await expect(cell).toHaveCount(1);
        await cell.click();
        await expect(this.input).not.toHaveValue('');
    }
}

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
