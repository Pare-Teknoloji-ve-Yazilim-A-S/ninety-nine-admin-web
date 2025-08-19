'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface CalendarEventDetail {
  id?: string | number
  title?: string
  time?: string
  description?: string
  isEmergency?: boolean
  isPinned?: boolean
  publishDate?: string
  expiryDate?: string
}

interface CalendarEventsForDay {
  count: number
  hasEmergency?: boolean
  hasPinned?: boolean
  items?: CalendarEventDetail[]
}

interface CalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  onDateSelect?: (dateKey: string, details?: CalendarEventDetail[]) => void
  className?: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  eventsByDate?: Record<string, CalendarEventsForDay>
  showSelectedSummary?: boolean
}

const Calendar = ({ 
  value, 
  onChange, 
  onDateSelect,
  className, 
  minDate, 
  maxDate, 
  disabled = false,
  eventsByDate,
  showSelectedSummary = true
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(value || new Date())
  const [viewDate, setViewDate] = useState(value || new Date())
  const [currentLanguage, setCurrentLanguage] = useState('tr')

  // Dil tercihini localStorage'dan al
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const today = new Date()
  const currentYear = viewDate.getFullYear()
  const currentMonth = viewDate.getMonth()

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Get previous month's last days to fill the calendar
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate()
  const prevMonthDays = Array.from(
    { length: firstDayWeekday },
    (_, i) => prevMonthLastDay - firstDayWeekday + i + 1
  )

  // Get current month days
  const currentMonthDays = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1
  )

  // Get next month days to fill remaining slots
  const totalCells = 42 // 6 rows × 7 days
  const remainingCells = totalCells - (prevMonthDays.length + currentMonthDays.length)
  const nextMonthDays = Array.from(
    { length: remainingCells },
    (_, i) => i + 1
  )

  // Dil bazlı ay ve gün isimleri
  const getMonthNames = () => {
    switch (currentLanguage) {
      case 'en':
        return [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
      case 'ar':
        return [
          'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
          'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
      default: // tr
        return [
          'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
    }
  };

  const getDayNames = () => {
    switch (currentLanguage) {
      case 'en':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      case 'ar':
        return ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];
      default: // tr
        return ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    }
  };

  const monthNames = getMonthNames();
  const dayNames = getDayNames();

  const formatDateKey = (date: Date) => {
    // Use ISO date portion to keep a stable key (YYYY-MM-DD)
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      .toISOString()
      .slice(0, 10)
  }

  const handleDateClick = (day: number, monthOffset: number = 0) => {
    if (disabled) return
    
    const newDate = new Date(currentYear, currentMonth + monthOffset, day)
    
    // Check if date is within allowed range
    if (minDate && newDate < minDate) return
    if (maxDate && newDate > maxDate) return
    
    setCurrentDate(newDate)
    onChange?.(newDate)
    const key = formatDateKey(newDate)
    onDateSelect?.(key, eventsByDate?.[key]?.items)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (disabled) return
    
    const newDate = new Date(viewDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setViewDate(newDate)
  }

  const isDateSelected = (day: number, monthOffset: number = 0) => {
    if (!currentDate) return false
    const date = new Date(currentYear, currentMonth + monthOffset, day)
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    )
  }

  const isDateToday = (day: number, monthOffset: number = 0) => {
    const date = new Date(currentYear, currentMonth + monthOffset, day)
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isDateDisabled = (day: number, monthOffset: number = 0) => {
    const date = new Date(currentYear, currentMonth + monthOffset, day)
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  return (
    <div
      className={cn(
        'p-4 rounded-xl shadow-lg',
        'bg-background-light-card dark:bg-background-card',
        'border border-border-light dark:border-border-dark',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          disabled={disabled}
          className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-hover-light-cream dark:hover:bg-hover-gold-bg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-lg font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          disabled={disabled}
          className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-hover-light-cream dark:hover:bg-hover-gold-bg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Selected day summary (titles) */}
      {showSelectedSummary && (() => {
        const selectedKey = formatDateKey(currentDate)
        const selectedItems = eventsByDate?.[selectedKey]?.items || []
        if (!selectedItems.length) return null
        return (
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-on-light dark:text-text-on-dark mb-1">
                {new Date(selectedKey).toLocaleDateString(currentLanguage === 'tr' ? 'tr-TR' : currentLanguage === 'ar' ? 'ar-SA' : 'en-US')} için etkinlikler
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedItems.map((it, idx) => (
                  <span
                    key={(it.id as string) || idx}
                    className={cn(
                      'inline-flex items-center max-w-[180px] truncate text-[11px] px-2 py-0.5 rounded-md border',
                      it.isEmergency
                        ? 'bg-primary-red/15 text-primary-red border-primary-red/30'
                        : it.isPinned
                          ? 'bg-primary-gold/20 text-primary-gold border-primary-gold/40'
                          : 'bg-primary-gold/10 text-primary-gold border-primary-gold/25'
                    )}
                  >
                    {it.time && <span className="mr-1">{it.time}</span>}
                    <span className="truncate">{it.title || 'Duyuru'}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-text-light-secondary dark:text-text-secondary"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Previous month days */}
        {prevMonthDays.map((day) => (
          <button
            key={`prev-${day}`}
            onClick={() => handleDateClick(day, -1)}
            disabled={disabled || isDateDisabled(day, -1)}
            className={cn(
              'p-2 text-sm rounded transition-colors',
              'text-text-light-muted dark:text-text-muted',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isDateSelected(day, -1) && 'bg-primary-gold/20 text-primary-gold hover:bg-primary-gold/30'
            )}
          >
            {day}
          </button>
        ))}

        {/* Current month days */}
        {currentMonthDays.map((day) => {
          const dateObj = new Date(currentYear, currentMonth, day)
          const dateKey = formatDateKey(dateObj)
          const dayEvents = eventsByDate ? eventsByDate[dateKey] : undefined
          const hasEvents = !!dayEvents && dayEvents.count > 0
          const showEmergency = !!dayEvents?.hasEmergency
          const showPinned = !!dayEvents?.hasPinned
          const eventClass = hasEvents
            ? (
                showEmergency
                  ? 'bg-primary-red/20 text-primary-red ring-1 ring-primary-red/40'
                  : showPinned
                    ? 'bg-primary-gold/20 text-primary-gold ring-1 ring-primary-gold/40'
                    : 'bg-primary-gold/10 text-primary-gold ring-1 ring-primary-gold/30'
              )
            : ''
          return (
            <button
              key={`current-${day}`}
              onClick={() => handleDateClick(day)}
              disabled={disabled || isDateDisabled(day)}
            className={cn(
                'relative p-2 text-sm rounded transition-colors',
                'hover:bg-hover-light-cream dark:hover:bg-hover-gold-bg',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isDateToday(day) && 'bg-background-light-soft dark:bg-background-soft font-semibold',
                isDateSelected(day) && 'ring-2 ring-primary-gold/50',
                eventClass
              )}
            >
              <div className="flex items-center justify-start">
                <span className="font-medium">{day}</span>
              </div>
              {hasEvents && (
                <span
                  className={cn(
                    'absolute top-1 right-1 w-2 h-2 rounded-full',
                    showEmergency ? 'bg-primary-red' : 'bg-primary-gold'
                  )}
                />
              )}
            </button>
          )
        })}

        {/* Next month days */}
        {nextMonthDays.map((day) => (
          <button
            key={`next-${day}`}
            onClick={() => handleDateClick(day, 1)}
            disabled={disabled || isDateDisabled(day, 1)}
            className={cn(
              'p-2 text-sm rounded transition-colors',
              'text-text-light-muted dark:text-text-muted',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isDateSelected(day, 1) && 'bg-primary-gold/20 text-primary-gold hover:bg-primary-gold/30'
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Calendar