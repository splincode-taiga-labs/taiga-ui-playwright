import {expect, test} from '@playwright/test';
import {
    tuiAccordion,
    tuiButton,
    tuiCheckbox,
    tuiInput,
    tuiPagination,
    tuiRadio,
    tuiSegmented,
    tuiStepper,
    tuiSwitch,
    tuiTabs,
    tuiTextarea,
} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('harness-controls')).toBeVisible();
});

test('Button clicks update a real Angular signal and disabled actions never fire', async ({page}) => {
    const button = tuiButton(page.getByTestId('basic-button'));
    await button.click();
    await button.click();
    await expect(page.getByTestId('basic-button-model')).toHaveText('2');
    await expect(tuiButton(page.getByTestId('disabled-button')).click()).rejects.toThrow(/enabled/);
    await expect(page.getByTestId('basic-button-model')).toHaveText('2');
});

test('Checkbox toggles a reactive FormControl on and off', async ({page}) => {
    const checkbox = tuiCheckbox(page.getByTestId('basic-checkbox'));
    await checkbox.check();
    await expect(page.getByTestId('basic-checkbox-model')).toHaveText('true');
    await checkbox.uncheck();
    await expect(page.getByTestId('basic-checkbox-model')).toHaveText('false');
});

test('Radio selects the requested option, unchecking the other radio', async ({page}) => {
    const a = tuiRadio(page.getByTestId('basic-radio-a'));
    const b = tuiRadio(page.getByTestId('basic-radio-b'));
    await b.check();
    await expect(a.host).not.toBeChecked();
    await expect(page.getByTestId('basic-radio-model')).toHaveText('B');
    await a.check();
    await expect(b.host).not.toBeChecked();
    await expect(page.getByTestId('basic-radio-model')).toHaveText('A');
});

test('Input fills and updates the Angular text model', async ({page}) => {
    const input = tuiInput(page.getByTestId('basic-input-field'));
    await input.fill('Hello from Playwright');
    await expect(page.getByTestId('basic-input-model')).toHaveText('Hello from Playwright');
    await input.fill('');
    await expect(page.getByTestId('basic-input-model')).toHaveText('');
});

test('Switch toggles model state in both directions', async ({page}) => {
    const control = tuiSwitch(page.getByTestId('basic-switch'));
    await control.setChecked(true);
    await expect(page.getByTestId('basic-switch-model')).toHaveText('true');
    await control.setChecked(false);
    await expect(page.getByTestId('basic-switch-model')).toHaveText('false');
});

test('Textarea supports multiline input and clearing', async ({page}) => {
    const textarea = tuiTextarea(page.getByTestId('basic-textarea-field'));
    await textarea.fill('first line\nsecond line');
    await expect(page.getByTestId('basic-textarea-model')).toContainText('first line');
    await textarea.fill('');
    await expect(page.getByTestId('basic-textarea-model')).toHaveText('');
});

test('Tabs selects one active tab and prevents a disabled tab', async ({page}) => {
    const tabs = tuiTabs(page.getByTestId('basic-tabs'));
    await tabs.select('Details');
    await expect(page.getByTestId('basic-tabs-model')).toHaveText('1');
    await expect(tabs.host.locator('[tuiTab]._active')).toHaveCount(1);
    await expect(tabs.select('Disabled tab')).rejects.toThrow(/enabled/);
    await expect(page.getByTestId('basic-tabs-model')).toHaveText('1');
});

test('Segmented control selects by accessible button name', async ({page}) => {
    const segmented = tuiSegmented(page.getByTestId('basic-segmented'));
    await segmented.select('Week');
    await expect(page.getByTestId('basic-segmented-model')).toHaveText('1');
    await segmented.select('Month');
    await expect(page.getByTestId('basic-segmented-model')).toHaveText('2');
    await expect(segmented.host.locator('.tui-segmented_active')).toHaveCount(1);
});

test('Accordion associates panel by aria-controls and closes other panels', async ({page}) => {
    const accordion = tuiAccordion(page.getByTestId('basic-accordion'));
    const shipping = await accordion.expand('Shipping');
    await expect(shipping).toContainText('Ships within 3 days');
    const returns = await accordion.expand('Returns');
    await expect(returns).toContainText('30-day return window');
    await expect(accordion.trigger('Shipping')).toHaveAttribute('aria-expanded', 'false');
    await accordion.collapse('Returns');
    await expect(accordion.trigger('Returns')).toHaveAttribute('aria-expanded', 'false');
});

test('Pagination clicks 1-based page labels and updates the Angular index', async ({page}) => {
    const pagination = tuiPagination(page.getByTestId('basic-pagination'));
    await pagination.goTo(2);
    await expect(page.getByTestId('basic-pagination-model')).toHaveText('1');
    await pagination.goTo(3);
    await expect(page.getByTestId('basic-pagination-model')).toHaveText('2');
    await expect(pagination.goTo(0)).rejects.toThrow(/positive integers/);
});

test('Stepper activates one step and respects disabled steps', async ({page}) => {
    const stepper = tuiStepper(page.getByTestId('basic-stepper'));
    await stepper.activate('Shipping');
    await expect(page.getByTestId('basic-stepper-model')).toHaveText('1');
    await expect(stepper.host.locator('[tuiStep]._active')).toHaveCount(1);
    await expect(stepper.activate('Payment')).rejects.toThrow(/enabled/);
    await expect(page.getByTestId('basic-stepper-model')).toHaveText('1');
});
