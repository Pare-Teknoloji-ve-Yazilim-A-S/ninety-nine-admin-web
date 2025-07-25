import React, { useState, useEffect } from 'react';
import Skeleton from './Skeleton';
import { AlertTriangle, FileText, Download, Eye } from 'lucide-react';

interface DocumentViewerProps {
    title: string;
    imageUrl?: string;
    alt: string;
    loading?: boolean;
    error?: boolean;
    onRetry?: () => void;
    className?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
    title,
    imageUrl,
    alt,
    loading = false,
    error = false,
    onRetry,
    className = ''
}) => {
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (imageUrl) {
            setImageLoading(true);
            setImageError(false);
        }
    }, [imageUrl]);

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    const handleDownload = () => {
        if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `${title.toLowerCase().replace(/\s+/g, '_')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-gold" />
                    {title}
                </h4>
                {imageUrl && !loading && !error && !imageError && (
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-primary-gold hover:text-primary-gold/80 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        İndir
                    </button>
                )}
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-background-light-card dark:bg-background-card">
                {loading ? (
                    <div className="p-6">
                        <Skeleton className="w-full h-64" />
                        <div className="mt-4 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ) : error || imageError ? (
                    <div className="p-8 text-center">
                        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Belge yüklenemedi
                        </p>
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="text-primary-gold hover:text-primary-gold/80 text-sm font-medium"
                            >
                                Tekrar Dene
                            </button>
                        )}
                    </div>
                ) : imageUrl ? (
                    <div className="relative">
                        {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                <Skeleton className="w-full h-64" />
                            </div>
                        )}
                        <img
                            src={imageUrl}
                            alt={alt}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            className={`w-full h-auto max-h-96 object-contain transition-opacity duration-300 ${
                                imageLoading ? 'opacity-0' : 'opacity-100'
                            }`}
                        />
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                            Belge bulunamadı
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}; 