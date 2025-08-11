Param(
  [Parameter(Mandatory = $true)][string]$Name,
  [string]$Title = "${Name} Listesi",
  [string]$Segment = $Name
)

$ErrorActionPreference = "Stop"

$base = Join-Path -Path "src/app/dashboard" -ChildPath $Segment
if (!(Test-Path $base)) { New-Item -ItemType Directory -Path $base -Force | Out-Null }

$viewJsonPath = Join-Path $base "view.json"
$readmePath = Join-Path $base "README.md"

$viewJson = @"
{
  "main": {
    "container": "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
    "sections": [
      {
        "id": "pageHeader",
        "title": "$Title",
        "summary": { "metrics": ["occupiedUnits", "occupancyRate"] },
        "actions": [
          { "id": "refresh", "component": "Button", "variant": "ghost" },
          { "id": "newItem", "component": "Button", "variant": "primary", "href": "/dashboard/$Segment/add" }
        ]
      },
      {
        "id": "quickStats",
        "type": "cards",
        "items": [
          { "title": "Stat A", "icon": "Building", "metric": "aCount", "color": "primary" },
          { "title": "Stat B", "icon": "Home", "metric": "bCount", "color": "success" },
          { "title": "Stat C", "icon": "Store", "metric": "cCount", "color": "info" }
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
"@

Set-Content -Path $viewJsonPath -Value $viewJson -Encoding UTF8

$readme = @"
# $Title

This directory was scaffolded via scripts/scaffold-list-page.ps1.

- Structure file: view.json (conforms to docs/page-structure/list-page.schema.json)
- Route suggestion: /dashboard/$Segment
- Next steps:
  1. Implement data fetching hooks and map to view.json keys (items, loading, error, pagination, etc.).
  2. Build table columns in a components file and reference as tableColumns.
  3. Wire up filter state to quick filters and filter drawer.

Refer to NinetyNine design rules and use components from src/app/components/ui.
"@

Set-Content -Path $readmePath -Value $readme -Encoding UTF8

Write-Host "List page scaffolded at: $base" -ForegroundColor Green


