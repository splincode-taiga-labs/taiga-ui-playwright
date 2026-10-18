import {expect, test} from '@playwright/test';
import {
    tuiInputCard, tuiInputCardGroup, tuiThumbnailCard,
    tuiReorder, tuiTable, tuiTablePagination,
} from '../src/index.js';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await expect(page.getByTestId('commerce-table')).toBeVisible();
});

test('InputCard masks a typed payment card and updates the FormControl', async ({page}) => {
    const input = tuiInputCard(page.getByTestId('input-card-widget'));
    await input.fillCard('4111111111111111');
    await expect(page.getByTestId('card-number-model')).toContainText('4111');
});

test('InputCardGroup accepts a masked card number and switches layout', async ({page}) => {
    const group = tuiInputCardGroup(page.getByTestId('card-group-widget'));
    await group.fillNumber('4111111111111111');
    await page.getByRole('button', {name: 'Compact payment input'}).click();
    await expect(group.host).toHaveClass(/(?:^|\s)_compact(?:\s|$)/);
});

test('ThumbnailCard changes size and projects contents', async ({page}) => {
    const card = tuiThumbnailCard(page.getByTestId('thumbnail-widget'));
    await card.expectSize('s');
    await expect(card.host).toContainText('Card thumbnail');
    await page.getByRole('button', {name: 'Large thumbnail'}).click();
    await card.expectSize('l');
});

test('Reorder projects three columns and toggles the first visibility', async ({page}) => {
    const reorder = tuiReorder(page.getByTestId('reorder-widget'));
    await reorder.expectItems(3);
    await reorder.toggleFirst();
    await expect(page.getByTestId('reorder-enabled')).not.toContainText('Name');
});

test('Table updates its size and projected native rows', async ({page}) => {
    const table = tuiTable(page.getByTestId('table-widget'));
    await table.expectSize('l');
    await expect(table.rows).toHaveCount(3);
    await page.getByRole('button', {name: 'Compact data table'}).click();
    await table.expectSize('s');
    await page.getByRole('button', {name: 'Add data row'}).click();
    await expect(table.rows).toHaveCount(4);
});

test('TablePagination follows a real click into the next page', async ({page}) => {
    const pagination = tuiTablePagination(page.getByTestId('pagination-widget'));
    await pagination.expectRange(1, 5);
    await pagination.nextPage();
    await expect(page.getByTestId('pagination-page')).toHaveText('1');
    await pagination.expectRange(6, 10);
});
