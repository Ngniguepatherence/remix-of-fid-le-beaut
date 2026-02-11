import { SalonAccount, AdminUser, AuthSession } from '@/types/auth';
import { getStorageItem, setStorageItem } from '@/lib/storage';

const ADMIN_KEY = 'beautyflow_admin';
const SALONS_KEY = 'beautyflow_salons_accounts';
const SESSION_KEY = 'beautyflow_session';

// Simple hash (pas cryptographique, suffisant pour localStorage MVP)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

// Admin par défaut
const defaultAdmin: AdminUser = {
  email: 'admin@leaderbright.com',
  motDePasse: simpleHash('admin2025'),
};

// ===== Admin =====
export function getAdmin(): AdminUser {
  return getStorageItem(ADMIN_KEY, defaultAdmin);
}

export function verifyAdmin(email: string, password: string): boolean {
  const admin = getAdmin();
  return admin.email === email && admin.motDePasse === simpleHash(password);
}

// ===== Salons =====
export function getSalonAccounts(): SalonAccount[] {
  return getStorageItem(SALONS_KEY, []);
}

export function saveSalonAccounts(salons: SalonAccount[]): void {
  setStorageItem(SALONS_KEY, salons);
}

export function createSalonAccount(data: Omit<SalonAccount, 'id' | 'dateCreation' | 'abonnementActif' | 'montantAbonnement' | 'joursAbonnement'>): SalonAccount {
  const salons = getSalonAccounts();
  const newSalon: SalonAccount = {
    ...data,
    id: crypto.randomUUID(),
    dateCreation: new Date().toISOString().split('T')[0],
    motDePasse: simpleHash(data.motDePasse),
    abonnementActif: true,
    montantAbonnement: 25000,
    joursAbonnement: 30,
  };
  salons.push(newSalon);
  saveSalonAccounts(salons);
  return newSalon;
}

export function verifySalonLogin(email: string, password: string): SalonAccount | null {
  const salons = getSalonAccounts();
  return salons.find(s => s.email === email && s.motDePasse === simpleHash(password)) || null;
}

export function isSalonSubscriptionActive(salon: SalonAccount): boolean {
  if (!salon.abonnementActif) return false;
  const lastPayment = new Date(salon.dernierPaiement);
  const expiry = new Date(lastPayment);
  expiry.setDate(expiry.getDate() + salon.joursAbonnement);
  return new Date() <= expiry;
}

export function renewSalonSubscription(salonId: string): void {
  const salons = getSalonAccounts();
  const index = salons.findIndex(s => s.id === salonId);
  if (index >= 0) {
    salons[index].dernierPaiement = new Date().toISOString().split('T')[0];
    salons[index].abonnementActif = true;
    saveSalonAccounts(salons);
  }
}

export function toggleSalonActive(salonId: string, active: boolean): void {
  const salons = getSalonAccounts();
  const index = salons.findIndex(s => s.id === salonId);
  if (index >= 0) {
    salons[index].abonnementActif = active;
    saveSalonAccounts(salons);
  }
}

// ===== Session =====
export function getSession(): AuthSession | null {
  return getStorageItem(SESSION_KEY, null);
}

export function setSession(session: AuthSession): void {
  setStorageItem(SESSION_KEY, session);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ===== Tenant storage keys =====
export function tenantKey(salonId: string, key: string): string {
  return `bf_${salonId}_${key}`;
}
