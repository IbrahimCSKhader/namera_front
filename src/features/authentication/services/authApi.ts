import { apiClient } from '../../../shared/services/api/apiClient';
import { type ApiResponse } from '../../../shared/types/apiResponse';
import {
  type AuthResponse,
  type ConfirmEmailRequest,
  type CurrentUser,
  type LoginRequest,
  type RegistrationResponse,
  type RegisterRequest,
  type ResendEmailConfirmationRequest,
} from '../types/authTypes';

export function login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  return apiClient<ApiResponse<AuthResponse>>('/auth/login', {
    method: 'POST',
    body: request,
    requiresAuth: false,
  });
}

export function register(request: RegisterRequest): Promise<ApiResponse<RegistrationResponse>> {
  return apiClient<ApiResponse<RegistrationResponse>>('/auth/register', {
    method: 'POST',
    body: request,
    requiresAuth: false,
  });
}

export function confirmEmail(request: ConfirmEmailRequest): Promise<ApiResponse<boolean>> {
  return apiClient<ApiResponse<boolean>>('/auth/confirm-email', {
    method: 'POST',
    body: request,
    requiresAuth: false,
  });
}

export function resendEmailConfirmation(request: ResendEmailConfirmationRequest): Promise<ApiResponse<boolean>> {
  return apiClient<ApiResponse<boolean>>('/auth/resend-confirmation', {
    method: 'POST',
    body: request,
    requiresAuth: false,
  });
}

export function getCurrentUser(): Promise<ApiResponse<CurrentUser>> {
  return apiClient<ApiResponse<CurrentUser>>('/auth/me');
}
