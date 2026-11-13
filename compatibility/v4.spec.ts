import {expect, test} from '@playwright/test';

import {packageApi} from './api';

const {
    tuiButton, tuiSelect, tuiComboBox, tuiCheckbox, tuiRadio, tuiSwitch,
    tuiTabs, tuiSegmented, tuiTextarea, tuiPagination, tuiStepper, tuiInputNumber,
    tuiLink, tuiBadge, tuiChip, tuiBadgeNotification, tuiLike, tuiProgress,
    tuiLoader, tuiExpand, tuiAvatar, tuiTextfield, tuiCalendar, tuiInputDate, tuiMultiSelect, tuiDialog,
    tuiAccordion, tuiRating, tuiBreadcrumbs, tuiInputTime, tuiInputPhone, tuiInputSlider,
    tuiInputDateRange, tuiInputDateMulti, tuiInputMonth,
    tuiInputMonthRange, tuiInputDateTime, tuiInputYear,
    tuiInputRange, tuiInputChip, tuiInputPin,
    tuiInputColor, tuiInputInline, tuiCalendarMonth,
    tuiCounter, tuiRadioList, tuiSlider, tuiRange,
} = await packageApi('./v4');

test('v4 entrypoint exposes the same runtime API as the package root', async () => {
    const root = await packageApi('.');
    const v4 = await packageApi('./v4');

    expect(Object.keys(v4).sort()).toEqual(Object.keys(root).sort());
});

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByRole('heading', {name: 'Taiga UI 4 demo'})).toBeVisible();
});

test('button updates Angular state', async ({page}) => {
    await tuiButton(page.getByTestId('save-button')).click();
    await expect(page.getByTestId('save-model')).toHaveText('1');
});

test('Select updates FormControl via a v4 dropdown', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));
    await select.selectOption('Estonia');
    await expect(page.getByTestId('country-model')).toHaveText('Estonia');
});

test('ComboBox updates FormControl via a v4 dropdown', async ({page}) => {
    const combo = tuiComboBox(page.getByTestId('city-field'));
    await combo.fill('Tall');
    await combo.selectOption('Tallinn');
    await expect(combo.input).toHaveValue('Tallinn');
    await expect(page.getByTestId('city-model')).toHaveText('Tallinn');
});


test('Checkbox updates a real v4 Angular form control', async ({page}) => {
    const checkbox = tuiCheckbox(page.getByTestId('checkbox'));
    await checkbox.check();
    await expect(page.getByTestId('checkbox-model')).toHaveText('true');
    await checkbox.uncheck();
    await expect(page.getByTestId('checkbox-model')).toHaveText('false');
});

test('Radio updates a real v4 Angular form control', async ({page}) => {
    await tuiRadio(page.getByTestId('radio-pro')).check();
    await expect(page.getByTestId('radio-model')).toHaveText('pro');
});

test('Switch updates a real v4 Angular form control', async ({page}) => {
    await tuiSwitch(page.getByTestId('switch')).setChecked(true);
    await expect(page.getByTestId('switch-model')).toHaveText('true');
});

test('Tabs switch the active v4 tab', async ({page}) => {
    await tuiTabs(page.getByTestId('tabs')).select('Details');
    await expect(page.getByTestId('tabs-model')).toHaveText('1');
});

test('Segmented switches the active v4 option', async ({page}) => {
    await tuiSegmented(page.getByTestId('segmented')).select('Cards');
    await expect(page.getByTestId('segmented-model')).toHaveText('1');
});

test('Textarea updates a real v4 Angular form control', async ({page}) => {
    await tuiTextarea(page.getByTestId('notes-field')).fill('Example notes');
    await expect(page.getByTestId('notes-model')).toHaveText('Example notes');
});

test('Pagination selects the requested v4 page', async ({page}) => {
    await tuiPagination(page.getByTestId('pagination')).goTo(2);
    await expect(page.getByTestId('pagination-model')).toHaveText('1');
});

test('Stepper activates the named v4 step', async ({page}) => {
    await tuiStepper(page.getByTestId('stepper')).activate('Review');
    await expect(page.getByTestId('stepper-model')).toHaveText('1');
});

test('InputNumber fills the real v4 textfield', async ({page}) => {
    const input = tuiInputNumber(page.getByTestId('number-field'));
    await input.fill('42');
    await expect(page.getByTestId('number-model')).toHaveText('42');
});


test('Link follows an anchor in the v4 Angular demo', async ({page}) => {
    const link = tuiLink(page.getByTestId('link'));
    expect(await link.href()).toBe('#v4-link-target');
    await link.follow();
    await expect(page).toHaveURL(/#v4-link-target$/);
});

test('Badge reads v4 appearance and size', async ({page}) => {
    await tuiBadge(page.getByTestId('badge')).expectAppearanceAndSize('primary', 'm');
});

test('Chip reads v4 appearance', async ({page}) => {
    await tuiChip(page.getByTestId('chip')).expectAppearance('neutral');
});

test('BadgeNotification reads real count and size', async ({page}) => {
    const badge = tuiBadgeNotification(page.getByTestId('notification-badge'));
    await badge.expectCount(7);
    await badge.expectSize('l');
});

test('Like updates a real v4 FormControl', async ({page}) => {
    const like = tuiLike(page.getByTestId('like'));
    await like.setLiked(true);
    await expect(page.getByTestId('like-model')).toHaveText('true');
    await like.setLiked(false);
    await expect(page.getByTestId('like-model')).toHaveText('false');
});

test('Progress reflects native DOM and Angular state', async ({page}) => {
    const progress = tuiProgress(page.getByTestId('progress'));
    await progress.expectValue(25);
    expect(await progress.max()).toBe(100);
    await page.getByRole('button', {name: 'Set progress to 75'}).click();
    await progress.expectValue(75);
    await expect(page.getByTestId('progress-model')).toHaveText('75');
});

test('Loader transitions from loading to idle in v4', async ({page}) => {
    const loader = tuiLoader(page.getByTestId('loader'));
    await loader.expectLoading();
    await page.getByRole('button', {name: 'Toggle loading'}).click();
    await loader.expectIdle();
});

test('Expand toggles real v4 content', async ({page}) => {
    const expand = tuiExpand(page.getByTestId('expand'));
    await expand.expectCollapsed();
    await page.getByRole('button', {name: 'Toggle section'}).click();
    await expand.expectExpanded();
    await page.getByRole('button', {name: 'Toggle section'}).click();
    await expand.expectCollapsed();
});

test('v4 Avatar adapter understands _round and data-type markup', async ({page}) => {
    const square = tuiAvatar(page.getByTestId('avatar'));
    await square.expectShape('square');
    await square.expectSize('m');
    await square.expectImageFallback();
    const round = tuiAvatar(page.getByTestId('avatar-round'));
    await round.expectShape('round');
    await round.expectSize('s');
});

test('Textfield harness focuses the real v4 input', async ({page}) => {
    const field = tuiTextfield(page.getByTestId('number-field'));
    await field.focus();
    await expect(field.input).toHaveAttribute('tuiInputNumber', '');
});


test('Calendar updates TuiDay through the packaged v4 harness', async ({page}) => {
    const calendar = tuiCalendar(page.getByTestId('v4-calendar'));
    await calendar.selectDay(20);
    await expect(page.getByTestId('v4-calendar-model')).toHaveText('2026-0-20');
});

test('InputDate selects an owned calendar day in v4', async ({page}) => {
    const field = tuiInputDate(page.getByTestId('v4-date-field'));
    await field.selectDay(22);
    await expect(page.getByTestId('v4-date-model')).toHaveText('2026-0-22');
    await expect(field.input).not.toHaveValue('');
});

test('MultiSelect selects two options in a real v4 form', async ({page}) => {
    const multi = tuiMultiSelect(page.getByTestId('v4-multi-field'));
    await multi.selectOption('Estonia');
    await expect(page.getByTestId('v4-multi-model')).toHaveText('Estonia');
    await multi.selectOption('Latvia');
    await expect(page.getByTestId('v4-multi-model')).toHaveText('Estonia,Latvia');
    expect((await multi.selectedLabels()).map((x) => x.trim())).toEqual(['Estonia', 'Latvia']);
});

test('Dialog confirms a real v4 portal', async ({page}) => {
    await page.getByRole('button', {name: 'Open v4 dialog'}).click();
    const dialog = tuiDialog(page.locator('tui-dialog'));
    await expect(dialog.title).toHaveText('V4 confirmation');
    await dialog.clickButton('Confirm');
    await expect(dialog.host).toBeHidden();
    await expect(page.getByTestId('v4-dialog-model')).toHaveText('closed');
});

test('Dialog closes through its v4-specific close control', async ({page}) => {
    await page.getByRole('button', {name: 'Open v4 dialog'}).click();
    const dialog = tuiDialog(page.locator('tui-dialog'));
    await dialog.close();
    await expect(page.getByTestId('v4-dialog-model')).toHaveText('closed');
});

test('Accordion opens, closes and coordinates real v4 panels', async ({page}) => {
    const accordion = tuiAccordion(page.getByTestId('v4-accordion'));
    const delivery = await accordion.expand('Delivery');
    await expect(delivery).toContainText('Delivery details');
    await expect(page.getByTestId('v4-accordion-model')).toHaveText('true / false');

    const payment = await accordion.expand('Payment');
    await expect(payment).toContainText('Payment details');
    await expect(page.getByTestId('v4-accordion-model')).toHaveText('false / true');

    await accordion.collapse('Payment');
    await expect(page.getByTestId('v4-accordion-model')).toHaveText('false / false');
});

test('Rating updates a v4 numeric FormControl with keyboard navigation', async ({page}) => {
    const rating = tuiRating(page.getByTestId('v4-rating'));
    await rating.rate(4);
    expect(await rating.value()).toBe(4);
    await expect(page.getByTestId('v4-rating-model')).toHaveText('4');
});

test('Breadcrumbs renders links and follows one on v4', async ({page}) => {
    const breadcrumbs = tuiBreadcrumbs(page.getByTestId('v4-breadcrumbs'));
    await breadcrumbs.expectSize('m');
    await expect(breadcrumbs.links).toHaveCount(2);
    await breadcrumbs.follow('Preferences');
    await expect(page).toHaveURL(/#v4-breadcrumb-target$/);
});

test('InputTime writes a real TuiTime to the Angular FormControl', async ({page}) => {
    const time = tuiInputTime(page.getByTestId('v4-time-field'));
    await time.fillTime('13:45');
    await expect(page.getByTestId('v4-time-model')).toHaveText('13:45');
});

test('InputPhone normalizes a full number into its Angular FormControl', async ({page}) => {
    const phone = tuiInputPhone(page.getByTestId('v4-phone-field'));
    await phone.fill('+1 212 555-0123');
    await expect(page.getByTestId('v4-phone-model')).toHaveText('+12125550123');
});

test('InputSlider synchronizes the textfield, slider and Angular FormControl', async ({page}) => {
    const slider = tuiInputSlider(page.getByTestId('v4-slider-field'));
    await slider.fill('42');
    await slider.input.press('Tab');
    await expect(page.getByTestId('v4-slider-model')).toHaveText('42');
    await expect(page.getByTestId('v4-slider-field').locator('input[tuiSlider]')).toHaveValue('42');
});

test('InputDateRange selects a real TuiDayRange via the owned v4 calendar', async ({page}) => {
    const range = tuiInputDateRange(page.getByTestId('v4-date-range-field'));
    await range.selectRange(20, 22);
    await expect(page.getByTestId('v4-date-range-model')).toHaveText('20-22');
    await expect(range.input).not.toHaveValue('');
});

test('InputDateMulti toggles days in a real v4 FormControl', async ({page}) => {
    const dates = tuiInputDateMulti(page.getByTestId('v4-date-multi-field'));
    await dates.toggleDay(20);
    await expect(page.getByTestId('v4-date-multi-model')).toHaveText('15,20');
    await dates.toggleDay(20);
    await expect(page.getByTestId('v4-date-multi-model')).toHaveText('15');
});

test('InputMonth selects a month in the real v4 calendar', async ({page}) => {
    const month = tuiInputMonth(page.getByTestId('v4-month-field'));
    await month.selectMonth(2);
    await expect(page.getByTestId('v4-month-model')).toHaveText('2026-2');
    await expect(month.input).not.toHaveValue('');
});

test('InputMonthRange selects two months in the real v4 FormControl', async ({page}) => {
    const range = tuiInputMonthRange(page.getByTestId('v4-month-range-field'));
    await range.selectRange(2, 5);
    await expect(page.getByTestId('v4-month-range-model')).toHaveText('2-5');
    await expect(range.input).not.toHaveValue('');
});

test('InputDateTime changes the day without losing the time in the v4 FormControl', async ({page}) => {
    const dateTime = tuiInputDateTime(page.getByTestId('v4-date-time-field'));
    await dateTime.selectDay(22);
    await expect(page.getByTestId('v4-date-time-model')).toHaveText('2026-0-22 13:45');
    await expect(dateTime.input).not.toHaveValue('');
});

test('InputYear fills a four-digit year into the v4 FormControl', async ({page}) => {
    const year = tuiInputYear(page.getByTestId('v4-year-field'));
    await year.fillYear(2028);
    await expect(page.getByTestId('v4-year-model')).toHaveText('2028');
});

test('InputRange updates both numbers and the real v4 FormControl', async ({page}) => {
    const range = tuiInputRange(page.getByTestId('v4-input-range'));
    await expect(range.range).toBeVisible();
    await range.setStart(25);
    await expect(page.getByTestId('v4-input-range-model')).toHaveText('25-90');
    await range.setEnd(75);
    await expect(page.getByTestId('v4-input-range-model')).toHaveText('25-75');
});

test('InputChip adds and removes a real v4 chip in the FormControl', async ({page}) => {
    const chips = tuiInputChip(page.getByTestId('v4-input-chip-field'));
    await chips.add('Playwright');
    await expect(page.getByTestId('v4-input-chip-model')).toHaveText('Angular,Playwright');
    await chips.remove('Playwright');
    await expect(page.getByTestId('v4-input-chip-model')).toHaveText('Angular');
});

test('InputPin enters four digits and updates the real v4 FormControl', async ({page}) => {
    const pin = tuiInputPin(page.getByTestId('v4-input-pin-field'));
    await pin.fill('1234');
    await expect(pin.input).toHaveValue('1234');
    await expect(page.getByTestId('v4-input-pin-model')).toHaveText('1234');
    await expect(page.getByTestId('v4-input-pin-field').locator('.t-value_filled')).toHaveCount(4);
});

test('InputColor writes a HEX value to a real v4 Angular FormControl', async ({page}) => {
    const color = tuiInputColor(page.getByTestId('v4-color-field'));
    await color.fill('#800000');
    await expect(color.input).toHaveValue('#800000');
    await expect(page.getByTestId('v4-color-model')).toHaveText('#800000');
});

test('InputInline updates the real v4 FormControl and mirrors its value', async ({page}) => {
    const inline = tuiInputInline(page.getByTestId('v4-inline-field'));
    await inline.fill('Updated title');
    await expect(page.getByTestId('v4-inline-model')).toHaveText('Updated title');
});

test('CalendarMonth selects a real v4 month and emits monthClick', async ({page}) => {
    const calendar = tuiCalendarMonth(page.getByTestId('v4-calendar-month'));
    await calendar.selectMonth(3);
    await expect(page.getByTestId('v4-calendar-month-model')).toHaveText('2026-3');
    await expect(calendar.month(3)).toHaveAttribute('data-range', 'active');
});

test('Counter increments, disables at max and decrements the v4 FormControl', async ({page}) => {
    const counter = tuiCounter(page.getByTestId('v4-counter'));
    await counter.increase();
    await expect(page.getByTestId('v4-counter-model')).toHaveText('3');
    await expect(counter.increment).toBeDisabled();
    await counter.decrease();
    await expect(page.getByTestId('v4-counter-model')).toHaveText('2');
    expect(await counter.value()).toBe(2);
});

test('RadioList selects an option in the v4 Angular FormControl', async ({page}) => {
    const radioList = tuiRadioList(page.getByTestId('v4-radio-list'));
    await radioList.select('Express');
    await expect(page.getByTestId('v4-radio-list-model')).toHaveText('Express');
    await expect(radioList.option('Standard')).not.toBeChecked();
});

test('Slider changes the v4 FormControl with keyboard arrows', async ({page}) => {
    const slider = tuiSlider(page.getByTestId('v4-slider'));
    await slider.stepRight();
    await expect(page.getByTestId('v4-native-slider-model')).toHaveText('5');
    expect(await slider.value()).toBe(5);
    await slider.stepLeft();
    await expect(page.getByTestId('v4-native-slider-model')).toHaveText('4');
});

test('Range adjusts both thumbs and writes the tuple v4 FormControl', async ({page}) => {
    const range = tuiRange(page.getByTestId('v4-range'));
    await range.stepStartRight();
    await expect(page.getByTestId('v4-range-model')).toHaveText('3-8');
    await range.stepEndLeft();
    await expect(page.getByTestId('v4-range-model')).toHaveText('3-7');
    await expect(range.start).toHaveValue('3');
    await expect(range.end).toHaveValue('7');
});

test('the same v4 demo documents its verified scope and versioned import', async ({page}) => {
    await page.goto('/');
    await expect(page.getByText('Tested controls, not blanket v4 compatibility.')).toBeVisible();
    await expect(page.locator('pre code')).toContainText('@taiga-ui-labs/playwright/v4');
    await expect(page.getByRole('heading', {level: 2})).toHaveCount(49);
    await page.getByText('Browse the Taiga UI 4 component inventory').click();
    await expect(page.locator('[data-v4-component]')).toHaveCount(123);
    await expect(page.locator('[data-verified="true"]')).toHaveCount(48);
    await expect(page.locator('[data-v4-component="Kit/checkbox"]')).toContainText('tuiCheckbox');
    await expect(page.getByRole('link', {name: /Back to Taiga UI 5 docs/})).toHaveAttribute('href', '../');
});
