# Taiga UI v4.x component inventory

Derived from the [upstream `v4.x` branch](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects), not from the current v5 catalog. This is a snapshot of **123 component directories** in Core, Kit, Mobile, Layout, Table and Commerce. It excludes standalone directives, pipes, legacy and experimental packages. Source directory availability may differ between early and late 4.x releases.

Only **41 components are browser-verified** on **Taiga UI 4.106.0**, Angular 20.3.0 and Chromium. The other **82** source directories are not verified by this v4 browser suite. See [tested behaviors](taiga-v4-coverage.md) and the [versioned documentation matrix](https://splincode-taiga-labs.github.io/taiga-ui-playwright/). The real v4 fixture remains in CI only.

A mapped harness indicates a name-based link to the package's public API, **not** that the corresponding v4 DOM contract works. A dash means no unambiguous direct mapping was found.

| Package | v4 component | Mapped harness | v4 browser result |
| --- | --- | --- | --- |
| Core | [`alert`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/alert) | `tuiAlert` | Not verified |
| Core | [`button`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/button) | `tuiButton` | Verified on 4.106 |
| Core | [`calendar`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/calendar) | `tuiCalendar` | Verified on 4.106 |
| Core | [`data-list`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/data-list) | `tuiDataList` | Not verified |
| Core | [`dialog`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/dialog) | `tuiDialog` | Verified on 4.106 |
| Core | [`error`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/error) | `tuiError` | Not verified |
| Core | [`expand`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/expand) | `tuiExpand` | Verified on 4.106 |
| Core | [`fullscreen`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/fullscreen) | `tuiFullscreen` | Not verified |
| Core | [`icon`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/icon) | `tuiIcon` | Not verified |
| Core | [`label`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/label) | `tuiLabel` | Not verified |
| Core | [`link`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/link) | `tuiLink` | Verified on 4.106 |
| Core | [`loader`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/loader) | `tuiLoader` | Verified on 4.106 |
| Core | [`notification`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/notification) | `tuiNotification` | Not verified |
| Core | [`root`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/root) | `tuiRoot` | Not verified |
| Core | [`scrollbar`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/scrollbar) | `tuiScrollbar` | Not verified |
| Core | [`spin-button`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/spin-button) | `tuiSpinButton` | Not verified |
| Core | [`textfield`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/core/components/textfield) | `tuiTextfield` | Verified on 4.106 |
| Kit | [`accordion`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/accordion) | `tuiAccordion` | Verified on 4.106 |
| Kit | [`action-bar`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/action-bar) | `tuiActionBar` | Not verified |
| Kit | [`avatar`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/avatar) | `tuiAvatar` | Verified on 4.106 |
| Kit | [`badge`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/badge) | `tuiBadge` | Verified on 4.106 |
| Kit | [`badge-notification`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/badge-notification) | `tuiBadgeNotification` | Verified on 4.106 |
| Kit | [`badged-content`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/badged-content) | `tuiBadgedContent` | Not verified |
| Kit | [`block`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/block) | `tuiBlock` | Not verified |
| Kit | [`breadcrumbs`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/breadcrumbs) | `tuiBreadcrumbs` | Verified on 4.106 |
| Kit | [`button-loading`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/button-loading) | `tuiButtonLoading` | Not verified |
| Kit | [`calendar-month`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/calendar-month) | `tuiCalendarMonth` | Not verified |
| Kit | [`calendar-range`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/calendar-range) | `tuiCalendarRange` | Not verified |
| Kit | [`carousel`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/carousel) | `tuiCarousel` | Not verified |
| Kit | [`checkbox`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/checkbox) | `tuiCheckbox` | Verified on 4.106 |
| Kit | [`chip`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/chip) | `tuiChip` | Verified on 4.106 |
| Kit | [`combo-box`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/combo-box) | `tuiComboBox` | Verified on 4.106 |
| Kit | [`comment`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/comment) | `tuiComment` | Not verified |
| Kit | [`compass`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/compass) | `tuiCompass` | Not verified |
| Kit | [`confirm`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/confirm) | `tuiConfirm` | Not verified |
| Kit | [`counter`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/counter) | `tuiCounter` | Not verified |
| Kit | [`data-list-wrapper`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/data-list-wrapper) | `tuiDataListWrapper` | Not verified |
| Kit | [`drawer`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/drawer) | `tuiDrawer` | Not verified |
| Kit | [`elastic-container`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/elastic-container) | `tuiElasticContainer` | Not verified |
| Kit | [`files`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/files) | `tuiFiles` | Not verified |
| Kit | [`filter`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/filter) | `tuiFilter` | Not verified |
| Kit | [`floating-container`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/floating-container) | `tuiFloatingContainer` | Not verified |
| Kit | [`input-chip`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-chip) | `tuiInputChip` | Verified on 4.106 |
| Kit | [`input-color`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-color) | `tuiInputColor` | Not verified |
| Kit | [`input-date`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-date) | `tuiInputDate` | Verified on 4.106 |
| Kit | [`input-date-multi`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-date-multi) | `tuiInputDateMulti` | Verified on 4.106 |
| Kit | [`input-date-range`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-date-range) | `tuiInputDateRange` | Verified on 4.106 |
| Kit | [`input-date-time`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-date-time) | `tuiInputDateTime` | Verified on 4.106 |
| Kit | [`input-inline`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-inline) | `tuiInputInline` | Not verified |
| Kit | [`input-month`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-month) | `tuiInputMonth` | Verified on 4.106 |
| Kit | [`input-month-range`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-month-range) | `tuiInputMonthRange` | Verified on 4.106 |
| Kit | [`input-number`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-number) | `tuiInputNumber` | Verified on 4.106 |
| Kit | [`input-password`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-password) | — | Not verified |
| Kit | [`input-phone`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-phone) | `tuiInputPhone` | Verified on 4.106 |
| Kit | [`input-phone-international`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-phone-international) | `tuiInternationalPhone` | Not verified |
| Kit | [`input-pin`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-pin) | `tuiInputPin` | Verified on 4.106 |
| Kit | [`input-range`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-range) | `tuiInputRange` | Verified on 4.106 |
| Kit | [`input-slider`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-slider) | `tuiInputSlider` | Verified on 4.106 |
| Kit | [`input-time`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-time) | `tuiInputTime` | Verified on 4.106 |
| Kit | [`input-year`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/input-year) | `tuiInputYear` | Verified on 4.106 |
| Kit | [`items-with-more`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/items-with-more) | `tuiItemsWithMore` | Not verified |
| Kit | [`like`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/like) | `tuiLike` | Verified on 4.106 |
| Kit | [`line-clamp`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/line-clamp) | `tuiLineClamp` | Not verified |
| Kit | [`message`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/message) | `tuiMessage` | Not verified |
| Kit | [`multi-select`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/multi-select) | `tuiMultiSelect` | Verified on 4.106 |
| Kit | [`notification-middle`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/notification-middle) | `tuiNotificationMiddle` | Not verified |
| Kit | [`pager`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/pager) | `tuiPager` | Not verified |
| Kit | [`pagination`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/pagination) | `tuiPagination` | Verified on 4.106 |
| Kit | [`pdf-viewer`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/pdf-viewer) | `tuiPdfViewer` | Not verified |
| Kit | [`pin`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/pin) | `tuiPin` | Not verified |
| Kit | [`preview`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/preview) | `tuiPreview` | Not verified |
| Kit | [`progress`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/progress) | `tuiProgress` | Verified on 4.106 |
| Kit | [`pulse`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/pulse) | `tuiPulse` | Not verified |
| Kit | [`push`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/push) | `tuiPush` | Not verified |
| Kit | [`radio`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/radio) | `tuiRadio` | Verified on 4.106 |
| Kit | [`radio-list`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/radio-list) | `tuiRadioList` | Not verified |
| Kit | [`range`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/range) | `tuiRange` | Not verified |
| Kit | [`rating`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/rating) | `tuiRating` | Verified on 4.106 |
| Kit | [`routable-dialog`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/routable-dialog) | `tuiRoutableDialog` | Not verified |
| Kit | [`segmented`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/segmented) | `tuiSegmented` | Verified on 4.106 |
| Kit | [`select`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/select) | `tuiSelect` | Verified on 4.106 |
| Kit | [`shrink-wrap`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/shrink-wrap) | `tuiShrinkWrap` | Not verified |
| Kit | [`slider`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/slider) | `tuiSlider` | Not verified |
| Kit | [`slides`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/slides) | `tuiSlides` | Not verified |
| Kit | [`status`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/status) | `tuiStatus` | Not verified |
| Kit | [`stepper`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/stepper) | `tuiStepper` | Verified on 4.106 |
| Kit | [`switch`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/switch) | `tuiSwitch` | Verified on 4.106 |
| Kit | [`tabs`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/tabs) | `tuiTabs` | Verified on 4.106 |
| Kit | [`textarea`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/textarea) | `tuiTextarea` | Verified on 4.106 |
| Kit | [`tiles`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/tiles) | `tuiTiles` | Not verified |
| Kit | [`toast`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/toast) | `tuiToast` | Not verified |
| Kit | [`tree`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/kit/components/tree) | `tuiTree` | Not verified |
| Mobile | [`bottom-sheet`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-mobile/components/bottom-sheet) | `tuiBottomSheet` | Not verified |
| Mobile | [`mobile-calendar`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-mobile/components/mobile-calendar) | `tuiMobileCalendar` | Not verified |
| Mobile | [`mobile-calendar-dropdown`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-mobile/components/mobile-calendar-dropdown) | `tuiMobileCalendarDropdown` | Not verified |
| Mobile | [`mobile-calendar-sheet`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-mobile/components/mobile-calendar-sheet) | `tuiMobileCalendarSheet` | Not verified |
| Mobile | [`mobile-dialog`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-mobile/components/mobile-dialog) | — | Not verified |
| Mobile | [`pull-to-refresh`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-mobile/components/pull-to-refresh) | `tuiPullToRefresh` | Not verified |
| Mobile | [`search-bar`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-mobile/components/search-bar) | `tuiSearchBar` | Not verified |
| Mobile | [`sheet-dialog`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-mobile/components/sheet-dialog) | `tuiSheetDialog` | Not verified |
| Mobile | [`swipe-action`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-mobile/components/swipe-action) | — | Not verified |
| Mobile | [`tab-bar`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-mobile/components/tab-bar) | `tuiTabBar` | Not verified |
| Layout | [`app-bar`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/app-bar) | `tuiAppBar` | Not verified |
| Layout | [`block-details`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/block-details) | `tuiBlockDetails` | Not verified |
| Layout | [`block-status`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/block-status) | `tuiBlockStatus` | Not verified |
| Layout | [`card`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/card) | `tuiCard` | Not verified |
| Layout | [`cell`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/cell) | `tuiCell` | Not verified |
| Layout | [`dynamic-header`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/dynamic-header) | `tuiDynamicHeader` | Not verified |
| Layout | [`form`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/form) | `tuiForm` | Not verified |
| Layout | [`header`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/header) | `tuiHeader` | Not verified |
| Layout | [`input-search`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/input-search) | `tuiInputSearch` | Not verified |
| Layout | [`item-group`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/item-group) | `tuiItemGroup` | Not verified |
| Layout | [`navigation`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/navigation) | `tuiNavigation` | Not verified |
| Layout | [`progressive-blur`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/progressive-blur) | `tuiProgressiveBlur` | Not verified |
| Layout | [`search`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/layout/components/search) | `tuiSearch` | Not verified |
| Table | [`reorder`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-table/components/reorder) | `tuiReorder` | Not verified |
| Table | [`table`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-table/components/table) | `tuiTable` | Not verified |
| Table | [`table-pagination`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-table/components/table-pagination) | `tuiTablePagination` | Not verified |
| Commerce | [`input-card`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-commerce/components/input-card) | `tuiInputCard` | Not verified |
| Commerce | [`input-card-group`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-commerce/components/input-card-group) | `tuiInputCardGroup` | Not verified |
| Commerce | [`input-cvc`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-commerce/components/input-cvc) | — | Not verified |
| Commerce | [`input-expire`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-commerce/components/input-expire) | — | Not verified |
| Commerce | [`thumbnail-card`](https://github.com/taiga-family/taiga-ui/tree/v4.x/projects/addon-commerce/components/thumbnail-card) | `tuiThumbnailCard` | Not verified |

The separate 133-item website matrix represents Taiga UI **v5**, not this v4 source inventory.
