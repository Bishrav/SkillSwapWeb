import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = ({ isAuthenticated }) => {
    return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;
