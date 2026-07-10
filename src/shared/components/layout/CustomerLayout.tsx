import { type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { ROUTES } from '../../constants/routes';

type CustomerLayoutProps = {
  children: ReactNode;
};

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTES.login, { replace: true });
  }

  return (
    <main className="app-page">
      <header className="app-header">
        <div>
          <p className="eyebrow">حساب الزبون</p>
          <h1>مرحبًا {user?.firstName}</h1>
        </div>
        <nav className="app-actions" aria-label="روابط الزبون">
          <Link className="text-button" to={ROUTES.customerDashboard}>
            الداشبورد
          </Link>
          <Link className="text-button" to={ROUTES.customerProfile}>
            الملف الشخصي
          </Link>
          <button className="text-button" type="button" onClick={handleLogout}>
            تسجيل الخروج
          </button>
        </nav>
      </header>
      <div className="app-content">{children}</div>
    </main>
  );
}
