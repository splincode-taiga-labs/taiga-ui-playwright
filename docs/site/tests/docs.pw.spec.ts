import {expect, test} from '@playwright/test';

import {HARNESS_CATALOG} from '../src/harness-catalog';

test('renders the real addon-doc shell and the upstream coverage inventory', async ({page}) => {
    await page.goto('/');

    await expect(page.locator('tui-doc-main')).toBeVisible();
    await expect(page.locator('tui-doc-page')).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Playwright harness matrix'})).toBeVisible();
    await expect(page.getByTestId('coverage-total')).toHaveText('133');
    await expect(page.getByTestId('coverage-done')).toHaveText('66');
    await expect(page.locator('tr[data-status="done"]')).toHaveCount(66);
    await expect(page.locator('tr[data-status="todo"]')).toHaveCount(67);
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

    await expect(page.locator('tr[data-status="done"]')).toHaveCount(66);
    await expect(page.locator('tr[data-status="todo"]')).toHaveCount(0);
    const link = page.locator('tr[data-harness="kit/select"]').getByRole('link', {name: /tuiSelect/});
    await expect(link).toHaveAttribute('href', /#\/harness\/kit\/select$/);
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
    await expect(page.locator('harness-detail h1')).toContainText('tuiSelect');
    await expect(page.locator('tui-doc-navigation a[href*="/harness/kit/select"]')).toHaveCount(1);
    await expect(page.locator('tui-doc-navigation a.t-sublink_active')).toHaveCount(1);
    await expect(page.locator('tui-doc-navigation a.t-sublink_active')).toContainText('tuiSelect');
    const verifiedKitHarnesses = HARNESS_CATALOG.filter((entry) => entry.category === 'Kit' && entry.status === 'done');
    await expect(page.locator('tui-doc-navigation a[href*="/harness/kit/"]')).toHaveCount(verifiedKitHarnesses.length);
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


test('new multi-value harnesses expose dedicated addon-doc pages', async ({page}) => {
    for (const name of ['multi-select', 'input-date-multi', 'input-range']) {
        await page.goto('/#/harness/kit/' + name);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy import'})).toBeEnabled();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
    }
});


test('semantic harness docs have source and example links', async ({page}) => {
    for (const route of ['core/spin-button', 'kit/pincode', 'kit/button-loading', 'kit/pager', 'core/link', 'kit/chip', 'kit/badge', 'kit/pin', 'kit/meter']) {
        await page.goto('/#/harness/' + route);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy import'})).toBeEnabled();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
    }
});

test('copy controls stay outside code overlays and work from the visible toolbar', async ({page, context}) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/#/harness/kit/select');

    const copy = page.getByRole('button', {name: 'Copy import'});
    await expect(copy).toBeVisible();
    await expect(copy.locator('xpath=ancestor::div[contains(@class, "copyable-code__toolbar")]')).toBeVisible();
    await expect(page.locator('tui-doc-code .t-code-actions button:visible')).toHaveCount(0);
    await copy.click();

    await expect(page.getByRole('button', {name: 'Copied import'})).toBeVisible();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe("import {tuiSelect} from '@taiga-ui-labs/playwright';");
});

test('full harness source has a single Taiga scrollbar with bounded height', async ({page}) => {
    await page.goto('/#/harness/kit/multi-select');
    await page.locator('details.source-details summary').click();

    const scrollbar = page.locator('details.source-details tui-scrollbar.harness-source-scroll');
    await expect(scrollbar).toBeVisible();
    await expect(scrollbar.locator('tui-doc-code')).toContainText('export class TuiMultiSelect');
    await expect.poll(() => scrollbar.evaluate((element) => element.scrollHeight > element.clientHeight))
        .toBe(true);
    expect(await scrollbar.evaluate((element) => getComputedStyle(element).maxBlockSize))
        .toBe('500px');
    expect(await scrollbar.evaluate((element) => Math.round(element.getBoundingClientRect().height)))
        .toBeLessThanOrEqual(503);
    expect(await scrollbar.locator('code.hljs').first().evaluate((element) =>
        getComputedStyle(element).overflowX
    )).toBe('visible');
});

test('new visual harnesses have navigable addon-doc pages with copyable source', async ({page}) => {
    for (const route of [
        'core/loader', 'kit/avatar', 'kit/badge-notification',
        'kit/status', 'kit/breadcrumbs',
    ]) {
        await page.goto('/#/harness/' + route);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy import'})).toBeEnabled();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
        const details = page.locator('details.source-details');
        if (!(await details.evaluate((node: HTMLDetailsElement) => node.open))) {
            await details.locator('summary').click();
        }
        await expect(details).toHaveAttribute('open', '');
        await expect(details.locator('tui-scrollbar')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy implementation'})).toBeEnabled();
    }
});

test('core behavior harnesses have dedicated docs with real checked-in source', async ({page}) => {
    for (const name of ['error', 'data-list', 'textfield', 'scrollbar', 'carousel']) {
        await page.goto('/#/harness/core/' + name);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy import'})).toBeEnabled();
        const details = page.locator('details.source-details');
        if (!(await details.evaluate((node: HTMLDetailsElement) => node.open))) {
            await details.locator('summary').click();
        }
        await expect(details.locator('tui-scrollbar')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy implementation'})).toBeEnabled();
    }
});

test('Taiga UI icon assets load on documentation pages and follow the base URL', async ({page}) => {
    await page.goto('/#/harness/kit/select');

    const copyButton = page.getByRole('button', {name: 'Copy import'});
    await expect(copyButton).toBeVisible();
    await expect.poll(() => copyButton.evaluate((button) =>
        getComputedStyle(button).getPropertyValue('--t-icon-start'),
    )).toContain('assets/taiga-ui/icons/copy.svg');

    for (const name of ['copy', 'check', 'search', 'chevron-down']) {
        const iconUrl = new URL('assets/taiga-ui/icons/' + name + '.svg', page.url());
        const response = await page.request.get(iconUrl.toString());
        expect(response.status(), iconUrl.toString()).toBe(200);
        expect(response.headers()['content-type']).toMatch(/image\/svg\+xml/);
        expect(await response.text()).toContain('<svg');
    }
});

test('new Kit interaction harnesses expose imports, source and examples', async ({page}) => {
    for (const name of ['data-list-wrapper', 'line-clamp', 'block', 'timeline', 'input-month-range']) {
        await page.goto('/#/harness/kit/' + name);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy import'})).toBeEnabled();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
        const details = page.locator('details.source-details');
        if (!(await details.evaluate((node: HTMLDetailsElement) => node.open))) {
            await details.locator('summary').click();
        }
        await expect(details.locator('tui-scrollbar')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy implementation'})).toBeEnabled();
    }
});
