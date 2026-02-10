// Utilitaires de stockage localStorage

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erreur de stockage:', error);
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Erreur de suppression:', error);
  }
}

// Clés de stockage
export const STORAGE_KEYS = {
  CLIENTS: 'beautyflow_clients',
  PRESTATIONS: 'beautyflow_prestations',
  TYPES_PRESTATIONS: 'beautyflow_types_prestations',
  RAPPELS: 'beautyflow_rappels',
  SALON: 'beautyflow_salon',
  UTILISATEUR: 'beautyflow_utilisateur',
  AUTH: 'beautyflow_auth',
  PRODUITS: 'beautyflow_produits',
  VENTES: 'beautyflow_ventes',
  DEPENSES: 'beautyflow_depenses',
} as const;
