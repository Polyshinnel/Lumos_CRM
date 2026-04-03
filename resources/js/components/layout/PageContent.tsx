import { Anchor, Box, Breadcrumbs, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface PageContentProps {
    title: string;
    children: ReactNode;
}

const routeNames: Record<string, string> = {
    '/': 'Главная',
    '/about': 'О системе',
    '/dashboard': 'Показатели',
};

export function PageContent({ title, children }: PageContentProps) {
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

            <Title order={2} mb="md">
                {title}
            </Title>

            <Box style={{ overflow: 'auto' }}>{children}</Box>
        </Stack>
    );
}
