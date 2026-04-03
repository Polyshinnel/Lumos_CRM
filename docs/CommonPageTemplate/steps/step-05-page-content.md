# Шаг 5. Создание PageContent.tsx — обёртка контента страницы

**Этап:** 2 — Layout-компоненты  
**Файл:** `resources/js/components/layout/PageContent.tsx`  
**Статус:** [x] Выполнен

---

## Цель

Создать переиспользуемый компонент, обеспечивающий единообразное отображение хлебных крошек (breadcrumbs), заголовка страницы и контента для всех защищённых страниц.

---

## Зависимости

- **Mantine:** `Breadcrumbs`, `Anchor`, `Title`, `Text`, `Stack`, `Box`
- **React Router:** `Link`, `useLocation`

---

## Props компонента

```typescript
interface PageContentProps {
    title: string;
    children: React.ReactNode;
}
```

---

## Реализация

### 5.1 Хлебные крошки (Breadcrumbs)

**Компонент Mantine:** `Breadcrumbs`

**Логика:**
- Если текущий путь `/` (Главная) — **не отображать** breadcrumbs
- Для остальных страниц:
  - Первый элемент: ссылка «Главная» → `/` (компонент `Anchor` с `component={Link}`)
  - Последний элемент: текущая страница (просто `Text`, не ссылка)

**Маппинг путей к названиям:**

```typescript
const routeNames: Record<string, string> = {
    '/': 'Главная',
    '/about': 'О системе',
    '/dashboard': 'Показатели',
    // расширяется по мере добавления маршрутов
};
```

**Пример для страницы «О системе» (`/about`):**

```
Главная > О системе
```

### 5.2 Заголовок страницы

- Компонент `Title` с `order={2}`
- Текст берётся из prop `title`
- Отступ снизу `mb="md"` перед контентом

### 5.3 Контент

- `children` рендерится как есть внутри контейнера
- Контейнер поддерживает горизонтальный скролл:

```tsx
<Box style={{ overflow: 'auto' }}>
    {children}
</Box>
```

---

## Итоговая структура компонента

```tsx
<Stack gap="sm">
    {/* Breadcrumbs — только если не главная */}
    {location.pathname !== '/' && (
        <Breadcrumbs>
            <Anchor component={Link} to="/">Главная</Anchor>
            <Text>{title}</Text>
        </Breadcrumbs>
    )}

    {/* Заголовок */}
    <Title order={2} mb="md">{title}</Title>

    {/* Контент */}
    <Box style={{ overflow: 'auto' }}>
        {children}
    </Box>
</Stack>
```

---

## Использование в страницах

```tsx
// Пример: HomePage.tsx
export function HomePage() {
    return (
        <PageContent title="Главная">
            {/* контент страницы */}
        </PageContent>
    );
}

// Пример: AboutPage.tsx
export function AboutPage() {
    return (
        <PageContent title="О системе">
            {/* контент страницы */}
        </PageContent>
    );
}
```

---

## Используемые компоненты

| Компонент | Источник |
|---|---|
| `Breadcrumbs`, `Anchor`, `Title`, `Text`, `Stack`, `Box` | `@mantine/core` |
| `Link`, `useLocation` | `react-router-dom` |

---

## Критерии завершения

- [x] Файл `PageContent.tsx` создан в `resources/js/components/layout/`
- [x] Props: `title` (string) и `children` (ReactNode)
- [x] Breadcrumbs отображаются для всех страниц кроме главной (`/`)
- [x] Заголовок страницы рендерится через `Title order={2}`
- [x] Контент поддерживает горизонтальный скролл
- [x] Маппинг `routeNames` определён и расширяем
