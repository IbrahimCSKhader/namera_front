export type UserRole = 'Customer' | 'Owner';

export type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: UserRole;
};

export type AuthResponse = {
  token: string;
  expiresAt: string;
  user: CurrentUser;
};

export type RegistrationResponse = {
  userId: string;
  email: string;
  requiresEmailConfirmation: boolean;
};

export type LoginRequest = {
  identifier: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  confirmPassword: string;
};

export type ConfirmEmailRequest = {
  userId: string;
  token: string;
};

export type ResendEmailConfirmationRequest = {
  email: string;
};
