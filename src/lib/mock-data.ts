import { Client, TypePrestation, Prestation, Salon, ConfigFidelite } from '@/types';

export const defaultConfigFidelite: ConfigFidelite = {
  visitesRequises: 5,
  reductionPourcentage: 10,
  visitesVIP: 10,
};

export const defaultSalon: Salon = {
  id: '1',
  nom: 'Mon Salon de Beauté',
  telephone: '+237 6XX XXX XXX',
  configFidelite: defaultConfigFidelite,
  joursRappelInactivite: 30,
  joursRappelSuivi: 21,
};

export const defaultTypesPrestations: TypePrestation[] = [
  { id: '1', nom: 'Coiffure simple', prix: 5000, description: 'Coiffure de base', categorie: 'Coiffure' },
  { id: '2', nom: 'Tresses africaines', prix: 15000, description: 'Tresses traditionnelles', categorie: 'Coiffure' },
  { id: '3', nom: 'Tissage', prix: 25000, description: 'Pose de tissage complet', categorie: 'Coiffure' },
  { id: '4', nom: 'Défrisage', prix: 8000, description: 'Défrisage cheveux', categorie: 'Traitement' },
  { id: '5', nom: 'Manucure', prix: 3000, description: 'Soin des ongles mains', categorie: 'Ongles' },
  { id: '6', nom: 'Pédicure', prix: 4000, description: 'Soin des ongles pieds', categorie: 'Ongles' },
  { id: '7', nom: 'Maquillage événement', prix: 20000, description: 'Maquillage pour occasion spéciale', categorie: 'Maquillage' },
  { id: '8', nom: 'Soin du visage', prix: 10000, description: 'Nettoyage et hydratation', categorie: 'Soins' },
];

export const mockClients: Client[] = [
  {
    id: '1',
    nom: 'Marie Nguema',
    telephone: '+237 699 123 456',
    dateInscription: '2024-01-15',
    dateAnniversaire: '1990-05-20',
    statut: 'vip',
    notes: 'Cliente fidèle, préfère les tresses',
    pointsFidelite: 12,
    totalDepense: 180000,
    nombreVisites: 15,
    derniereVisite: '2025-01-28',
  },
  {
    id: '2',
    nom: 'Aminata Diallo',
    telephone: '+237 677 234 567',
    dateInscription: '2024-03-10',
    statut: 'reguliere',
    pointsFidelite: 6,
    totalDepense: 75000,
    nombreVisites: 8,
    derniereVisite: '2025-01-20',
  },
  {
    id: '3',
    nom: 'Florence Mbarga',
    telephone: '+237 655 345 678',
    dateInscription: '2024-11-01',
    statut: 'nouvelle',
    pointsFidelite: 2,
    totalDepense: 28000,
    nombreVisites: 2,
    derniereVisite: '2024-12-15',
  },
  {
    id: '4',
    nom: 'Sandrine Eyenga',
    telephone: '+237 690 456 789',
    dateInscription: '2024-06-20',
    dateAnniversaire: '1985-12-10',
    statut: 'reguliere',
    notes: 'Allergique à certains produits',
    pointsFidelite: 5,
    totalDepense: 62000,
    nombreVisites: 7,
    derniereVisite: '2025-01-25',
  },
];

export const mockPrestations: Prestation[] = [
  {
    id: '1',
    clientId: '1',
    typePrestationId: '2',
    date: '2025-01-28',
    employe: 'Sophie',
    montant: 15000,
  },
  {
    id: '2',
    clientId: '1',
    typePrestationId: '5',
    date: '2025-01-28',
    employe: 'Sophie',
    montant: 3000,
  },
  {
    id: '3',
    clientId: '2',
    typePrestationId: '3',
    date: '2025-01-20',
    employe: 'Marie',
    montant: 25000,
  },
  {
    id: '4',
    clientId: '4',
    typePrestationId: '8',
    date: '2025-01-25',
    employe: 'Sophie',
    montant: 10000,
  },
];
