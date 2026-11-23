import {readFileSync} from 'node:fs';
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
    tuiCalendarRange, tuiSpinButton, tuiPager, tuiDataListWrapper,
    tuiDataList, tuiScrollbar, tuiCarousel, tuiLineClamp,
    tuiError, tuiFilter, tuiBlock, tuiPulse,
    tuiNotification, tuiBadgedContent, tuiButtonLoading, tuiStatus,
    tuiIcon, tuiLabel, tuiFiles, tuiTree, tuiComment, tuiMessage, tuiRoot, tuiCompass,
    tuiPin, tuiSlides, tuiShrinkWrap, tuiElasticContainer, tuiFloatingContainer,
    tuiAlert,
    tuiFullscreen,
    tuiTiles,
    tuiTablePagination,
    tuiReorder,
    tuiTable,
    tuiConfirm,
    tuiToast,
    tuiNotificationMiddle,
    tuiPreview,
    tuiRoutableDialog,
    tuiPdfViewer,
    tuiInternationalPhone,
    tuiDrawer, tuiPush,
    tuiItemsWithMore,
    tuiActionBar,
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

test('Select can change the selected option without retaining stale v4 form state', async ({page}) => {
    const select = tuiSelect(page.getByTestId('country-field'));

    await select.selectOption('Estonia');
    await expect(page.getByTestId('country-model')).toHaveText('Estonia');

    await select.selectOption('Austria');
    await expect(page.getByTestId('country-model')).toHaveText('Austria');
    await expect(select.input).toHaveValue('Austria');
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

test('Checkbox supports keyboard toggling while keeping the v4 form value in sync', async ({page}) => {
    const checkbox = tuiCheckbox(page.getByTestId('checkbox'));
    await checkbox.host.focus();
    await page.keyboard.press('Space');
    await expect(page.getByTestId('checkbox-model')).toHaveText('true');

    await page.keyboard.press('Space');
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

test('Dialog can reopen after being closed in the same v4 Angular session', async ({page}) => {
    const open = page.getByRole('button', {name: 'Open v4 dialog'});
    const dialog = tuiDialog(page.locator('tui-dialog'));

    await open.click();
    await dialog.clickButton('Confirm');
    await expect(dialog.host).toBeHidden();
    await expect(page.getByTestId('v4-dialog-model')).toHaveText('closed');

    await open.click();
    await expect(dialog.title).toHaveText('V4 confirmation');
    await expect(page.getByTestId('v4-dialog-model')).toHaveText('pending');

    await dialog.close();
    await expect(dialog.host).toBeHidden();
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

test('CalendarRange selects a real v4 date range and emits the selected days', async ({page}) => {
    const calendar = tuiCalendarRange(page.getByTestId('v4-standalone-calendar-range'));
    await calendar.selectRange(10, 12);
    await expect(page.getByTestId('v4-standalone-calendar-range-model')).toHaveText('10-12');
});

test('SpinButton handles arrow navigation, clicks and disabled bounds on v4', async ({page}) => {
    const spin = tuiSpinButton(page.getByTestId('v4-spin-button'));
    await expect(spin.previous).toHaveClass(/t-button_hidden/);
    await spin.increase();
    await expect(page.getByTestId('v4-spin-button-model')).toHaveText('1');
    await spin.arrowRight();
    await expect(page.getByTestId('v4-spin-button-model')).toHaveText('2');
    await expect(spin.next).toHaveClass(/t-button_hidden/);
    await spin.decrease();
    await expect(page.getByTestId('v4-spin-button-model')).toHaveText('1');
});

test('Pager tracks the Angular index and its active visual marker', async ({page}) => {
    const pager = tuiPager(page.getByTestId('v4-pager'));
    await pager.expectIndex(0);
    await page.getByRole('button', {name: 'Next v4 pager page'}).click();
    await pager.expectIndex(1);
    await expect(page.getByTestId('v4-pager-model')).toHaveText('1');
    await page.getByRole('button', {name: 'Previous v4 pager page'}).click();
    await pager.expectIndex(0);
});

test('DataListWrapper selects a real v4 option and renders its loading state', async ({page}) => {
    const list = tuiDataListWrapper(page.getByTestId('v4-data-list-wrapper'));
    await expect(list.options).toHaveCount(3);
    await list.selectOption('Blue');
    await expect(page.getByTestId('v4-data-list-wrapper-model')).toHaveText('Blue');
    await page.getByRole('button', {name: 'Show v4 wrapper loading'}).click();
    await list.expectLoading();
});

test('DataList navigates by keyboard and selects a real v4 option', async ({page}) => {
    const list = tuiDataList(page.getByTestId('v4-data-list'));
    await expect(list.options).toHaveCount(4);
    await list.focusNext('Alpha', 'Beta');
    await list.select('Beta');
    await expect(page.getByTestId('v4-data-list-model')).toHaveText('Beta');
    await expect(list.option('Disabled')).toBeDisabled();
});

test('Scrollbar scrolls its actual v4 host to both ends', async ({page}) => {
    const scrollbar = tuiScrollbar(page.getByTestId('v4-scrollbar'));
    expect(await scrollbar.scrollOffset()).toBe(0);
    await scrollbar.scrollToBottom();
    await expect(page.getByTestId('v4-scrollbar-bottom')).toBeInViewport();
    expect(await scrollbar.scrollOffset()).toBeGreaterThan(0);
    await scrollbar.scrollToTop();
    expect(await scrollbar.scrollOffset()).toBe(0);
});

test('Carousel changes the v4 Angular index on horizontal wheel navigation', async ({page}) => {
    const carousel = tuiCarousel(page.getByTestId('v4-carousel'));
    await expect(carousel.slide('Alpha slide')).toBeEnabled();
    await carousel.moveNext();
    await expect(page.getByTestId('v4-carousel-model')).toHaveText('1');
    await expect(carousel.slide('Beta slide')).toBeEnabled();
    await carousel.movePrevious();
    await expect(page.getByTestId('v4-carousel-model')).toHaveText('0');
});

test('LineClamp changes visible height while retaining real v4 text', async ({page}) => {
    const clamp = tuiLineClamp(page.getByTestId('v4-line-clamp'));
    await clamp.expectLines(1);
    const before = await clamp.maxHeight();
    await page.getByRole('button', {name: 'Expand v4 line clamp to 3 lines'}).click();
    await clamp.expectLines(3);
    expect(await clamp.maxHeight()).toBeGreaterThan(before);
    await expect(clamp.content).toContainText('The full text remains present');
    await expect(page.getByTestId('v4-line-clamp-model')).toHaveText('3');
});

test('Error shows and clears the v4 validation message and Angular signal', async ({page}) => {
    const error = tuiError(page.getByTestId('v4-error'));
    await error.expectCleared();
    await page.getByRole('button', {name: 'Show v4 error'}).click();
    await error.expectError('Required field');
    await expect(page.getByTestId('v4-error-model')).toHaveText('Required field');
    await page.getByRole('button', {name: 'Clear v4 error'}).click();
    await error.expectCleared();
    await expect(page.getByTestId('v4-error-model')).toHaveText('none');
});

test('Filter changes real v4 selection and respects disabled options', async ({page}) => {
    const filter = tuiFilter(page.getByTestId('v4-filter'));
    await filter.expectSize('s');
    await expect(filter.checkbox('News')).toBeChecked();
    await filter.setChecked('Tech', true);
    await expect(page.getByTestId('v4-filter-model')).toHaveText('News,Tech');
    await filter.setChecked('News', false);
    await expect(page.getByTestId('v4-filter-model')).toHaveText('Tech');
    await expect(filter.checkbox('Furniture')).toBeDisabled();
});

test('Block checks real v4 form value and reflects disabled state', async ({page}) => {
    const block = tuiBlock(page.getByTestId('v4-block'));
    await block.expectSize('m');
    await block.setChecked(true);
    await expect(page.getByTestId('v4-block-model')).toHaveText('true');
    await page.getByRole('button', {name: 'Disable v4 block'}).click();
    await block.expectDisabled();
});

test('Pulse updates playing state in the real v4 component', async ({page}) => {
    const pulse = tuiPulse(page.getByTestId('v4-pulse'));
    await pulse.expectPlaying(true);
    await page.getByRole('button', {name: 'Toggle v4 pulse'}).click();
    await pulse.expectPlaying(false);
    await expect(page.getByTestId('v4-pulse-model')).toHaveText('false');
    await page.getByRole('button', {name: 'Toggle v4 pulse'}).click();
    await pulse.expectPlaying(true);
});

test('Notification changes real v4 appearance and size', async ({page}) => {
    const notification = tuiNotification(page.getByTestId('v4-notification'));
    await notification.expectState('info', 's');
    await page.getByRole('button', {name: 'Change v4 notification'}).click();
    await notification.expectState('warning', 'l');
    await expect(notification.host).toContainText('Updates are available');
});

test('BadgedContent updates its top badge and removes the bottom slot on v4', async ({page}) => {
    const badged = tuiBadgedContent(page.getByTestId('v4-badged-content'));
    await badged.expectBadge('top', '2');
    await badged.expectBadge('bottom', '5');
    await page.getByRole('button', {name: 'Update v4 top badge'}).click();
    await badged.expectBadge('top', '7');
    await page.getByRole('button', {name: 'Hide v4 bottom badge'}).click();
    await badged.expectBadgeAbsent('bottom');
    await badged.expectBadge('top', '7');
});

test('ButtonLoading blocks v4 clicks while loading, then allows a click', async ({page}) => {
    const button = tuiButtonLoading(page.getByTestId('v4-button-loading'));
    await button.expectLoading();
    await button.host.click({force: true});
    await expect(page.getByTestId('v4-button-loading-model')).toHaveText('0');
    await page.getByRole('button', {name: 'Finish v4 loading'}).click();
    await button.click();
    await expect(page.getByTestId('v4-button-loading-model')).toHaveText('1');
});

test('Status updates the real v4 CSS custom property from an Angular signal', async ({page}) => {
    const status = tuiStatus(page.getByTestId('v4-status'));
    await status.expectColor('#007a00');
    await page.getByRole('button', {name: 'Set v4 status red'}).click();
    await status.expectColor('#aa0000');
    await expect(page.getByTestId('v4-status-model')).toHaveText('#aa0000');
});

test('Icon resolves and changes the actual Taiga UI v4 SVG resource', async ({page}) => {
    const icon = tuiIcon(page.getByTestId('v4-icon'));
    await icon.expectIcon('search');
    expect(await icon.iconUrl()).toContain('search.svg');
    await page.getByRole('button', {name: 'Change v4 icon'}).click();
    await icon.expectIcon('check');
    expect(await icon.iconUrl()).toContain('check.svg');
    await expect(page.getByTestId('v4-icon-model')).toHaveText('@tui.check');
});

test('Label associates the native input and updates its v4 Angular form', async ({page}) => {
    const label = tuiLabel(page.getByTestId('v4-label'));
    await label.expectOrientation('horizontal');
    await label.focusInput();
    const input = await label.expectAssociatedInput();
    await input.fill('Ada');
    await expect(page.getByTestId('v4-label-model')).toHaveText('Ada');
});

test('Root bootstraps content and popup portals in the real v4 Angular fixture', async ({page}) => {
    const root = tuiRoot(page.locator('tui-root'));
    await root.expectBootstrapped();
    await expect(root.host).toHaveAttribute('tuiRootV', /^4\./);
});

test('Alert renders a real v4 popup and dismisses it via its close action', async ({page}) => {
    await page.getByRole('button', {name: 'Show v4 alert'}).click();
    const alert = tuiAlert(page.locator('tui-alert').last());
    await alert.expectAlert('Saved successfully');
    await expect(alert.host).toContainText('Browser alert');
    await alert.host.locator('button[tuiIconButton]').click();
    await expect(page.locator('tui-alert')).toHaveCount(0);
});

test('Fullscreen enters and exits the native browser fullscreen state', async ({page}) => {
    await page.getByRole('button', {name: 'Mount v4 fullscreen'}).click();
    const fullscreen = tuiFullscreen(page.getByTestId('v4-fullscreen'));
    await fullscreen.expectRoot();
    await fullscreen.host.getByRole('button', {name: 'Enter v4 fullscreen'}).click();
    await expect.poll(() => page.evaluate(() => document.fullscreenElement?.tagName.toLowerCase())).toBe('tui-root');
    await expect(page.getByTestId('v4-fullscreen-model')).toHaveText('true');
    await fullscreen.host.getByRole('button', {name: 'Leave v4 fullscreen'}).click();
    await expect.poll(() => page.evaluate(() => document.fullscreenElement)).toBeNull();
    await expect(page.getByTestId('v4-fullscreen-model')).toHaveText('false');
});

test('Tiles reorders real v4 projected tile components by pointer drag', async ({page}) => {
    await page.getByRole('button', {name: 'Mount v4 tiles'}).click();
    const tiles = tuiTiles(page.getByTestId('v4-tiles'));
    await expect(tiles.tiles).toHaveCount(3);
    await tiles.expectOrder(0, 0);
    await tiles.drag(0, 2);
    await tiles.expectOrder(0, 2);
    await expect(page.getByTestId('v4-tiles-model')).toHaveText('2/0/1');
});

test('TablePagination updates the v4 page and size via native navigation controls', async ({page}) => {
    await page.getByRole('button', {name: 'Mount v4 table pagination'}).click();
    const pagination = tuiTablePagination(page.getByTestId('v4-table-pagination'));
    await pagination.expectRange(1, 10);
    await expect(page.getByTestId('v4-table-pagination-model')).toHaveText('0 / 10');
    await pagination.nextPage();
    await pagination.expectRange(11, 20);
    await expect(page.getByTestId('v4-table-pagination-model')).toHaveText('1 / 10');
    await pagination.nextPage();
    await pagination.expectRange(21, 25);
    await expect(page.getByTestId('v4-table-pagination-model')).toHaveText('2 / 10');
    await expect(pagination.host.locator('button.t-button:not(.t-button_back)')).toBeDisabled();
    await pagination.host.locator('button.t-button_back').click();
    await pagination.expectRange(11, 20);
    await expect(page.getByTestId('v4-table-pagination-model')).toHaveText('1 / 10');
});

test('Reorder toggles enabled items and moves rows through real v4 drag handles', async ({page}) => {
    await page.getByRole('button', {name: 'Mount v4 reorder'}).click();
    const reorder = tuiReorder(page.getByTestId('v4-reorder'));
    await reorder.expectItems(3);
    await expect(page.getByTestId('v4-reorder-enabled')).toHaveText('Alpha / Beta / Gamma');
    await reorder.toggleFirst();
    await expect(page.getByTestId('v4-reorder-enabled')).toHaveText('Beta / Gamma');

    await reorder.tiles.first().locator('[tuiTileHandle]').dragTo(reorder.tiles.last(), {
        targetPosition: {x: 32, y: 20},
        steps: 20,
    });
    await expect(page.getByTestId('v4-reorder-model')).toHaveText('Beta / Gamma / Alpha');
    await expect(page.getByTestId('v4-reorder-enabled')).toHaveText('Beta / Gamma');
});

test('Table renders v4 rows, changes table size, and updates reactive row content', async ({page}) => {
    await page.getByRole('button', {name: 'Mount v4 table', exact: true}).click();
    const table = tuiTable(page.getByTestId('v4-table'));
    await table.expectSize('s');
    await expect(table.rows).toHaveCount(4);
    await expect(table.rows.nth(1)).toContainText('Alice');

    await page.getByRole('button', {name: 'Expand v4 table size'}).click();
    await table.expectSize('l');
    await page.getByRole('button', {name: 'Remove last v4 table row'}).click();
    await expect(table.rows).toHaveCount(3);
    await expect(table.host).not.toContainText('Carol');
    await expect(page.getByTestId('v4-table-model')).toHaveText('Alice / Bob');
});

test('Confirm uses real v4 dialog service for accept and reject decisions', async ({page}) => {
    await page.getByRole('button', {name: 'Open v4 confirmation', exact: true}).click();
    const confirm = tuiConfirm(page.locator('tui-confirm').last());
    await confirm.expectContent('Publish this v4 draft?');
    await confirm.decide(false, 'Cancel');
    await expect(page.getByTestId('v4-confirm-result')).toHaveText('rejected');

    await page.getByRole('button', {name: 'Open v4 confirmation', exact: true}).click();
    await confirm.expectContent('Publish this v4 draft?');
    await confirm.decide(true, 'Proceed');
    await expect(page.getByTestId('v4-confirm-result')).toHaveText('accepted');
});

test('Toast displays the real v4 status portal and dismisses through its close button', async ({page}) => {
    await page.getByRole('button', {name: 'Show v4 toast', exact: true}).click();
    const toast = tuiToast(page.locator('tui-toast').last());
    await toast.expectState('Saved v4 settings', 'positive');
    await toast.close();
    await expect(page.locator('tui-toast')).toHaveCount(0);
});

test('NotificationMiddle shows the v4 loading portal and closes on Escape', async ({page}) => {
    await page.getByRole('button', {name: 'Show v4 middle notification', exact: true}).click();
    const notification = tuiNotificationMiddle(page.locator('tui-notification-middle').last());
    await notification.expectOpen('Loading v4 report');
    await notification.dismiss();
    await expect(page.getByTestId('v4-middle-notification-state')).toHaveText('closed');
});

test('RoutableDialog opens from the v4 router and navigates back on Escape', async ({page}) => {
    await page.getByRole('button', {name: 'Open v4 routed dialog'}).click();
    await expect(page).toHaveURL(/\/routed-v4-dialog$/);

    // The route component itself has an empty template: the content is mounted
    // through TuiDialogService in the root dialog portal.
    const dialog = tuiRoutableDialog(page.locator('tui-dialog').last());
    await dialog.expectRouted('Opened from Angular Router');
    await expect(page.getByTestId('v4-routed-dialog-content')).toBeVisible();

    await dialog.close();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('tui-dialog')).toHaveCount(0);
});

test('PdfViewer opens a real v4 iframe portal and handles close and Escape', async ({page}) => {
    await page.getByRole('button', {name: 'Open v4 PDF viewer'}).click();
    const pdf = tuiPdfViewer(page.locator('tui-pdf-viewer'));
    await pdf.expectPdf('Sample v4.pdf');
    await expect(pdf.host.locator('iframe[title="pdf"]')).toHaveAttribute('src', 'about:blank');
    await expect(page.getByTestId('v4-pdf-viewer-model')).toHaveText('open');

    await pdf.host.locator('button.t-close').click();
    await expect(pdf.host).toHaveCount(0);
    await expect(page.getByTestId('v4-pdf-viewer-model')).toHaveText('closed');

    await page.getByRole('button', {name: 'Open v4 PDF viewer'}).click();
    await pdf.expectPdf('Sample v4.pdf');
    await page.keyboard.press('Escape');
    await expect(pdf.host).toHaveCount(0);
    await expect(page.getByTestId('v4-pdf-viewer-model')).toHaveText('closed');
});

test('Preview rotates real v4 projected content through its toolbar action', async ({page}) => {
    await page.getByRole('button', {name: 'Mount v4 preview', exact: true}).click();
    const preview = tuiPreview(page.getByTestId('v4-preview'));
    await expect(preview.host).toBeVisible();
    await expect(preview.viewport).toContainText('Preview v4 document');
    await preview.rotate();
    await expect(preview.viewport).toHaveCSS('transform', /matrix/);
});

test('Comment renders its default direction on the real v4 directive', async ({page}) => {
    const comment = tuiComment(page.getByTestId('v4-comment'));
    await comment.expectDirection('top');
    await expect(comment.host).toContainText('A note from the author');
});

test('ActionBar toggles its real v4 expand panel and executes projected actions', async ({page}) => {
    const bar = tuiActionBar(page.getByTestId('v4-action-bar'));
    await bar.expectSize('m');
    await bar.expectExpanded(false);
    await bar.clickAction('Approve v4 selection');
    await expect(page.getByTestId('v4-action-bar-model')).toHaveText('1');
    await page.getByRole('button', {name: 'Toggle v4 action bar'}).click();
    await bar.expectExpanded(true);
    await page.getByRole('button', {name: 'Toggle v4 action bar'}).click();
    await bar.expectExpanded(false);
});

test('ItemsWithMore respects the v4 item limit and restores all items when expanded', async ({page}) => {
    const items = tuiItemsWithMore(page.getByTestId('v4-items-with-more'));
    await items.expectVisibleItems(['Alpha', 'Beta']);
    await items.expectOverflow(2);
    await page.getByRole('button', {name: 'Expand v4 items with more'}).click();
    await items.expectVisibleItems(['Alpha', 'Beta', 'Gamma', 'Delta']);
    await items.expectOverflow(0);
    await expect(page.getByTestId('v4-items-limit-model')).toHaveText('5');
});

test('InputPassword toggles actual v4 input visibility without clearing its FormControl', async ({page}) => {
    const field = tuiTextfield(page.getByTestId('v4-password-field'));
    await field.focus();
    await field.input.fill('demo-secret');
    await expect(page.getByTestId('v4-password-model')).toHaveText('demo-secret');
    await expect(field.input).toHaveAttribute('type', 'password');
    await field.host.locator('tui-icon').click();
    await expect(field.input).toHaveAttribute('type', 'text');
    await expect(field.input).toHaveValue('demo-secret');
});

test('Drawer changes its v4 direction and overlay state', async ({page}) => {
    await page.getByRole('button', {name: 'Open v4 drawer'}).click();
    const drawer = tuiDrawer(page.getByTestId('v4-drawer'));
    await drawer.expectState('right', false);
    await drawer.host.getByRole('button', {name: 'Move v4 drawer left'}).click();
    await drawer.expectState('left', true);
    await expect(page.getByTestId('v4-drawer-model')).toHaveText('left / true');
    await drawer.host.getByRole('button', {name: 'Close v4 drawer'}).click();
    await expect(drawer.host).toHaveCount(0);
});

test('Push notification emits its v4 close output and disappears', async ({page}) => {
    await page.getByRole('button', {name: 'Open v4 push'}).click();
    const push = tuiPush(page.getByTestId('v4-push'));
    await push.expectHeading('Build completed');
    await expect(push.host).toContainText('Changes are ready for review');
    await push.close();
    await expect(page.getByTestId('v4-push-model')).toHaveText('false');
});

test('InternationalPhone updates the Angular v4 form using the real masked input', async ({page}) => {
    await page.getByRole('button', {name: 'Mount v4 international phone'}).click();
    const phone = tuiInternationalPhone(page.getByTestId('v4-international-phone'));
    await phone.input.click();
    // Maskito relies on beforeinput/key events, which Locator.fill does not model.
    await phone.input.pressSequentially('2025550183');
    await expect(page.getByTestId('v4-international-phone-model')).toContainText('2025550183');
    await expect(phone.input).toHaveValue(/202/);
});

test('ElasticContainer expands when its real v4 projected content grows', async ({page}) => {
    const elastic = tuiElasticContainer(page.getByTestId('v4-elastic-container'));
    const initial = await elastic.getHeight();
    expect(initial).toBeGreaterThan(0);
    await page.getByRole('button', {name: 'Grow v4 elastic container'}).click();
    await elastic.expectHeightGreaterThan(initial);
    await expect(page.getByTestId('v4-elastic-model')).toHaveText('120');
});

test('FloatingContainer updates its real v4 CSS background input', async ({page}) => {
    const floating = tuiFloatingContainer(page.getByTestId('v4-floating-container'));
    await floating.expectBackground('rgb(128, 0, 0)');
    await page.getByRole('button', {name: 'Change v4 floating background'}).click();
    await floating.expectBackground('rgb(0, 128, 0)');
    await expect(page.getByTestId('v4-floating-model')).toHaveText('rgb(0, 128, 0)');
});

test('ShrinkWrap responds to the real v4 containing block width', async ({page}) => {
    const wrap = tuiShrinkWrap(page.getByTestId('v4-shrink-wrap'));
    await wrap.expectMaxInlineSize(200);
    await page.getByRole('button', {name: 'Expand v4 shrink wrap parent'}).click();
    await wrap.expectMaxInlineSize(300);
    await expect(page.getByTestId('v4-shrink-wrap-model')).toHaveText('300');
});

test('Pin toggles its real v4 open class through Angular state', async ({page}) => {
    const pin = tuiPin(page.getByTestId('v4-pin'));
    await pin.expectOpen(false);
    await page.getByRole('button', {name: 'Toggle v4 pin'}).click();
    await pin.expectOpen(true);
    await expect(page.getByTestId('v4-pin-model')).toHaveText('true');
    await page.getByRole('button', {name: 'Toggle v4 pin'}).click();
    await pin.expectOpen(false);
});

test('Slides responds to its v4 direction input and projected slide text', async ({page}) => {
    const slides = tuiSlides(page.getByTestId('v4-slides'));
    await slides.expectDirection(0);
    await slides.expectSlide('First slide');
    await page.getByRole('button', {name: 'Next v4 slide'}).click();
    await slides.expectDirection(1);
    await slides.expectSlide('Second slide');
    await expect(page.getByTestId('v4-slides-model')).toHaveText('Second slide');
});

test('Compass responds to Angular signal input on real v4 component', async ({page}) => {
    const compass = tuiCompass(page.getByTestId('v4-compass'));
    await compass.expectDegrees(45);
    await page.getByRole('button', {name: 'Rotate v4 compass'}).click();
    await compass.expectDegrees(180);
    await expect(page.getByTestId('v4-compass-model')).toHaveText('180');
});

test('Message updates projected text on the real v4 directive', async ({page}) => {
    const message = tuiMessage(page.getByTestId('v4-message'));
    await message.expectMessage('First message');
    await page.getByRole('button', {name: 'Update v4 message'}).click();
    await message.expectMessage('Updated message');
});

test('Files reveals additional real v4 file components', async ({page}) => {
    const files = tuiFiles(page.getByTestId('v4-files'));
    await files.expectFile('Alpha');
    await expect(files.host.locator('tui-file').first()).toBeVisible();
    await files.expand();
    await files.expectFile('Beta');
    await files.expectFile('Gamma');
    await expect(files.host.locator('tui-file').last()).toBeVisible();
});

test('Tree exposes nested v4 nodes and updates when Angular removes a node', async ({page}) => {
    const tree = tuiTree(page.getByTestId('v4-tree'));
    await tree.expectNode('main.ts');
    await tree.expectNode('README.md');
    await page.getByRole('button', {name: 'Remove v4 tree README'}).click();
    await expect(tree.host.getByRole('treeitem', {name: 'README.md', exact: true})).toHaveCount(0);
    await tree.expectNode('main.ts');
});

test('v4 source inventory and docs matrices agree on browser-verified coverage', () => {
    const read = (path: string): string => readFileSync(new URL(path, import.meta.url), 'utf8');
    const source = read('../integration/angular-app-v4/src/component-inventory.ts');
    const inventory = read('../docs/taiga-v4-inventory.md');
    const coverage = read('../docs/taiga-v4-coverage.md');
    const readme = read('../README.md');
    const compatibility = read('../docs/api-upstream-compatibility.md');
    const verified = (source.match(/"verified": true/g) ?? []).length;
    const total = (source.match(/"name": "/g) ?? []).length;
    const inventoryVerified = (inventory.match(/\| Verified on 4\.106 \|/g) ?? []).length;
    const documentedBehaviors = (coverage.match(/^\| [^|\n]+ \| `tui[^`]+` \|.+\|$/gm) ?? []).length;

    expect(total).toBe(123);
    expect(inventoryVerified).toBe(verified);
    expect(documentedBehaviors).toBe(verified);
    expect(inventory).toContain(`Only **${verified} components are browser-verified**`);
    expect(inventory).toContain(`The other **${total - verified}** source directories`);
    expect(readme).toContain(`targeted tests for ${verified} controls`);
    expect(readme).toContain(`workspace tests ${verified} controls`);
    expect(compatibility).toContain(`${verified} real v4 controls are browser-tested`);
});

test('the same v4 demo documents its verified scope and versioned import', async ({page}) => {
    await page.goto('/');
    await expect(page.getByText('Tested controls, not blanket v4 compatibility.')).toBeVisible();
    await expect(page.locator('pre code')).toContainText('@taiga-ui-labs/playwright/v4');
    const headings = (await page.getByRole('heading', {level: 2}).allTextContents())
        .map((heading) => heading.trim());
    // New fixture sections should not require editing a brittle exact count.
    expect(headings.length).toBeGreaterThanOrEqual(94);
    expect(new Set(headings).size).toBe(headings.length);
    await expect(page.getByText('This demo exercises 94 real Taiga UI controls', {exact: false})).toBeVisible();
    await page.getByText('Browse the Taiga UI 4 component inventory').click();
    await expect(page.locator('[data-v4-component]')).toHaveCount(123);
    await expect(page.locator('[data-verified="true"]')).toHaveCount(94);
    await expect(page.locator('[data-v4-component="Kit/checkbox"]')).toContainText('tuiCheckbox');
    await expect(page.locator('[data-v4-component="Kit/routable-dialog"]')).toContainText('Verified');
    await expect(page.getByRole('link', {name: /Back to Taiga UI 5 docs/})).toHaveAttribute('href', '../');
});
