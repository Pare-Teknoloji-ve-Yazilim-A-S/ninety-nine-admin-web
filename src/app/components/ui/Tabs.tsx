'use client'
import { forwardRef, HTMLAttributes, ReactNode, useState, useEffect } from 'react'
import { LucideIcon } from 'lucide-react'

interface TabItem {
    id: string
    label: string
    icon?: LucideIcon
    disabled?: boolean
    badge?: string | number
    content?: ReactNode
}

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
    items: TabItem[]
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    variant?: 'default' | 'pills' | 'underline' | 'cards' | 'soft-pills'
    size?: 'sm' | 'md' | 'lg'
    orientation?: 'horizontal' | 'vertical'
    fullWidth?: boolean
    centered?: boolean
    scrollable?: boolean
    keepMounted?: boolean // Keep all tab content mounted
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
    ({
        items,
        defaultValue,
        value,
        onValueChange,
        variant = 'default',
        size = 'md',
        orientation = 'horizontal',
        fullWidth = false,
        centered = false,
        scrollable = true,
        keepMounted = false,
        className = '',
        ...props
    }, ref) => {
        const [activeTab, setActiveTab] = useState<string>(() => {
            if (value) return value
            if (defaultValue) return defaultValue
            return items.find(item => !item.disabled)?.id || items[0]?.id || ''
        })

        useEffect(() => {
            if (value !== undefined) {
                setActiveTab(value)
            }
        }, [value])

        const handleTabChange = (tabId: string) => {
            const tab = items.find(item => item.id === tabId)
            if (tab && !tab.disabled) {
                setActiveTab(tabId)
                onValueChange?.(tabId)
            }
        }

        const sizeClasses = {
            sm: 'text-sm px-3 py-1.5',
            md: 'text-sm px-4 py-2',
            lg: 'text-base px-5 py-3'
        }

        const variantClasses = {
            default: {
                tab: 'border-b-2 border-transparent hover:border-primary-gold/50 hover:text-text-primary',
                activeTab: 'border-primary-gold text-primary-gold font-semibold',
                container: 'border-b border-primary-gold/20',
                tabList: ''
            },
            pills: {
                tab: 'rounded-lg hover:bg-primary-gold/10 hover:text-text-primary',
                activeTab: 'bg-primary-gold text-primary-dark-gray font-semibold',
                container: '',
                tabList: ''
            },
            'soft-pills': {
                tab: 'rounded-lg hover:bg-primary-gold/10 hover:text-text-primary focus:outline-none focus-visible:ring-0',
                activeTab: 'bg-primary-gold/15 text-primary-gold font-semibold border border-primary-gold/30 ring-0 ring-offset-0',
                container: '',
                tabList: ''
            },
            underline: {
                tab: 'border-b-2 border-transparent hover:border-primary-gold/50 hover:text-text-primary',
                activeTab: 'border-primary-gold text-primary-gold font-semibold',
                container: 'border-b border-primary-gold/20',
                tabList: ''
            },
            cards: {
                tab: 'border border-transparent rounded-t-lg hover:bg-primary-gold/10 hover:text-text-primary',
                activeTab: 'border-primary-gold/30 bg-background-card text-text-primary font-semibold border-b-background-card',
                container: 'border-b border-primary-gold/20',
                tabList: 'flex space-x-1'
            }
        }

        const orientationClasses = {
            horizontal: {
                container: 'flex-col',
                tabList: `flex ${scrollable ? 'overflow-x-auto' : ''} ${centered ? 'justify-center' : ''} ${fullWidth ? 'w-full' : ''} space-x-1`,
                tab: fullWidth ? 'flex-1' : '',
                content: 'mt-4'
            },
            vertical: {
                container: 'flex-row',
                tabList: `flex flex-col ${scrollable ? 'overflow-y-auto' : ''} space-y-1 min-w-max`,
                tab: 'justify-start',
                content: 'ml-4 flex-1'
            }
        }

        const renderTabContent = () => {
            if (keepMounted) {
                return items.map(item => (
                    <div
                        key={item.id}
                        className={`${activeTab === item.id ? 'block' : 'hidden'}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${item.id}`}
                    >
                        {item.content}
                    </div>
                ))
            }

            const activeItem = items.find(item => item.id === activeTab)
            return activeItem?.content ? (
                <div role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
                    {activeItem.content}
                </div>
            ) : null
        }

        return (
            <div
                ref={ref}
                className={`flex ${orientationClasses[orientation].container} ${className}`}
                {...props}
            >
                {/* Tab List */}
                <div
                    className={`${variantClasses[variant].tabList || orientationClasses[orientation].tabList} ${variantClasses[variant].container}`}
                    role="tablist"
                >
                    {items.map((item) => {
                        const isActive = activeTab === item.id
                        const Icon = item.icon

                        return (
                            <button
                                key={item.id}
                                id={`tab-${item.id}`}
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`tabpanel-${item.id}`}
                                disabled={item.disabled}
                                onClick={() => handleTabChange(item.id)}
                                className={`
                  ${sizeClasses[size]}
                  ${orientationClasses[orientation].tab}
                  ${variantClasses[variant].tab}
                  ${isActive ? variantClasses[variant].activeTab : ''}
                  ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  transition-all duration-200 font-helvetica
                  text-text-secondary
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold/40 focus-visible:ring-offset-0
                  inline-flex items-center justify-center space-x-2
                  relative
                `}
                            >
                                {Icon && (
                                    <Icon className={`
                    ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}
                  `} />
                                )}
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className="ml-2 px-2 py-0.5 text-xs bg-primary-gold/20 text-primary-gold rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <div className={`${orientationClasses[orientation].content}`}>
                    {renderTabContent()}
                </div>
            </div>
        )
    }
)

Tabs.displayName = 'Tabs'

export default Tabs

// Alt component'ler
export const TabList = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`flex ${className}`} role="tablist" {...props}>
        {children}
    </div>
)

export const Tab = ({
    children,
    className = '',
    isActive = false,
    disabled = false,
    ...props
}: HTMLAttributes<HTMLButtonElement> & { isActive?: boolean; disabled?: boolean }) => (
    <button
        role="tab"
        aria-selected={isActive}
        disabled={disabled}
        className={`
      px-4 py-2 text-sm font-medium transition-all duration-200 font-helvetica
      ${isActive
                ? 'text-primary-gold border-b-2 border-primary-gold font-semibold'
                : 'text-text-secondary hover:text-text-primary border-b-2 border-transparent hover:border-primary-gold/50'
            }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      focus:outline-none focus:ring-2 focus:ring-primary-gold/50 focus:ring-offset-1
      ${className}
    `}
        {...props}
    >
        {children}
    </button>
)

export const TabPanel = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`mt-4 ${className}`} role="tabpanel" {...props}>
        {children}
    </div>
)

export const TabPanels = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
    <div className={`mt-4 ${className}`} {...props}>
        {children}
    </div>
) 