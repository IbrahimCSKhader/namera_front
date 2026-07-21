import { type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../features/authentication/context/AuthContext';
import { AppFooter } from '../../shared/components/layout/AppFooter';
import { AppHeader } from '../../shared/components/layout/AppHeader';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppHeader />
        {children}
        <AppFooter />
      </AuthProvider>
    </BrowserRouter>
  );
}
