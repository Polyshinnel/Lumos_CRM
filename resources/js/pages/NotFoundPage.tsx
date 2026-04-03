import { Link } from 'react-router-dom';
import { Button, Card, Container, Stack, Text, Title } from '@mantine/core';

export function NotFoundPage() {
    return (
        <Container size="sm" py="xl">
            <Card withBorder radius="md" p="lg">
                <Stack gap="sm" align="center">
                    <Title order={2}>404</Title>
                    <Text c="dimmed" ta="center">
                        Страница не найдена или была перемещена.
                    </Text>
                    <Button component={Link} to="/" variant="light">
                        На главную
                    </Button>
                </Stack>
            </Card>
        </Container>
    );
}
