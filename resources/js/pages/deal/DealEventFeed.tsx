import { Box, Button, Card, Group, Image, Paper, ScrollArea, Stack, Table, Text, ThemeIcon } from '@mantine/core';
import { useEffect, useRef } from 'react';
import {
    IconArrowsExchange,
    IconChecklist,
    IconEdit,
    IconFileSpreadsheet,
    IconFileText,
    IconFileTypePdf,
    IconMessage,
    IconPackages,
    IconPhoto,
    IconPlayerPlay,
    IconRulerMeasure,
    IconTool,
    IconUserEdit,
} from '@tabler/icons-react';

import type { AttachmentFileType, DealEvent } from './deal.types';

interface DealEventFeedProps {
    events: DealEvent[];
}

function EventTimestamp({ timestamp }: { timestamp: string }) {
    return (
        <Text size="xs" c="dimmed">
            {timestamp}
        </Text>
    );
}

function StatusChangeCard({ event }: { event: Extract<DealEvent, { type: 'status_change' }> }) {
    return (
        <Paper p="sm" radius="md" bg="var(--mantine-color-gray-0)">
            <Group gap="sm" wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" color="gray" size="md" mt={2}>
                    <IconArrowsExchange size={16} />
                </ThemeIcon>
                <Stack gap={2} style={{ flex: 1 }}>
                    <Text size="sm">
                        Сменён статус сделки с <Text component="span" fw={600}>{event.fromStatus}</Text> на{' '}
                        <Text component="span" fw={600}>{event.toStatus}</Text>
                    </Text>
                    <Group gap="xs">
                        <EventTimestamp timestamp={event.timestamp} />
                        <Text size="xs" c="dimmed">·</Text>
                        <Text size="xs" c="dimmed">Ответственный: {event.changedBy}</Text>
                    </Group>
                </Stack>
            </Group>
        </Paper>
    );
}

function ResponsibleChangeCard({ event }: { event: Extract<DealEvent, { type: 'responsible_change' }> }) {
    return (
        <Paper p="sm" radius="md" bg="var(--mantine-color-gray-0)">
            <Group gap="sm" wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" color="blue" size="md" mt={2}>
                    <IconUserEdit size={16} />
                </ThemeIcon>
                <Stack gap={2} style={{ flex: 1 }}>
                    <Text size="sm">
                        Сменён ответственный по сделке: с{' '}
                        <Text component="span" fw={600}>{event.fromResponsible}</Text> на{' '}
                        <Text component="span" fw={600}>{event.toResponsible}</Text>
                    </Text>
                    <Group gap="xs">
                        <EventTimestamp timestamp={event.timestamp} />
                        <Text size="xs" c="dimmed">·</Text>
                        <Text size="xs" c="dimmed">Сменил: {event.changedBy}</Text>
                    </Group>
                </Stack>
            </Group>
        </Paper>
    );
}

function TaskCard({ event }: { event: Extract<DealEvent, { type: 'task' }> }) {
    return (
        <Card withBorder radius="md" p="sm">
            <Group gap="sm" wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" color="yellow" size="md" mt={2}>
                    <IconChecklist size={16} />
                </ThemeIcon>
                <Stack gap={4} style={{ flex: 1 }}>
                    <Text size="sm" fw={600}>Задача: {event.taskName}</Text>
                    <Text size="sm">{event.taskText}</Text>
                    <Text size="xs" c="dimmed">Срок: {event.deadline}</Text>
                    <Group gap="xs">
                        <EventTimestamp timestamp={event.timestamp} />
                        <Text size="xs" c="dimmed">·</Text>
                        <Text size="xs" c="dimmed">
                            Назначил: {event.isAutomatic ? 'Система' : event.assignedBy}
                        </Text>
                    </Group>
                </Stack>
            </Group>
        </Card>
    );
}

const fileTypeIcons: Record<AttachmentFileType, typeof IconPhoto> = {
    image: IconPhoto,
    excel: IconFileSpreadsheet,
    word: IconFileText,
    pdf: IconFileTypePdf,
};

const fileTypeColors: Record<AttachmentFileType, string> = {
    image: 'green',
    excel: 'teal',
    word: 'blue',
    pdf: 'red',
};

function AttachmentCard({ event }: { event: Extract<DealEvent, { type: 'attachment' }> }) {
    const Icon = fileTypeIcons[event.fileType];
    const color = fileTypeColors[event.fileType];

    return (
        <Card withBorder radius="md" p="sm">
            <Group gap="sm" wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" color={color} size="md" mt={2}>
                    <Icon size={16} />
                </ThemeIcon>
                <Stack gap={4} style={{ flex: 1 }}>
                    <Text size="sm" fw={600}>{event.fileName}</Text>
                    {event.comment ? <Text size="sm" c="dimmed">{event.comment}</Text> : null}
                    <EventTimestamp timestamp={event.timestamp} />
                </Stack>
            </Group>
        </Card>
    );
}

function MeasurementCard({ event }: { event: Extract<DealEvent, { type: 'measurement' }> }) {
    return (
        <Card withBorder radius="md" p="sm">
            <Group gap="sm" wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" color="violet" size="md" mt={2}>
                    <IconRulerMeasure size={16} />
                </ThemeIcon>
                <Stack gap={4} style={{ flex: 1 }}>
                    <Text size="sm" fw={600}>Назначен замер</Text>
                    <Text size="sm">Замерщик: {event.measurerName}</Text>
                    <Text size="sm">Дата замера: {event.measurementDate}</Text>
                    <Group justify="space-between" align="center">
                        <EventTimestamp timestamp={event.timestamp} />
                        <Button variant="light" size="xs" leftSection={<IconEdit size={14} />}>
                            Изменить
                        </Button>
                    </Group>
                </Stack>
            </Group>
        </Card>
    );
}

function InstallationCard({ event }: { event: Extract<DealEvent, { type: 'installation' }> }) {
    return (
        <Card withBorder radius="md" p="sm">
            <Group gap="sm" wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" color="orange" size="md" mt={2}>
                    <IconTool size={16} />
                </ThemeIcon>
                <Stack gap={4} style={{ flex: 1 }}>
                    <Text size="sm" fw={600}>Назначен монтаж</Text>
                    <Text size="sm">Монтажник: {event.installerName}</Text>
                    <Text size="sm">Дата монтажа: {event.installationDate}</Text>
                    <Group justify="space-between" align="center">
                        <EventTimestamp timestamp={event.timestamp} />
                        <Button variant="light" size="xs" leftSection={<IconEdit size={14} />}>
                            Изменить
                        </Button>
                    </Group>
                </Stack>
            </Group>
        </Card>
    );
}

function AudioCard({ event }: { event: Extract<DealEvent, { type: 'audio' }> }) {
    return (
        <Card withBorder radius="md" p="sm">
            <Group gap="sm" wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" color="grape" size="md" mt={2}>
                    <IconPlayerPlay size={16} />
                </ThemeIcon>
                <Stack gap={4} style={{ flex: 1 }}>
                    <Text size="sm" fw={600}>Звонок от: {event.phoneNumber}</Text>
                    <Group gap="xs" align="center">
                        <ThemeIcon
                            variant="filled"
                            color="grape"
                            size="sm"
                            radius="xl"
                            style={{ cursor: 'pointer' }}
                        >
                            <IconPlayerPlay size={12} />
                        </ThemeIcon>
                        <Box
                            style={{
                                flex: 1,
                                height: 24,
                                borderRadius: 4,
                                background: 'var(--mantine-color-gray-2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                padding: '0 8px',
                                overflow: 'hidden',
                            }}
                        >
                            {Array.from({ length: 40 }).map((_, i) => (
                                <Box
                                    key={i}
                                    style={{
                                        width: 3,
                                        height: `${20 + Math.sin(i * 0.8) * 40 + Math.random() * 30}%`,
                                        borderRadius: 1,
                                        background: 'var(--mantine-color-grape-4)',
                                        flexShrink: 0,
                                    }}
                                />
                            ))}
                        </Box>
                        <Text size="xs" c="dimmed">{event.duration}</Text>
                    </Group>
                    <EventTimestamp timestamp={event.timestamp} />
                </Stack>
            </Group>
        </Card>
    );
}

function MaterialsCard({ event }: { event: Extract<DealEvent, { type: 'materials' }> }) {
    return (
        <Card withBorder radius="md" p="sm">
            <Group gap="sm" wrap="nowrap" align="flex-start" mb="xs">
                <ThemeIcon variant="light" color="teal" size="md" mt={2}>
                    <IconPackages size={16} />
                </ThemeIcon>
                <Text size="sm" fw={600}>Материалы</Text>
            </Group>
            <Table striped highlightOnHover withTableBorder withColumnBorders fz="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{ width: 50 }} />
                        <Table.Th>Наименование</Table.Th>
                        <Table.Th style={{ width: 100, textAlign: 'right' }}>Кол-во</Table.Th>
                        <Table.Th style={{ width: 60 }}>Ед.</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {event.items.map((item) => (
                        <Table.Tr key={item.id}>
                            <Table.Td>
                                {item.imageUrl ? (
                                    <Image src={item.imageUrl} w={36} h={36} radius="sm" fit="cover" />
                                ) : (
                                    <Box
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 4,
                                            background: 'var(--mantine-color-gray-2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <IconPhoto size={16} color="var(--mantine-color-gray-5)" />
                                    </Box>
                                )}
                            </Table.Td>
                            <Table.Td>{item.name}</Table.Td>
                            <Table.Td style={{ textAlign: 'right' }}>{item.quantity}</Table.Td>
                            <Table.Td>{item.unit}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
            <EventTimestamp timestamp={event.timestamp} />
        </Card>
    );
}

function CommentCard({ event }: { event: Extract<DealEvent, { type: 'comment' }> }) {
    return (
        <Card withBorder radius="md" p="sm">
            <Group gap="sm" wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" color="indigo" size="md" mt={2}>
                    <IconMessage size={16} />
                </ThemeIcon>
                <Stack gap={4} style={{ flex: 1 }}>
                    <Text size="sm" fw={600}>{event.authorName}</Text>
                    <Text size="sm">{event.text}</Text>
                    <EventTimestamp timestamp={event.timestamp} />
                </Stack>
            </Group>
        </Card>
    );
}

function EventCard({ event }: { event: DealEvent }) {
    switch (event.type) {
        case 'status_change':
            return <StatusChangeCard event={event} />;
        case 'responsible_change':
            return <ResponsibleChangeCard event={event} />;
        case 'task':
            return <TaskCard event={event} />;
        case 'attachment':
            return <AttachmentCard event={event} />;
        case 'measurement':
            return <MeasurementCard event={event} />;
        case 'installation':
            return <InstallationCard event={event} />;
        case 'audio':
            return <AudioCard event={event} />;
        case 'materials':
            return <MaterialsCard event={event} />;
        case 'comment':
            return <CommentCard event={event} />;
    }
}

export function DealEventFeed({ events }: DealEventFeedProps) {
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight });
        }
    }, [events]);

    return (
        <ScrollArea h="100%" viewportRef={viewportRef} offsetScrollbars>
            <Stack gap="sm" pr="xs">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </Stack>
        </ScrollArea>
    );
}
