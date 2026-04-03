# Шаг 2. Создание AppLayout.tsx — главный layout

**Этап:** 2 — Layout-компоненты  
**Файл:** `resources/js/components/layout/AppLayout.tsx`  
**Статус:** [x] Выполнен

---

## Цель

Создать главный layout-компонент на основе `AppShell` из Mantine v8, который объединяет фиксированный header, фиксированный sidebar и прокручиваемую рабочую область.

---

## Зависимости

- **Предварительно:** Шаг 1 (типы) должен быть выполнен
- **Компоненты Mantine:** `AppShell`, `ScrollArea`
- **React Router:** `Outlet`
- **Mantine Hooks:** `useDisclosure`

---

## Файловая структура

```
resources/js/components/layout/
├── AppLayout.tsx          ← создаётся на этом шаге
├── AppHeader.tsx          ← шаг 3
├── AppSidebar.tsx         ← шаг 4
├── PageContent.tsx        ← шаг 5
└── AppLayout.module.css   ← при необходимости
```

---

## Реализация

### 2.1 Создать файл `AppLayout.tsx`

```tsx
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

export function AppLayout() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <AppHeader burgerOpened={opened} onBurgerClick={toggle} />
            </AppShell.Header>

            <AppShell.Navbar>
                <AppSidebar />
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
```

---

## Ключевые моменты

| Аспект | Детали |
|---|---|
| Фиксация header/navbar | `AppShell` делает это автоматически |
| Отступы Main | `AppShell.Main` автоматически получает padding под header и navbar |
| Горизонтальный скролл | Стилизация `AppShell.Main` через `style={{ overflow: 'auto' }}` |
| Мобильная адаптация | На `breakpoint: 'sm'` sidebar прячется, Burger в header |
| Состояние sidebar | `useDisclosure()` — opened/toggle передаются в Header для Burger |

---

## Управление состоянием sidebar (мобильная версия)

Состояние `opened` управляется через `useDisclosure` в `AppLayout`:
- `opened` — передаётся в `AppHeader` как `burgerOpened`
- `toggle` — передаётся в `AppHeader` как `onBurgerClick`
- `collapsed: { mobile: !opened }` — управляет видимостью navbar на мобильных

---

## Визуальная структура

```
┌──────────────────────────────────────────────────────────┐
│                        HEADER (fixed, 60px)              │
├────────────┬─────────────────────────────────────────────┤
│  SIDEBAR   │                                             │
│  (fixed,   │         КОНТЕНТ (Outlet)                    │
│   260px)   │      (scroll: vertical + horizontal)        │
│            │                                             │
└────────────┴─────────────────────────────────────────────┘
```

---

## Критерии завершения

- [x] Файл `AppLayout.tsx` создан в `resources/js/components/layout/`
- [x] `AppShell` настроен с header (60px) и navbar (260px, breakpoint sm)
- [x] `useDisclosure` управляет состоянием мобильного sidebar
- [x] `Outlet` из react-router-dom рендерится внутри `AppShell.Main`
- [x] Импорты `AppHeader` и `AppSidebar` подготовлены (заглушки компонентов OK)
