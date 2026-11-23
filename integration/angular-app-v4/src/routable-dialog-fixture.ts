import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-v4-route-home',
    template: '',
})
export class V4RouteHome {}

@Component({
    selector: 'app-v4-route-dialog-content',
    template: '<p data-testid="v4-routed-dialog-content">Opened from Angular Router</p>',
})
export class V4RouteDialogContent {}

@Component({
    selector: 'app-v4-routable-dialog-fixture',
    imports: [RouterLink, RouterOutlet],
    template: `
        <section>
            <h2>RoutableDialog</h2>
            <button type="button" routerLink="/routed-v4-dialog">Open v4 routed dialog</button>
            <router-outlet />
        </section>
    `,
})
export class V4RoutableDialogFixture {}
