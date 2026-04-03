import { ActionIcon, Button, Group, Stack, Textarea } from '@mantine/core';
import {
    IconFileText,
    IconListDetails,
    IconPackages,
    IconRulerMeasure,
    IconSend,
    IconTool,
} from '@tabler/icons-react';
import { useState } from 'react';

export function DealActions() {
    const [comment, setComment] = useState('');

    return (
        <Stack gap="sm" style={{ flexShrink: 0 }}>
            <Group gap="xs" wrap="wrap">
                <Button variant="light" size="xs" leftSection={<IconFileText size={16} />}>
                    Создать договор
                </Button>
                <Button variant="light" size="xs" leftSection={<IconListDetails size={16} />}>
                    Создать спецификацию
                </Button>
                <Button variant="light" size="xs" leftSection={<IconRulerMeasure size={16} />}>
                    Назначить замер
                </Button>
                <Button variant="light" size="xs" leftSection={<IconTool size={16} />}>
                    Назначить монтаж
                </Button>
                <Button variant="light" size="xs" leftSection={<IconPackages size={16} />}>
                    Добавить товары со склада
                </Button>
            </Group>

            <Group gap="xs" align="flex-end">
                <Textarea
                    placeholder="Написать комментарий..."
                    value={comment}
                    onChange={(e) => setComment(e.currentTarget.value)}
                    autosize
                    minRows={2}
                    maxRows={5}
                    style={{ flex: 1 }}
                />
                <ActionIcon size="lg" variant="filled" color="blue">
                    <IconSend size={18} />
                </ActionIcon>
            </Group>
        </Stack>
    );
}
