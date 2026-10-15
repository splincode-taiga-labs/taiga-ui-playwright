import {expect, test} from '@playwright/test';

test('renders the real addon-doc shell and the upstream coverage inventory', async ({page}) => {
    await page.goto('/');

    await expect(page.locator('tui-doc-main')).toBeVisible();
    await expect(page.locator('tui-doc-page')).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Playwright harness matrix'})).toBeVisible();
    await expect(page.getByTestId('coverage-total')).toHaveText('133');
    await expect(page.getByTestId('coverage-done')).toHaveText('25');
    await expect(page.locator('tr[data-status="done"]')).toHaveCount(25);
    await expect(page.locator('tr[data-status="todo"]')).toHaveCount(108);
});

test('filters the matrix by component text and package', async ({page}) => {
    await page.goto('/');
    await page.getByRole('textbox', {name: 'Search components'}).fill('select');
    await expect(page.getByTestId('filtered-count')).toContainText('results');
    await expect(page.locator('tr[data-harness="kit/select"]')).toBeVisible();
    await expect(page.locator('tr[data-harness="kit/combo-box"]')).toHaveCount(0);

    await page.getByRole('combobox', {name: 'Filter by package'}).selectOption('Core');
    await expect(page.locator('tr[data-harness="kit/select"]')).toHaveCount(0);

    await page.getByRole('combobox', {name: 'Filter by package'}).selectOption('Kit');
    await expect(page.locator('tr[data-harness="kit/select"]')).toBeVisible();
});

test('filters done rows and links to the actual Playwright helper source', async ({page}) => {
    await page.goto('/');
    await page.getByRole('button', {name: 'Done', exact: true}).click();

    await expect(page.locator('tr[data-status="done"]')).toHaveCount(25);
    await expect(page.locator('tr[data-status="todo"]')).toHaveCount(0);
    const link = page.locator('tr[data-harness="kit/select"]').getByRole('link', {name: /tuiSelect/});
    await expect(link).toHaveAttribute('href', /src\/select\.ts/);
});

test('navigates to Getting started using GitHub Pages compatible hash routing', async ({page}) => {
    await page.goto('/');
    await page.getByRole('link', {name: 'Guide', exact: true}).click();

    await expect(page).toHaveURL(/#\/guide$/);
    await expect(page.getByRole('heading', {name: 'Getting started'})).toBeVisible();
    await expect(page.locator('getting-started')).toBeVisible();
});

test('the addon-doc logo is loaded and visible on both routes', async ({page}) => {
    await page.goto('/#/');
    await expect(page).toHaveURL(/#\/matrix$/);
    const logo = page.locator('header[tuiDocHeader] img.t-img');

    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', /assets\/brand\.svg$/);
    await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);

    await page.getByRole('link', {name: 'Guide', exact: true}).click();
    await expect(logo).toBeVisible();
});

test('only the selected documentation item is active in the left navigation', async ({page}) => {
    await page.goto('/#/');
    const nav = page.locator('tui-doc-main > tui-root tui-doc-navigation').first();
    const active = nav.locator('a.t-sublink_active');

    await expect(page).toHaveURL(/#\/matrix$/);
    await expect(active).toHaveCount(1);
    await expect(active).toContainText('Coverage matrix');

    await page.getByRole('link', {name: 'Guide', exact: true}).click();
    await expect(active).toHaveCount(1);
    await expect(active).toContainText('Getting started');

    await page.getByRole('link', {name: 'Matrix', exact: true}).click();
    await expect(active).toHaveCount(1);
    await expect(active).toContainText('Coverage matrix');
});

test('Current harnesses uses highlighted TypeScript in native addon-doc code component', async ({page}) => {
    await page.goto('/#/guide');
    const code = page.locator('getting-started tui-doc-code');

    await expect(code).toBeVisible();
    await expect(code.getByText('playwright.spec.ts')).toBeVisible();
    await expect(code.locator('code.hljs')).toContainText('tuiSelect');
    await expect(code.locator('.hljs-keyword').first()).toBeVisible();
    await expect(code.locator('.hljs-string').first()).toBeVisible();
});
