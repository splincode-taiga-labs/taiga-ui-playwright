import {expect, type Locator} from '@playwright/test';

interface OwnedCalendarPortal {
    readonly id: string;
    readonly portal: Locator;
}

export async function ownedCalendarPortal(input: Locator, field: string): Promise<OwnedCalendarPortal> {
    if ((await input.getAttribute('aria-expanded')) !== 'true') {
        await input.click();
    }

    const id = (await input.getAttribute('aria-controls'))?.trim();

    if (!id || id.split(/\s+/).length !== 1) {
        throw new Error(`${field} requires a single aria-controls ID to identify its calendar portal.`);
    }

    const page = input.page();
    const portal = page.locator('tui-dropdown:visible')
        .and(page.locator('[id=' + JSON.stringify(id) + ']'));

    await expect(portal).toBeVisible();

    return {id, portal};
}

export async function clickOwnedCalendarCell(
    input: Locator,
    field: string,
    findCell: (portal: Locator) => Locator,
): Promise<void> {
    for (let attempt = 0; attempt < 3; attempt++) {
        const {id, portal} = await ownedCalendarPortal(input, field);
        const cell = findCell(portal);

        try {
            await expect(cell).toHaveCount(1);
            await expect(cell).toBeVisible();
            await expect(cell).not.toHaveClass(/t-cell_disabled/);
            await cell.click({timeout: 3000});

            return;
        } catch (error) {
            const currentId = (await input.getAttribute('aria-controls'))?.trim();

            if (currentId === id || attempt === 2) {
                throw error;
            }
        }
    }
}
