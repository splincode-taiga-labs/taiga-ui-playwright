import {expect, test} from '@playwright/test';

import {tuiInputDate, tuiInputDateRange, tuiInputDateTime, tuiInputMonth} from '../src/index.js';

const dayMarkup = '<tui-calendar><tui-calendar-sheet><button automation-id="tui-calendar-sheet__cell" type="button">22</button></tui-calendar-sheet></tui-calendar>';
const monthMarkup = '<tui-calendar-month><div class="t-row">' +
    Array.from({length: 12}, (_, index) =>
        '<button class="t-cell" type="button">' + index + '</button>',
    ).join('') + '</div></tui-calendar-month>';

const cases = [
    {name: 'InputDate', inputAttribute: 'tuiInputDate', markup: dayMarkup, label: '22'},
    {name: 'InputDateTime', inputAttribute: 'tuiInputDateTime', markup: dayMarkup, label: '22'},
    {name: 'InputMonth', inputAttribute: 'tuiInputMonth', markup: monthMarkup, label: '2'},
] as const;

for (const scenario of cases) {
    test(`${scenario.name} chooses only from the replacement owned calendar`, async ({page}) => {
        await page.setContent(`
            <tui-textfield data-testid="field">
                <input ${scenario.inputAttribute} aria-expanded="false" aria-controls="portal-1">
            </tui-textfield>
            <output id="model"></output>
            <tui-dropdown id="decoy" data-testid="unrelated-portal">
                ${scenario.markup}
            </tui-dropdown>
            <script>
                const input = document.querySelector('input');
                const model = document.querySelector('#model');
                const markup = ${JSON.stringify(scenario.markup)};
                const target = ${JSON.stringify(scenario.label)};
                let rotations = 0;

                document.querySelector('#decoy').addEventListener('click', () => {
                    document.body.dataset.decoyClicked = 'true';
                });

                function mount(id) {
                    const popup = document.createElement('tui-dropdown');
                    popup.id = id;
                    popup.innerHTML = markup;
                    document.body.appendChild(popup);

                    const option = Array.from(popup.querySelectorAll('button'))
                        .find(button => button.textContent.trim() === target);

                    if (id === 'portal-1') {
                        option.addEventListener('pointerover', () => {
                            rotations++;
                            document.body.dataset.rotations = String(rotations);
                            popup.remove();
                            input.setAttribute('aria-controls', 'portal-2');
                            mount('portal-2');
                        }, {once: true});
                    }

                    option.addEventListener('click', () => {
                        model.textContent = target;
                        input.value = target;
                        document.body.dataset.clickedPortal = id;
                    });
                }

                input.addEventListener('click', () => {
                    input.setAttribute('aria-expanded', 'true');
                    mount('portal-1');
                });
                document.body.dataset.rotations = String(rotations);
            </script>
        `);

        const field = page.getByTestId('field');

        if (scenario.name === 'InputDate') {
            await tuiInputDate(field).selectDay(22);
        } else if (scenario.name === 'InputDateTime') {
            await tuiInputDateTime(field).selectDay(22);
        } else {
            await tuiInputMonth(field).selectMonth(2);
        }

        await expect(field.locator('input')).toHaveAttribute('aria-controls', 'portal-2');
        await expect(page.locator('#model')).toHaveText(scenario.label);
        await expect(page.locator('body')).toHaveAttribute('data-clicked-portal', 'portal-2');
        await expect(page.locator('body')).toHaveAttribute('data-rotations', '1');
        await expect(page.getByTestId('unrelated-portal')).toBeVisible();
        await expect(page.locator('body')).not.toHaveAttribute('data-decoy-clicked', 'true');
    });
}

test('InputDateRange retries only its second click after the owned calendar remounts', async ({page}) => {
    const markup = '<tui-calendar-range><tui-calendar><tui-calendar-sheet>' +
        '<button automation-id="tui-calendar-sheet__cell" type="button">18</button>' +
        '<button automation-id="tui-calendar-sheet__cell" type="button">20</button>' +
        '</tui-calendar-sheet></tui-calendar></tui-calendar-range>';

    await page.setContent(`
        <tui-textfield data-testid="field">
            <input tuiInputDateRange aria-expanded="false" aria-controls="portal-1">
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

                const start = popup.querySelectorAll('button')[0];
                const end = popup.querySelectorAll('button')[1];

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
                    input.value = '18-20';
                    model.textContent = '18-20';
                });
            }

            input.addEventListener('click', () => {
                input.setAttribute('aria-expanded', 'true');
                mount('portal-1');
            });
            document.body.dataset.initialized = 'true';
            window.getCalendarCounts = () => ({rotations, startClicks, endClicks});
        </script>
    `);

    const field = tuiInputDateRange(page.getByTestId('field'));
    await field.selectRange(18, 20);

    await expect(page.getByTestId('field').locator('input')).toHaveAttribute('aria-controls', 'portal-2');
    await expect(page.locator('#model')).toHaveText('18-20');
    await expect(page.locator('body')).toHaveAttribute('data-start-portal', 'portal-1');
    await expect(page.locator('body')).toHaveAttribute('data-end-portal', 'portal-2');
    expect(await page.evaluate(() => (window as unknown as {getCalendarCounts: () => unknown}).getCalendarCounts()))
        .toEqual({rotations: 1, startClicks: 1, endClicks: 1});
    await expect(page.getByTestId('unrelated-portal')).toBeVisible();
    await expect(page.locator('body')).not.toHaveAttribute('data-decoy-clicked', 'true');
});
