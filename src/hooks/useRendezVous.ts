import { useState, useCallback, useEffect } from 'react';
import { RendezVous } from '@/types/rendez-vous';
import { getStorageItem, setStorageItem } from '@/lib/storage';

const STORAGE_KEY = 'beautyflow_rendez_vous';

const mockRendezVous: RendezVous[] = [
  {
    id: '1',
    clientId: '1',
    typePrestationId: '2',
    date: new Date().toISOString().split('T')[0],
    heure: '09:00',
    duree: 120,
    employe: 'Sophie',
    statut: 'confirme',
  },
  {
    id: '2',
    clientId: '2',
    typePrestationId: '3',
    date: new Date().toISOString().split('T')[0],
    heure: '14:00',
    duree: 90,
    employe: 'Marie',
    statut: 'en_attente',
  },
  {
    id: '3',
    clientId: '4',
    typePrestationId: '9',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    heure: '10:00',
    duree: 60,
    employe: 'Sophie',
    statut: 'confirme',
  },
  {
    id: '4',
    clientId: '1',
    typePrestationId: '11',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    heure: '11:00',
    duree: 90,
    statut: 'en_attente',
  },
];

export function useRendezVous() {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>(() =>
    getStorageItem(STORAGE_KEY, mockRendezVous)
  );

  useEffect(() => {
    setStorageItem(STORAGE_KEY, rendezVous);
  }, [rendezVous]);

  const addRendezVous = useCallback((rdv: Omit<RendezVous, 'id'>) => {
    const newRdv: RendezVous = {
      ...rdv,
      id: crypto.randomUUID(),
    };
    setRendezVous(prev => [...prev, newRdv]);
    return newRdv;
  }, []);

  const updateRendezVous = useCallback((id: string, updates: Partial<RendezVous>) => {
    setRendezVous(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const deleteRendezVous = useCallback((id: string) => {
    setRendezVous(prev => prev.filter(r => r.id !== id));
  }, []);

  const getRendezVousByDate = useCallback((date: string) => {
    return rendezVous
      .filter(r => r.date === date)
      .sort((a, b) => a.heure.localeCompare(b.heure));
  }, [rendezVous]);

  const getRendezVousAujourdhui = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return getRendezVousByDate(today);
  }, [getRendezVousByDate]);

  const getDatesAvecRendezVous = useCallback(() => {
    const dates = new Set(rendezVous.map(r => r.date));
    return Array.from(dates);
  }, [rendezVous]);

  return {
    rendezVous,
    addRendezVous,
    updateRendezVous,
    deleteRendezVous,
    getRendezVousByDate,
    getRendezVousAujourdhui,
    getDatesAvecRendezVous,
  };
}
