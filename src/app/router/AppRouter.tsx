import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CustomerRoute } from '../../features/authentication/routes/CustomerRoute';
import { OwnerRoute } from '../../features/authentication/routes/OwnerRoute';
import { ROUTES } from '../../shared/constants/routes';

const HomePage = lazy(() => import('../../features/public/pages/HomePage').then(({ HomePage }) => ({ default: HomePage })));
const AboutPage = lazy(() => import('../../features/public/pages/AboutPage').then(({ AboutPage }) => ({ default: AboutPage })));
const StaticPage = lazy(() => import('../../features/public/pages/StaticPage').then(({ StaticPage }) => ({ default: StaticPage })));
const ProductsPage = lazy(() => import('../../features/products/pages/ProductsPage').then(({ ProductsPage }) => ({ default: ProductsPage })));
const ProductDetailsPage = lazy(() => import('../../features/products/pages/ProductDetailsPage').then(({ ProductDetailsPage }) => ({ default: ProductDetailsPage })));
const CartPage = lazy(() => import('../../features/orders/pages/CartPage').then(({ CartPage }) => ({ default: CartPage })));
const LoginPage = lazy(() => import('../../features/authentication/pages/LoginPage').then(({ LoginPage }) => ({ default: LoginPage })));
const RegisterPage = lazy(() => import('../../features/authentication/pages/RegisterPage').then(({ RegisterPage }) => ({ default: RegisterPage })));
const ConfirmEmailPage = lazy(() => import('../../features/authentication/pages/ConfirmEmailPage').then(({ ConfirmEmailPage }) => ({ default: ConfirmEmailPage })));
const CustomerDashboardPage = lazy(() => import('../../features/customer/pages/CustomerDashboardPage').then(({ CustomerDashboardPage }) => ({ default: CustomerDashboardPage })));
const CustomerProfilePage = lazy(() => import('../../features/customer/pages/CustomerProfilePage').then(({ CustomerProfilePage }) => ({ default: CustomerProfilePage })));
const CustomerOrdersPage = lazy(() => import('../../features/orders/pages/CustomerOrdersPage').then(({ CustomerOrdersPage }) => ({ default: CustomerOrdersPage })));
const CustomerReviewsPage = lazy(() => import('../../features/customer/pages/CustomerReviewsPage').then(({ CustomerReviewsPage }) => ({ default: CustomerReviewsPage })));
const CustomerAddressesPage = lazy(() => import('../../features/customer/pages/CustomerAddressesPage').then(({ CustomerAddressesPage }) => ({ default: CustomerAddressesPage })));
const OwnerDashboardPage = lazy(() => import('../../features/owner/pages/OwnerDashboardPage').then(({ OwnerDashboardPage }) => ({ default: OwnerDashboardPage })));
const ProductsManagementPage = lazy(() => import('../../features/products/admin/pages/ProductsManagementPage').then(({ ProductsManagementPage }) => ({ default: ProductsManagementPage })));
const OwnerOrdersPage = lazy(() => import('../../features/orders/pages/OwnerOrdersPage').then(({ OwnerOrdersPage }) => ({ default: OwnerOrdersPage })));
const AddProductPage = lazy(() => import('../../features/products/admin/pages/AddProductPage').then(({ AddProductPage }) => ({ default: AddProductPage })));
const CategoriesManagementPage = lazy(() => import('../../features/products/admin/pages/CategoriesManagementPage').then(({ CategoriesManagementPage }) => ({ default: CategoriesManagementPage })));
const OwnerCustomersPage = lazy(() => import('../../features/orders/pages/OwnerCustomersPage').then(({ OwnerCustomersPage }) => ({ default: OwnerCustomersPage })));
const OwnerReviewsPage = lazy(() => import('../../features/owner/pages/OwnerReviewsPage').then(({ OwnerReviewsPage }) => ({ default: OwnerReviewsPage })));
const OwnerProfilePage = lazy(() => import('../../features/owner/pages/OwnerProfilePage').then(({ OwnerProfilePage }) => ({ default: OwnerProfilePage })));
const OwnerSettingsPage = lazy(() => import('../../features/owner/pages/OwnerSettingsPage').then(({ OwnerSettingsPage }) => ({ default: OwnerSettingsPage })));
const OwnerPasswordPage = lazy(() => import('../../features/owner/pages/OwnerPasswordPage').then(({ OwnerPasswordPage }) => ({ default: OwnerPasswordPage })));
const EditProductPage = lazy(() => import('../../features/products/admin/pages/EditProductPage').then(({ EditProductPage }) => ({ default: EditProductPage })));

export function AppRouter() {
  return (
    <Suspense fallback={<main className="app-page"><div className="loading-state"><span /> جار تحميل الصفحة...</div></main>}>
      <Routes>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.products} element={<ProductsPage />} />
        <Route path={ROUTES.productDetails} element={<ProductDetailsPage />} />
        <Route path={ROUTES.categories} element={<ProductsPage />} />
        <Route path={ROUTES.about} element={<AboutPage />} />
        <Route path={ROUTES.contact} element={<StaticPage title="تواصل معنا" subtitle="يمكن ربط هذه الصفحة لاحقا بنموذج رسائل أو بيانات التواصل الخاصة بالمتجر." />} />
        <Route path={ROUTES.cart} element={<CartPage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path={ROUTES.confirmEmail} element={<ConfirmEmailPage />} />
        <Route path={ROUTES.customerDashboard} element={<CustomerRoute><CustomerDashboardPage /></CustomerRoute>} />
        <Route path={ROUTES.customerProfile} element={<CustomerRoute><CustomerProfilePage /></CustomerRoute>} />
        <Route path={ROUTES.customerOrders} element={<CustomerRoute><CustomerOrdersPage /></CustomerRoute>} />
        <Route path={ROUTES.customerReviews} element={<CustomerRoute><CustomerReviewsPage /></CustomerRoute>} />
        <Route path={ROUTES.customerAddresses} element={<CustomerRoute><CustomerAddressesPage /></CustomerRoute>} />
        <Route path={ROUTES.ownerDashboard} element={<OwnerRoute><OwnerDashboardPage /></OwnerRoute>} />
        <Route path={ROUTES.ownerProducts} element={<OwnerRoute><ProductsManagementPage /></OwnerRoute>} />
        <Route path={ROUTES.ownerOrders} element={<OwnerRoute><OwnerOrdersPage /></OwnerRoute>} />
        <Route path={ROUTES.ownerAddProduct} element={<OwnerRoute><AddProductPage /></OwnerRoute>} />
        <Route path={ROUTES.ownerCategories} element={<OwnerRoute><CategoriesManagementPage /></OwnerRoute>} />
        <Route path={ROUTES.ownerCustomers} element={<OwnerRoute><OwnerCustomersPage /></OwnerRoute>} />
        <Route path={ROUTES.ownerReviews} element={<OwnerRoute><OwnerReviewsPage /></OwnerRoute>} />
        <Route path={ROUTES.ownerProfile} element={<OwnerRoute><OwnerProfilePage /></OwnerRoute>} />
        <Route path={ROUTES.ownerSettings} element={<OwnerRoute><OwnerSettingsPage /></OwnerRoute>} />
        <Route path={ROUTES.ownerPassword} element={<OwnerRoute><OwnerPasswordPage /></OwnerRoute>} />
        <Route path={ROUTES.ownerEditProduct} element={<OwnerRoute><EditProductPage /></OwnerRoute>} />
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </Suspense>
  );
}
