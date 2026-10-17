/**
 * Taiga UI 5.28 component directory inventory from taiga-family/taiga-ui.
 * Source: https://github.com/taiga-family/taiga-ui/tree/main/projects
 * Scope: core, kit, portals, addon-mobile, layout, addon-table, addon-commerce.
 * Does NOT include directives, pipes, editor, proprietary packages or all demos.
 * Do not mark a component done without a tested exported Playwright helper.
 */
export type HarnessStatus = 'done' | 'in-progress' | 'todo';
export type HarnessCategory = "Core" | "Kit" | "Portals" | "Mobile" | "Layout" | "Table" | "Commerce";

export interface HarnessEntry {
    readonly id: string;
    readonly category: HarnessCategory;
    readonly name: string;
    readonly path: string;
    readonly status: HarnessStatus;
}

export const HARNESS_CATALOG: readonly HarnessEntry[] = [
  {
    "category": "Commerce",
    "name": "input-card",
    "path": "projects/addon-commerce/components/input-card",
    "id": "commerce/input-card",
    "status": "todo"
  },
  {
    "category": "Commerce",
    "name": "input-card-group",
    "path": "projects/addon-commerce/components/input-card-group",
    "id": "commerce/input-card-group",
    "status": "todo"
  },
  {
    "category": "Commerce",
    "name": "thumbnail-card",
    "path": "projects/addon-commerce/components/thumbnail-card",
    "id": "commerce/thumbnail-card",
    "status": "todo"
  },
  {
    "category": "Core",
    "name": "button",
    "path": "projects/core/components/button",
    "id": "core/button",
    "status": "done"
  },
  {
    "category": "Core",
    "name": "calendar",
    "path": "projects/core/components/calendar",
    "id": "core/calendar",
    "status": "done"
  },
  {
    "category": "Core",
    "name": "carousel",
    "path": "projects/core/components/carousel",
    "id": "core/carousel",
    "status": "todo"
  },
  {
    "category": "Core",
    "name": "cell",
    "path": "projects/core/components/cell",
    "id": "core/cell",
    "status": "todo"
  },
  {
    "category": "Core",
    "name": "checkbox",
    "path": "projects/core/components/checkbox",
    "id": "core/checkbox",
    "status": "done"
  },
  {
    "category": "Core",
    "name": "data-list",
    "path": "projects/core/components/data-list",
    "id": "core/data-list",
    "status": "todo"
  },
  {
    "category": "Core",
    "name": "error",
    "path": "projects/core/components/error",
    "id": "core/error",
    "status": "todo"
  },
  {
    "category": "Core",
    "name": "expand",
    "path": "projects/core/components/expand",
    "id": "core/expand",
    "status": "done"
  },
  {
    "category": "Core",
    "name": "icon",
    "path": "projects/core/components/icon",
    "id": "core/icon",
    "status": "todo"
  },
  {
    "category": "Core",
    "name": "input",
    "path": "projects/core/components/input",
    "id": "core/input",
    "status": "done"
  },
  {
    "category": "Core",
    "name": "label",
    "path": "projects/core/components/label",
    "id": "core/label",
    "status": "todo"
  },
  {
    "category": "Core",
    "name": "link",
    "path": "projects/core/components/link",
    "id": "core/link",
    "status": "done"
  },
  {
    "category": "Core",
    "name": "loader",
    "path": "projects/core/components/loader",
    "id": "core/loader",
    "status": "done"
  },
  {
    "category": "Core",
    "name": "notification",
    "path": "projects/core/components/notification",
    "id": "core/notification",
    "status": "todo"
  },
  {
    "category": "Core",
    "name": "radio",
    "path": "projects/core/components/radio",
    "id": "core/radio",
    "status": "done"
  },
  {
    "category": "Core",
    "name": "root",
    "path": "projects/core/components/root",
    "id": "core/root",
    "status": "todo"
  },
  {
    "category": "Core",
    "name": "scrollbar",
    "path": "projects/core/components/scrollbar",
    "id": "core/scrollbar",
    "status": "todo"
  },
  {
    "category": "Core",
    "name": "slider",
    "path": "projects/core/components/slider",
    "id": "core/slider",
    "status": "done"
  },
  {
    "category": "Core",
    "name": "spin-button",
    "path": "projects/core/components/spin-button",
    "id": "core/spin-button",
    "status": "done"
  },
  {
    "category": "Core",
    "name": "textfield",
    "path": "projects/core/components/textfield",
    "id": "core/textfield",
    "status": "todo"
  },
  {
    "category": "Core",
    "name": "title",
    "path": "projects/core/components/title",
    "id": "core/title",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "accordion",
    "path": "projects/kit/components/accordion",
    "id": "kit/accordion",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "action-bar",
    "path": "projects/kit/components/action-bar",
    "id": "kit/action-bar",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "avatar",
    "path": "projects/kit/components/avatar",
    "id": "kit/avatar",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "badge",
    "path": "projects/kit/components/badge",
    "id": "kit/badge",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "badge-notification",
    "path": "projects/kit/components/badge-notification",
    "id": "kit/badge-notification",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "badged-content",
    "path": "projects/kit/components/badged-content",
    "id": "kit/badged-content",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "block",
    "path": "projects/kit/components/block",
    "id": "kit/block",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "breadcrumbs",
    "path": "projects/kit/components/breadcrumbs",
    "id": "kit/breadcrumbs",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "button-loading",
    "path": "projects/kit/components/button-loading",
    "id": "kit/button-loading",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "calendar-month",
    "path": "projects/kit/components/calendar-month",
    "id": "kit/calendar-month",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "calendar-range",
    "path": "projects/kit/components/calendar-range",
    "id": "kit/calendar-range",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "chip",
    "path": "projects/kit/components/chip",
    "id": "kit/chip",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "combo-box",
    "path": "projects/kit/components/combo-box",
    "id": "kit/combo-box",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "comment",
    "path": "projects/kit/components/comment",
    "id": "kit/comment",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "compass",
    "path": "projects/kit/components/compass",
    "id": "kit/compass",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "confirm",
    "path": "projects/kit/components/confirm",
    "id": "kit/confirm",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "copy",
    "path": "projects/kit/components/copy",
    "id": "kit/copy",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "counter",
    "path": "projects/kit/components/counter",
    "id": "kit/counter",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "data-list-wrapper",
    "path": "projects/kit/components/data-list-wrapper",
    "id": "kit/data-list-wrapper",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "drawer",
    "path": "projects/kit/components/drawer",
    "id": "kit/drawer",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "files",
    "path": "projects/kit/components/files",
    "id": "kit/files",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "filter",
    "path": "projects/kit/components/filter",
    "id": "kit/filter",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "fullscreen",
    "path": "projects/kit/components/fullscreen",
    "id": "kit/fullscreen",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "input-chip",
    "path": "projects/kit/components/input-chip",
    "id": "kit/input-chip",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-color",
    "path": "projects/kit/components/input-color",
    "id": "kit/input-color",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-date",
    "path": "projects/kit/components/input-date",
    "id": "kit/input-date",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-date-multi",
    "path": "projects/kit/components/input-date-multi",
    "id": "kit/input-date-multi",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-date-range",
    "path": "projects/kit/components/input-date-range",
    "id": "kit/input-date-range",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-date-time",
    "path": "projects/kit/components/input-date-time",
    "id": "kit/input-date-time",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-inline",
    "path": "projects/kit/components/input-inline",
    "id": "kit/input-inline",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-month",
    "path": "projects/kit/components/input-month",
    "id": "kit/input-month",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-month-range",
    "path": "projects/kit/components/input-month-range",
    "id": "kit/input-month-range",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "input-number",
    "path": "projects/kit/components/input-number",
    "id": "kit/input-number",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-phone",
    "path": "projects/kit/components/input-phone",
    "id": "kit/input-phone",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-phone-international",
    "path": "projects/kit/components/input-phone-international",
    "id": "kit/input-phone-international",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "input-pin",
    "path": "projects/kit/components/input-pin",
    "id": "kit/input-pin",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-range",
    "path": "projects/kit/components/input-range",
    "id": "kit/input-range",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-slider",
    "path": "projects/kit/components/input-slider",
    "id": "kit/input-slider",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-time",
    "path": "projects/kit/components/input-time",
    "id": "kit/input-time",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "input-year",
    "path": "projects/kit/components/input-year",
    "id": "kit/input-year",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "items-with-more",
    "path": "projects/kit/components/items-with-more",
    "id": "kit/items-with-more",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "like",
    "path": "projects/kit/components/like",
    "id": "kit/like",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "line-clamp",
    "path": "projects/kit/components/line-clamp",
    "id": "kit/line-clamp",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "message",
    "path": "projects/kit/components/message",
    "id": "kit/message",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "meter",
    "path": "projects/kit/components/meter",
    "id": "kit/meter",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "multi-select",
    "path": "projects/kit/components/multi-select",
    "id": "kit/multi-select",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "notification-middle",
    "path": "projects/kit/components/notification-middle",
    "id": "kit/notification-middle",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "pager",
    "path": "projects/kit/components/pager",
    "id": "kit/pager",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "pagination",
    "path": "projects/kit/components/pagination",
    "id": "kit/pagination",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "pin",
    "path": "projects/kit/components/pin",
    "id": "kit/pin",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "pincode",
    "path": "projects/kit/components/pincode",
    "id": "kit/pincode",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "preview",
    "path": "projects/kit/components/preview",
    "id": "kit/preview",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "progress",
    "path": "projects/kit/components/progress",
    "id": "kit/progress",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "pulse",
    "path": "projects/kit/components/pulse",
    "id": "kit/pulse",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "push",
    "path": "projects/kit/components/push",
    "id": "kit/push",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "radio-list",
    "path": "projects/kit/components/radio-list",
    "id": "kit/radio-list",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "range",
    "path": "projects/kit/components/range",
    "id": "kit/range",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "rating",
    "path": "projects/kit/components/rating",
    "id": "kit/rating",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "routable-dialog",
    "path": "projects/kit/components/routable-dialog",
    "id": "kit/routable-dialog",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "segmented",
    "path": "projects/kit/components/segmented",
    "id": "kit/segmented",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "select",
    "path": "projects/kit/components/select",
    "id": "kit/select",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "shrink-wrap",
    "path": "projects/kit/components/shrink-wrap",
    "id": "kit/shrink-wrap",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "status",
    "path": "projects/kit/components/status",
    "id": "kit/status",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "stepper",
    "path": "projects/kit/components/stepper",
    "id": "kit/stepper",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "switch",
    "path": "projects/kit/components/switch",
    "id": "kit/switch",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "tabs",
    "path": "projects/kit/components/tabs",
    "id": "kit/tabs",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "textarea",
    "path": "projects/kit/components/textarea",
    "id": "kit/textarea",
    "status": "done"
  },
  {
    "category": "Kit",
    "name": "tiles",
    "path": "projects/kit/components/tiles",
    "id": "kit/tiles",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "timeline",
    "path": "projects/kit/components/timeline",
    "id": "kit/timeline",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "toast",
    "path": "projects/kit/components/toast",
    "id": "kit/toast",
    "status": "todo"
  },
  {
    "category": "Kit",
    "name": "tree",
    "path": "projects/kit/components/tree",
    "id": "kit/tree",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "app-bar",
    "path": "projects/layout/components/app-bar",
    "id": "layout/app-bar",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "block-details",
    "path": "projects/layout/components/block-details",
    "id": "layout/block-details",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "block-status",
    "path": "projects/layout/components/block-status",
    "id": "layout/block-status",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "card",
    "path": "projects/layout/components/card",
    "id": "layout/card",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "dynamic-header",
    "path": "projects/layout/components/dynamic-header",
    "id": "layout/dynamic-header",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "elastic-container",
    "path": "projects/layout/components/elastic-container",
    "id": "layout/elastic-container",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "floating-container",
    "path": "projects/layout/components/floating-container",
    "id": "layout/floating-container",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "form",
    "path": "projects/layout/components/form",
    "id": "layout/form",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "header",
    "path": "projects/layout/components/header",
    "id": "layout/header",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "input-search",
    "path": "projects/layout/components/input-search",
    "id": "layout/input-search",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "item-group",
    "path": "projects/layout/components/item-group",
    "id": "layout/item-group",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "list",
    "path": "projects/layout/components/list",
    "id": "layout/list",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "navigation",
    "path": "projects/layout/components/navigation",
    "id": "layout/navigation",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "pdf-viewer",
    "path": "projects/layout/components/pdf-viewer",
    "id": "layout/pdf-viewer",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "progressive-blur",
    "path": "projects/layout/components/progressive-blur",
    "id": "layout/progressive-blur",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "search",
    "path": "projects/layout/components/search",
    "id": "layout/search",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "slides",
    "path": "projects/layout/components/slides",
    "id": "layout/slides",
    "status": "todo"
  },
  {
    "category": "Layout",
    "name": "surface",
    "path": "projects/layout/components/surface",
    "id": "layout/surface",
    "status": "todo"
  },
  {
    "category": "Mobile",
    "name": "bottom-sheet",
    "path": "projects/addon-mobile/components/bottom-sheet",
    "id": "mobile/bottom-sheet",
    "status": "todo"
  },
  {
    "category": "Mobile",
    "name": "keypad",
    "path": "projects/addon-mobile/components/keypad",
    "id": "mobile/keypad",
    "status": "todo"
  },
  {
    "category": "Mobile",
    "name": "mobile-calendar",
    "path": "projects/addon-mobile/components/mobile-calendar",
    "id": "mobile/mobile-calendar",
    "status": "todo"
  },
  {
    "category": "Mobile",
    "name": "mobile-calendar-dropdown",
    "path": "projects/addon-mobile/components/mobile-calendar-dropdown",
    "id": "mobile/mobile-calendar-dropdown",
    "status": "todo"
  },
  {
    "category": "Mobile",
    "name": "mobile-calendar-sheet",
    "path": "projects/addon-mobile/components/mobile-calendar-sheet",
    "id": "mobile/mobile-calendar-sheet",
    "status": "todo"
  },
  {
    "category": "Mobile",
    "name": "pull-to-refresh",
    "path": "projects/addon-mobile/components/pull-to-refresh",
    "id": "mobile/pull-to-refresh",
    "status": "todo"
  },
  {
    "category": "Mobile",
    "name": "search-bar",
    "path": "projects/addon-mobile/components/search-bar",
    "id": "mobile/search-bar",
    "status": "todo"
  },
  {
    "category": "Mobile",
    "name": "sheet-dialog",
    "path": "projects/addon-mobile/components/sheet-dialog",
    "id": "mobile/sheet-dialog",
    "status": "todo"
  },
  {
    "category": "Mobile",
    "name": "swipe-actions",
    "path": "projects/addon-mobile/components/swipe-actions",
    "id": "mobile/swipe-actions",
    "status": "todo"
  },
  {
    "category": "Mobile",
    "name": "tab-bar",
    "path": "projects/addon-mobile/components/tab-bar",
    "id": "mobile/tab-bar",
    "status": "todo"
  },
  {
    "category": "Portals",
    "name": "alert",
    "path": "projects/core/portals/alert",
    "id": "portals/alert",
    "status": "todo"
  },
  {
    "category": "Portals",
    "name": "close",
    "path": "projects/core/portals/close",
    "id": "portals/close",
    "status": "todo"
  },
  {
    "category": "Portals",
    "name": "dialog",
    "path": "projects/core/portals/dialog",
    "id": "portals/dialog",
    "status": "done"
  },
  {
    "category": "Portals",
    "name": "dropdown",
    "path": "projects/core/portals/dropdown",
    "id": "portals/dropdown",
    "status": "todo"
  },
  {
    "category": "Portals",
    "name": "hint",
    "path": "projects/core/portals/hint",
    "id": "portals/hint",
    "status": "todo"
  },
  {
    "category": "Portals",
    "name": "modal",
    "path": "projects/core/portals/modal",
    "id": "portals/modal",
    "status": "todo"
  },
  {
    "category": "Portals",
    "name": "popup",
    "path": "projects/core/portals/popup",
    "id": "portals/popup",
    "status": "todo"
  },
  {
    "category": "Table",
    "name": "reorder",
    "path": "projects/addon-table/components/reorder",
    "id": "table/reorder",
    "status": "todo"
  },
  {
    "category": "Table",
    "name": "table",
    "path": "projects/addon-table/components/table",
    "id": "table/table",
    "status": "todo"
  },
  {
    "category": "Table",
    "name": "table-pagination",
    "path": "projects/addon-table/components/table-pagination",
    "id": "table/table-pagination",
    "status": "todo"
  }
] as const;

export const IMPLEMENTATIONS: Readonly<Record<string, string>> = {
    'core/loader': 'tuiLoader',
    'kit/avatar': 'tuiAvatar',
    'kit/badge-notification': 'tuiBadgeNotification',
    'kit/status': 'tuiStatus',
    'kit/breadcrumbs': 'tuiBreadcrumbs',
    'kit/select': 'tuiSelect',
    'kit/combo-box': 'tuiComboBox',
    'portals/dialog': 'tuiDialog',
    'core/spin-button': 'tuiSpinButton',
    'kit/pincode': 'tuiPincode',
    'kit/button-loading': 'tuiButtonLoading',
    'kit/pager': 'tuiPager',
    'core/link': 'tuiLink',
    'kit/chip': 'tuiChip',
    'kit/badge': 'tuiBadge',
    'kit/pin': 'tuiPin',
    'kit/meter': 'tuiMeter',
    'kit/multi-select': 'tuiMultiSelect',
    'kit/input-date-multi': 'tuiInputDateMulti',
    'kit/input-range': 'tuiInputRange',
    'kit/counter': 'tuiCounter',
    'kit/radio-list': 'tuiRadioList',
    'kit/input-inline': 'tuiInputInline',
    'kit/range': 'tuiRange',
    'core/expand': 'tuiExpand',
    'kit/rating': 'tuiRating',
    'kit/like': 'tuiLike',
    'kit/copy': 'tuiCopy',
    'kit/input-chip': 'tuiInputChip',
    'kit/progress': 'tuiProgress',
    'kit/calendar-range': 'tuiCalendarRange',
    'kit/input-date-range': 'tuiInputDateRange',
    'kit/input-date-time': 'tuiInputDateTime',
    'kit/input-month': 'tuiInputMonth',
    'core/calendar': 'tuiCalendar',
    'kit/calendar-month': 'tuiCalendarMonth',
    'kit/input-date': 'tuiInputDate',
    'kit/input-year': 'tuiInputYear',
    'kit/input-time': 'tuiInputTime',
    'kit/input-number': 'tuiInputNumber',
    'kit/input-phone': 'tuiInputPhone',
    'kit/input-pin': 'tuiInputPin',
    'kit/input-color': 'tuiInputColor',
    'kit/input-slider': 'tuiInputSlider',
    'core/slider': 'tuiSlider',
    'core/button': 'tuiButton',
    'core/checkbox': 'tuiCheckbox',
    'core/radio': 'tuiRadio',
    'core/input': 'tuiInput',
    'kit/switch': 'tuiSwitch',
    'kit/textarea': 'tuiTextarea',
    'kit/tabs': 'tuiTabs',
    'kit/segmented': 'tuiSegmented',
    'kit/accordion': 'tuiAccordion',
    'kit/pagination': 'tuiPagination',
    'kit/stepper': 'tuiStepper',
};
