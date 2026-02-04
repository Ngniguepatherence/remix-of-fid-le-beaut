import { useState, useCallback, useEffect } from 'react';
import { Client, ClientStatus } from '@/types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/storage';
import { mockClients } from '@/lib/mock-data';

export function useClients() {
  const [clients, setClients] = useState<Client[]>(() => 
    getStorageItem(STORAGE_KEYS.CLIENTS, mockClients)
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CLIENTS, clients);
  }, [clients]);

  const addClient = useCallback((client: Omit<Client, 'id' | 'dateInscription' | 'pointsFidelite' | 'totalDepense' | 'nombreVisites'>) => {
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
      dateInscription: new Date().toISOString().split('T')[0],
      pointsFidelite: 0,
      totalDepense: 0,
      nombreVisites: 0,
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  }, []);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  }, []);

  const getClient = useCallback((id: string) => {
    return clients.find(c => c.id === id);
  }, [clients]);

  const searchClients = useCallback((query: string) => {
    const q = query.toLowerCase();
    return clients.filter(c => 
      c.nom.toLowerCase().includes(q) || 
      c.telephone.includes(q)
    );
  }, [clients]);

  const getClientsByStatus = useCallback((status: ClientStatus) => {
    return clients.filter(c => c.statut === status);
  }, [clients]);

  const getInactiveClients = useCallback((days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return clients.filter(c => {
      if (!c.derniereVisite) return true;
      return new Date(c.derniereVisite) < cutoffDate;
    });
  }, [clients]);

  const updateClientStats = useCallback((clientId: string, montant: number) => {
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      
      const nombreVisites = c.nombreVisites + 1;
      const totalDepense = c.totalDepense + montant;
      const pointsFidelite = c.pointsFidelite + 1;
      
      // Mise à jour automatique du statut
      let statut: ClientStatus = c.statut;
      if (nombreVisites >= 10) {
        statut = 'vip';
      } else if (nombreVisites >= 3) {
        statut = 'reguliere';
      }

      return {
        ...c,
        nombreVisites,
        totalDepense,
        pointsFidelite,
        statut,
        derniereVisite: new Date().toISOString().split('T')[0],
      };
    }));
  }, []);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    getClient,
    searchClients,
    getClientsByStatus,
    getInactiveClients,
    updateClientStats,
  };
}
