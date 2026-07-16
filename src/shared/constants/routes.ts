export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  customerDashboard: '/customer/dashboard',
  customerProfile: '/account/profile',
  ownerDashboard: '/owner/dashboard',
  ownerProducts: '/owner/products',
  ownerAddProduct: '/owner/products/new',
  ownerEditProduct: '/owner/products/:productId/edit',
} as const;
