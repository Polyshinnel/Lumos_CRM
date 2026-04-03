import { Card, Container, Stack, Title } from '@mantine/core';

import { RegisterForm } from '../features/auth/components/RegisterForm';

export function RegisterPage() {
    return (
        <Container size="xs" py="xl">
            <Card withBorder radius="md" p="lg">
                <Stack gap="md">
                    <Title order={2} ta="center">
                        Регистрация
                    </Title>
                    <RegisterForm />
                </Stack>
            </Card>
        </Container>
    );
}
