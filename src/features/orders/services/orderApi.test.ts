import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../shared/services/api/apiClient';
import {
  createOrder,
  getMyOrders,
  getOwnerCustomers,
  getOwnerDashboardStats,
  getOwnerOrders,
  updateOrderStatus,
} from './orderApi';

vi.mock('../../../shared/services/api/apiClient', () => ({
  apiClient: vi.fn(),
}));

const mockedApiClient = vi.mocked(apiClient);

describe('order API service', () => {
  beforeEach(() => {
    mockedApiClient.mockReset();
    mockedApiClient.mockResolvedValue({ success: true, message: 'ok', data: null, errors: [] });
  });

  it('creates customer orders without owner-only fields', async () => {
    const request = {
      items: [{ productId: 'product-1', quantity: 2 }],
      customerName: 'Guest Customer',
      customerPhoneNumber: '0591234567',
      shippingAddress: 'Ramallah',
      notes: 'Gift wrap',
    };

    await createOrder(request);

    expect(mockedApiClient).toHaveBeenCalledWith('/customer/orders', {
      method: 'POST',
      body: request,
    });
  });

  it('loads customer orders from the customer endpoint', async () => {
    await getMyOrders();

    expect(mockedApiClient).toHaveBeenCalledWith('/customer/orders');
  });

  it('passes owner order filters as query parameters', async () => {
    await getOwnerOrders({ status: 'pending', search: 'RB-1001' });

    expect(mockedApiClient).toHaveBeenCalledWith('/admin/orders?status=pending&search=RB-1001');
  });

  it('updates order status through the owner endpoint', async () => {
    await updateOrderStatus('order-1', 'approved', 'Approved by owner');

    expect(mockedApiClient).toHaveBeenCalledWith('/admin/orders/order-1/status', {
      method: 'PATCH',
      body: { status: 'approved', ownerNote: 'Approved by owner' },
    });
  });

  it('loads owner customers and dashboard stats', async () => {
    await getOwnerCustomers();
    await getOwnerDashboardStats();

    expect(mockedApiClient).toHaveBeenNthCalledWith(1, '/admin/customers');
    expect(mockedApiClient).toHaveBeenNthCalledWith(2, '/admin/dashboard/stats');
  });
});
