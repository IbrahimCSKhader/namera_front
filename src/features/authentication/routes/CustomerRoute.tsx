import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { ROUTES } from '../../../shared/constants/routes';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';

type CustomerRouteProps = {
  children: ReactNode;
};

export function CustomerRoute({ children }: CustomerRouteProps) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user?.role === 'Customer' ? children : <Navigate to={ROUTES.ownerDashboard} replace />}
    </ProtectedRoute>
  );
}
