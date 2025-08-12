'use client'

import { useState, useCallback } from 'react'
import type { Staff } from '@/services/types/staff.types'
import type { StaffUIState } from '../types'
import { STAFF_VIEW_MODES, type StaffViewMode } from '../constants/staff'

export function useStaffUI() {
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<StaffViewMode>(STAFF_VIEW_MODES.TABLE)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const openCreate = useCallback(() => {
    setEditingStaff(null)
    setIsStaffFormOpen(true)
  }, [])

  const openEdit = useCallback((staff: Staff) => {
    setEditingStaff(staff)
    setIsStaffFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setEditingStaff(null)
    setIsStaffFormOpen(false)
  }, [])

  const openFilters = useCallback(() => {
    setFiltersOpen(true)
  }, [])

  const closeFilters = useCallback(() => {
    setFiltersOpen(false)
  }, [])

  const setSelected = useCallback((ids: string[]) => {
    setSelectedStaffIds(ids)
  }, [])

  const clearSelected = useCallback(() => {
    setSelectedStaffIds([])
  }, [])

  const uiState: StaffUIState = {
    isStaffFormOpen,
    filtersOpen,
    viewMode: STAFF_VIEW_MODES.TABLE,
    selectedStaffIds,
    editingStaff
  }

  const uiActions = {
    openCreate,
    openEdit,
    closeForm,
    openFilters,
    closeFilters,
    setViewMode: () => {},
    setSelected,
    clearSelected
  }

  return {
    uiState,
    uiActions
  }
}