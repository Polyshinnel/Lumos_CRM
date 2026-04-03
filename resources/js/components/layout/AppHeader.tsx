import { ActionIcon, Burger, Group, Stack, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconCrown, IconHelmet, IconLogout, IconUser } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../features/auth/store/useAuthStore';
import type { UserRole } from '../../features/auth/types/auth.types';

interface AppHeaderProps {
    burgerOpened: boolean;
    onBurgerClick: () => void;
}

const roleLabels: Record<UserRole, string> = {
    user: 'Пользователь',
    admin: 'Администратор',
};

export function AppHeader({ burgerOpened, onBurgerClick }: AppHeaderProps) {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const userRole: UserRole = user?.role ?? 'user';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
                <Burger hiddenFrom="sm" opened={burgerOpened} onClick={onBurgerClick} size="sm" aria-label="Открыть меню" />

                <UnstyledButton
                    component={Link}
                    to="/"
                    style={{
                        borderRadius: 8,
                        padding: '4px 8px',
                    }}
                >
                    <Group gap="xs" wrap="nowrap">
                        <IconHelmet size={22} />
                        <Text fw={700} size="lg">
                            Lumos CRM
                        </Text>
                    </Group>
                </UnstyledButton>
            </Group>

            <Group gap="xs" wrap="nowrap">
                <Group gap="xs" wrap="nowrap">
                    <IconUser size={18} />
                    <Stack gap={0} visibleFrom="sm">
                        <Text size="sm" fw={500}>
                            {user?.name ?? 'Пользователь'}
                        </Text>
                        <Group gap={4} wrap="nowrap">
                            <Text size="xs" c="dimmed">
                                {roleLabels[userRole]}
                            </Text>
                            {userRole === 'admin' ? <IconCrown size={14} color="var(--mantine-color-yellow-6)" /> : null}
                        </Group>
                    </Stack>
                </Group>

                <Tooltip label="Выход">
                    <ActionIcon variant="subtle" onClick={handleLogout} aria-label="Выйти">
                        <IconLogout size={18} />
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Group>
    );
}
