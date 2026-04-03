import { Box, Code, NavLink, ScrollArea, Text } from '@mantine/core';
import {
    IconHome2,
    IconLayoutDashboard,
    IconUsersGroup,
    IconRulerMeasure,
    IconTools,
    IconPackage,
    IconSettings,
    IconShieldCheck,
    IconUserCog,
} from '@tabler/icons-react';
import type { ComponentType } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
    label: string;
    icon: ComponentType<{ size?: number | string; stroke?: number | string }>;
    path?: string;
    children?: NavItem[];
}

const navigation: NavItem[] = [
    { label: 'Главная', icon: IconHome2, path: '/' },
    { label: 'CRM', icon: IconLayoutDashboard, path: '/crm' },
    { label: 'Клиенты', icon: IconUsersGroup, path: '/clients' },
    { label: 'Замеры', icon: IconRulerMeasure, path: '/measurements' },
    { label: 'Монтажи', icon: IconTools, path: '/installations' },
    { label: 'Склад', icon: IconPackage, path: '/warehouse' },
];

const settingsNavigation: NavItem = {
    label: 'Настройки',
    icon: IconSettings,
    children: [
        { label: 'Роли', icon: IconShieldCheck, path: '/settings/roles' },
        { label: 'Пользователи', icon: IconUserCog, path: '/settings/users' },
    ],
};

function isNavItemActive(item: NavItem, pathname: string): boolean {
    if (item.path && pathname === item.path) {
        return true;
    }

    return item.children?.some((child) => isNavItemActive(child, pathname)) ?? false;
}

function renderNavItem(item: NavItem, pathname: string, keyPrefix = '') {
    const key = `${keyPrefix}${item.label}`;

    if (item.path) {
        return (
            <NavLink
                key={key}
                component={Link}
                to={item.path}
                label={item.label}
                leftSection={<item.icon size={20} stroke={1.5} />}
                active={isNavItemActive(item, pathname)}
            >
                {item.children?.map((child) => renderNavItem(child, pathname, `${key}-`))}
            </NavLink>
        );
    }

    return (
        <NavLink
            key={key}
            label={item.label}
            leftSection={<item.icon size={20} stroke={1.5} />}
            active={isNavItemActive(item, pathname)}
            defaultOpened={isNavItemActive(item, pathname)}
        >
            {item.children?.map((child) => renderNavItem(child, pathname, `${key}-`))}
        </NavLink>
    );
}

const APP_VERSION = 'v1.0.0';

export function AppSidebar() {
    const location = useLocation();

    return (
        <Box h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
            <ScrollArea scrollbarSize={6} style={{ flex: 1 }}>
                <Box p="sm">
                    {navigation.map((item) => renderNavItem(item, location.pathname))}
                </Box>
            </ScrollArea>

            <Box p="sm" pt={0}>
                {renderNavItem(settingsNavigation, location.pathname)}

                <Text size="xs" c="dimmed" mb={4}>
                    Версия
                </Text>
                <Code>{APP_VERSION}</Code>
            </Box>
        </Box>
    );
}
