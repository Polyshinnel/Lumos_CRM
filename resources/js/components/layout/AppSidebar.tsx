import { Box, Code, NavLink, ScrollArea, Text } from '@mantine/core';
import { IconHome2, IconInfoCircle } from '@tabler/icons-react';
import type { ComponentType } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
    label: string;
    icon: ComponentType<{ size?: number | string; stroke?: number | string }>;
    path: string;
    children?: NavItem[];
}

const navigation: NavItem[] = [
    { label: 'Главная', icon: IconHome2, path: '/' },
    { label: 'О системе', icon: IconInfoCircle, path: '/about' },
];

const APP_VERSION = 'v1.0.0';

export function AppSidebar() {
    const location = useLocation();

    return (
        <Box h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
            <ScrollArea scrollbarSize={6} style={{ flex: 1 }}>
                <Box p="sm">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.path}
                            component={Link}
                            to={item.path}
                            label={item.label}
                            leftSection={<item.icon size={20} stroke={1.5} />}
                            active={location.pathname === item.path}
                        />
                    ))}
                </Box>
            </ScrollArea>

            <Box p="sm" pt={0}>
                <Text size="xs" c="dimmed" mb={4}>
                    Версия
                </Text>
                <Code>{APP_VERSION}</Code>
            </Box>
        </Box>
    );
}
