import { type ReactNode } from 'react';

type OwnerLayoutProps = {
  children: ReactNode;
};

export function OwnerLayout({ children }: OwnerLayoutProps) {
  return (
    <main className="app-page owner-shell">
      <div className="app-content">{children}</div>
    </main>
  );
}
