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
      <section className="brand-header" aria-label="Namira handmade gifts">
        <div className="brand-mark">N</div>
        <h1>Namira</h1>
        <p>
          {
            '\u0647\u062f\u0627\u064a\u0627 \u064a\u062f\u0648\u064a\u0629 \u0645\u0635\u0646\u0648\u0639\u0629 \u0628\u0639\u0646\u0627\u064a\u0629 \u0648\u062a\u0641\u0627\u0635\u064a\u0644 \u062f\u0627\u0641\u0626\u0629'
          }
        </p>
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
