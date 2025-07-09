import React from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    User,
    MessageCircle,
    UserPlus,
    Settings,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Avatar from './Avatar';
import Badge from './Badge';
import Button from './Button';

interface UserCardProps {
    user: {
        id: string;
        name: string;
        email?: string;
        phone?: string;
        avatar?: string;
        role?: string;
        department?: string;
        location?: string;
        joinDate?: string;
        status?: 'online' | 'offline' | 'away' | 'busy';
        bio?: string;
        stats?: {
            projects?: number;
            tasks?: number;
            followers?: number;
            following?: number;
        };
        badges?: Array<{
            label: string;
            variant?: 'default' | 'outline' | 'solid' | 'soft';
            color?: 'primary' | 'gold' | 'red' | 'green' | 'blue';
        }>;
    };
    variant?: 'default' | 'compact' | 'detailed' | 'minimal';
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    showActions?: boolean;
    actions?: React.ReactNode;
    onMessage?: () => void;
    onConnect?: () => void;
    onProfile?: () => void;
    className?: string;
}

const UserCard: React.FC<UserCardProps> = ({
    user,
    variant = 'default',
    size = 'md',
    interactive = true,
    showActions = true,
    actions,
    onMessage,
    onConnect,
    onProfile,
    className,
}) => {
    const sizeClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const avatarSizes = {
        sm: 'md' as const,
        md: 'lg' as const,
        lg: 'xl' as const,
    };

    const cardClasses = cn(
        'bg-background-card border border-primary-dark-gray/20 rounded-lg transition-all duration-200',
        sizeClasses[size],
        interactive && 'hover:shadow-lg hover:border-primary-gold/30',
        className
    );

    const renderActions = () => {
        if (actions) return actions;

        if (!showActions) return null;

        return (
            <div className="flex gap-2">
                {onMessage && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onMessage}
                        className="flex-1"
                    >
                        <MessageCircle size={16} className="mr-1" />
                        Mesaj
                    </Button>
                )}
                {onConnect && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onConnect}
                        className="flex-1"
                    >
                        <UserPlus size={16} className="mr-1" />
                        Bağlan
                    </Button>
                )}
                {onProfile && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onProfile}
                    >
                        <Settings size={16} />
                    </Button>
                )}
            </div>
        );
    };

    const renderStats = () => {
        if (!user.stats) return null;

        const stats = Object.entries(user.stats).filter(([_, value]) => value !== undefined);

        if (stats.length === 0) return null;

        return (
            <div className="flex justify-around py-3 border-t border-primary-dark-gray/20">
                {stats.map(([key, value]) => (
                    <div key={key} className="text-center">
                        <div className="text-lg font-semibold text-text-primary">{value}</div>
                        <div className="text-sm text-text-secondary capitalize">{key}</div>
                    </div>
                ))}
            </div>
        );
    };

    const renderBadges = () => {
        if (!user.badges || user.badges.length === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 mt-2">
                {user.badges.map((badge, index) => (
                    <Badge
                        key={index}
                        variant={badge.variant || 'soft'}
                        color={badge.color || 'primary'}
                        size="sm"
                    >
                        {badge.label}
                    </Badge>
                ))}
            </div>
        );
    };

    if (variant === 'minimal') {
        return (
            <div className={cardClasses}>
                <div className="flex items-center space-x-3">
                    <Avatar
                        src={user.avatar}
                        fallback={user.name}
                        size={avatarSizes[size]}
                        status={user.status}
                        showStatus
                    />
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-text-primary truncate">{user.name}</div>
                        {user.role && (
                            <div className="text-sm text-text-secondary truncate">{user.role}</div>
                        )}
                    </div>
                    {showActions && (
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal size={16} />
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <div className={cardClasses}>
                <div className="flex items-start space-x-4">
                    <Avatar
                        src={user.avatar}
                        fallback={user.name}
                        size={avatarSizes[size]}
                        status={user.status}
                        showStatus
                    />
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-text-primary">{user.name}</div>
                        {user.role && (
                            <div className="text-sm text-text-secondary">{user.role}</div>
                        )}
                        {user.email && (
                            <div className="text-sm text-text-secondary flex items-center mt-1">
                                <Mail size={14} className="mr-1" />
                                {user.email}
                            </div>
                        )}
                        {renderBadges()}
                    </div>
                </div>
                {showActions && (
                    <div className="mt-4">
                        {renderActions()}
                    </div>
                )}
            </div>
        );
    }

    if (variant === 'detailed') {
        return (
            <div className={cardClasses}>
                <div className="text-center">
                    <Avatar
                        src={user.avatar}
                        fallback={user.name}
                        size="2xl"
                        status={user.status}
                        showStatus
                        className="mx-auto mb-4"
                    />
                    <div className="mb-4">
                        <h3 className="text-xl font-semibold text-text-primary">{user.name}</h3>
                        {user.role && (
                            <p className="text-text-secondary">{user.role}</p>
                        )}
                        {user.department && (
                            <p className="text-sm text-text-secondary">{user.department}</p>
                        )}
                    </div>

                    {user.bio && (
                        <p className="text-sm text-text-secondary mb-4 text-center">{user.bio}</p>
                    )}

                    <div className="space-y-2 mb-4">
                        {user.email && (
                            <div className="flex items-center justify-center text-sm text-text-secondary">
                                <Mail size={14} className="mr-2" />
                                {user.email}
                            </div>
                        )}
                        {user.phone && (
                            <div className="flex items-center justify-center text-sm text-text-secondary">
                                <Phone size={14} className="mr-2" />
                                {user.phone}
                            </div>
                        )}
                        {user.location && (
                            <div className="flex items-center justify-center text-sm text-text-secondary">
                                <MapPin size={14} className="mr-2" />
                                {user.location}
                            </div>
                        )}
                        {user.joinDate && (
                            <div className="flex items-center justify-center text-sm text-text-secondary">
                                <Calendar size={14} className="mr-2" />
                                {user.joinDate}
                            </div>
                        )}
                    </div>

                    {renderBadges()}
                    {renderStats()}

                    {showActions && (
                        <div className="mt-4">
                            {renderActions()}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Default variant
    return (
        <div className={cardClasses}>
            <div className="flex items-start space-x-4">
                <Avatar
                    src={user.avatar}
                    fallback={user.name}
                    size={avatarSizes[size]}
                    status={user.status}
                    showStatus
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-text-primary truncate">{user.name}</h3>
                        {user.status && (
                            <Badge
                                variant="soft"
                                color={user.status === 'online' ? 'green' : 'gray'}
                                size="sm"
                            >
                                {user.status}
                            </Badge>
                        )}
                    </div>

                    {user.role && (
                        <p className="text-sm text-text-secondary">{user.role}</p>
                    )}

                    {user.department && (
                        <p className="text-sm text-text-secondary">{user.department}</p>
                    )}

                    <div className="mt-2 space-y-1">
                        {user.email && (
                            <div className="flex items-center text-sm text-text-secondary">
                                <Mail size={14} className="mr-2" />
                                {user.email}
                            </div>
                        )}
                        {user.location && (
                            <div className="flex items-center text-sm text-text-secondary">
                                <MapPin size={14} className="mr-2" />
                                {user.location}
                            </div>
                        )}
                    </div>

                    {renderBadges()}
                </div>
            </div>

            {showActions && (
                <div className="mt-4">
                    {renderActions()}
                </div>
            )}
        </div>
    );
};

// Predefined UserCard Patterns
export const UserCardPatterns = {
    // Employee card for admin dashboard
    Employee: (user: UserCardProps['user'], props?: Partial<UserCardProps>) => (
        <UserCard
            user={user}
            variant="default"
            size="md"
            showActions
            {...props}
        />
    ),

    // Team member card
    TeamMember: (user: UserCardProps['user'], props?: Partial<UserCardProps>) => (
        <UserCard
            user={user}
            variant="compact"
            size="sm"
            showActions
            {...props}
        />
    ),

    // Profile card for user profiles
    Profile: (user: UserCardProps['user'], props?: Partial<UserCardProps>) => (
        <UserCard
            user={user}
            variant="detailed"
            size="lg"
            showActions
            {...props}
        />
    ),

    // Contact card for directories
    Contact: (user: UserCardProps['user'], props?: Partial<UserCardProps>) => (
        <UserCard
            user={user}
            variant="minimal"
            size="sm"
            interactive={false}
            showActions={false}
            {...props}
        />
    ),
};

export default UserCard; 