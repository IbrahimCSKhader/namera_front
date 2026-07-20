import { apiClient } from '../../../shared/services/api/apiClient';
import { type ApiResponse } from '../../../shared/types/apiResponse';
import {
  type ChangeOwnerPasswordRequest,
  type OwnerProfile,
  type OwnerReview,
  type StoreSettings,
  type UpdateOwnerProfileRequest,
  type UpdateStoreSettingsRequest,
} from '../types/ownerTypes';

export function getOwnerProfile(): Promise<ApiResponse<OwnerProfile>> {
  return apiClient<ApiResponse<OwnerProfile>>('/admin/account/profile');
}

export function updateOwnerProfile(request: UpdateOwnerProfileRequest): Promise<ApiResponse<OwnerProfile>> {
  return apiClient<ApiResponse<OwnerProfile>>('/admin/account/profile', {
    method: 'PUT',
    body: request,
  });
}

export function changeOwnerPassword(request: ChangeOwnerPasswordRequest): Promise<ApiResponse<boolean>> {
  return apiClient<ApiResponse<boolean>>('/admin/account/password', {
    method: 'PUT',
    body: request,
  });
}

export function getStoreSettings(): Promise<ApiResponse<StoreSettings>> {
  return apiClient<ApiResponse<StoreSettings>>('/admin/settings');
}

export function updateStoreSettings(request: UpdateStoreSettingsRequest): Promise<ApiResponse<StoreSettings>> {
  return apiClient<ApiResponse<StoreSettings>>('/admin/settings', {
    method: 'PUT',
    body: request,
  });
}

export function getOwnerReviews(visible?: boolean): Promise<ApiResponse<OwnerReview[]>> {
  const query = visible === undefined ? '' : `?visible=${visible}`;
  return apiClient<ApiResponse<OwnerReview[]>>(`/admin/reviews${query}`);
}

export function setOwnerReviewVisibility(reviewId: string, isVisible: boolean): Promise<ApiResponse<OwnerReview>> {
  return apiClient<ApiResponse<OwnerReview>>(`/admin/reviews/${reviewId}/visibility`, {
    method: 'PATCH',
    body: { isVisible },
  });
}

export function deleteOwnerReview(reviewId: string): Promise<ApiResponse<boolean>> {
  return apiClient<ApiResponse<boolean>>(`/admin/reviews/${reviewId}`, {
    method: 'DELETE',
  });
}
