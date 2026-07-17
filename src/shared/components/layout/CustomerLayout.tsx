import { type ReactNode } from 'react';

type CustomerLayoutProps = {
  children: ReactNode;
};

export function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <main className="app-page">
      <div className="app-content">{children}</div>
    </main>
  );
}
