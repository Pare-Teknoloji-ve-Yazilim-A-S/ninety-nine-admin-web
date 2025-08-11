'use client'

import { useRef } from 'react'
import type { StaffPageViewModel } from '../types'
import { useStaffUI } from './useStaffUI'
import { useStaffData } from './useStaffData'
import { useStaffActions } from './useStaffActions'

import type { Staff } from '@/services/types/staff.types'
import type { Department, Position } from '@/services/types/department.types'
import type { QuickFilter, SavedFilter } from '@/services/types/ui.types'

interface UseStaffPageViewModelProps {
  initialData?: {
    staff?: Staff[]
    departments?: Department[]
    positions?: Position[]
    quickFilters?: QuickFilter[]
    savedFilters?: SavedFilter[]
    managers?: Staff[]
  }
}

export function useStaffPageViewModel({ initialData }: UseStaffPageViewModelProps = {}): StaffPageViewModel {
  const importInputRef = useRef<HTMLInputElement>(null)
  
  // Compose smaller hooks
  const { uiState, uiActions } = useStaffUI()
  const { dataState, dataActions } = useStaffData({ initialData })
  const { actions } = useStaffActions({
    onRefresh: dataActions.refresh,
    importInputRef,
    clearSelected: () => uiActions.setSelected([])
  })

  // Combine all actions
  const allActions = {
    ...uiActions,
    ...dataActions,
    ...actions
  }

  const viewModel: StaffPageViewModel = {
    ui: uiState,
    data: dataState,
    refs: {
      importInputRef
    },
    actions: allActions
  }

  return viewModel
}

export default useStaffPageViewModel


