export type OwnerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
};

export type UpdateOwnerProfileRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  address: string;
};

export type ChangeOwnerPasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type StoreSettings = {
  id: string;
  storeName: string;
  contactPhone: string;
  contactEmail: string;
  instagramUrl: string;
  defaultCurrency: string;
  aboutText: string;
  ordersEnabled: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type UpdateStoreSettingsRequest = {
  storeName: string;
  contactPhone: string;
  contactEmail: string;
  instagramUrl: string;
  defaultCurrency: string;
  aboutText: string;
  ordersEnabled: boolean;
};

export type OwnerReview = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  customerName: string;
  customerPhoneNumber: string;
  rating: number;
  comment: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string | null;
};
