'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'gold';
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
  size = 'md',
  variant = 'default',
}) => {
  const handleToggle = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7',
  };

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const variantClasses = {
    default: {
      track: 'bg-gray-200 dark:bg-gray-700',
      trackChecked: 'bg-primary-blue dark:bg-primary-blue',
      thumb: 'bg-white dark:bg-gray-100',
    },
    primary: {
      track: 'bg-gray-200 dark:bg-gray-700',
      trackChecked: 'bg-primary-blue dark:bg-primary-blue',
      thumb: 'bg-white dark:bg-gray-100',
    },
    gold: {
      track: 'bg-gray-200 dark:bg-gray-700',
      trackChecked: 'bg-primary-gold dark:bg-primary-gold',
      thumb: 'bg-white dark:bg-gray-100',
    },
  };

  const currentVariant = variantClasses[variant];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleToggle}
      className={cn(
        'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold/30 focus:ring-offset-2 dark:focus:ring-offset-background-card',
        sizeClasses[size],
        checked ? currentVariant.trackChecked : currentVariant.track,
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer',
        className
      )}
    >
      <span
        className={cn(
          'inline-block rounded-full transition-transform duration-200 ease-in-out',
          thumbSizeClasses[size],
          currentVariant.thumb,
          checked ? 'translate-x-full' : 'translate-x-0',
          size === 'sm' && checked && '-translate-x-1',
          size === 'md' && checked && '-translate-x-1',
          size === 'lg' && checked && '-translate-x-1',
        )}
      />
    </button>
  );
};

export default Switch;
