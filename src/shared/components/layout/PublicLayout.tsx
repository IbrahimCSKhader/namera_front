import { type ReactNode } from 'react';
import { BRAND } from '../../constants/brand';

type PublicLayoutProps = {
  title: string;
  subtitle: string;
  sideTitle: string;
  children: ReactNode;
};

export function PublicLayout({ title, subtitle, sideTitle, children }: PublicLayoutProps) {
  return (
    <main className="auth-page">
      <section className="brand-header" aria-label={`${BRAND.name} store`}>
        <img className="brand-logo-image" src={BRAND.logoUrl} alt={BRAND.name} />
        <h1>{BRAND.name}</h1>
        <p>{BRAND.tagline}</p>
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
