export type CustomerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};

export type UpdateCustomerProfileRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};

export type CustomerDashboard = {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  addressesCount: number;
  reviewsCount: number;
  totalSpent: number;
  lastOrderNumber: string | null;
  lastOrderStatus: string | null;
  lastOrderStatusLabel: string | null;
};

export type CustomerAddress = {
  id: string;
  label: string;
  recipientName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  notes: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type CustomerAddressRequest = {
  label: string;
  recipientName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  notes?: string;
  isDefault: boolean;
};

export type CustomerReview = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImageUrl: string;
  rating: number;
  comment: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string | null;
};

export type CustomerReviewRequest = {
  productId: string;
  rating: number;
  comment: string;
  customerName?: string;
  customerPhoneNumber?: string;
};
