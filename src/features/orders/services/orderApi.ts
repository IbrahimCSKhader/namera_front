import { apiClient } from '../../../shared/services/api/apiClient';
import { type ApiResponse } from '../../../shared/types/apiResponse';
import {
  type CreateOrderRequest,
  type Order,
  type OrderStatus,
  type OwnerCustomer,
  type OwnerDashboardStats,
} from '../types/orderTypes';

export function createOrder(request: CreateOrderRequest): Promise<ApiResponse<Order>> {
  return apiClient<ApiResponse<Order>>('/customer/orders', {
    method: 'POST',
    body: request,
  });
}

export function getMyOrders(): Promise<ApiResponse<Order[]>> {
  return apiClient<ApiResponse<Order[]>>('/customer/orders');
}

export function getOwnerOrders(filters: { status?: string; search?: string } = {}): Promise<ApiResponse<Order[]>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return apiClient<ApiResponse<Order[]>>(`/admin/orders${params.size ? `?${params.toString()}` : ''}`);
}

export function updateOrderStatus(orderId: string, status: OrderStatus, ownerNote = ''): Promise<ApiResponse<Order>> {
  return apiClient<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: { status, ownerNote },
  });
}

export function getOwnerCustomers(): Promise<ApiResponse<OwnerCustomer[]>> {
  return apiClient<ApiResponse<OwnerCustomer[]>>('/admin/customers');
}

export function getOwnerDashboardStats(): Promise<ApiResponse<OwnerDashboardStats>> {
  return apiClient<ApiResponse<OwnerDashboardStats>>('/admin/dashboard/stats');
}
