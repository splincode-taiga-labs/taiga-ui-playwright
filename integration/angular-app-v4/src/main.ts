import '@angular/compiler';
import {provideZoneChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {NG_EVENT_PLUGINS} from '@taiga-ui/event-plugins';

import {DemoV4} from './app';

bootstrapApplication(DemoV4, {
    providers: [provideZoneChangeDetection(), provideAnimations(), NG_EVENT_PLUGINS],
}).catch((error: unknown) => console.error(error));
