// components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/Authcontext';
import { useUser } from './contexts/UserContext';

const PrivateRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: ('USER' | 'ADMIN')[];
}) => {
  const { isAuthenticated } = useAuth();
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated || !user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
