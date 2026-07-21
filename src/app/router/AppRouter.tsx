import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../../features/authentication/pages/LoginPage';
import { RegisterPage } from '../../features/authentication/pages/RegisterPage';
import { CustomerRoute } from '../../features/authentication/routes/CustomerRoute';
import { OwnerRoute } from '../../features/authentication/routes/OwnerRoute';
import { CustomerAddressesPage } from '../../features/customer/pages/CustomerAddressesPage';
import { CustomerDashboardPage } from '../../features/customer/pages/CustomerDashboardPage';
import { CustomerProfilePage } from '../../features/customer/pages/CustomerProfilePage';
import { CustomerReviewsPage } from '../../features/customer/pages/CustomerReviewsPage';
import { OwnerDashboardPage } from '../../features/owner/pages/OwnerDashboardPage';
import { OwnerPasswordPage } from '../../features/owner/pages/OwnerPasswordPage';
import { OwnerProfilePage } from '../../features/owner/pages/OwnerProfilePage';
import { OwnerReviewsPage } from '../../features/owner/pages/OwnerReviewsPage';
import { OwnerSettingsPage } from '../../features/owner/pages/OwnerSettingsPage';
import { CartPage } from '../../features/orders/pages/CartPage';
import { CustomerOrdersPage } from '../../features/orders/pages/CustomerOrdersPage';
import { OwnerCustomersPage } from '../../features/orders/pages/OwnerCustomersPage';
import { OwnerOrdersPage } from '../../features/orders/pages/OwnerOrdersPage';
import { AddProductPage } from '../../features/products/admin/pages/AddProductPage';
import { CategoriesManagementPage } from '../../features/products/admin/pages/CategoriesManagementPage';
import { EditProductPage } from '../../features/products/admin/pages/EditProductPage';
import { ProductsManagementPage } from '../../features/products/admin/pages/ProductsManagementPage';
import { ProductDetailsPage } from '../../features/products/pages/ProductDetailsPage';
import { ProductsPage } from '../../features/products/pages/ProductsPage';
import { AboutPage } from '../../features/public/pages/AboutPage';
import { HomePage } from '../../features/public/pages/HomePage';
import { StaticPage } from '../../features/public/pages/StaticPage';
import { ROUTES } from '../../shared/constants/routes';

export function AppRouter() {
  return (
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
      <Route
        path={ROUTES.customerDashboard}
        element={
          <CustomerRoute>
            <CustomerDashboardPage />
          </CustomerRoute>
        }
      />
      <Route
        path={ROUTES.customerProfile}
        element={
          <CustomerRoute>
            <CustomerProfilePage />
          </CustomerRoute>
        }
      />
      <Route
        path={ROUTES.customerOrders}
        element={
          <CustomerRoute>
            <CustomerOrdersPage />
          </CustomerRoute>
        }
      />
      <Route
        path={ROUTES.customerReviews}
        element={
          <CustomerRoute>
            <CustomerReviewsPage />
          </CustomerRoute>
        }
      />
      <Route
        path={ROUTES.customerAddresses}
        element={
          <CustomerRoute>
            <CustomerAddressesPage />
          </CustomerRoute>
        }
      />
      <Route
        path={ROUTES.ownerDashboard}
        element={
          <OwnerRoute>
            <OwnerDashboardPage />
          </OwnerRoute>
        }
      />
      <Route
        path={ROUTES.ownerProducts}
        element={
          <OwnerRoute>
            <ProductsManagementPage />
          </OwnerRoute>
        }
      />
      <Route
        path={ROUTES.ownerOrders}
        element={
          <OwnerRoute>
            <OwnerOrdersPage />
          </OwnerRoute>
        }
      />
      <Route
        path={ROUTES.ownerAddProduct}
        element={
          <OwnerRoute>
            <AddProductPage />
          </OwnerRoute>
        }
      />
      <Route
        path={ROUTES.ownerCategories}
        element={
          <OwnerRoute>
            <CategoriesManagementPage />
          </OwnerRoute>
        }
      />
      <Route
        path={ROUTES.ownerCustomers}
        element={
          <OwnerRoute>
            <OwnerCustomersPage />
          </OwnerRoute>
        }
      />
      <Route
        path={ROUTES.ownerReviews}
        element={
          <OwnerRoute>
            <OwnerReviewsPage />
          </OwnerRoute>
        }
      />
      <Route
        path={ROUTES.ownerProfile}
        element={
          <OwnerRoute>
            <OwnerProfilePage />
          </OwnerRoute>
        }
      />
      <Route
        path={ROUTES.ownerSettings}
        element={
          <OwnerRoute>
            <OwnerSettingsPage />
          </OwnerRoute>
        }
      />
      <Route
        path={ROUTES.ownerPassword}
        element={
          <OwnerRoute>
            <OwnerPasswordPage />
          </OwnerRoute>
        }
      />
      <Route
        path={ROUTES.ownerEditProduct}
        element={
          <OwnerRoute>
            <EditProductPage />
          </OwnerRoute>
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  );
}
