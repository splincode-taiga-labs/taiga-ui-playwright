import {expect, test} from '@playwright/test';

import {tuiSelect} from '../src/index.js';
import {setupOptionsFixture} from './fixtures.js';

test('rejects ambiguous visible portals without aria-controls', async ({page}) => {
    await setupOptionsFixture(page);
    await page.getByTestId('country-overlay').evaluate((element) => { (element as HTMLElement).hidden = false; });
    await page.getByTestId('city-overlay').evaluate((element) => { (element as HTMLElement).hidden = false; });

    const select = tuiSelect(page.getByTestId('country-field'));

    await expect(select.selectOption('Austria')).rejects.toThrow(/multiple overlays are visible/);
    await expect(select.input).toHaveValue('');
});

test('rejects an unowned overlay when another field has focus', async ({page}) => {
    await setupOptionsFixture(page);
    await page.getByTestId('city-field').locator('input').click();

    const select = tuiSelect(page.getByTestId('country-field'));

    await expect(select.selectOption('Austria')).rejects.toThrow(/missing aria-controls/);
    await expect(select.input).toHaveValue('');
});

for (const tag of ['tui-dropdown-mobile', 'tui-sheet-dialog']) {
    test(`uses aria-controls to locate a ${tag} portal`, async ({page}) => {
        await page.setContent(`
            <tui-textfield data-testid="field">
                <input tuiSelect aria-controls="mobile-list" aria-expanded="false">
            </tui-textfield>
            <${tag} id="mobile-list" hidden>
                <tui-data-list>
                    <button tuiOption type="button">Tallinn</button>
                </tui-data-list>
            </${tag}>
            <script>
                const input = document.querySelector('input');
                const overlay = document.getElementById('mobile-list');
                input.addEventListener('click', () => {
                    overlay.hidden = false;
                    input.setAttribute('aria-expanded', 'true');
                });
                overlay.querySelector('button').addEventListener('click', () => {
                    input.value = 'Tallinn';
                    overlay.hidden = true;
                });
            </script>
        `);

        const select = tuiSelect(page.getByTestId('field'));
        await select.selectOption('Tallinn');

        await expect(select.input).toHaveValue('Tallinn');
        await expect(select.overlay).toBeHidden();
    });
}

test('waits for an asynchronously mounted portal and follows a changed aria-controls ID', async ({page}) => {
    await page.setContent(`
        <tui-textfield data-testid="field">
            <input tuiSelect aria-controls="menu-initial" aria-expanded="false">
        </tui-textfield>
        <script>
            const input = document.querySelector('input');
            let generation = 0;
            input.addEventListener('click', () => {
                const id = 'menu-' + (++generation);
                input.setAttribute('aria-controls', id);
                input.setAttribute('aria-expanded', 'true');
                setTimeout(() => {
                    const overlay = document.createElement('tui-dropdown');
                    overlay.id = id;
                    overlay.innerHTML = '<tui-data-list><button tuiOption>Estonia</button></tui-data-list>';
                    document.body.appendChild(overlay);
                    overlay.querySelector('button').addEventListener('click', () => {
                        input.value = 'Estonia';
                        overlay.remove();
                        input.setAttribute('aria-expanded', 'false');
                    });
                }, 40);
            });
            input.addEventListener('keydown', event => {
                if (event.key === 'Escape') {
                    document.querySelector('tui-dropdown')?.remove();
                    input.setAttribute('aria-expanded', 'false');
                }
            });
        </script>
    `);

    const select = tuiSelect(page.getByTestId('field'));
    await select.open();
    await expect(await select.getOverlay()).toHaveAttribute('id', 'menu-1');
    await select.close();
    await expect(select.overlay).toHaveCount(0);

    await select.open();
    await expect(await select.getOverlay()).toHaveAttribute('id', 'menu-2');
    await select.selectOption('Estonia');

    await expect(select.input).toHaveValue('Estonia');
});
