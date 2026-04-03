import { Anchor, Box, Breadcrumbs, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface PageContentProps {
    title: string;
    children: ReactNode;
    hideTitle?: boolean;
}

const routeNames: Record<string, string> = {
    '/': 'Главная',
    '/crm': 'CRM',
    '/clients': 'Клиенты',
    '/measurements': 'Замеры',
    '/installations': 'Монтажи',
    '/warehouse': 'Склад',
    '/settings/roles': 'Роли',
    '/settings/users': 'Пользователи',
};

export function PageContent({ title, children, hideTitle = false }: PageContentProps) {
    const location = useLocation();
    const currentPath = location.pathname;
    const currentPageTitle = routeNames[currentPath] ?? title;

    return (
        <Stack gap="sm">
            {currentPath !== '/' ? (
                <Breadcrumbs>
                    <Anchor component={Link} to="/">
                        Главная
                    </Anchor>
                    <Text>{currentPageTitle}</Text>
                </Breadcrumbs>
            ) : null}

            {!hideTitle ? (
                <Title order={2} mb="md">
                    {title}
                </Title>
            ) : null}

            <Box style={{ overflow: 'auto' }}>{children}</Box>
        </Stack>
    );
}
