import { Card, Container, Stack, Title } from '@mantine/core';

import { LoginForm } from '../features/auth/components/LoginForm';

export function LoginPage() {
    return (
        <Container size="xs" py="xl">
            <Card withBorder radius="md" p="lg">
                <Stack gap="md">
                    <Title order={2} ta="center">
                        Вход в систему
                    </Title>
                    <LoginForm />
                </Stack>
            </Card>
        </Container>
    );
}
