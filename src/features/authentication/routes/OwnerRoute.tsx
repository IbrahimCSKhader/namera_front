import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { ROUTES } from '../../../shared/constants/routes';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';

type OwnerRouteProps = {
  children: ReactNode;
};

export function OwnerRoute({ children }: OwnerRouteProps) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user?.role === 'Owner' ? children : <Navigate to={ROUTES.customerProfile} replace />}
    </ProtectedRoute>
  );
}
