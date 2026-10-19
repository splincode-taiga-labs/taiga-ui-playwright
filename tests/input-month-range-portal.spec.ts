import {expect, test} from '@playwright/test';

import {tuiInputMonthRange} from '../src/index.js';

test('InputMonthRange retries only the end month after its calendar remounts', async ({page}) => {
    const markup = '<tui-calendar-month><div class="t-row">' +
        Array.from({length: 12}, (_, index) =>
            '<button class="t-cell" type="button">' + index + '</button>',
        ).join('') + '</div></tui-calendar-month>';

    await page.setContent(`
        <tui-textfield data-testid="month-range-field">
            <input tuiInputMonthRange aria-expanded="false" aria-controls="portal-1">
        </tui-textfield>
        <output id="model"></output>
        <tui-dropdown id="decoy" data-testid="unrelated-portal">
            ${markup}
        </tui-dropdown>
        <script>
            const input = document.querySelector('input');
            const model = document.querySelector('#model');
            const markup = ${JSON.stringify(markup)};
            let rotations = 0;
            let startClicks = 0;
            let endClicks = 0;

            document.querySelector('#decoy').addEventListener('click', () => {
                document.body.dataset.decoyClicked = 'true';
            });

            function mount(id) {
                const popup = document.createElement('tui-dropdown');
                popup.id = id;
                popup.innerHTML = markup;
                document.body.appendChild(popup);

                const cells = popup.querySelectorAll('.t-cell');
                const start = cells[2];
                const end = cells[4];

                if (id === 'portal-1') {
                    end.addEventListener('pointerover', () => {
                        rotations++;
                        popup.remove();
                        input.setAttribute('aria-controls', 'portal-2');
                        mount('portal-2');
                    }, {once: true});
                }

                start.addEventListener('click', () => {
                    startClicks++;
                    document.body.dataset.startPortal = id;
                });
                end.addEventListener('click', () => {
                    endClicks++;
                    document.body.dataset.endPortal = id;
                    input.value = 'Mar 2026 – May 2026';
                    input.setAttribute('aria-expanded', 'false');
                    model.textContent = '2-4';
                    popup.remove();
                });
            }

            input.addEventListener('click', () => {
                input.setAttribute('aria-expanded', 'true');
                mount('portal-1');
            });
            window.getMonthRangeCounts = () => ({rotations, startClicks, endClicks});
        </script>
    `);

    const field = tuiInputMonthRange(page.getByTestId('month-range-field'));
    await field.selectRange(2, 4);

    await expect(field.input).toHaveAttribute('aria-controls', 'portal-2');
    await expect(field.input).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#model')).toHaveText('2-4');
    await expect(page.locator('body')).toHaveAttribute('data-start-portal', 'portal-1');
    await expect(page.locator('body')).toHaveAttribute('data-end-portal', 'portal-2');
    expect(await page.evaluate(() =>
        (window as unknown as {getMonthRangeCounts: () => unknown}).getMonthRangeCounts(),
    )).toEqual({rotations: 1, startClicks: 1, endClicks: 1});
    await expect(page.getByTestId('unrelated-portal')).toBeVisible();
    await expect(page.locator('body')).not.toHaveAttribute('data-decoy-clicked', 'true');
});
