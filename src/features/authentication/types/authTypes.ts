export type UserRole = 'Customer' | 'Owner';

export type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  role: UserRole;
};

export type AuthResponse = {
  token: string;
  expiresAt: string;
  user: CurrentUser;
};

export type LoginRequest = {
  phoneNumber: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  password: string;
  confirmPassword: string;
};
