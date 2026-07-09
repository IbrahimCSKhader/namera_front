import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../../features/authentication/pages/LoginPage';
import { RegisterPage } from '../../features/authentication/pages/RegisterPage';
import { CustomerRoute } from '../../features/authentication/routes/CustomerRoute';
import { OwnerRoute } from '../../features/authentication/routes/OwnerRoute';
import { CustomerProfilePage } from '../../features/customer/pages/CustomerProfilePage';
import { HomePage } from '../../features/public/pages/HomePage';
import { OwnerLayout } from '../../shared/components/layout/OwnerLayout';
import { ROUTES } from '../../shared/constants/routes';

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.register} element={<RegisterPage />} />
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
            <OwnerLayout>
              <section className="placeholder-page">
                <p className="eyebrow">قريباً</p>
                <h1>لوحة المالك قيد التحضير</h1>
                <p>تم تجهيز مسار المالك للحماية فقط، وسيتم بناء ميزات الإدارة لاحقاً.</p>
              </section>
            </OwnerLayout>
          </OwnerRoute>
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  );
}
