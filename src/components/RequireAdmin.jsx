import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function RequireAdmin({ children }) {
  const auth = useAuth();
  
  if (!auth.isLoggedIn) {
    return <Navigate to="/admin" />;
  }
  
  if (!auth.isAdmin) {
    return <Navigate to="/admin" />;
  }
  
  return children;
}

export default RequireAdmin;
