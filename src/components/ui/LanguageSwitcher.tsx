'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('tr');
  const router = useRouter();

  // Sayfa yüklendiğinde localStorage'dan dil tercihini al
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['tr', 'en', 'ar'].includes(savedLanguage)) {
      setCurrentLocale(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    console.log('Dil değiştiriliyor:', { currentLocale, newLocale });
    setCurrentLocale(newLocale);
    setIsOpen(false);
    
    // localStorage'a kaydet
    localStorage.setItem('preferredLanguage', newLocale);
    
    // Sayfayı yenile ki dil değişikliği etkili olsun
    window.location.reload();
  };

  const getLanguageName = (code: string) => {
    switch (code) {
      case 'tr':
        return 'Türkçe';
      case 'en':
        return 'English';
      case 'ar':
        return 'العربية';
      default:
        return code.toUpperCase();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Dil:</span>
      <div className="relative">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 min-w-[100px]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Globe className="h-4 w-4" />
          <span>{getLanguageName(currentLocale)}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-1 w-[140px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
            {['tr', 'en', 'ar'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  currentLocale === lang ? 'bg-primary-gold-light/20 font-medium' : ''
                }`}
              >
                {getLanguageName(lang)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
