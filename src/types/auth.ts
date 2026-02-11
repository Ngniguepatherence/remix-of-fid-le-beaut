// Types pour le système multi-tenant

export interface SalonAccount {
  id: string;
  nom: string;
  proprietaire: string;
  telephone: string;
  adresse?: string;
  email: string;
  motDePasse: string; // hash simple
  dateCreation: string;
  dernierPaiement: string; // date ISO
  abonnementActif: boolean;
  montantAbonnement: number; // 25000 FCFA
  joursAbonnement: number; // 30
}

export interface AdminUser {
  email: string;
  motDePasse: string;
}

export interface AuthSession {
  type: 'admin' | 'salon';
  salonId?: string;
  email: string;
  timestamp: number;
}
