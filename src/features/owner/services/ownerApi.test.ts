import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../shared/services/api/apiClient';
import {
  changeOwnerPassword,
  deleteOwnerReview,
  getOwnerProfile,
  getOwnerReviews,
  getStoreSettings,
  setOwnerReviewVisibility,
  updateOwnerProfile,
  updateStoreSettings,
} from './ownerApi';

vi.mock('../../../shared/services/api/apiClient', () => ({
  apiClient: vi.fn(),
}));

const mockedApiClient = vi.mocked(apiClient);

describe('owner API service', () => {
  beforeEach(() => {
    mockedApiClient.mockReset();
    mockedApiClient.mockResolvedValue({ success: true, message: 'ok', data: null, errors: [] });
  });

  it('connects owner profile and password endpoints', async () => {
    const profile = {
      firstName: 'Namira',
      lastName: 'Owner',
      phoneNumber: '0590000000',
      email: 'namera@gmail.com',
      address: 'Store address',
    };
    const password = {
      currentPassword: 'oldPassword1',
      newPassword: 'newPassword1',
      confirmPassword: 'newPassword1',
    };

    await getOwnerProfile();
    await updateOwnerProfile(profile);
    await changeOwnerPassword(password);

    expect(mockedApiClient).toHaveBeenNthCalledWith(1, '/admin/account/profile');
    expect(mockedApiClient).toHaveBeenNthCalledWith(2, '/admin/account/profile', { method: 'PUT', body: profile });
    expect(mockedApiClient).toHaveBeenNthCalledWith(3, '/admin/account/password', { method: 'PUT', body: password });
  });

  it('connects store settings endpoints', async () => {
    const settings = {
      storeName: 'Resin Bon',
      contactPhone: '0590000000',
      contactEmail: 'namera@gmail.com',
      instagramUrl: 'https://instagram.com/resinbon',
      defaultCurrency: 'ILS',
      aboutText: 'Handmade resin gifts.',
      ordersEnabled: true,
    };

    await getStoreSettings();
    await updateStoreSettings(settings);

    expect(mockedApiClient).toHaveBeenNthCalledWith(1, '/admin/settings');
    expect(mockedApiClient).toHaveBeenNthCalledWith(2, '/admin/settings', { method: 'PUT', body: settings });
  });

  it('connects owner review moderation endpoints', async () => {
    await getOwnerReviews();
    await getOwnerReviews(true);
    await setOwnerReviewVisibility('review-1', false);
    await deleteOwnerReview('review-1');

    expect(mockedApiClient).toHaveBeenNthCalledWith(1, '/admin/reviews');
    expect(mockedApiClient).toHaveBeenNthCalledWith(2, '/admin/reviews?visible=true');
    expect(mockedApiClient).toHaveBeenNthCalledWith(3, '/admin/reviews/review-1/visibility', {
      method: 'PATCH',
      body: { isVisible: false },
    });
    expect(mockedApiClient).toHaveBeenNthCalledWith(4, '/admin/reviews/review-1', { method: 'DELETE' });
  });
});
