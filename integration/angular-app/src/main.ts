import '@angular/compiler';
import {provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {tuiRouteDialog} from '@taiga-ui/kit';
import {RoutableFixtureContent} from './routable-fixture-content';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideTaiga} from '@taiga-ui/core';

import {FixtureApp} from './app';

bootstrapApplication(FixtureApp, {
    providers: [provideZonelessChangeDetection(), provideTaiga(), provideRouter([tuiRouteDialog(RoutableFixtureContent, {path: 'routable-fixture'})])],
}).catch((error: unknown) => console.error(error));
