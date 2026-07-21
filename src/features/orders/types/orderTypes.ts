export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'received'
  | 'preparing'
  | 'ready'
  | 'shipped'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  categoryName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  customizationSummary: string;
  customizationDetailsJson: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  statusLabel: string;
  subtotal: number;
  total: number;
  currency: string;
  customerName: string;
  customerPhoneNumber: string;
  shippingAddress: string;
  notes: string;
  ownerNote: string;
  stockDeducted: boolean;
  createdAt: string;
  updatedAt: string | null;
  approvedAt: string | null;
  receivedAt: string | null;
  cancelledAt: string | null;
  items: OrderItem[];
};

export type CreateOrderRequest = {
  items: Array<{
    productId: string;
    quantity: number;
    selectedOptions?: Array<{
      groupId: string;
      valueId: string;
    }>;
    customFields?: Array<{
      fieldId: string;
      value?: string;
      selectedChoiceIds?: string[];
    }>;
    customRequest?: string;
  }>;
  shippingAddress?: string;
  notes?: string;
};

export type OwnerCustomer = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string | null;
};

export type OwnerDashboardStats = {
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  completedOrders: number;
  customersCount: number;
  productsCount: number;
  revenue: number;
  ordersByStatus: Array<{ status: OrderStatus; label: string; count: number }>;
  revenueByDay: Array<{ date: string; revenue: number }>;
};
