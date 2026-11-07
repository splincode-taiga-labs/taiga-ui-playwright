/** Taiga UI v4 secondary entrypoint. Shared helpers use the primary APF entrypoint. */
export * from '@taiga-ui-labs/playwright';
// The explicit exports override the v5 Avatar DOM contract for v4.
export {TuiAvatarHarness, tuiAvatar} from './avatar';
export {TuiComboBox, tuiComboBox} from './combo-box';
export {TuiDialog, tuiDialog} from './dialog';
