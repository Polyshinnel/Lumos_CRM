import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, LoadingOverlay } from '@mantine/core';

import { PrivateRoute } from './components/PrivateRoute';
import { useAuthStore } from './features/auth/store/useAuthStore';
import { AboutPage } from './pages/AboutPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RegisterPage } from './pages/RegisterPage';

export function App() {
    const { token, loadUser } = useAuthStore();
    const [isInitializing, setIsInitializing] = useState(Boolean(token));

    useEffect(() => {
        let isMounted = true;

        const initialize = async () => {
            if (!token) {
                setIsInitializing(false);
                return;
            }

            try {
                await loadUser();
            } finally {
                if (isMounted) {
                    setIsInitializing(false);
                }
            }
        };

        void initialize();

        return () => {
            isMounted = false;
        };
    }, [loadUser, token]);

    return (
        <Box pos="relative" mih="100vh">
            <LoadingOverlay visible={isInitializing} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Box>
    );
}
