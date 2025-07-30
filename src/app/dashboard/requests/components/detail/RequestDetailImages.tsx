import React from 'react';
import { Image, Camera, Eye } from 'lucide-react';
import Card from '@/app/components/ui/Card';
import Badge from '@/app/components/ui/Badge';
import Button from '@/app/components/ui/Button';
import { RequestDetailImagesProps } from '@/services/types/request-detail.types';

const RequestDetailImages: React.FC<RequestDetailImagesProps> = ({
  requestId,
  imagesCount
}) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-text-light-muted dark:text-text-muted" />
            <h2 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
              Fotoğraflar
            </h2>
          </div>
          <Badge variant="soft" color="secondary" className="text-sm">
            {imagesCount} Fotoğraf
          </Badge>
        </div>

        {imagesCount > 0 ? (
          <div className="space-y-4">
            {/* Image grid placeholder */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[...Array(Math.min(imagesCount, 6))].map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-background-light-soft dark:bg-background-soft rounded-lg flex items-center justify-center border-2 border-dashed border-background-light-secondary dark:border-background-secondary"
                >
                  <div className="text-center">
                    <Camera className="mx-auto h-6 w-6 text-text-light-muted dark:text-text-muted mb-1" />
                    <p className="text-xs text-text-light-muted dark:text-text-muted">
                      Fotoğraf {index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Show more button if there are more images */}
            {imagesCount > 6 && (
              <div className="text-center">
                <Button variant="ghost" icon={Eye} className="text-sm">
                  {imagesCount - 6} Fotoğraf Daha Göster
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-background-light-secondary dark:border-background-secondary">
              <Button variant="secondary" size="sm">
                Tümünü Göster
              </Button>
              <Button variant="ghost" size="sm">
                İndir
              </Button>
            </div>

            {/* Info message */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                📷 Fotoğraf görüntüleme özelliği yakında aktif olacak
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Camera className="mx-auto h-12 w-12 text-text-light-muted dark:text-text-muted mb-3" />
            <p className="text-text-light-secondary dark:text-text-secondary mb-2">
              Henüz fotoğraf yok
            </p>
            <p className="text-sm text-text-light-muted dark:text-text-muted">
              Bu talep için henüz fotoğraf eklenmemiş
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestDetailImages;