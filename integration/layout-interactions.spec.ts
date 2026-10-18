import {expect, test} from '@playwright/test';
import {tuiCell, tuiLabel, tuiTitle, tuiItemsWithMore, tuiTiles} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('layout-interactions')).toBeVisible();
});

test('Cell reflects dynamic Taiga size and height inputs', async ({page}) => {
    const cell = tuiCell(page.getByTestId('cell-widget'));
    await cell.expectLayout('l', 'normal');
    await page.getByRole('button', {name: 'Compact cell'}).click();
    await cell.expectLayout('s', 'compact');
});

test('Label focuses its associated native and Taiga textfield inputs', async ({page}) => {
    const label = tuiLabel(page.getByTestId('plain-label'));
    await label.expectOrientation('horizontal');
    await label.focusInput();
    await page.getByLabel('Contact name').fill('Ada');
    await expect(page.getByLabel('Contact name')).toHaveValue('Ada');

    const floating = tuiLabel(page.getByTestId('floating-label'));
    await floating.expectOrientation('horizontal');
    const associatedInput = await floating.expectAssociatedInput();
    await expect(associatedInput).toHaveAttribute('tuiInput', '');
    await expect(associatedInput).toBeVisible();
});

test('Title changes its Taiga typography variant dynamically', async ({page}) => {
    const title = tuiTitle(page.getByTestId('title-widget'));
    await title.expectSize('l');
    await page.getByRole('button', {name: 'Small title'}).click();
    await title.expectSize('s');
});

test('ItemsWithMore hides excess children and reacts to changed itemsLimit', async ({page}) => {
    const items = tuiItemsWithMore(page.getByTestId('overflow-widget'));
    await items.expectVisibleItems(['Alpha', 'Beta']);
    await items.expectOverflow(3);
    await page.getByRole('button', {name: 'Show four items'}).click();
    await items.expectVisibleItems(['Alpha', 'Beta', 'Gamma', 'Delta']);
    await items.expectOverflow(1);
    await page.getByRole('button', {name: 'Show all items'}).click();
    await items.expectVisibleItems(['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']);
    await items.expectOverflow(0);
});

test('Tiles reorder through a drag handle and update the bound order Map', async ({page}) => {
    const tiles = tuiTiles(page.getByTestId('tiles-widget'));
    await expect(tiles.tiles).toHaveCount(3);
    await expect(page.getByTestId('tile-order')).toHaveText('0,1,2');
    await tiles.drag(0, 1);
    await expect(page.getByTestId('tile-order')).toHaveText('1,0,2');
    await tiles.expectOrder(0, 1);
    await tiles.expectOrder(1, 0);
});
