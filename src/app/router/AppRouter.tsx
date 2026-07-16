import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../../features/authentication/pages/LoginPage';
import { RegisterPage } from '../../features/authentication/pages/RegisterPage';
import { CustomerRoute } from '../../features/authentication/routes/CustomerRoute';
import { OwnerRoute } from '../../features/authentication/routes/OwnerRoute';
import { CustomerDashboardPage } from '../../features/customer/pages/CustomerDashboardPage';
import { CustomerProfilePage } from '../../features/customer/pages/CustomerProfilePage';
import { OwnerDashboardPage } from '../../features/owner/pages/OwnerDashboardPage';
import { AddProductPage } from '../../features/products/admin/pages/AddProductPage';
import { EditProductPage } from '../../features/products/admin/pages/EditProductPage';
import { ProductsManagementPage } from '../../features/products/admin/pages/ProductsManagementPage';
import { HomePage } from '../../features/public/pages/HomePage';
import { ROUTES } from '../../shared/constants/routes';

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />
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
        path={ROUTES.ownerAddProduct}
        element={
          <OwnerRoute>
            <AddProductPage />
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
