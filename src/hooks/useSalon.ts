import { useState, useCallback, useEffect } from 'react';
import { Salon } from '@/types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/storage';
import { defaultSalon } from '@/lib/mock-data';

export function useSalon() {
  const [salon, setSalon] = useState<Salon>(() => 
    getStorageItem(STORAGE_KEYS.SALON, defaultSalon)
  );

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.SALON, salon);
  }, [salon]);

  const updateSalon = useCallback((updates: Partial<Salon>) => {
    setSalon(prev => ({ ...prev, ...updates }));
  }, []);

  const updateConfigFidelite = useCallback((updates: Partial<Salon['configFidelite']>) => {
    setSalon(prev => ({
      ...prev,
      configFidelite: { ...prev.configFidelite, ...updates },
    }));
  }, []);

  return {
    salon,
    updateSalon,
    updateConfigFidelite,
  };
}
