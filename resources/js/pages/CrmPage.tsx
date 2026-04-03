import { Badge, Card, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconBuildingFactory2, IconClockHour4, IconRulerMeasure } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { PageContent } from '../components/layout/PageContent';

type CrmStage = 'new' | 'call' | 'measurement' | 'production' | 'installation';

interface DealCard {
    id: number;
    stage: CrmStage;
    phone: string;
    createdAt: string;
    clientName?: string;
    measurerName?: string;
    measurementDate?: string;
    installerName?: string;
    installationDate?: string;
}

interface StageColumn {
    id: CrmStage;
    title: string;
}

const stageColumns: StageColumn[] = [
    { id: 'new', title: 'Новые обращения' },
    { id: 'call', title: 'Созвон с клиентом' },
    { id: 'measurement', title: 'Назначен замер' },
    { id: 'production', title: 'Отправлено в производство' },
    { id: 'installation', title: 'Назначен монтаж' },
];

const mockDeals: DealCard[] = [
    { id: 1, stage: 'new', phone: '+79999999999', createdAt: '03.04.2026, 09:15' },
    { id: 2, stage: 'new', phone: '+79998887766', createdAt: '03.04.2026, 11:02' },
    {
        id: 3,
        stage: 'call',
        clientName: 'Петров Дмитрий Алексеевич',
        phone: '+79991234567',
        createdAt: '02.04.2026, 16:42',
    },
    {
        id: 4,
        stage: 'measurement',
        clientName: 'Смирнова Елена Павловна',
        phone: '+79995554433',
        createdAt: '01.04.2026, 13:25',
        measurerName: 'Иванов Сергей',
        measurementDate: '05.04.2026, 12:00',
    },
    {
        id: 5,
        stage: 'production',
        clientName: 'Николаев Артем Викторович',
        phone: '+79997776655',
        createdAt: '31.03.2026, 10:10',
    },
    {
        id: 6,
        stage: 'installation',
        clientName: 'Козлова Марина Игоревна',
        phone: '+79990001122',
        createdAt: '29.03.2026, 08:50',
        installerName: 'Орлов Михаил',
        installationDate: '06.04.2026, 15:30',
    },
];

function DealItem({ deal }: { deal: DealCard }) {
    const isNewLead = deal.stage === 'new';

    return (
        <Card
            component={Link}
            to={`/crm/deals/${deal.id}`}
            withBorder
            radius="md"
            p="sm"
            bg="var(--mantine-color-body)"
            style={{ textDecoration: 'none' }}
        >
            <Stack gap={6}>
                {!isNewLead ? (
                    <Group justify="space-between" align="center">
                        <Text fw={600} size="sm">
                            Сделка #{deal.id}
                        </Text>
                        <Badge variant="light" color="gray">
                            {deal.createdAt}
                        </Badge>
                    </Group>
                ) : null}

                {!isNewLead && deal.clientName ? (
                    <Text size="sm">
                        <Text component="span" c="dimmed">
                            Клиент:{' '}
                        </Text>
                        {deal.clientName}
                    </Text>
                ) : null}

                <Text size="sm">
                    <Text component="span" c="dimmed">
                        Телефон:{' '}
                    </Text>
                    {deal.phone}
                </Text>

                {isNewLead ? (
                    <Group gap={6} c="dimmed">
                        <IconClockHour4 size={14} />
                        <Text size="xs">Создана: {deal.createdAt}</Text>
                    </Group>
                ) : null}

                {deal.stage === 'measurement' && deal.measurerName && deal.measurementDate ? (
                    <Group gap={8} align="flex-start" wrap="nowrap">
                        <ThemeIcon variant="light" color="blue" size="sm" mt={2}>
                            <IconRulerMeasure size={14} />
                        </ThemeIcon>
                        <Stack gap={2}>
                            <Text size="xs">{deal.measurerName}</Text>
                            <Text size="xs" c="dimmed">
                                Замер: {deal.measurementDate}
                            </Text>
                        </Stack>
                    </Group>
                ) : null}

                {deal.stage === 'installation' && deal.installerName && deal.installationDate ? (
                    <Group gap={8} align="flex-start" wrap="nowrap">
                        <ThemeIcon variant="light" color="orange" size="sm" mt={2}>
                            <IconBuildingFactory2 size={14} />
                        </ThemeIcon>
                        <Stack gap={2}>
                            <Text size="xs">{deal.installerName}</Text>
                            <Text size="xs" c="dimmed">
                                Монтаж: {deal.installationDate}
                            </Text>
                        </Stack>
                    </Group>
                ) : null}
            </Stack>
        </Card>
    );
}

export function CrmPage() {
    const dealsByStage = stageColumns.map((column) => ({
        ...column,
        deals: mockDeals.filter((deal) => deal.stage === column.id),
    }));

    return (
        <PageContent title="CRM" hideTitle hideBreadcrumbs>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 5 }} spacing="md">
                {dealsByStage.map((column) => (
                    <Paper key={column.id} withBorder radius="md" p="md" bg="var(--mantine-color-gray-0)">
                        <Stack gap="sm">
                            <Group justify="space-between">
                                <Text fw={700} size="sm">
                                    {column.title}
                                </Text>
                                <Badge variant="filled" color="dark">
                                    {column.deals.length}
                                </Badge>
                            </Group>

                            <Stack gap="xs">
                                {column.deals.map((deal) => (
                                    <DealItem key={deal.id} deal={deal} />
                                ))}
                            </Stack>
                        </Stack>
                    </Paper>
                ))}
            </SimpleGrid>
        </PageContent>
    );
}
