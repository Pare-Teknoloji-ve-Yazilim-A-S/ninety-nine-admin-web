import React from 'react';
import { User, Building2, Phone, Star, UserX } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import { RequestDetailAssigneeProps } from '@/services/types/request-detail.types';

const RequestDetailAssignee: React.FC<RequestDetailAssigneeProps> = ({ assignee }) => {
  // Render rating stars
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-3 w-3 text-gray-300 dark:text-gray-600" />
      );
    }

    return stars;
  };

  // If no assignee, show unassigned state
  if (!assignee) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <UserX className="h-5 w-5 text-text-light-muted dark:text-text-muted" />
            <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
              Teknisyen
            </h2>
          </div>

          <div className="text-center py-8">
            <UserX className="mx-auto h-12 w-12 text-text-light-muted dark:text-text-muted mb-3" />
            <p className="text-text-light-secondary dark:text-text-secondary mb-2">
              Henüz teknisyen atanmamış
            </p>
            <Badge variant="soft" color="secondary">
              Atama Bekleniyor
            </Badge>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-text-light-muted dark:text-text-muted" />
          <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
            Atanan Teknisyen
          </h2>
        </div>

        {/* Assignee Profile */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-primary-gold/10 rounded-full flex items-center justify-center text-lg font-bold text-primary-gold flex-shrink-0">
            {assignee.avatar}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark mb-1">
              {assignee.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-0.5">
                {renderRating(assignee.rating)}
              </div>
              <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                ({assignee.rating.toFixed(1)})
              </span>
            </div>

            {/* Company */}
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
              <span className="text-sm text-text-light-secondary dark:text-text-secondary">
                {assignee.company}
              </span>
            </div>

            {/* Phone */}
            {assignee.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-text-light-muted dark:text-text-muted" />
                <a 
                  href={`tel:${assignee.phone}`}
                  className="text-sm text-primary-gold hover:underline font-medium"
                >
                  {assignee.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="pt-4 border-t border-background-light-secondary dark:border-background-secondary">
          <Badge variant="soft" color="success" className="text-sm">
            ✅ Atanmış
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-background-light-secondary dark:border-background-secondary">
          <div className="flex flex-wrap gap-2">
            {assignee.phone && (
              <a
                href={`tel:${assignee.phone}`}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-primary-gold/10 text-primary-gold rounded-lg hover:bg-primary-gold/20 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Ara
              </a>
            )}
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-background-light-soft dark:bg-background-soft text-text-light-secondary dark:text-text-secondary rounded-lg hover:bg-background-light-secondary dark:hover:bg-background-secondary transition-colors">
              <User className="h-4 w-4" />
              Profil
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RequestDetailAssignee;