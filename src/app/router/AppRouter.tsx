import { Navigate, Route, Routes } from 'react-router-dom';
import { CustomerProfilePage } from '../../features/customer/pages/CustomerProfilePage';
import { LoginPage } from '../../features/authentication/pages/LoginPage';
import { RegisterPage } from '../../features/authentication/pages/RegisterPage';
import { CustomerRoute } from '../../features/authentication/routes/CustomerRoute';
import { OwnerRoute } from '../../features/authentication/routes/OwnerRoute';
import { OwnerLayout } from '../../shared/components/layout/OwnerLayout';
import { ROUTES } from '../../shared/constants/routes';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.login} replace />} />
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
                <p>تم تجهيز مسار المالك للحماية فقط، دون بناء ميزات الإدارة الآن.</p>
              </section>
            </OwnerLayout>
          </OwnerRoute>
        }
      />
      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}
