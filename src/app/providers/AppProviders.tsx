import { type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../features/authentication/context/AuthContext';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}
