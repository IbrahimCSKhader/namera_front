import { apiClient } from '../../../shared/services/api/apiClient';
import { type ApiResponse } from '../../../shared/types/apiResponse';
import {
  type AuthResponse,
  type CurrentUser,
  type LoginRequest,
  type RegisterRequest,
} from '../types/authTypes';

export function login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  return apiClient<ApiResponse<AuthResponse>>('/auth/login', {
    method: 'POST',
    body: request,
    requiresAuth: false,
  });
}

export function register(request: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
  return apiClient<ApiResponse<AuthResponse>>('/auth/register', {
    method: 'POST',
    body: request,
    requiresAuth: false,
  });
}

export function getCurrentUser(): Promise<ApiResponse<CurrentUser>> {
  return apiClient<ApiResponse<CurrentUser>>('/auth/me');
}
