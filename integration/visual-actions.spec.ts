import {expect, test} from '@playwright/test';
import {tuiActionBar, tuiCompass, tuiFilter, tuiIcon, tuiPulse} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('visual-actions')).toBeVisible();
});

test('Icon follows its Taiga SVG resolver and serves both assets', async ({page}) => {
    const icon = tuiIcon(page.getByTestId('icon-widget'));
    await icon.expectIcon('search');
    let response = await page.request.get(await icon.iconUrl());
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('<svg');

    await page.getByRole('button', {name: 'Change icon'}).click();
    await icon.expectIcon('check');
    response = await page.request.get(await icon.iconUrl());
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('<svg');
});

test('Filter updates a real Angular control when checkboxes are toggled', async ({page}) => {
    const filter = tuiFilter(page.getByTestId('filter-widget'));
    await filter.expectSize('s');
    await expect(filter.items).toHaveCount(3);
    await filter.setChecked('Beta', true);
    await expect(page.getByTestId('filter-model')).toHaveText('Beta');
    await filter.setChecked('Alpha', true);
    await expect(page.getByTestId('filter-model')).toHaveText('Alpha,Beta');
    await filter.setChecked('Beta', false);
    await expect(page.getByTestId('filter-model')).toHaveText('Alpha');
});

test('Pulse responds to a dynamic playing input', async ({page}) => {
    const pulse = tuiPulse(page.getByTestId('pulse-widget'));
    await pulse.expectPlaying(true);
    await page.getByRole('button', {name: 'Toggle pulse'}).click();
    await pulse.expectPlaying(false);
    await page.getByRole('button', {name: 'Toggle pulse'}).click();
    await pulse.expectPlaying(true);
});

test('Compass reflects a new angle in the rendered CSS variable', async ({page}) => {
    const compass = tuiCompass(page.getByTestId('compass-widget'));
    await compass.expectDegrees(45);
    await page.getByRole('button', {name: 'Rotate compass'}).click();
    await compass.expectDegrees(135);
    await expect(compass.expectDegrees(Number.NaN)).rejects.toThrow(/finite/);
});

test('ActionBar preserves actions while expanding and collapsing its menu', async ({page}) => {
    await page.getByRole('button', {name: 'Show action bar'}).click();
    const bar = tuiActionBar(page.getByTestId('action-bar-widget'));
    await bar.expectSize('s');
    await bar.expectExpanded(false);
    await bar.clickAction('Apply changes');
    await expect(page.getByTestId('action-model')).toHaveText('1');
    await page.getByRole('button', {name: 'Toggle action menu'}).click();
    await bar.expectExpanded(true);
    await bar.clickAction('Archive selection');
    await expect(page.getByTestId('action-model')).toHaveText('11');
    await page.getByRole('button', {name: 'Toggle action menu'}).click();
    await bar.expectExpanded(false);
});
