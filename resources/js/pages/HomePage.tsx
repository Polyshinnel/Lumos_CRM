import { Badge, Card, Grid, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconArrowUpRight, IconTrendingUp } from '@tabler/icons-react';
import { PageContent } from '../components/layout/PageContent';

export function HomePage() {
    const monthlyProfitPoints = [
        { x: 0, y: 74 },
        { x: 52, y: 68 },
        { x: 104, y: 55 },
        { x: 156, y: 58 },
        { x: 208, y: 42 },
        { x: 260, y: 38 },
    ];
    const chartPath = monthlyProfitPoints.map((point) => `${point.x},${point.y}`).join(' ');

    return (
        <PageContent title="Главная" hideTitle>
            <Grid gutter="md">
                <Grid.Col span={12}>
                    <Card withBorder radius="md" p="lg">
                        <Stack gap="xs">
                            <Text fw={600}>Текущие задачи</Text>
                            <Text c="dimmed">Новых задач нет.</Text>
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Card withBorder radius="md" p="lg">
                        <Stack gap="xs">
                            <Text fw={600}>Показатели</Text>
                            <Grid gutter="xs">
                                <Grid.Col span={6}>
                                    <Text size="sm" c="dimmed">
                                        Количество обращений
                                    </Text>
                                    <Text fw={700} size="lg">
                                        0
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text size="sm" c="dimmed">
                                        Количество замеров
                                    </Text>
                                    <Text fw={700} size="lg">
                                        0
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text size="sm" c="dimmed">
                                        Количество монтажей
                                    </Text>
                                    <Text fw={700} size="lg">
                                        0
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text size="sm" c="dimmed">
                                        Количество успешных сделок
                                    </Text>
                                    <Text fw={700} size="lg">
                                        0
                                    </Text>
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Card withBorder radius="md" p="lg">
                        <Stack gap="sm">
                            <Group justify="space-between" align="flex-start">
                                <div>
                                    <Text fw={600}>Прибыль за месяц</Text>
                                    <Text size="xl" fw={700}>
                                        0 ₽
                                    </Text>
                                </div>

                                <Badge color="teal" variant="light" leftSection={<IconArrowUpRight size={14} />}>
                                    0% к прошлому месяцу
                                </Badge>
                            </Group>

                            <Group gap="xs">
                                <ThemeIcon variant="light" color="teal" size="sm">
                                    <IconTrendingUp size={14} />
                                </ThemeIcon>
                                <Text size="sm" c="dimmed">
                                    Сравнение с предыдущим месяцем: 0 ₽
                                </Text>
                            </Group>

                            <svg width="100%" height="90" viewBox="0 0 260 80" role="img" aria-label="График прибыли">
                                <polyline
                                    fill="none"
                                    stroke="var(--mantine-color-blue-6)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    points={chartPath}
                                />
                            </svg>
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Card withBorder radius="md" p="lg">
                        <Stack gap="xs">
                            <Text fw={600}>Заказы в производстве</Text>
                            <Text c="dimmed">Новых заказов нет.</Text>
                        </Stack>
                    </Card>
                </Grid.Col>
            </Grid>
        </PageContent>
    );
}
