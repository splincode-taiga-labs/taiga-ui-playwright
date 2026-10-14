import {provideZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideTaiga} from '@taiga-ui/core';

import {FixtureApp} from './app';

bootstrapApplication(FixtureApp, {
    providers: [provideZonelessChangeDetection(), provideTaiga()],
}).catch((error: unknown) => console.error(error));
