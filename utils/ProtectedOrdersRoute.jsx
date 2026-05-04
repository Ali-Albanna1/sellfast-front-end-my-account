import React from 'react';
import { Navigate } from 'react-router';

function ProtectedOrdersRoute({user, children}) {
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

export default ProtectedOrdersRoute