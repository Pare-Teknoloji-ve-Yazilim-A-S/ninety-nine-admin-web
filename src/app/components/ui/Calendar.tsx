'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface CalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}

const Calendar = ({ 
  value, 
  onChange, 
  className, 
  minDate, 
  maxDate, 
  disabled = false 
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(value || new Date())
  const [viewDate, setViewDate] = useState(value || new Date())

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

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ]

  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

  const handleDateClick = (day: number, monthOffset: number = 0) => {
    if (disabled) return
    
    const newDate = new Date(currentYear, currentMonth + monthOffset, day)
    
    // Check if date is within allowed range
    if (minDate && newDate < minDate) return
    if (maxDate && newDate > maxDate) return
    
    setCurrentDate(newDate)
    onChange?.(newDate)
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
    <div className={cn('p-4 bg-white border rounded-lg shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          disabled={disabled}
          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
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
              'p-2 text-sm text-gray-400 hover:bg-gray-100 rounded transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isDateSelected(day, -1) && 'bg-blue-500 text-white hover:bg-blue-600'
            )}
          >
            {day}
          </button>
        ))}

        {/* Current month days */}
        {currentMonthDays.map((day) => (
          <button
            key={`current-${day}`}
            onClick={() => handleDateClick(day)}
            disabled={disabled || isDateDisabled(day)}
            className={cn(
              'p-2 text-sm hover:bg-gray-100 rounded transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isDateToday(day) && 'bg-gray-100 font-semibold',
              isDateSelected(day) && 'bg-blue-500 text-white hover:bg-blue-600'
            )}
          >
            {day}
          </button>
        ))}

        {/* Next month days */}
        {nextMonthDays.map((day) => (
          <button
            key={`next-${day}`}
            onClick={() => handleDateClick(day, 1)}
            disabled={disabled || isDateDisabled(day, 1)}
            className={cn(
              'p-2 text-sm text-gray-400 hover:bg-gray-100 rounded transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isDateSelected(day, 1) && 'bg-blue-500 text-white hover:bg-blue-600'
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