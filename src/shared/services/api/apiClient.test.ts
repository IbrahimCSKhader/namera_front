import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../../constants/storageKeys';

const storage = new Map<string, string>();
const assign = vi.fn();

function installWindow(pathname = '/account/profile') {
  storage.clear();
  assign.mockReset();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
    location: {
      hostname: '127.0.0.1',
      pathname,
      assign,
    },
  });
}

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    installWindow();
  });

  it('attaches bearer token to protected requests', async () => {
    storage.set(STORAGE_KEYS.token, 'token-123');
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const { apiClient } = await import('./apiClient');

    await apiClient('/customer/profile');

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer token-123');
  });

  it('does not require auth for public requests', async () => {
    storage.set(STORAGE_KEYS.token, 'token-123');
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const { apiClient } = await import('./apiClient');

    await apiClient('/products', { requiresAuth: false });

    const headers = fetchMock.mock.calls[0][1].headers as Headers;
    expect(headers.get('Authorization')).toBeNull();
  });

  it('throws backend validation payloads for non-ok responses', async () => {
    const payload = { success: false, message: 'invalid', errors: ['bad request'] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 400 })));
    const { apiClient } = await import('./apiClient');

    await expect(apiClient('/customer/profile')).rejects.toEqual(payload);
  });

  it('clears auth storage and redirects on 401', async () => {
    storage.set(STORAGE_KEYS.token, 'token-123');
    storage.set(STORAGE_KEYS.user, '{"id":"user-1"}');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false }), { status: 401 })));
    const { apiClient } = await import('./apiClient');

    await expect(apiClient('/customer/profile')).rejects.toEqual({ success: false });

    expect(storage.has(STORAGE_KEYS.token)).toBe(false);
    expect(storage.has(STORAGE_KEYS.user)).toBe(false);
    expect(assign).toHaveBeenCalledWith('/login');
  });
});
