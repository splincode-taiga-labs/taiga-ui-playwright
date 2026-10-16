import {provideZonelessChangeDetection, signal} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withHashLocation} from '@angular/router';
import {
    TUI_DOC_LOGO,
    TUI_DOC_PAGES,
    TUI_DOC_SEARCH_ENABLED,
    TUI_DOC_TITLE,
    TUI_DOC_VERSION,
} from '@taiga-ui/addon-doc';
import {provideTaiga} from '@taiga-ui/core';
import {provideHighlightOptions} from 'ngx-highlightjs';

import {DocsApp} from './app';
import {HarnessMatrixPage} from './harness-matrix';
import {GettingStartedPage} from './guide';
import {HarnessDetailPage} from './harness-detail';
import {HARNESS_NAVIGATION} from './harness-reference';

bootstrapApplication(DocsApp, {
    providers: [
        provideZonelessChangeDetection(),
        provideTaiga(),
        provideRouter([
            {path: '', pathMatch: 'full', redirectTo: 'matrix'},
            {path: 'matrix', component: HarnessMatrixPage, title: 'Harness coverage'},
            {path: 'guide', component: GettingStartedPage, title: 'Getting started'},
            {path: 'harness/:category/:name', component: HarnessDetailPage, title: 'Harness reference'},
            {path: '**', redirectTo: ''},
        ], withHashLocation()),
        provideHighlightOptions({
            coreLibraryLoader: () => import('highlight.js/lib/core'),
            languages: {
                typescript: () => import('highlight.js/lib/languages/typescript'),
            },
        }),
        {provide: TUI_DOC_LOGO, useValue: 'assets/brand.svg'},
        {provide: TUI_DOC_TITLE, useValue: 'Taiga UI Playwright · '},
        {provide: TUI_DOC_VERSION, useValue: '5.28.0'},
        {provide: TUI_DOC_SEARCH_ENABLED, useValue: signal(true)},
        {
            provide: TUI_DOC_PAGES,
            useValue: HARNESS_NAVIGATION,
        },
    ],
}).catch((error: unknown) => console.error(error));
