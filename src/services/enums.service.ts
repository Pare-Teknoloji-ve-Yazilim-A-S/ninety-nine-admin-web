// Enums Service - Fetch and cache enums in localStorage
'use client';

import { apiClient } from './api/client';

export type AppEnums = Record<string, any>;

const ENUMS_STORAGE_KEY = 'appEnums';
const ENUMS_FETCHED_AT_KEY = 'appEnumsFetchedAt';

function saveToStorage(enums: AppEnums) {
  try {
    localStorage.setItem(ENUMS_STORAGE_KEY, JSON.stringify(enums));
    localStorage.setItem(ENUMS_FETCHED_AT_KEY, Date.now().toString());
  } catch (error) {
    console.warn('Failed to save enums to localStorage:', error);
  }
}

function readFromStorage(): AppEnums | null {
  try {
    const raw = localStorage.getItem(ENUMS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const enumsService = {
  storageKey: ENUMS_STORAGE_KEY,
  fetchedAtKey: ENUMS_FETCHED_AT_KEY,

  getFromCache(): AppEnums | null {
    if (typeof window === 'undefined') return null;
    return readFromStorage();
  },

  async fetchAndCache(): Promise<AppEnums> {
    const response = await apiClient.get<{ success: boolean; data: AppEnums }>('/enums');
    const enums = response?.data ?? {};
    saveToStorage(enums);
    return enums;
  },

  async get(): Promise<AppEnums> {
    const cached = this.getFromCache();
    if (cached) return cached;
    return this.fetchAndCache();
  },

  clearCache(): void {
    try {
      localStorage.removeItem(ENUMS_STORAGE_KEY);
      localStorage.removeItem(ENUMS_FETCHED_AT_KEY);
    } catch (error) {
      console.warn('Failed to clear enums from localStorage:', error);
    }
  },
};


