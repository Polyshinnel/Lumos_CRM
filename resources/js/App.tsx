import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, LoadingOverlay } from '@mantine/core';

import { PrivateRoute } from './components/PrivateRoute';
import { useAuthStore } from './features/auth/store/useAuthStore';
import { ClientsPage } from './pages/ClientsPage';
import { CrmPage } from './pages/CrmPage';
import { DealPage } from './pages/DealPage';
import { HomePage } from './pages/HomePage';
import { InstallationsPage } from './pages/InstallationsPage';
import { LoginPage } from './pages/LoginPage';
import { MeasurementsPage } from './pages/MeasurementsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RegisterPage } from './pages/RegisterPage';
import { RolesPage } from './pages/RolesPage';
import { UsersPage } from './pages/UsersPage';
import { WarehousePage } from './pages/WarehousePage';

function RouteTitle() {
    const { pathname } = useLocation();

    useEffect(() => {
        const titleByPath: Record<string, string> = {
            '/': '🏠 Lumos CRM',
            '/crm': 'CRM',
            '/clients': 'Клиенты',
            '/measurements': 'Замеры',
            '/installations': 'Монтажи',
            '/warehouse': 'Склад',
            '/settings/roles': 'Роли',
            '/settings/users': 'Пользователи',
            '/login': 'Вход в систему',
            '/register': 'Регистрация',
        };

        if (pathname.startsWith('/crm/deals/')) {
            document.title = 'Сделка';
            return;
        }

        document.title = titleByPath[pathname] ?? 'Страница не найдена';
    }, [pathname]);

    return null;
}

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
            <RouteTitle />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/crm" element={<CrmPage />} />
                    <Route path="/crm/deals/:dealId" element={<DealPage />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/measurements" element={<MeasurementsPage />} />
                    <Route path="/installations" element={<InstallationsPage />} />
                    <Route path="/warehouse" element={<WarehousePage />} />
                    <Route path="/settings/roles" element={<RolesPage />} />
                    <Route path="/settings/users" element={<UsersPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Box>
    );
}
