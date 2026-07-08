import { type ReactNode } from 'react';

type PublicLayoutProps = {
  title: string;
  subtitle: string;
  sideTitle: string;
  children: ReactNode;
};

export function PublicLayout({ title, subtitle, sideTitle, children }: PublicLayoutProps) {
  return (
    <main className="auth-page">
      <section className="brand-header" aria-label="نميرة">
        <div className="brand-mark">ن</div>
        <h1>نميرة</h1>
        <p>فن الريزن بلمسة عصرية فاخرة</p>
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
