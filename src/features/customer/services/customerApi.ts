import { apiClient } from '../../../shared/services/api/apiClient';
import { type ApiResponse } from '../../../shared/types/apiResponse';
import { type CustomerProfile, type UpdateCustomerProfileRequest } from '../types/customerTypes';

export function getProfile(): Promise<ApiResponse<CustomerProfile>> {
  return apiClient<ApiResponse<CustomerProfile>>('/customer/profile');
}

export function updateProfile(request: UpdateCustomerProfileRequest): Promise<ApiResponse<CustomerProfile>> {
  return apiClient<ApiResponse<CustomerProfile>>('/customer/profile', {
    method: 'PUT',
    body: request,
  });
}
