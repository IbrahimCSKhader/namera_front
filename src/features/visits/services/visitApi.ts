import { apiClient } from '../../../shared/services/api/apiClient';
import { type ApiResponse } from '../../../shared/types/apiResponse';

export function trackStoreVisit(path: string, referrer = document.referrer): Promise<ApiResponse<boolean>> {
  return apiClient<ApiResponse<boolean>>('/visits/store', {
    method: 'POST',
    requiresAuth: false,
    body: { path, referrer },
  });
}
