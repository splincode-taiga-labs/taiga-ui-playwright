import {expect, type Locator} from '@playwright/test';

const ACTIVE_DAY = '.t-cell[data-range="active"], .t-cell[data-range="start"]';
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
        await expect(this.input, 'Open tuiMobileCalendar before selecting a date')
            .toHaveAttribute('aria-expanded', 'true');

        const id = (await this.input.getAttribute('aria-controls'))?.trim();

        if (!id || id.split(/\s+/).length !== 1) {
            throw new Error('Mobile calendar requires one aria-controls ID for its owning input.');
        }

        const page = this.host.page();
        const portal = page.locator('tui-mobile-calendar-dropdown:visible')
            .and(page.locator('[id=' + JSON.stringify(id) + ']'));

        await expect(portal).toHaveCount(1);
        const calendar = portal.locator('tui-mobile-calendar');
        await expect(calendar).toBeVisible();
        await expect(calendar).toHaveClass(/(?:^|\s)_initialized(?:\s|$)/);

        return portal;
    }

    private async scrollEarlier(portal: Locator, month: Locator): Promise<void> {
        const viewport = portal.locator('tui-mobile-calendar .t-months');
        await expect(viewport).toHaveCount(1);
        const height = await month.evaluate((element) => element.getBoundingClientRect().height);

        // Keep the anchor in the rendered range while revealing its predecessor.
        await viewport.evaluate((element, monthHeight) => {
            element.scrollBy({
                top: -Math.min(element.clientHeight, monthHeight) / 2,
                behavior: 'instant',
            });
        }, height);
    }

    private async selectedMonth(portal: Locator): Promise<Locator> {
        const selected = portal.locator('.t-month-wrapper:has(' + ACTIVE_DAY + ')');
        const end = portal.locator('.t-month-wrapper:has(.t-cell[data-range="end"])');

        // Taiga UI opens a saved range at its end, which can leave the start
        // month outside the virtualized DOM even for an adjacent-month range.
        if (await selected.count() === 0 && await end.count() === 1) {
            await this.scrollEarlier(portal, end);
        }

        await expect(selected, 'Expected one selected date or range start month in the owned mobile calendar')
            .toHaveCount(1);

        return selected;
    }

    private async chooseDay(portal: Locator, day: number): Promise<void> {
        validDay(day);

        const selectedMonth = await this.selectedMonth(portal);
        const cell = selectedMonth.locator(
            'tui-mobile-calendar-sheet ' + DAY_CELL,
        ).filter({hasText: new RegExp('^\\s*' + day + '\\s*$')});

        await expect(cell).toHaveCount(1);
        await expect(cell).toBeVisible();
        await expect(cell).not.toHaveClass(/t-cell_disabled/);
        await cell.click();
    }

    /** Select a date in the adjacent virtual-scroll month of the unique current selection. */
    private async chooseAdjacentMonthDay(
        portal: Locator,
        day: number,
        direction: 'next' | 'previous',
    ): Promise<void> {
        validDay(day);

        const selected = await this.selectedMonth(portal);

        const sibling = direction === 'next' ? 'following-sibling' : 'preceding-sibling';
        const adjacent = selected.locator('xpath=' + sibling + '::section[1]');

        if (direction === 'previous' && await adjacent.count() === 0) {
            await this.scrollEarlier(portal, selected);
        }

        await expect(adjacent, 'Expected an adjacent rendered mobile calendar month')
            .toHaveCount(1);
        await adjacent.scrollIntoViewIfNeeded();

        const cell = adjacent.locator('tui-mobile-calendar-sheet ' + DAY_CELL)
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

    /** Select a day in the preceding or following month of the current selection. */
    public async selectAdjacentMonthDay(
        day: number,
        direction: 'next' | 'previous' = 'next',
    ): Promise<void> {
        if (await this.input.getAttribute('tuiInputDateRange') !== null) {
            throw new Error('Use selectRangeAcrossNextMonth() for a mobile date-range field.');
        }

        const portal = await this.portal();
        await this.chooseAdjacentMonthDay(portal, day, direction);
        await this.confirm(portal);
        await expect(this.input).not.toHaveValue('');
    }

    /** Choose a forward range that crosses into the following calendar month. */
    public async selectRangeAcrossNextMonth(startDay: number, endDay: number): Promise<void> {
        if (await this.input.getAttribute('tuiInputDateRange') === null) {
            throw new Error('Use selectAdjacentMonthDay() for a mobile single-date field.');
        }

        validDay(startDay);
        validDay(endDay);

        const portal = await this.portal();
        await this.chooseDay(portal, startDay);
        await this.chooseAdjacentMonthDay(portal, endDay, 'next');
        await this.confirm(portal);
        await expect(this.input).not.toHaveValue('');
    }

    /** Replace a range within its start month, including a saved cross-month range. */
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
