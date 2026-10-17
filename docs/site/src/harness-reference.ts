import {HARNESS_CATALOG, IMPLEMENTATIONS} from './harness-catalog';

const SOURCES: Readonly<Record<string, string>> = {
    "core/loader": "visual-harnesses.ts",
    "kit/avatar": "visual-harnesses.ts",
    "kit/badge-notification": "visual-harnesses.ts",
    "kit/status": "visual-harnesses.ts",
    "kit/breadcrumbs": "visual-harnesses.ts",
    "kit/select": "select.ts",
    "kit/combo-box": "combo-box.ts",
    "portals/dialog": "dialog.ts",
    "core/button": "basic-harnesses.ts",
    "core/checkbox": "basic-harnesses.ts",
    "core/radio": "basic-harnesses.ts",
    "core/input": "basic-harnesses.ts",
    "kit/switch": "basic-harnesses.ts",
    "kit/textarea": "basic-harnesses.ts",
    "kit/tabs": "basic-harnesses.ts",
    "kit/segmented": "basic-harnesses.ts",
    "kit/accordion": "basic-harnesses.ts",
    "kit/pagination": "basic-harnesses.ts",
    "kit/stepper": "basic-harnesses.ts",
    "kit/input-number": "specialized-inputs.ts",
    "kit/input-phone": "specialized-inputs.ts",
    "kit/input-pin": "specialized-inputs.ts",
    "kit/input-color": "specialized-inputs.ts",
    "kit/input-slider": "specialized-inputs.ts",
    "core/slider": "specialized-inputs.ts",
    "core/calendar": "date-harnesses.ts",
    "kit/calendar-month": "date-harnesses.ts",
    "kit/input-date": "date-harnesses.ts",
    "kit/input-year": "date-harnesses.ts",
    "kit/input-time": "date-harnesses.ts",
    "kit/calendar-range": "date-range-harnesses.ts",
    "kit/input-date-range": "date-range-harnesses.ts",
    "kit/input-date-time": "date-range-harnesses.ts",
    "kit/input-month": "date-range-harnesses.ts",
    "kit/rating": "interactive-widgets.ts",
    "kit/like": "interactive-widgets.ts",
    "kit/copy": "interactive-widgets.ts",
    "kit/input-chip": "interactive-widgets.ts",
    "kit/progress": "interactive-widgets.ts",
    "kit/counter": "form-navigation.ts",
    "kit/radio-list": "form-navigation.ts",
    "kit/input-inline": "form-navigation.ts",
    "kit/range": "form-navigation.ts",
    "core/expand": "form-navigation.ts",
    "kit/multi-select": "multi-fields.ts",
    "kit/input-date-multi": "multi-fields.ts",
    "kit/input-range": "multi-fields.ts",
    "core/spin-button": "semantic-harnesses.ts",
    "kit/pincode": "semantic-harnesses.ts",
    "kit/button-loading": "semantic-harnesses.ts",
    "kit/pager": "semantic-harnesses.ts",
    "core/link": "semantic-harnesses.ts",
    "kit/chip": "semantic-harnesses.ts",
    "kit/badge": "semantic-harnesses.ts",
    "kit/pin": "semantic-harnesses.ts",
    "kit/meter": "semantic-harnesses.ts"
};

const ACTIONS: Readonly<Record<string, string>> = {
    "core/loader": "await harness.expectLoading();",
    "kit/avatar": "await harness.expectShape('round');",
    "kit/badge-notification": "await harness.expectCount(3);",
    "kit/status": "await harness.expectColor('lime');",
    "kit/breadcrumbs": "await harness.follow('Products');",
    "kit/select": "await harness.selectOption('Estonia');\nawait expect(harness.input).toHaveValue('Estonia');",
    "kit/combo-box": "await harness.fill('Tall');\nawait harness.selectOption('Tallinn');",
    "portals/dialog": "await expect(harness.title).toBeVisible();\nawait harness.close();",
    "core/button": "await harness.click();",
    "core/checkbox": "await harness.check();\nawait expect(harness.host).toBeChecked();",
    "core/radio": "await harness.check();\nawait expect(harness.host).toBeChecked();",
    "core/input": "await harness.fill('Hello');\nawait expect(harness.input).toHaveValue('Hello');",
    "core/slider": "await harness.stepRight();\nexpect(await harness.value()).toBeGreaterThan(0);",
    "core/calendar": "await harness.selectDay(15);",
    "core/expand": "await harness.expectExpanded();",
    "kit/multi-select": "await harness.selectOption('Estonia');",
    "kit/input-date-multi": "await harness.toggleDay(17);",
    "kit/input-range": "await harness.setStart(30);\nawait harness.setEnd(70);",
    "core/spin-button": "await harness.increase();",
    "kit/pincode": "await harness.enter('1234');",
    "kit/button-loading": "await harness.expectLoading();",
    "kit/pager": "await harness.expectIndex(0);",
    "core/link": "await harness.follow();",
    "kit/chip": "await harness.expectAppearance('positive');",
    "kit/badge": "await harness.expectAppearanceAndSize('positive', 'm');",
    "kit/pin": "await harness.expectOpen(true);",
    "kit/meter": "await harness.expectValue(25);",
    "kit/calendar-month": "await harness.selectMonth(0);",
    "kit/input-date": "await harness.selectDay(15);",
    "kit/input-year": "await harness.fillYear('2026');",
    "kit/input-time": "await harness.fillTime('11:30');",
    "kit/calendar-range": "await harness.selectRange(15, 17);",
    "kit/input-date-range": "await harness.selectRange(15, 17);",
    "kit/input-date-time": "await harness.selectDay(15);",
    "kit/input-month": "await harness.selectMonth(0);",
    "kit/input-number": "await harness.fill('42');",
    "kit/input-phone": "await harness.fill('9991234567');",
    "kit/input-pin": "await harness.fill('1234');",
    "kit/input-color": "await harness.fill('#112233');",
    "kit/input-slider": "await harness.fill('65');",
    "kit/switch": "await harness.setChecked(true);",
    "kit/textarea": "await harness.fill('A useful note');",
    "kit/tabs": "await harness.select('Details');",
    "kit/segmented": "await harness.select('Week');",
    "kit/accordion": "await harness.expand('Shipping');",
    "kit/pagination": "await harness.goTo(2);",
    "kit/stepper": "await harness.activate('Shipping');",
    "kit/rating": "await harness.rate(4);",
    "kit/like": "await harness.setLiked(true);",
    "kit/copy": "await harness.copy();",
    "kit/input-chip": "await harness.add('Alpha');",
    "kit/progress": "await harness.expectValue(25);",
    "kit/counter": "await harness.increase();",
    "kit/radio-list": "await harness.select('Medium');",
    "kit/input-inline": "await harness.fill('Edited inline');",
    "kit/range": "await harness.stepStartRight();"
};

export interface HarnessReference {
    readonly id: string;
    readonly name: string;
    readonly category: string;
    readonly api: string;
    readonly sourceFile: string;
    readonly route: string;
}

export const HARNESS_REFERENCES: readonly HarnessReference[] = HARNESS_CATALOG
    .filter((entry) => entry.status === 'done')
    .map((entry) => ({
        id: entry.id,
        name: entry.name,
        category: entry.category,
        api: IMPLEMENTATIONS[entry.id] ?? '',
        sourceFile: SOURCES[entry.id] ?? '',
        route: '/harness/' + entry.id,
    }));

export function getHarnessSourceFile(id: string): string {
    return SOURCES[id] ?? '';
}

export function makeExample(entry: HarnessReference): string {
    const action = ACTIONS[entry.id] ?? 'await expect(harness.host).toBeVisible();';
    const fixture = entry.id === 'portals/dialog'
        ? "page.locator('tui-dialog')"
        : "page.getByTestId('" + entry.name + "-field')";
    return [
        "import {expect, test} from '@playwright/test';",
        "import {" + entry.api + "} from '@taiga-ui-labs/playwright';",
        '',
        "test('" + entry.name + "', async ({page}) => {",
        "    await page.goto('/');",
        "    // Replace the locator with the matching component in your app.",
        '    const harness = ' + entry.api + '(' + fixture + ');',
        ...action.split('\n').map((line) => '    ' + line),
        '});',
    ].join('\n');
}

export const HARNESS_NAVIGATION = [
    {section: 'Documentation', title: 'Coverage matrix', route: '/matrix'},
    {section: 'Documentation', title: 'Getting started', route: '/guide'},
    ...(['Core', 'Kit', 'Portals', 'Mobile', 'Layout', 'Table', 'Commerce'] as const)
        .map((category) => ({
            section: 'Harnesses',
            title: category,
            subPages: HARNESS_REFERENCES.filter((item) => item.category === category)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => ({
                    title: item.api,
                    route: item.route,
                    keywords: item.name + ' ' + item.category,
                })),
        }))
        .filter((group) => group.subPages.length > 0),
];
