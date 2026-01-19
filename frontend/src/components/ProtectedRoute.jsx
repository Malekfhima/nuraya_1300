import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../context/StoreContext';

const ProtectedRoute = ({ children }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
