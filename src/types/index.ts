// Types pour LeaderBright BeautyFlow

export type ClientStatus = 'nouvelle' | 'reguliere' | 'vip';

export interface Client {
  id: string;
  nom: string;
  telephone: string;
  dateInscription: string;
  dateAnniversaire?: string;
  statut: ClientStatus;
  notes?: string;
  pointsFidelite: number;
  totalDepense: number;
  nombreVisites: number;
  derniereVisite?: string;
}

export interface TypePrestation {
  id: string;
  nom: string;
  prix: number;
  description?: string;
  categorie?: string;
}

export interface Prestation {
  id: string;
  clientId: string;
  typePrestationId: string;
  date: string;
  employe?: string;
  notes?: string;
  montant: number;
}

export interface Rappel {
  id: string;
  clientId: string;
  type: 'inactivite' | 'suivi' | 'anniversaire' | 'personnalise';
  dateCreation: string;
  dateEnvoi?: string;
  message: string;
  statut: 'en_attente' | 'envoye' | 'annule';
}

export interface ConfigFidelite {
  visitesRequises: number;
  reductionPourcentage: number;
  visitesVIP: number;
}

export interface Salon {
  id: string;
  nom: string;
  logo?: string;
  telephone: string;
  adresse?: string;
  configFidelite: ConfigFidelite;
  joursRappelInactivite: number;
  joursRappelSuivi: number;
}

export interface Utilisateur {
  id: string;
  email: string;
  nom: string;
  role: 'admin' | 'employe';
  salonId: string;
}

export interface StatistiquesDashboard {
  totalClientes: number;
  clientesActives: number;
  clientesInactives: number;
  visitesCeMois: number;
  revenusCeMois: number;
  prestationsPopulaires: { nom: string; count: number }[];
}
