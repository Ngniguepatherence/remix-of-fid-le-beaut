import { useState, useCallback, useEffect, useMemo } from 'react';
import { Vente, VenteItem, Depense } from '@/types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/storage';

const mockVentes: Vente[] = [
  {
    id: '1', date: '2025-02-08', clientId: '1',
    items: [
      { type: 'prestation', referenceId: '2', nom: 'Tresses africaines', quantite: 1, prixUnitaire: 15000, montant: 15000 },
      { type: 'produit', referenceId: '3', nom: 'Huile de coco', quantite: 1, prixUnitaire: 3000, montant: 3000 },
    ],
    totalMontant: 18000, modePaiement: 'mobile_money',
  },
  {
    id: '2', date: '2025-02-07', clientId: '2',
    items: [
      { type: 'prestation', referenceId: '3', nom: 'Tissage', quantite: 1, prixUnitaire: 25000, montant: 25000 },
    ],
    totalMontant: 25000, modePaiement: 'especes',
  },
  {
    id: '3', date: '2025-02-06',
    items: [
      { type: 'produit', referenceId: '1', nom: 'Shampoing professionnel', quantite: 2, prixUnitaire: 5000, montant: 10000 },
    ],
    totalMontant: 10000, modePaiement: 'especes',
  },
];

const mockDepenses: Depense[] = [
  { id: '1', date: '2025-02-05', categorie: 'Fournitures', description: 'Réapprovisionnement shampoings', montant: 45000 },
  { id: '2', date: '2025-02-03', categorie: 'Loyer', description: 'Loyer mensuel salon', montant: 150000 },
  { id: '3', date: '2025-02-01', categorie: 'Salaires', description: 'Salaires employés', montant: 200000 },
];

export function useFinances() {
  const [ventes, setVentes] = useState<Vente[]>(() =>
    getStorageItem(STORAGE_KEYS.VENTES, mockVentes)
  );
  const [depenses, setDepenses] = useState<Depense[]>(() =>
    getStorageItem(STORAGE_KEYS.DEPENSES, mockDepenses)
  );

  useEffect(() => { setStorageItem(STORAGE_KEYS.VENTES, ventes); }, [ventes]);
  useEffect(() => { setStorageItem(STORAGE_KEYS.DEPENSES, depenses); }, [depenses]);

  const addVente = useCallback((vente: Omit<Vente, 'id'>) => {
    const newVente: Vente = { ...vente, id: crypto.randomUUID() };
    setVentes(prev => [...prev, newVente]);
    return newVente;
  }, []);

  const addDepense = useCallback((depense: Omit<Depense, 'id'>) => {
    const newDepense: Depense = { ...depense, id: crypto.randomUUID() };
    setDepenses(prev => [...prev, newDepense]);
    return newDepense;
  }, []);

  const deleteVente = useCallback((id: string) => {
    setVentes(prev => prev.filter(v => v.id !== id));
  }, []);

  const deleteDepense = useCallback((id: string) => {
    setDepenses(prev => prev.filter(d => d.id !== id));
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const ventesMois = ventes.filter(v => v.date.startsWith(thisMonth));
    const depensesMois = depenses.filter(d => d.date.startsWith(thisMonth));

    const totalRevenus = ventesMois.reduce((s, v) => s + v.totalMontant, 0);
    const totalDepenses = depensesMois.reduce((s, d) => s + d.montant, 0);
    const benefice = totalRevenus - totalDepenses;

    const revenusProduits = ventesMois.reduce((s, v) =>
      s + v.items.filter(i => i.type === 'produit').reduce((si, i) => si + i.montant, 0), 0);
    const revenusPrestations = ventesMois.reduce((s, v) =>
      s + v.items.filter(i => i.type === 'prestation').reduce((si, i) => si + i.montant, 0), 0);

    const parModePaiement: Record<string, number> = {};
    ventesMois.forEach(v => {
      parModePaiement[v.modePaiement] = (parModePaiement[v.modePaiement] || 0) + v.totalMontant;
    });

    const parCategorieDepense: Record<string, number> = {};
    depensesMois.forEach(d => {
      parCategorieDepense[d.categorie] = (parCategorieDepense[d.categorie] || 0) + d.montant;
    });

    return {
      totalRevenus,
      totalDepenses,
      benefice,
      revenusProduits,
      revenusPrestations,
      nombreVentes: ventesMois.length,
      parModePaiement,
      parCategorieDepense,
    };
  }, [ventes, depenses]);

  return {
    ventes,
    depenses,
    addVente,
    addDepense,
    deleteVente,
    deleteDepense,
    stats,
  };
}
