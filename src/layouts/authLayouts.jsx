import React from 'react';

import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthLayouts() {
  const { token } = useAuth();

  if (token) {
    return <Navigate to={'/admin/dashboard'} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
