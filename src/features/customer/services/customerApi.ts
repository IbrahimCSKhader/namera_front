import { apiClient } from '../../../shared/services/api/apiClient';
import { type ApiResponse } from '../../../shared/types/apiResponse';
import {
  type CustomerAddress,
  type CustomerAddressRequest,
  type CustomerDashboard,
  type CustomerProfile,
  type CustomerReview,
  type CustomerReviewRequest,
  type UpdateCustomerProfileRequest,
} from '../types/customerTypes';

export function getProfile(): Promise<ApiResponse<CustomerProfile>> {
  return apiClient<ApiResponse<CustomerProfile>>('/customer/profile');
}

export function updateProfile(request: UpdateCustomerProfileRequest): Promise<ApiResponse<CustomerProfile>> {
  return apiClient<ApiResponse<CustomerProfile>>('/customer/profile', {
    method: 'PUT',
    body: request,
  });
}

export function getDashboard(): Promise<ApiResponse<CustomerDashboard>> {
  return apiClient<ApiResponse<CustomerDashboard>>('/customer/dashboard');
}

export function getAddresses(): Promise<ApiResponse<CustomerAddress[]>> {
  return apiClient<ApiResponse<CustomerAddress[]>>('/customer/addresses');
}

export function createAddress(request: CustomerAddressRequest): Promise<ApiResponse<CustomerAddress>> {
  return apiClient<ApiResponse<CustomerAddress>>('/customer/addresses', {
    method: 'POST',
    body: request,
  });
}

export function updateAddress(addressId: string, request: CustomerAddressRequest): Promise<ApiResponse<CustomerAddress>> {
  return apiClient<ApiResponse<CustomerAddress>>(`/customer/addresses/${addressId}`, {
    method: 'PUT',
    body: request,
  });
}

export function deleteAddress(addressId: string): Promise<ApiResponse<boolean>> {
  return apiClient<ApiResponse<boolean>>(`/customer/addresses/${addressId}`, {
    method: 'DELETE',
  });
}

export function getReviews(): Promise<ApiResponse<CustomerReview[]>> {
  return apiClient<ApiResponse<CustomerReview[]>>('/customer/reviews');
}

export function saveReview(request: CustomerReviewRequest): Promise<ApiResponse<CustomerReview>> {
  return apiClient<ApiResponse<CustomerReview>>('/customer/reviews', {
    method: 'POST',
    body: request,
  });
}

export function deleteReview(reviewId: string): Promise<ApiResponse<boolean>> {
  return apiClient<ApiResponse<boolean>>(`/customer/reviews/${reviewId}`, {
    method: 'DELETE',
  });
}
