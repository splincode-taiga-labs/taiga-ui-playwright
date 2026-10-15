import {provideZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withHashLocation} from '@angular/router';
import {
    TUI_DOC_PAGES,
    TUI_DOC_SEARCH_ENABLED,
    TUI_DOC_TITLE,
    TUI_DOC_VERSION,
} from '@taiga-ui/addon-doc';
import {provideTaiga} from '@taiga-ui/core';

import {DocsApp} from './app';
import {HarnessMatrixPage} from './harness-matrix';
import {GettingStartedPage} from './guide';

bootstrapApplication(DocsApp, {
    providers: [
        provideZonelessChangeDetection(),
        provideTaiga(),
        provideRouter([
            {path: '', component: HarnessMatrixPage, title: 'Harness coverage'},
            {path: 'guide', component: GettingStartedPage, title: 'Getting started'},
            {path: '**', redirectTo: ''},
        ], withHashLocation()),
        {provide: TUI_DOC_TITLE, useValue: 'Taiga UI Playwright · '},
        {provide: TUI_DOC_VERSION, useValue: '5.28.0'},
        {provide: TUI_DOC_SEARCH_ENABLED, useValue: false},
        {
            provide: TUI_DOC_PAGES,
            useValue: [
                {section: 'Documentation', title: 'Coverage matrix', route: '/'},
                {section: 'Documentation', title: 'Getting started', route: '/guide'},
            ],
        },
    ],
}).catch((error: unknown) => console.error(error));
