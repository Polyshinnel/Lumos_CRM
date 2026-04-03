import { Link } from 'react-router-dom';
import { Button, Stack, Text } from '@mantine/core';
import { PageContent } from '../components/layout/PageContent';

export function HomePage() {
    return (
        <PageContent title="Главная">
            <Stack gap="sm">
                <Text c="dimmed">React + TypeScript + Mantine успешно подключены в Laravel через Vite.</Text>
                <Button component={Link} to="/crm" variant="light">
                    Перейти в CRM
                </Button>
            </Stack>
        </PageContent>
    );
}
