import {expect, test} from '@playwright/test';

test('renders the real addon-doc shell and the upstream coverage inventory', async ({page}) => {
    await page.goto('/');

    await expect(page.locator('tui-doc-main')).toBeVisible();
    await expect(page.locator('tui-doc-page')).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Playwright harness matrix'})).toBeVisible();
    await expect(page.getByTestId('coverage-total')).toHaveText('133');
    await expect(page.getByTestId('coverage-done')).toHaveText('39');
    await expect(page.locator('tr[data-status="done"]')).toHaveCount(39);
    await expect(page.locator('tr[data-status="todo"]')).toHaveCount(94);
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

    await expect(page.locator('tr[data-status="done"]')).toHaveCount(39);
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


test('each verified harness has a navigable individual sidebar reference', async ({page}) => {
    await page.goto('/#/harness/kit/select');

    await expect(page.locator('harness-detail tui-doc-page')).toBeVisible();
    await expect(page.getByRole('heading', {name: 'tuiSelect', exact: true})).toBeVisible();
    await expect(page.locator('tui-doc-navigation a[href*="/harness/kit/select"]')).toHaveCount(1);
    await expect(page.locator('tui-doc-navigation a.t-sublink_active')).toHaveCount(1);
    await expect(page.locator('tui-doc-navigation a.t-sublink_active')).toContainText('tuiSelect');
    await expect(page.locator('tui-doc-navigation a[href*="/harness/kit/"]')).toHaveCount(31);
});

test('matrix links to harness docs and the extra inner text padding is gone', async ({page}) => {
    await page.goto('/#/matrix');
    const matrix = page.locator('.matrix-page');
    await expect(matrix).toBeVisible();
    expect(await matrix.evaluate((node) => getComputedStyle(node).paddingInlineStart)).toBe('0px');

    const select = page.getByRole('combobox', {name: 'Filter by package'});
    await expect(select).toBeVisible();
    expect(await select.evaluate((node) => getComputedStyle(node).appearance)).toBe('none');
    expect(await select.evaluate((node) => getComputedStyle(node).backgroundImage)).toContain('svg');

    await page.locator('tr[data-harness="kit/select"]').getByRole('link', {name: /tuiSelect/}).click();
    await expect(page).toHaveURL(/#\/harness\/kit\/select$/);
    await expect(page.locator('harness-detail')).toBeVisible();
});

test('copy action copies real example code and import into browser clipboard', async ({page, context}) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/#/harness/kit/select');

    await page.getByRole('button', {name: 'Copy import'}).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe("import {tuiSelect} from '@taiga-ui-labs/playwright';");
    await expect(page.getByRole('button', {name: 'Copied import'})).toBeVisible();

    await page.getByRole('button', {name: 'Copy example'}).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toContain("await harness.selectOption('Estonia');");
});

test('copy implementation reads real checked-in TypeScript source and copies it', async ({page, context}) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/#/harness/kit/select');
    await page.locator('details.source-details summary').click();
    const source = page.locator('details.source-details tui-doc-code');
    await expect(source).toContainText('export class TuiSelect');

    await page.getByRole('button', {name: 'Copy implementation'}).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toContain('export class TuiSelect');
});

test('copy button also works in the Getting started code sample', async ({page, context}) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/#/guide');
    await page.getByRole('button', {name: 'Copy example'}).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toContain("import {tuiSelect, tuiComboBox, tuiDialog}");
});
