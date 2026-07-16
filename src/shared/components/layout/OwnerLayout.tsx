import { type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/authentication/hooks/useAuth';
import { ROUTES } from '../../constants/routes';

type OwnerLayoutProps = {
  children: ReactNode;
};

export function OwnerLayout({ children }: OwnerLayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(ROUTES.login, { replace: true });
  }

  return (
    <main className="app-page owner-shell">
      <header className="app-header owner-header">
        <div>
          <p className="eyebrow">لوحة الإدارة</p>
          <h1>مرحبًا {user?.firstName}</h1>
        </div>
        <nav className="app-actions" aria-label="روابط صاحبة المتجر">
          <NavLink className="text-button" to={ROUTES.ownerDashboard}>
            الرئيسية
          </NavLink>
          <NavLink className="text-button" to={ROUTES.ownerProducts}>
            عرض المنتجات
          </NavLink>
          <NavLink className="text-button" to={ROUTES.ownerAddProduct}>
            إدارة المنتجات
          </NavLink>
          <Link className="text-button" to={ROUTES.home}>
            المتجر
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
