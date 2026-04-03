import { Badge, Box, Button, Card, Divider, Group, Stack, Text } from '@mantine/core';
import {
    IconBan,
    IconCash,
    IconTrash,
} from '@tabler/icons-react';

import type { DealInfo } from './deal.types';
import { stageLabels } from './deal.types';

interface DealInfoCardProps {
    deal: DealInfo;
}

const stageColors: Record<string, string> = {
    new: 'blue',
    call: 'cyan',
    measurement: 'violet',
    production: 'orange',
    installation: 'green',
};

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <Group gap={4} wrap="nowrap" align="flex-start">
            <Text size="sm" c="dimmed" style={{ minWidth: 130, flexShrink: 0 }}>
                {label}:
            </Text>
            <Text size="sm" style={{ wordBreak: 'break-word' }}>
                {value}
            </Text>
        </Group>
    );
}

export function DealInfoCard({ deal }: DealInfoCardProps) {
    return (
        <Card withBorder radius="md" p="lg" style={{ height: '100%' }}>
            <Stack gap="md" style={{ height: '100%' }}>
                <Box style={{ flex: 1 }}>
                    <Stack gap="md">
                        <Group justify="space-between" align="center">
                            <Text fw={700} size="lg">
                                Сделка #{deal.id}
                            </Text>
                            <Badge color={stageColors[deal.stage] ?? 'gray'} variant="filled" size="lg">
                                {stageLabels[deal.stage]}
                            </Badge>
                        </Group>

                        <Divider />

                        <Stack gap="xs">
                            <Text fw={600} size="sm" c="dimmed" tt="uppercase">
                                Сведения о клиенте
                            </Text>
                            <InfoRow label="ФИО" value={deal.clientName} />
                            <InfoRow label="Телефон" value={deal.phone} />
                            <InfoRow label="Адрес" value={deal.address} />
                            <InfoRow label="Паспорт" value={deal.passport} />
                            <InfoRow label="Источник" value={deal.source} />
                            <InfoRow label="Менеджер" value={deal.responsibleManager} />
                            <InfoRow label="Сумма сделки" value={`${deal.dealSum.toLocaleString('ru-RU')} ₽`} />
                        </Stack>

                        {deal.measurerName && deal.measurementDate ? (
                            <>
                                <Divider />
                                <Stack gap="xs">
                                    <Text fw={600} size="sm" c="dimmed" tt="uppercase">
                                        Замер
                                    </Text>
                                    <InfoRow label="Замерщик" value={deal.measurerName} />
                                    <InfoRow label="Дата замера" value={deal.measurementDate} />
                                </Stack>
                            </>
                        ) : null}

                        {deal.installerName && deal.installationDate ? (
                            <>
                                <Divider />
                                <Stack gap="xs">
                                    <Text fw={600} size="sm" c="dimmed" tt="uppercase">
                                        Монтаж
                                    </Text>
                                    <InfoRow label="Монтажник" value={deal.installerName} />
                                    <InfoRow label="Дата монтажа" value={deal.installationDate} />
                                </Stack>
                            </>
                        ) : null}
                    </Stack>
                </Box>

                <Divider />

                <Group grow>
                    <Button variant="outline" color="red" leftSection={<IconBan size={16} />}>
                        Отказ
                    </Button>
                    <Button color="red" leftSection={<IconTrash size={16} />}>
                        Удалить
                    </Button>
                    <Button color="green" leftSection={<IconCash size={16} />}>
                        Получены деньги
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
}
