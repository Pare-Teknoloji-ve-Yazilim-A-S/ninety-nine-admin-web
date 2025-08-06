import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    onClear?: () => void;
    showAdvancedFilter?: boolean;
    onAdvancedFilterClick?: () => void;
    showClearButton?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    suggestions?: string[];
    onSuggestionClick?: (suggestion: string) => void;
    disabled?: boolean;
    autoFocus?: boolean;
    debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Ara...',
    value: controlledValue,
    onChange,
    onSearch,
    onClear,
    showAdvancedFilter = false,
    onAdvancedFilterClick,
    showClearButton = true,
    size = 'md',
    className,
    suggestions = [],
    onSuggestionClick,
    disabled = false,
    autoFocus = false,
    debounceMs = 300,
}) => {
    const [internalValue, setInternalValue] = useState(controlledValue || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();
    const onSearchRef = useRef(onSearch);

    // Update ref when onSearch changes
    useEffect(() => {
        onSearchRef.current = onSearch;
    }, [onSearch]);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const sizeClasses = {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
    };

    const iconSizes = {
        sm: 14,
        md: 16,
        lg: 20,
    };

    const paddingClasses = {
        sm: 'pl-8 pr-3',
        md: 'pl-10 pr-4',
        lg: 'pl-12 pr-5',
    };

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (onSearchRef.current) {
                onSearchRef.current(currentValue);
            }
        }, debounceMs);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [currentValue, debounceMs]);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (isControlled) {
            onChange?.(newValue);
        } else {
            setInternalValue(newValue);
        }

        // Show suggestions if there are any and input has value
        if (suggestions.length > 0 && newValue.trim()) {
            setShowSuggestions(true);
            setFocusedSuggestionIndex(-1);
        } else {
            setShowSuggestions(false);
        }
    };

    // Handle clear
    const handleClear = () => {
        const newValue = '';

        if (isControlled) {
            onChange?.(newValue);
        } else {
            setInternalValue(newValue);
        }

        setShowSuggestions(false);
        setFocusedSuggestionIndex(-1);
        
        // Clear debounce timer to prevent old search from executing
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        
        // Immediately trigger search with empty value to clear results
        onSearchRef.current?.(newValue);
        onClear?.();
        inputRef.current?.focus();
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: string) => {
        if (isControlled) {
            onChange?.(suggestion);
        } else {
            setInternalValue(suggestion);
        }

        setShowSuggestions(false);
        setFocusedSuggestionIndex(-1);
        onSuggestionClick?.(suggestion);
        inputRef.current?.focus();
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) {
            if (e.key === 'Enter' && onSearchRef.current) {
                onSearchRef.current(currentValue);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedSuggestionIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (focusedSuggestionIndex >= 0) {
                    handleSuggestionClick(suggestions[focusedSuggestionIndex]);
                } else if (onSearchRef.current) {
                    onSearchRef.current(currentValue);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setFocusedSuggestionIndex(-1);
                break;
        }
    };

    // Filter suggestions based on current value
    const filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(currentValue.toLowerCase())
    );

    // Handle clicks outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (containerRef.current && target && !containerRef.current.contains(target)) {
                setShowSuggestions(false);
                setFocusedSuggestionIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <div className="relative">
                {/* Search Icon */}
                <Search
                    size={iconSizes[size]}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light-muted dark:text-text-muted pointer-events-none"
                />

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={currentValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (suggestions.length > 0 && currentValue.trim()) {
                            setShowSuggestions(true);
                        }
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    className={cn(
                        'w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-background-light-card dark:bg-background-card text-text-on-light dark:text-text-on-dark transition-colors',
                        'focus:ring-2 focus:ring-primary-gold/30 focus:border-primary-gold focus:outline-none',
                        'placeholder:text-text-light-muted dark:placeholder:text-text-muted',
                        sizeClasses[size],
                        paddingClasses[size],
                        showClearButton && currentValue ? 'pr-20' : showAdvancedFilter ? 'pr-12' : '',
                        disabled && 'opacity-50 cursor-not-allowed',
                    )}
                />

                {/* Clear Button */}
                {showClearButton && currentValue && (
                    <button
                        onClick={handleClear}
                        disabled={disabled}
                        className={cn(
                            'absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full',
                            'text-text-light-muted dark:text-text-muted hover:text-text-on-light dark:hover:text-text-on-dark',
                            'hover:bg-background-light-soft dark:hover:bg-background-soft transition-colors',
                            showAdvancedFilter && 'right-12'
                        )}
                    >
                        <X size={iconSizes[size]} />
                    </button>
                )}

                {/* Advanced Filter Button */}
                {showAdvancedFilter && (
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Filter}
                        onClick={onAdvancedFilterClick}
                        disabled={disabled}
                        className={cn(
                            'absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-1',
                            'text-text-light-muted dark:text-text-muted hover:text-primary-gold'
                        )}
                    />
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background-light-card dark:bg-background-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-card max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                        <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={cn(
                                'w-full text-left px-3 py-2 hover:bg-background-light-soft dark:hover:bg-background-soft transition-colors',
                                'text-text-on-light dark:text-text-on-dark text-sm',
                                index === focusedSuggestionIndex && 'bg-primary-gold/10 text-primary-gold',
                                index === 0 && 'rounded-t-lg',
                                index === filteredSuggestions.length - 1 && 'rounded-b-lg'
                            )}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;