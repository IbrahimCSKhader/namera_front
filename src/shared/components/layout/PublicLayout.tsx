import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

type PublicLayoutProps = {
  title: string;
  subtitle: string;
  sideTitle: string;
  children: ReactNode;
};

export function PublicLayout({ title, subtitle, sideTitle, children }: PublicLayoutProps) {
  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <Link className="site-logo" to={ROUTES.home}>
          <span className="site-logo-mark">N</span>
          <span>Namira Gifts</span>
        </Link>
        <Link to={ROUTES.home}>العودة للرئيسية</Link>
      </div>
      <section className="brand-header" aria-label="Namira handmade gifts">
        <div className="brand-mark">N</div>
        <h1>Namira</h1>
        <p>هدايا يدوية مصنوعة بعناية وتفاصيل دافئة</p>
      </section>
      <section className="auth-shell">
        <aside className="auth-art" aria-hidden="true">
          <span>{sideTitle}</span>
        </aside>
        <section className="auth-card">
          <div className="auth-card-heading">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          {children}
        </section>
      </section>
    </main>
  );
}
