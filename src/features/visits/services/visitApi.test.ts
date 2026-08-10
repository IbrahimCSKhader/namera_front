import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../shared/services/api/apiClient';
import { trackStoreVisit } from './visitApi';

vi.mock('../../../shared/services/api/apiClient', () => ({
  apiClient: vi.fn(),
}));

const mockedApiClient = vi.mocked(apiClient);

describe('visit API service', () => {
  beforeEach(() => {
    mockedApiClient.mockReset();
    mockedApiClient.mockResolvedValue({ success: true, message: 'ok', data: true, errors: [] });
  });

  it('tracks public store visits without requiring auth', async () => {
    await trackStoreVisit('/products/resin-tray', 'https://example.test');

    expect(mockedApiClient).toHaveBeenCalledWith('/visits/store', {
      method: 'POST',
      requiresAuth: false,
      body: {
        path: '/products/resin-tray',
        referrer: 'https://example.test',
      },
    });
  });
});
