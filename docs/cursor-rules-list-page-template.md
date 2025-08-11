### List Page Template (Cursor Rules)

Use this template to scaffold list-type pages that follow NinetyNine Admin Web patterns (warm palette, semantic components, App Router).

#### JSON Schema
- Location: `docs/page-structure/list-page.schema.json`
- Purpose: Describes the structure of a list page: header, quick stats, search+filters, quick filters, filter drawer, content (table/grid).

#### Minimal JSON Example
```json
{
  "main": {
    "container": "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
    "sections": [
      {
        "id": "pageHeader",
        "title": "Örnek Liste",
        "summary": { "metrics": ["occupiedUnits", "occupancyRate"] },
        "actions": [
          { "id": "refresh", "component": "Button", "variant": "ghost" },
          { "id": "newItem", "component": "Button", "variant": "primary", "href": "/add" }
        ]
      },
      {
        "id": "quickStats",
        "type": "cards",
        "items": [
          { "title": "Stat A", "icon": "Building", "metric": "aCount", "color": "primary" },
          { "title": "Stat B", "icon": "Home", "metric": "bCount", "color": "success" }
        ]
      },
      {
        "id": "searchAndFilters",
        "card": true,
        "searchBar": {
          "placeholder": "Ara...",
          "debounceMs": 500,
          "stateKey": "searchInput",
          "onSearch": "handleSearchSubmit"
        },
        "actions": [
          { "id": "openFilters", "component": "Button", "icon": "Filter", "toggles": "showFilters" },
          {
            "id": "viewToggle",
            "component": "ViewToggle",
            "options": [
              { "id": "table", "label": "Tablo", "icon": "List" },
              { "id": "grid", "label": "Kart", "icon": "Grid3X3" }
            ],
            "stateKey": "viewMode"
          }
        ]
      },
      {
        "id": "quickFilters",
        "card": true,
        "groups": [
          {
            "label": "Durum",
            "stateKey": "filters.status",
            "options": [
              { "label": "Tümü", "value": null },
              { "label": "Aktif", "value": "ACTIVE" },
              { "label": "Pasif", "value": "INACTIVE" }
            ]
          }
        ]
      },
      {
        "id": "filterDrawer",
        "visibleKey": "showFilters",
        "component": "FilterPanel",
        "groupsKey": "filterGroups",
        "handlers": { "apply": "handleApplyFilters", "reset": "handleResetFilters", "close": "setShowFilters(false)" }
      },
      {
        "id": "contentArea",
        "layout": "singleColumn",
        "views": {
          "table": {
            "when": "viewMode === 'table'",
            "component": "GenericListView",
            "dataKey": "items",
            "loadingKey": "loading",
            "errorKey": "error",
            "columnsKey": "tableColumns",
            "selection": { "onChange": "handleSelectionChange" },
            "bulkActions": ["bulk-edit", "bulk-export", "bulk-delete"],
            "pagination": {
              "pageKey": "pagination.page",
              "totalPagesKey": "pagination.totalPages",
              "totalRecordsKey": "pagination.total",
              "limitKey": "pagination.limit",
              "onPageChange": "handlePageChange",
              "onLimitChange": "handleRecordsPerPageChange"
            },
            "actionMenu": "RowActionMenu"
          },
          "grid": {
            "when": "viewMode === 'grid'",
            "component": "GenericGridView",
            "dataKey": "items",
            "loadingKey": "loading",
            "errorKey": "error",
            "selection": { "onChange": "handleGridSelectionChange", "selectedKey": "selectedItems" },
            "bulkActions": ["bulk-edit", "bulk-export", "bulk-delete"],
            "pagination": {
              "pageKey": "pagination.page",
              "totalPagesKey": "pagination.totalPages",
              "totalRecordsKey": "pagination.total",
              "limitKey": "pagination.limit",
              "onPageChange": "handlePageChange",
              "onLimitChange": "handleRecordsPerPageChange"
            },
            "uiKey": "gridUI",
            "actionMenu": "RowActionMenu",
            "renderCard": "renderCard",
            "getItemId": "getItemId",
            "gridCols": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }
        }
      }
    ]
  }
}
```

#### Usage in Cursor
- Include the JSON in your task context and ask the assistant to scaffold a page using NinetyNine components (`src/app/components/ui/*`) and follow the design system.
- Ensure colors and text classes use warm palette tokens (e.g., `text-text-on-light`, `bg-background-light-card`, `text-primary-gold`).

#### Component Guidelines Recap
- Buttons: `variant="primary|secondary|ghost|danger"`, use icons from `lucide-react`.
- Cards: prefer `rounded-2xl`, `shadow-lg`, warm backgrounds.
- Typography: never use pure white text; use `text-on-dark` on dark surfaces.



