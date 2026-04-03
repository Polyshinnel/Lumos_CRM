import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';

import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

export function AppLayout() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <AppHeader burgerOpened={opened} onBurgerClick={toggle} />
            </AppShell.Header>

            <AppShell.Navbar>
                <AppSidebar />
            </AppShell.Navbar>

            <AppShell.Main style={{ overflow: 'auto' }}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
