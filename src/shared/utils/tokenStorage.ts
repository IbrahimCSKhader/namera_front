import { STORAGE_KEYS } from '../constants/storageKeys';
import { type CurrentUser } from '../../features/authentication/types/authTypes';

export function getToken(): string | null {
  return window.localStorage.getItem(STORAGE_KEYS.token);
}

export function setToken(token: string): void {
  window.localStorage.setItem(STORAGE_KEYS.token, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(STORAGE_KEYS.token);
}

export function getStoredUser(): CurrentUser | null {
  const rawUser = window.localStorage.getItem(STORAGE_KEYS.user);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as CurrentUser;
  } catch {
    window.localStorage.removeItem(STORAGE_KEYS.user);
    return null;
  }
}

export function setStoredUser(user: CurrentUser): void {
  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function clearStoredUser(): void {
  window.localStorage.removeItem(STORAGE_KEYS.user);
}
