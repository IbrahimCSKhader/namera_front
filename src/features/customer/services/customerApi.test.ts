import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../shared/services/api/apiClient';
import {
  createAddress,
  deleteAddress,
  deleteReview,
  getAddresses,
  getDashboard,
  getProfile,
  getReviews,
  saveReview,
  updateAddress,
  updateProfile,
} from './customerApi';

vi.mock('../../../shared/services/api/apiClient', () => ({
  apiClient: vi.fn(),
}));

const mockedApiClient = vi.mocked(apiClient);

describe('customer API service', () => {
  beforeEach(() => {
    mockedApiClient.mockReset();
    mockedApiClient.mockResolvedValue({ success: true, message: 'ok', data: null, errors: [] });
  });

  it('connects profile and dashboard endpoints', async () => {
    await getProfile();
    await updateProfile({ firstName: 'Mayar', lastName: 'Sabta', phoneNumber: '0590000001', address: 'Ramallah' });
    await getDashboard();

    expect(mockedApiClient).toHaveBeenNthCalledWith(1, '/customer/profile');
    expect(mockedApiClient).toHaveBeenNthCalledWith(2, '/customer/profile', {
      method: 'PUT',
      body: { firstName: 'Mayar', lastName: 'Sabta', phoneNumber: '0590000001', address: 'Ramallah' },
    });
    expect(mockedApiClient).toHaveBeenNthCalledWith(3, '/customer/dashboard');
  });

  it('connects customer address endpoints', async () => {
    const request = {
      label: 'Home',
      recipientName: 'Mayar Sabta',
      phoneNumber: '0590000001',
      addressLine: 'Main street',
      city: 'Ramallah',
      isDefault: true,
    };

    await getAddresses();
    await createAddress(request);
    await updateAddress('address-1', request);
    await deleteAddress('address-1');

    expect(mockedApiClient).toHaveBeenNthCalledWith(1, '/customer/addresses');
    expect(mockedApiClient).toHaveBeenNthCalledWith(2, '/customer/addresses', { method: 'POST', body: request });
    expect(mockedApiClient).toHaveBeenNthCalledWith(3, '/customer/addresses/address-1', { method: 'PUT', body: request });
    expect(mockedApiClient).toHaveBeenNthCalledWith(4, '/customer/addresses/address-1', { method: 'DELETE' });
  });

  it('connects customer review endpoints', async () => {
    const request = { productId: 'product-1', rating: 5, comment: 'Beautiful' };

    await getReviews();
    await saveReview(request);
    await deleteReview('review-1');

    expect(mockedApiClient).toHaveBeenNthCalledWith(1, '/customer/reviews');
    expect(mockedApiClient).toHaveBeenNthCalledWith(2, '/customer/reviews', { method: 'POST', body: request });
    expect(mockedApiClient).toHaveBeenNthCalledWith(3, '/customer/reviews/review-1', { method: 'DELETE' });
  });
});
