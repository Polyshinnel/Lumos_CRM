import { Navigate } from 'react-router-dom';

import { useAuthStore } from '../features/auth/store/useAuthStore';
import { AppLayout } from './layout/AppLayout';

export function PrivateRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <AppLayout />;
}
