import React from 'react';
import { MapPin, User, Users, Phone, Building, Hash } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import { RequestDetailApartmentProps } from '@/services/types/request-detail.types';

const RequestDetailApartment: React.FC<RequestDetailApartmentProps> = ({ apartment }) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Building className="h-5 w-5 text-text-light-muted dark:text-text-muted" />
          <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
            Mülk Bilgileri
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Apartment Number */}
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-text-light-muted dark:text-text-muted flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                Daire No
              </p>
              <p className="text-base font-semibold text-text-on-light dark:text-text-on-dark">
                {apartment.number}
              </p>
            </div>
          </div>

          {/* Block */}
          <div className="flex items-center gap-3">
            <Building className="h-4 w-4 text-text-light-muted dark:text-text-muted flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                Blok
              </p>
              <p className="text-base text-text-on-light dark:text-text-on-dark">
                {apartment.block}
              </p>
            </div>
          </div>

          {/* Floor */}
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-text-light-muted dark:text-text-muted flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                Kat
              </p>
              <p className="text-base text-text-on-light dark:text-text-on-dark">
                {apartment.floor}. Kat
              </p>
            </div>
          </div>

          {/* Owner */}
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-text-light-muted dark:text-text-muted flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                Mülk Sahibi
              </p>
              <p className="text-base text-text-on-light dark:text-text-on-dark">
                {apartment.owner}
              </p>
            </div>
          </div>
        </div>

        {/* Tenant (if exists) */}
        {apartment.tenant && (
          <div className="pt-4 border-t border-background-light-secondary dark:border-background-secondary">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-text-light-muted dark:text-text-muted flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                  Kiracı
                </p>
                <p className="text-base text-text-on-light dark:text-text-on-dark">
                  {apartment.tenant}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Phone Contact */}
        {apartment.phone && (
          <div className="pt-4 border-t border-background-light-secondary dark:border-background-secondary">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-text-light-muted dark:text-text-muted flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary">
                  İletişim
                </p>
                <a 
                  href={`tel:${apartment.phone}`}
                  className="text-base text-primary-gold hover:underline font-medium"
                >
                  {apartment.phone}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Address Summary */}
        <div className="pt-4 border-t border-background-light-secondary dark:border-background-secondary">
          <div className="bg-background-light-soft dark:bg-background-soft rounded-lg p-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-light-secondary dark:text-text-secondary mb-1">
                  Tam Adres
                </p>
                <p className="text-sm text-text-on-light dark:text-text-on-dark">
                  {apartment.block} Blok, {apartment.number} Daire, {apartment.floor}. Kat
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RequestDetailApartment;