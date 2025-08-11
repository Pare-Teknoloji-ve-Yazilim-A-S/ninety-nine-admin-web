'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search, User } from 'lucide-react'

export interface SearchableOption {
  value: string
  label: string
  description?: string
  avatarText?: string
}

interface SearchableDropdownProps {
  value: string
  onChange: (value: string) => void
  options: SearchableOption[]
  placeholder?: string
  label?: string
  disabled?: boolean
  loading?: boolean
  allowEmpty?: boolean
  emptyLabel?: string
  searchable?: boolean
  showSelectedSummary?: boolean
}

export default function SearchableDropdown({
  value,
  onChange,
  options,
  placeholder = 'Seçiniz...',
  label,
  disabled,
  loading,
  allowEmpty,
  emptyLabel = 'Seçilmedi',
  searchable = false,
  showSelectedSummary = false
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = useMemo(() => options.find(o => o.value === value), [options, value])

  const filtered = useMemo(() => {
    if (!searchable) return options
    const q = search.trim().toLowerCase()
    if (!q) return options
    return options.filter(o => o.label.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q))
  }, [options, search, searchable])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="relative">
          {searchable && (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-light-muted dark:text-text-muted" />
          )}
          <div
            className={`w-full ${searchable ? 'pl-10' : 'pl-3'} pr-10 py-2 text-sm rounded-lg border border-primary-gold/30 hover:border-primary-gold/50 focus-within:border-primary-gold bg-background-secondary text-text-primary transition-colors cursor-pointer select-none`}
            onClick={() => setOpen((o) => !o)}
            role="button"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="block truncate">
              {loading ? 'Yükleniyor...' : (selected ? selected.label : placeholder)}
            </span>
          </div>
          <ChevronDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-light-muted transition-transform ${open ? 'rotate-180' : ''}`}
            onClick={() => setOpen(!open)}
          />
        </div>

        {/* Selected pill */}
        {showSelectedSummary && selected && !open && (
          <div className="mt-2 p-2 bg-primary-gold/10 border border-primary-gold/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary-gold/20 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-medium text-primary-gold">{selected.avatarText || selected.label.charAt(0)}</span>
              </div>
              <span className="text-sm font-medium text-text-on-light dark:text-text-on-dark">{selected.label}</span>
              {selected.description && (
                <span className="text-xs text-text-light-muted dark:text-text-muted">({selected.description})</span>
              )}
            </div>
          </div>
        )}

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-background-secondary border border-primary-gold/30 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-text-light-muted dark:text-text-muted">Yükleniyor...</div>
            ) : filtered.length === 0 ? (
              <div className="p-3 text-center text-text-light-muted dark:text-text-muted">
                {search ? 'Sonuç bulunamadı' : 'Kayıt yok'}
              </div>
            ) : (
              <>
                <div className="p-2 text-xs font-medium text-text-light-muted dark:text-text-muted border-b border-gray-200 dark:border-gray-700">
                  {filtered.length} seçenek
                </div>
                {allowEmpty && (
                  <button
                    type="button"
                    onClick={() => { onChange(''); setOpen(false); setSearch('') }}
                    className="w-full text-left p-3 hover:bg-primary-gold/10 transition-colors border-b border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-text-light-secondary dark:text-text-secondary">-</span>
                      </div>
                      <div className="text-sm text-text-light-secondary dark:text-text-secondary">{emptyLabel}</div>
                    </div>
                  </button>
                )}
                {filtered.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false); setSearch('') }}
                    className="w-full text-left p-3 hover:bg-primary-gold/10 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-gold/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-gold">{opt.avatarText || opt.label.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-text-on-light dark:text-text-on-dark">{opt.label}</div>
                        {opt.description && (
                          <div className="text-xs text-text-light-muted dark:text-text-muted">{opt.description}</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


