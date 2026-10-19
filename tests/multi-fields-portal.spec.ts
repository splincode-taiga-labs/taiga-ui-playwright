import {expect, test} from '@playwright/test';

import {tuiInputDateMulti, tuiMultiSelect} from '../src/index.js';

const cases = [
    {
        name: 'MultiSelect',
        inputAttribute: 'tuiInputChip',
        optionMarkup: '<tui-data-list><button tuiOption type="button">Estonia</button></tui-data-list>',
        label: 'Estonia',
    },
    {
        name: 'InputDateMulti',
        inputAttribute: 'tuiInputDateMulti',
        optionMarkup: '<tui-calendar-sheet><button automation-id="tui-calendar-sheet__cell" type="button">17</button></tui-calendar-sheet>',
        label: '17',
    },
] as const;

for (const scenario of cases) {
    test(`${scenario.name} reacquires its own portal after detachment before click`, async ({page}) => {
        await page.setContent(`
            <tui-textfield data-testid="field">
                <input ${scenario.inputAttribute} aria-expanded="false" aria-controls="portal-1">
            </tui-textfield>
            <output id="model"></output>
            <tui-dropdown id="decoy" data-testid="unrelated-portal">
                ${scenario.optionMarkup}
            </tui-dropdown>
            <script>
                const input = document.querySelector('input');
                const field = document.querySelector('tui-textfield');
                const model = document.querySelector('#model');
                let swaps = 0;
                const markup = ${JSON.stringify(scenario.optionMarkup)};
                const value = ${JSON.stringify(scenario.label)};

                document.querySelector('#decoy button').addEventListener('click', () => {
                    document.body.dataset.decoyClicked = 'true';
                });

                function mount(id) {
                    const popup = document.createElement('tui-dropdown');
                    popup.id = id;
                    popup.innerHTML = markup;
                    document.body.appendChild(popup);
                    const option = popup.querySelector('button');

                    if (id === 'portal-1') {
                        option.addEventListener('pointerover', () => {
                            swaps++;
                            document.body.dataset.remounts = String(swaps);
                            popup.remove();
                            input.setAttribute('aria-controls', 'portal-2');
                            mount('portal-2');
                        }, {once: true});
                    }

                    option.addEventListener('click', () => {
                        model.textContent = value;
                        const chip = document.createElement('tui-textfield-item');
                        chip.textContent = value;
                        field.appendChild(chip);
                    });
                }

                input.addEventListener('click', () => {
                    input.setAttribute('aria-expanded', 'true');
                    mount('portal-1');
                });
                document.body.dataset.initialized = 'true';
                document.body.dataset.remounts = String(swaps);
            </script>
        `);

        await expect(page.locator('body')).toHaveAttribute('data-initialized', 'true');
        const host = page.getByTestId('field');

        if (scenario.name === 'MultiSelect') {
            await tuiMultiSelect(host).selectOption(scenario.label);
        } else {
            await tuiInputDateMulti(host).toggleDay(17);
        }

        await expect(host.locator('input')).toHaveAttribute('aria-controls', 'portal-2');
        await expect(page.locator('#model')).toHaveText(scenario.label);
        await expect(host.locator('tui-textfield-item')).toHaveText(scenario.label);
        await expect(page.getByTestId('unrelated-portal')).toBeVisible();
        await expect(page.locator('body')).not.toHaveAttribute('data-decoy-clicked', 'true');
        expect(await page.evaluate(() => document.body.dataset.remounts)).toBe('1');
    });
}
