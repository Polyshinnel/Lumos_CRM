import { Anchor, Box, Breadcrumbs, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
    label: string;
    to?: string;
}

interface PageContentProps {
    title: string;
    children: ReactNode;
    hideTitle?: boolean;
    hideBreadcrumbs?: boolean;
    breadcrumbs?: BreadcrumbItem[];
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

export function PageContent({
    title,
    children,
    hideTitle = false,
    hideBreadcrumbs = false,
    breadcrumbs,
}: PageContentProps) {
    const location = useLocation();
    const currentPath = location.pathname;
    const currentPageTitle = routeNames[currentPath] ?? title;

    const renderBreadcrumbs = () => {
        if (hideBreadcrumbs || currentPath === '/') return null;

        if (breadcrumbs) {
            return (
                <Breadcrumbs>
                    {breadcrumbs.map((item, index) =>
                        item.to ? (
                            <Anchor key={index} component={Link} to={item.to}>
                                {item.label}
                            </Anchor>
                        ) : (
                            <Text key={index}>{item.label}</Text>
                        ),
                    )}
                </Breadcrumbs>
            );
        }

        return (
            <Breadcrumbs>
                <Anchor component={Link} to="/">
                    Главная
                </Anchor>
                <Text>{currentPageTitle}</Text>
            </Breadcrumbs>
        );
    };

    return (
        <Stack gap="sm">
            {renderBreadcrumbs()}

            {!hideTitle ? (
                <Title order={2} mb="md">
                    {title}
                </Title>
            ) : null}

            <Box style={{ overflow: 'hidden' }}>{children}</Box>
        </Stack>
    );
}
