import {expect, test} from '@playwright/test';

import {HARNESS_CATALOG} from '../src/harness-catalog';

test('renders the real addon-doc shell and the upstream coverage inventory', async ({page}) => {
    await page.goto('/');

    await expect(page.locator('tui-doc-main')).toBeVisible();
    await expect(page.locator('tui-doc-page')).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Playwright harness matrix'})).toBeVisible();
    await expect(page.getByTestId('coverage-total')).toHaveText('133');
    await expect(page.getByTestId('coverage-done')).toHaveText('133');
    await expect(page.locator('tr[data-status="done"]')).toHaveCount(133);
    await expect(page.locator('tr[data-status="todo"]')).toHaveCount(0);
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

    await expect(page.locator('tr[data-status="done"]')).toHaveCount(133);
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
    await expect(code.getByText('test.pw.spec.ts')).toBeVisible();
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

test('single Playwright example includes the versioned import and can be copied', async ({page, context}) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/#/harness/kit/select');

    const reference = page.locator('harness-detail');
    await expect(reference.getByRole('heading', {name: 'Import'})).toHaveCount(0);
    await expect(reference.locator('details.source-details')).toHaveCount(0);
    await expect(reference.getByRole('button', {name: 'Copy import'})).toHaveCount(0);
    await expect(reference.getByRole('button', {name: 'Copy implementation'})).toHaveCount(0);
    await expect(reference.locator('tui-doc-code')).toHaveCount(1);
    await expect(reference.locator('tui-doc-code')).toContainText("import {tuiSelect} from '@taiga-ui-labs/playwright'");
    await expect(reference.locator('tui-doc-code')).toContainText('test.pw.spec.ts');
    await expect(reference.getByRole('link', {name: /Source on GitHub/}))
        .toHaveAttribute('href', /\/src\/select\.ts$/);

    await reference.getByRole('button', {name: 'Copy example'}).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toContain("import {tuiSelect} from '@taiga-ui-labs/playwright'");
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toContain("await harness.selectOption('Estonia');");
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
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
    }
});


test('semantic harness docs have source and example links', async ({page}) => {
    for (const route of ['core/spin-button', 'kit/pincode', 'kit/button-loading', 'kit/pager', 'core/link', 'kit/chip', 'kit/badge', 'kit/pin', 'kit/meter']) {
        await page.goto('/#/harness/' + route);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
    }
});

test('copy example control remains outside the code overlay', async ({page, context}) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/#/harness/kit/select');
    const copy = page.getByRole('button', {name: 'Copy example'});
    await expect(copy).toBeVisible();
    await expect(copy.locator('xpath=ancestor::div[contains(@class, "copyable-code__toolbar")]')).toBeVisible();
    await expect(page.locator('tui-doc-code .t-code-actions button:visible')).toHaveCount(0);
    await copy.click();
    await expect(page.getByRole('button', {name: 'Copied example'})).toBeVisible();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toContain("import {tuiSelect} from '@taiga-ui-labs/playwright'");
});

test('harness pages link to implementation without embedding the full source', async ({page}) => {
    await page.goto('/#/harness/kit/multi-select');
    await expect(page.getByRole('link', {name: /Source on GitHub/})).toHaveAttribute('href', /\/src\/multi-fields\.ts$/);
    await expect(page.locator('details.source-details')).toHaveCount(0);
    await expect(page.locator('tui-scrollbar.harness-source-scroll')).toHaveCount(0);
    await expect(page.locator('harness-detail tui-doc-code')).toHaveCount(1);
});

test('new visual harnesses have navigable addon-doc pages with copyable source', async ({page}) => {
    for (const route of [
        'core/loader', 'kit/avatar', 'kit/badge-notification',
        'kit/status', 'kit/breadcrumbs',
    ]) {
        await page.goto('/#/harness/' + route);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
        await expect(page.locator('details.source-details')).toHaveCount(0);
    }
});

test('core behavior harnesses have dedicated docs with real checked-in source', async ({page}) => {
    for (const name of ['error', 'data-list', 'textfield', 'scrollbar', 'carousel']) {
        await page.goto('/#/harness/core/' + name);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
        await expect(page.locator('details.source-details')).toHaveCount(0);
    }
});

test('Taiga UI icon assets load on documentation pages and follow the base URL', async ({page}) => {
    await page.goto('/#/harness/kit/select');

    const copyButton = page.getByRole('button', {name: 'Copy example'});
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
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
        await expect(page.locator('details.source-details')).toHaveCount(0);
    }
});

test('visual and action harness pages expose tested source and examples', async ({page}) => {
    for (const route of ['core/icon', 'kit/filter', 'kit/action-bar', 'kit/pulse', 'kit/compass']) {
        await page.goto('/#/harness/' + route);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
        await expect(page.locator('details.source-details')).toHaveCount(0);
    }
});

test('new layout and overflow harnesses have source-backed reference pages', async ({page}) => {
    for (const route of ['core/cell', 'core/label', 'core/title', 'kit/items-with-more', 'kit/tiles']) {
        await page.goto('/#/harness/' + route);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
        await expect(page.locator('details.source-details')).toHaveCount(0);
    }
});

test('new notification and layout harnesses expose tested source-backed pages', async ({page}) => {
    for (const route of ['core/notification', 'kit/badged-content', 'layout/block-status', 'layout/card', 'layout/input-search']) {
        await page.goto('/#/harness/' + route);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
        await expect(page.locator('details.source-details')).toHaveCount(0);
    }
});

test('Confirm, Toast and layout harnesses expose the source-backed docs', async ({page}) => {
    for (const route of ['kit/confirm', 'kit/toast', 'layout/form', 'layout/item-group', 'kit/shrink-wrap']) {
        await page.goto('/#/harness/' + route);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
        await expect(page.locator('details.source-details')).toHaveCount(0);
    }
});

test('responsive layout and close harnesses link to real tested implementations', async ({page}) => {
    for (const route of ['layout/list', 'layout/slides', 'layout/elastic-container', 'layout/floating-container', 'portals/close']) {
        await page.goto('/#/harness/' + route);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
        await expect(page.locator('details.source-details')).toHaveCount(0);
    }
});

test('remaining Core, Kit, and Layout harnesses have real source references', async ({page}) => {
    for (const id of ["core/root","kit/comment","kit/message","kit/drawer","layout/header","layout/block-details","layout/surface","layout/search","layout/app-bar","layout/progressive-blur"]) {
        await page.goto('/#/harness/' + id);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Copy example'})).toBeEnabled();
    }
});

test('mobile components link to real Angular-backed harness source', async ({page}) => {
    for (const id of ["mobile/bottom-sheet","mobile/keypad","mobile/mobile-calendar","mobile/mobile-calendar-sheet","mobile/search-bar","mobile/swipe-actions","mobile/tab-bar"]) {
        await page.goto('/#/harness/' + id);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
    }
});

test('commerce and table harness pages include live source references', async ({page}) => {
    for (const id of ["commerce/input-card","commerce/input-card-group","commerce/thumbnail-card","table/reorder","table/table","table/table-pagination"]) {
        await page.goto('/#/harness/' + id);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
    }
});

test('complex Kit harnesses have tested source reference pages', async ({page}) => {
    for (const id of ["kit/files","kit/tree","kit/input-phone-international","kit/notification-middle","kit/preview","kit/push"]) {
        await page.goto('/#/harness/' + id);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
    }
});

test('real alert dropdown hint modal and popup docs pages work', async ({page}) => {
    for (const id of ["portals/alert","portals/dropdown","portals/hint","portals/modal","portals/popup"]) {
        await page.goto('/#/harness/' + id);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
    }
});

test('final platform and mobile portal pages map to real source', async ({page}) => {
    for (const id of ["kit/fullscreen","kit/routable-dialog","layout/dynamic-header","layout/navigation","layout/pdf-viewer","mobile/mobile-calendar-dropdown","mobile/pull-to-refresh","mobile/sheet-dialog"]) {
        await page.goto('/#/harness/' + id);
        await expect(page.locator('harness-detail h1')).toBeVisible();
        await expect(page.getByRole('link', {name: /Source on GitHub/})).toBeVisible();
    }
});

test('landing separates v5 coverage and v4 TODO without a demo link', async ({page}) => {
    await page.goto('/');
    const versions = page.getByRole('region', {name: 'Supported Taiga UI versions'});
    await expect(versions.getByRole('heading', {name: /Taiga UI 5/})).toBeVisible();
    await expect(versions.getByRole('heading', {name: /Taiga UI 4/})).toBeVisible();
    await expect(page.getByTestId('v5-todo')).toHaveText('0 TODO');
    await expect(page.getByTestId('v4-todo')).toHaveText('82 TODO');
    await expect(page.getByTestId('coverage-total')).toHaveText('133');
    await expect(page.getByRole('link', {name: 'v4 Demo'})).toHaveCount(0);
    await expect(page.getByRole('link', {name: 'Open interactive v4 demo'})).toHaveCount(0);
});

test('v4 inventory shows 41 verified entries and 82 TODO', async ({page}) => {
    await page.goto('/');
    await page.getByRole('button', {name: 'View v4 matrix'}).click();
    await expect(page.getByTestId('coverage-total')).toHaveText('123');
    await expect(page.getByTestId('coverage-done')).toHaveText('41');
    await expect(page.getByTestId('coverage-todo')).toHaveText('82');
    await expect(page.locator('tr[data-status="done"]')).toHaveCount(41);
    await expect(page.locator('tr[data-status="todo"]')).toHaveCount(82);
    await expect(page.locator('tr[data-harness="v4/kit/input-password"]')).toContainText('TODO');
    await expect(page.locator('tr[data-harness="v4/kit/avatar"]')).toContainText('Verified');
    for (const name of ['input-date-range', 'input-date-multi', 'input-month', 'input-month-range', 'input-date-time', 'input-year', 'input-range', 'input-chip', 'input-pin']) {
        await expect(page.locator('tr[data-harness="v4/kit/' + name + '"]')).toContainText('Verified');
    }
    const link = page.locator('tr[data-harness="v4/kit/avatar"]').getByRole('link', {name: /tuiAvatar/});
    await expect(link).toHaveAttribute('href', /#\/harness\/kit\/avatar\?version=v4$/);
    await link.click();
    await expect(page.getByRole('button', {name: 'Taiga UI 4'})).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('harness-detail tui-doc-code').first()).toContainText('@taiga-ui-labs/playwright/v4');
});

test('harness pages switch the import and describe v4 DOM adapters', async ({page}) => {
    await page.goto('/#/harness/kit/avatar');
    await expect(page.locator('harness-detail tui-doc-code').first()).toContainText("from '@taiga-ui-labs/playwright'");
    await page.getByRole('button', {name: 'Taiga UI 4'}).click();
    await expect(page).toHaveURL(/version=v4/);
    await expect(page.locator('harness-detail tui-doc-code').first()).toContainText('@taiga-ui-labs/playwright/v4');
    await expect(page.locator('harness-detail')).toContainText('data-type');
    await expect(page.getByRole('link', {name: /View v4 adapter/})).toHaveAttribute('href', /v4\/src\/avatar.ts/);

    await page.goto('/#/harness/portals/dialog?version=v4');
    await expect(page.locator('harness-detail')).toContainText('close-button locator');
    await expect(page.locator('harness-detail tui-doc-code').first()).toContainText('@taiga-ui-labs/playwright/v4');

    await page.goto('/#/harness/kit/accordion?version=v4');
    await expect(page.locator('harness-detail')).toContainText('t-header_open');
    await expect(page.getByRole('link', {name: /View v4 adapter/})).toHaveAttribute('href', /v4\/src\/accordion.ts/);

    await page.goto('/#/harness/kit/tree?version=v4');
    await expect(page.locator('harness-detail')).toContainText('has not been browser-verified');
    await page.getByRole('button', {name: 'Taiga UI 5'}).click();
    await expect(page.locator('harness-detail tui-doc-code').first()).not.toContainText('@taiga-ui-labs/playwright/v4');
});

test('guide keeps the v4 fixture CI-only', async ({page}) => {
    await page.goto('/#/guide');
    await expect(page.locator('getting-started')).toContainText('used only for Playwright tests in CI');
    await expect(page.getByRole('link', {name: 'interactive v4 demo'})).toHaveCount(0);
});
