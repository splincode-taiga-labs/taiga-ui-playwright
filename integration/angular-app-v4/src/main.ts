import '@angular/compiler';
import {provideZoneChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {NG_EVENT_PLUGINS} from '@taiga-ui/event-plugins';
import {tuiGenerateDialogableRoute} from '@taiga-ui/kit';

import {DemoV4} from './app';
import {V4RouteDialogContent, V4RouteHome} from './routable-dialog-fixture';

bootstrapApplication(DemoV4, {
    providers: [
        provideZoneChangeDetection(),
        provideAnimations(),
        NG_EVENT_PLUGINS,
        provideRouter([
            {path: '', pathMatch: 'full', component: V4RouteHome},
            tuiGenerateDialogableRoute(V4RouteDialogContent, {
                path: 'routed-v4-dialog',
                label: 'Routed v4 dialog',
                dismissible: true,
                closeable: true,
            }),
        ]),
    ],
}).catch((error: unknown) => console.error(error));
