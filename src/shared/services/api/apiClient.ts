import { ROUTES } from '../../constants/routes';
import { clearStoredUser, clearToken, getToken } from '../../utils/tokenStorage';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  requiresAuth?: boolean;
};

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5074/api';

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers = new Headers({ Accept: 'application/json' });

  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.requiresAuth !== false && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: isFormData ? options.body as FormData : options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    clearToken();
    clearStoredUser();

    if (window.location.pathname !== ROUTES.login) {
      window.location.assign(ROUTES.login);
    }
  }

  const payload = (await response.json()) as T;

  if (!response.ok) {
    throw payload;
  }

  return payload;
}
