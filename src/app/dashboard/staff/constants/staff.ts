export const STAFF_BULK_ACTIONS = {
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate',
  DELETE: 'delete',
  EXPORT: 'export'
} as const

export type StaffBulkAction = typeof STAFF_BULK_ACTIONS[keyof typeof STAFF_BULK_ACTIONS]

export const EXPORT_FILENAMES = {
  STAFF_LIST: 'personel-listesi.csv'
} as const

export const STAFF_QUICK_FILTER_KEYS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  ALL: 'all',
  NEW_HIRES: 'new_hires'
} as const

export type StaffQuickFilterKey = typeof STAFF_QUICK_FILTER_KEYS[keyof typeof STAFF_QUICK_FILTER_KEYS]

export const STAFF_VIEW_MODES = {
  TABLE: 'table',
  GRID: 'grid'
} as const

export type StaffViewMode = typeof STAFF_VIEW_MODES[keyof typeof STAFF_VIEW_MODES]