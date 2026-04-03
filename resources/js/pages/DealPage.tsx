import { Box, Grid } from '@mantine/core';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import type { BreadcrumbItem } from '../components/layout/PageContent';
import { PageContent } from '../components/layout/PageContent';
import { DealActions } from './deal/DealActions';
import { DealEventFeed } from './deal/DealEventFeed';
import { DealInfoCard } from './deal/DealInfoCard';
import { mockDeal, mockEvents } from './deal/dealMockData';

const HEADER_HEIGHT = 60;
const SHELL_PADDING = 16;
const BREADCRUMBS_HEIGHT = 30;
const PAGE_HEIGHT = `calc(100vh - ${HEADER_HEIGHT + SHELL_PADDING * 2 + BREADCRUMBS_HEIGHT}px)`;

export function DealPage() {
    const { dealId } = useParams<{ dealId: string }>();

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { label: 'Главная', to: '/' },
            { label: 'Сделки', to: '/crm' },
            { label: `Сделка №${dealId ?? ''}` },
        ],
        [dealId],
    );

    return (
        <PageContent title={`Сделка #${dealId ?? ''}`} hideTitle breadcrumbs={breadcrumbs}>
            <Grid gutter="md" overflow="hidden" style={{ height: PAGE_HEIGHT }}>
                <Grid.Col span={{ base: 12, md: 4 }} style={{ height: PAGE_HEIGHT, overflow: 'auto' }}>
                    <DealInfoCard deal={mockDeal} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 8 }} style={{ height: PAGE_HEIGHT }}>
                    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
                        <Box style={{ flex: 1, minHeight: 0 }}>
                            <DealEventFeed events={mockEvents} />
                        </Box>
                        <DealActions />
                    </Box>
                </Grid.Col>
            </Grid>
        </PageContent>
    );
}
