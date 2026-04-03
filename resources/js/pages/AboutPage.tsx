import { Link } from 'react-router-dom';
import { Button, Group, Stack, Text } from '@mantine/core';
import { IconBrandLaravel } from '@tabler/icons-react';
import { PageContent } from '../components/layout/PageContent';

export function AboutPage() {
    return (
        <PageContent title="О системе">
            <Stack gap="sm">
                <Group>
                    <IconBrandLaravel size={20} />
                    <Text fw={600}>About</Text>
                </Group>
                <Text c="dimmed">Маршрутизация работает через react-router-dom и BrowserRouter.</Text>
                <Button component={Link} to="/" variant="light">
                    На главную
                </Button>
            </Stack>
        </PageContent>
    );
}
