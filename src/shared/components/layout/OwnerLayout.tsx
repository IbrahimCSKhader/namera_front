import { type ReactNode } from 'react';
import { useAuth } from '../../../features/authentication/hooks/useAuth';

type OwnerLayoutProps = {
  children: ReactNode;
};

export function OwnerLayout({ children }: OwnerLayoutProps) {
  const { logout, user } = useAuth();

  return (
    <main className="app-page">
      <header className="app-header">
        <div>
          <p className="eyebrow">لوحة الإدارة</p>
          <h1>مرحباً {user?.firstName}</h1>
        </div>
        <button className="text-button" type="button" onClick={logout}>
          تسجيل الخروج
        </button>
      </header>
      <div className="app-content">{children}</div>
    </main>
  );
}
