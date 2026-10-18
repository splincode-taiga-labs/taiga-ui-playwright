import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TuiItem} from '@taiga-ui/cdk';
import {TuiButton, TuiTextfield} from '@taiga-ui/core';
import {
    TuiFiles, TuiInputPhoneInternationalComponent, TuiNotificationMiddle,
    TuiPreviewComponent, TuiPushComponent, TuiTree,
} from '@taiga-ui/kit';

@Component({
    selector: 'app-remaining-kit',
    imports: [
        ReactiveFormsModule, TuiItem, TuiButton, TuiTextfield,
        TuiFiles, TuiInputPhoneInternationalComponent, TuiNotificationMiddle,
        TuiPreviewComponent, TuiPushComponent, TuiTree,
    ],
    template: `
        <section data-testid="remaining-kit">
            <h2>Complex Kit fixtures</h2>
            <tui-files data-testid="files-widget" [max]="1">
                <ng-template tuiItem><span>File alpha.txt</span></ng-template>
                <ng-template tuiItem><span>File beta.txt</span></ng-template>
                <ng-template tuiItem><span>File gamma.txt</span></ng-template>
            </tui-files>

            <tui-tree data-testid="tree-widget" [value]="treeRoot()" />
            <button type="button" (click)="treeRoot.set('Updated tree node')">
                Update tree
            </button>

            <tui-textfield data-testid="international-phone-widget">
                <input tuiInputPhoneInternational aria-label="International phone"
                    [formControl]="phone" />
            </tui-textfield>
            <output data-testid="phone-value">{{phone.value}}</output>

            <button type="button" (click)="middleOpen.set(true)">
                Open middle notification
            </button>
            <ng-template [(tuiNotificationMiddle)]="middleOpen"
                [tuiNotificationMiddleOptions]="{closable: true}">
                Loading account information
            </ng-template>
            <output data-testid="middle-open">{{middleOpen()}}</output>

            <tui-preview data-testid="preview-widget" [rotatable]="true">
                <div style="width:160px;height:160px">Preview artwork</div>
            </tui-preview>

            @if (pushOpen()) {
                <tui-push data-testid="push-widget" heading="Account update"
                    type="Notice" (close)="pushOpen.set(false)">
                    Push message
                </tui-push>
            }
            <button type="button" (click)="pushOpen.set(true)">Show push</button>
        </section>
    `,
})
export class RemainingKit {
    protected readonly treeRoot = signal('Initial tree node');
    protected readonly phone = new FormControl('', {nonNullable: true});
    protected readonly middleOpen = signal(false);
    protected readonly pushOpen = signal(true);
}
