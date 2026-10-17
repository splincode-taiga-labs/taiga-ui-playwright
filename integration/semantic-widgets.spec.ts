import {expect, test} from '@playwright/test';
import {
    tuiBadge, tuiButtonLoading, tuiChip, tuiLink, tuiMeter,
    tuiPager, tuiPin, tuiPincode, tuiSpinButton,
} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('semantic-widgets')).toBeVisible();
});

test('SpinButton handles left/right and hides unavailable arrows at bounds', async ({page}) => {
    const spin = tuiSpinButton(page.getByTestId('spin-widget'));
    await spin.increase();
    await expect(page.getByTestId('spin-model')).toHaveText('2');
    await expect(spin.next).toHaveClass(/t-button_hidden/);
    await spin.decrease();
    await spin.decrease();
    await expect(page.getByTestId('spin-model')).toHaveText('0');
    await expect(spin.previous).toHaveClass(/t-button_hidden/);
    await spin.arrowRight();
    await expect(page.getByTestId('spin-model')).toHaveText('1');
});

test('Pincode accepts only configured-length digits and updates Angular form', async ({page}) => {
    const pin = tuiPincode(page.getByTestId('pincode-field'));
    await pin.enter('1234');
    await expect(page.getByTestId('pincode-model')).toHaveText('1234');
    await expect(pin.enter('12345')).rejects.toThrow(/configured length/);
    await expect(pin.enter('ABCD')).rejects.toThrow(/numeric/);
});

test('ButtonLoading prevents action while loading and exposes accessible status', async ({page}) => {
    const loading = tuiButtonLoading(page.getByTestId('loading-button'));
    await loading.click();
    await expect(page.getByTestId('loading-count')).toHaveText('1');
    await page.getByRole('button', {name: 'Toggle loading'}).click();
    await loading.expectLoading();
    await expect(loading.click()).rejects.toThrow();
    await expect(page.getByTestId('loading-count')).toHaveText('1');
    await page.getByRole('button', {name: 'Toggle loading'}).click();
    await loading.click();
    await expect(page.getByTestId('loading-count')).toHaveText('2');
});

test('Pager changes its active index based on an external Angular signal', async ({page}) => {
    const pager = tuiPager(page.getByTestId('pager-widget'));
    await expect(pager.items).toHaveCount(8);
    await pager.expectIndex(0);
    await page.getByRole('button', {name: 'Next pager'}).click();
    await pager.expectIndex(1);
    await page.getByRole('button', {name: 'Next pager'}).click();
    await pager.expectIndex(2);
    await expect(page.getByTestId('pager-model')).toHaveText('2');
});

test('Link follows the actual native anchor destination', async ({page}) => {
    const link = tuiLink(page.getByTestId('link-widget'));
    expect(await link.href()).toBe('#semantic-link-destination');
    await link.follow();
    await expect(page).toHaveURL(/#semantic-link-destination$/);
});

test('Chip reflects reactive appearance changes', async ({page}) => {
    const chip = tuiChip(page.getByTestId('semantic-chip-widget'));
    await chip.expectAppearance('neutral');
    await page.getByRole('button', {name: 'Toggle chip'}).click();
    await chip.expectAppearance('positive');
});

test('Badge exposes Taiga size and appearance after signal updates', async ({page}) => {
    const badge = tuiBadge(page.getByTestId('badge-widget'));
    await badge.expectAppearanceAndSize('positive', 'm');
    await page.getByRole('button', {name: 'Toggle badge'}).click();
    await badge.expectAppearanceAndSize('positive', 's');
});

test('Pin open class reflects Angular input state', async ({page}) => {
    const pin = tuiPin(page.getByTestId('pin-widget'));
    await pin.expectOpen(false);
    await page.getByRole('button', {name: 'Toggle pin'}).click();
    await pin.expectOpen(true);
    await page.getByRole('button', {name: 'Toggle pin'}).click();
    await pin.expectOpen(false);
});

test('Meter reports native numeric value and bounds after Angular update', async ({page}) => {
    const meter = tuiMeter(page.getByTestId('meter-widget'));
    expect(await meter.bounds()).toEqual({min: 0, max: 100});
    await meter.expectValue(25);
    await page.getByRole('button', {name: 'Increase meter'}).click();
    await meter.expectValue(75);
    await expect(page.getByTestId('meter-model')).toHaveText('75');
});
