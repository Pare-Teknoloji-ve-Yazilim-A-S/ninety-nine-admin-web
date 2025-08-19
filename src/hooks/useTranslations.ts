import { useTranslations as useNextIntlTranslations } from 'next-intl';

// Tip güvenli çeviri hook'u
export function useTranslations(namespace?: string) {
  return useNextIntlTranslations(namespace);
}

// Özel çeviri hook'ları
export function useCommonTranslations() {
  return useTranslations('common');
}

export function useNavigationTranslations() {
  return useTranslations('navigation');
}

export function useDashboardTranslations() {
  return useTranslations('dashboard');
}

export function useResidentsTranslations() {
  return useTranslations('residents');
}

export function useStaffTranslations() {
  return useTranslations('staff');
}

export function useUnitsTranslations() {
  return useTranslations('units');
}

export function useRequestsTranslations() {
  return useTranslations('requests');
}

export function useFinancialTranslations() {
  return useTranslations('financial');
}

export function useAnnouncementsTranslations() {
  return useTranslations('announcements');
}

export function useSettingsTranslations() {
  return useTranslations('settings');
}

export function useAuthTranslations() {
  return useTranslations('auth');
}
