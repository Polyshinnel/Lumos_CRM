# Базовый шаблон страницы (CommonPageTemplate) — Детальный план

## 1. Общее описание

Создание единого layout-шаблона для всех защищённых (авторизованных) страниц приложения **Lumos CRM**. Шаблон **не применяется** к страницам `/login` и `/register`. Основан на компоненте `AppShell` из Mantine v8 — он нативно поддерживает фиксированный header, фиксированный sidebar и прокручиваемую рабочую область.

---

## 2. Текущее состояние проекта

| Аспект | Текущее состояние |
|---|---|
| Фреймворк | React 19 + TypeScript, Vite 8, Laravel 13 (SPA) |
| UI-библиотека | Mantine v8 (`@mantine/core` ^8.3.18) |
| Иконки | `@tabler/icons-react` ^3.40.0 |
| Роутинг | `react-router-dom` ^7.13.1 (`BrowserRouter`) |
| Стейт | Zustand ^5 (только auth-стор) |
| Layout | **Отсутствует** — каждая страница рендерит контент напрямую |
| Header/Sidebar/Breadcrumbs | **Не реализованы** |
| Модель User (фронтенд) | `{ id, name, email, status }` — **поле `role` отсутствует** |
| Роль пользователя (бэкенд) | **Не реализована** — есть только `UserStatus` enum |

---

## 3. Структура layout

```
┌──────────────────────────────────────────────────────────┐
│                        HEADER (fixed)                    │
│  [👷 Lumos CRM]                    [User Info] [Logout]  │
├────────────┬─────────────────────────────────────────────┤
│            │  Хлебные крошки (если не главная)           │
│  SIDEBAR   │  Название страницы                          │
│  (fixed)   │─────────────────────────────────────────────│
│            │                                             │
│  Навигация │         КОНТЕНТ СТРАНИЦЫ                    │
│            │      (scroll: vertical + horizontal)        │
│            │                                             │
│            │                                             │
└────────────┴─────────────────────────────────────────────┘
```

- **Header** — фиксирован, растянут на всю ширину, высота ~60px
- **Sidebar** — фиксирован, ширина ~260px, вертикально скроллится если не хватает высоты
- **Основная область** — занимает оставшееся пространство, скроллится по обеим осям

---

## 4. Архитектура компонентов

### 4.1 Файловая структура (новые файлы)

```
resources/js/
├── components/
│   └── layout/
│       ├── AppLayout.tsx              # Главный layout (AppShell обёртка)
│       ├── AppHeader.tsx              # Header
│       ├── AppSidebar.tsx             # Sidebar (навигация)
│       ├── PageContent.tsx            # Обёртка контента (breadcrumbs + title + children)
│       └── AppLayout.module.css       # CSS-модуль для кастомных стилей (при необходимости)
```

### 4.2 Изменяемые файлы

```
resources/js/
├── App.tsx                            # Изменение роутинга — PrivateRoute оборачивает AppLayout
├── components/PrivateRoute.tsx        # Рефакторинг — рендерит AppLayout вместо голого Outlet
├── pages/HomePage.tsx                 # Убрать Container/Card обёртку, оставить контент
├── pages/AboutPage.tsx                # Убрать Container/Card обёртку, оставить контент
├── features/auth/types/auth.types.ts  # Добавить поле role в User
```

---

## 5. Детальный план по компонентам

### 5.1 Подготовка: расширение модели User

**Проблема:** В текущей модели `User` нет поля `role`. Для отображения роли и иконки короны необходимо добавить поле.

**Действия:**

1. Добавить enum `UserRole` в `auth.types.ts`:
   ```typescript
   export type UserRole = 'user' | 'admin';
   ```

2. Расширить интерфейс `User`:
   ```typescript
   export interface User {
       id: number;
       name: string;
       email: string;
       status: 'pending' | 'approved' | 'rejected';
       role: UserRole;
   }
   ```

3. На бэкенде (отдельная задача, в рамках текущего плана **не делаем**):
   - Добавить поле `role` в таблицу `users` (миграция)
   - Создать enum `UserRole`
   - Добавить `role` в ответ эндпоинта `/api/auth/me`

> **Временное решение:** Пока бэкенд не готов, на фронтенде задаём `role` по умолчанию как `'user'`, используя fallback: `user.role ?? 'user'`.

---

### 5.2 AppLayout.tsx — Главный layout

**Компонент Mantine:** `AppShell` — встроенный компонент для shell-layout с фиксированными header и navbar.

**Реализация:**

```tsx
import { AppShell, ScrollArea } from '@mantine/core';

<AppShell
    header={{ height: 60 }}
    navbar={{ width: 260, breakpoint: 'sm' }}
    padding="md"
>
    <AppShell.Header>
        <AppHeader />
    </AppShell.Header>

    <AppShell.Navbar>
        <AppSidebar />
    </AppShell.Navbar>

    <AppShell.Main>
        <Outlet />   {/* react-router-dom */}
    </AppShell.Main>
</AppShell>
```

**Ключевые моменты:**
- `AppShell` автоматически делает header и navbar фиксированными
- `AppShell.Main` автоматически получает отступы под header и navbar
- Для горизонтального скролла контента — стилизация `AppShell.Main` через `style={{ overflow: 'auto' }}`
- Мобильная адаптация: на `breakpoint: 'sm'` sidebar прячется, появляется Burger в header

---

### 5.3 AppHeader.tsx — Header

**Ориентир:** Паттерн «Simple header» с ui.mantine.dev, адаптированный под наши нужды.

**Структура:**

```
┌──────────────────────────────────────────────────────┐
│  [👷 Lumos CRM]              [👤 Имя / роль] [⏻]    │
└──────────────────────────────────────────────────────┘
```

**Левая часть:**
- Иконка: `IconHelmet` из `@tabler/icons-react` (иконка рабочего/строительная каска) или `IconTool` / `IconHammer` — выбрать наиболее подходящую
- Текст: «Lumos CRM» — `Text` компонент, `fw={700}`, `size="lg"`
- Весь блок обёрнут в `UnstyledButton` (или `Anchor`) с `component={Link} to="/"`
- При наведении — лёгкий hover-эффект

**Правая часть:**

**а) Блок пользователя:**
- `Group` с `gap="xs"`
- `IconUser` — иконка пользователя (или `Avatar` с первой буквой имени)
- `Stack` с `gap={0}`:
  - `Text` — имя пользователя (`user.name`), `size="sm"`, `fw={500}`
  - `Group` с `gap={4}`:
    - `Text` — роль: «Пользователь» / «Администратор», `size="xs"`, `c="dimmed"`
    - Если `role === 'admin'`: `IconCrown` размером 14px, цвет `yellow.6`

**б) Кнопка выхода:**
- `ActionIcon` с `variant="subtle"`
- Иконка: `IconLogout` из `@tabler/icons-react`
- `Tooltip` с текстом «Выход»
- Обработчик:
  ```typescript
  const handleLogout = () => {
      logout();                    // из useAuthStore — очищает token и state
      navigate('/login');          // react-router navigate
  };
  ```

**Мобильная версия:**
- На маленьких экранах (`hiddenFrom="sm"`) показывать `Burger` слева для открытия sidebar
- Имя пользователя можно скрыть (`visibleFrom="sm"`), оставив только аватар

**Используемые компоненты Mantine:**
`Group`, `Text`, `UnstyledButton`, `ActionIcon`, `Tooltip`, `Burger`

**Иконки Tabler:**
`IconHelmet` (или подходящая), `IconUser`, `IconCrown`, `IconLogout`

---

### 5.4 AppSidebar.tsx — Sidebar

**Ориентир:** Паттерн «Navbar with nested links» / «Simple navbar» с ui.mantine.dev.

**Структура:**

```
┌─────────────────┐
│  📊 Главная      │
│  📋 Показатели   │
│  👥 Клиенты     │
│  📦 Заказы      │
│  ...            │
│                 │
│                 │
│  v1.0.0         │
└─────────────────┘
```

**Реализация:**
- `ScrollArea` оборачивает навигационные элементы (на случай длинного списка)
- Каждый пункт меню — `NavLink` из Mantine или кастомный компонент на основе `UnstyledButton`
- Активный пункт подсвечивается на основе текущего `location.pathname` (из `useLocation()`)
- В будущем: поддержка вложенных групп через `Collapse` (паттерн `LinksGroup`)

**Структура данных навигации:**

```typescript
interface NavItem {
    label: string;
    icon: React.FC<TablerIconProps>;
    path: string;
    children?: NavItem[];
}

const navigation: NavItem[] = [
    { label: 'Главная', icon: IconHome2, path: '/' },
    { label: 'Показатели', icon: IconChartBar, path: '/dashboard' },
    // ... расширяется по мере добавления страниц
];
```

**Мобильная адаптация:**
- AppShell скрывает navbar на экранах меньше `sm`
- Открытие через Burger в header (состояние `useDisclosure` пробрасывается через props или контекст)

**Используемые компоненты Mantine:**
`ScrollArea`, `NavLink` (или `UnstyledButton` + `Group`), `Text`, `Code` (версия)

---

### 5.5 PageContent.tsx — Обёртка контента страницы

**Назначение:** Единообразное отображение breadcrumbs + заголовка страницы + контента.

**Реализация:**

```tsx
interface PageContentProps {
    title: string;
    children: React.ReactNode;
}
```

**Хлебные крошки (Breadcrumbs):**
- Компонент Mantine: `Breadcrumbs`
- Логика:
  - Если текущий путь `/` (Главная) — **не отображать** breadcrumbs
  - Для остальных страниц:
    - Первый элемент: ссылка «Главная» → `/`
    - Последний элемент: текущая страница (текст, не ссылка)
- Маппинг путей к названиям:

```typescript
const routeNames: Record<string, string> = {
    '/': 'Главная',
    '/about': 'О системе',
    '/dashboard': 'Показатели',
    // ... расширяется
};
```

**Заголовок:**
- `Title` order={2} с названием текущей страницы
- Отступ снизу `mb="md"` перед контентом

**Контент:**
- `children` рендерится как есть
- Контейнер контента должен поддерживать горизонтальный скролл:
  ```tsx
  <Box style={{ overflow: 'auto' }}>
      {children}
  </Box>
  ```

**Используемые компоненты Mantine:**
`Breadcrumbs`, `Anchor`, `Title`, `Text`, `Stack`, `Box`

---

## 6. Изменения в маршрутизации

### 6.1 Текущая структура (App.tsx)

```
Routes
├── /login → LoginPage
├── /register → RegisterPage
├── PrivateRoute (Outlet)
│   ├── / → HomePage
│   └── /about → AboutPage
└── * → Navigate
```

### 6.2 Новая структура

```
Routes
├── /login → LoginPage
├── /register → RegisterPage
├── PrivateRoute → AppLayout (содержит Outlet)
│   ├── / → HomePage (обёрнут в PageContent)
│   └── /about → AboutPage (обёрнут в PageContent)
└── * → Navigate
```

**Вариант интеграции (предпочтительный):**

Модифицировать `PrivateRoute` — вместо голого `<Outlet />` рендерить `<AppLayout />`, который внутри себя содержит `<Outlet />`.

```tsx
// PrivateRoute.tsx
export function PrivateRoute() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <AppLayout />;
}
```

---

## 7. Управление состоянием sidebar (мобильная версия)

Для переключения sidebar на мобильных устройствах:

```tsx
// AppLayout.tsx
const [opened, { toggle }] = useDisclosure();

<AppShell
    navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
>
    <AppShell.Header>
        <AppHeader burgerOpened={opened} onBurgerClick={toggle} />
    </AppShell.Header>
    ...
</AppShell>
```

---

## 8. Стилизация

- Основные стили через **Mantine props** (не Tailwind) для консистентности с UI-библиотекой
- CSS-модули (`*.module.css`) только для кастомных стилей, которые невозможно выразить через Mantine props
- Цветовая схема: стандартная тема Mantine (в будущем можно кастомизировать через `MantineProvider theme`)
- Header: `bg` из темы (например, белый фон + нижний бордер)
- Sidebar: светлый фон, активный пункт — primary color Mantine

---

## 9. Порядок реализации (пошаговый)

### Этап 1: Подготовка типов
1. Добавить `UserRole` и поле `role` в `auth.types.ts`

### Этап 2: Layout-компоненты
2. Создать `AppLayout.tsx` с `AppShell`
3. Создать `AppHeader.tsx`
4. Создать `AppSidebar.tsx`
5. Создать `PageContent.tsx`

### Этап 3: Интеграция
6. Модифицировать `PrivateRoute.tsx` — рендерить `AppLayout`
7. Обновить `App.tsx` при необходимости
8. Рефакторинг `HomePage.tsx` — убрать `Container`/`Card`, использовать `PageContent`
9. Рефакторинг `AboutPage.tsx` — аналогично

### Этап 4: Финализация
10. Проверка скролла основной области (вертикальный + горизонтальный)
11. Проверка фиксации header и sidebar при скролле
12. Проверка мобильной версии (Burger + Drawer sidebar)
13. Проверка logout-функциональности
14. Линтинг и исправление ошибок

---

## 10. Зависимости

Новые пакеты **не требуются**. Все необходимые компоненты уже доступны:

| Что нужно | Откуда |
|---|---|
| `AppShell`, `Breadcrumbs`, `NavLink`, `ScrollArea`, `Tooltip`, `ActionIcon`, `Burger` | `@mantine/core` (^8.3.18) |
| `useDisclosure` | `@mantine/hooks` (^8.3.18) |
| `IconHelmet`, `IconUser`, `IconCrown`, `IconLogout`, `IconHome2`, `IconChartBar` и др. | `@tabler/icons-react` (^3.40.0) |
| `Outlet`, `Link`, `useLocation`, `useNavigate` | `react-router-dom` (^7.13.1) |
| `useAuthStore` (logout, user) | Zustand стор (существующий) |

---

## 11. Заметки и открытые вопросы

1. **Роль пользователя на бэкенде** — нужна миграция + enum + обновление эндпоинта `/api/auth/me`. Пока фронтенд будет использовать fallback `role ?? 'user'`.
2. **Пункты sidebar** — пока добавляем только существующие маршруты (Главная, О системе). Список будет расширяться по мере добавления функциональности CRM.
3. **Тема Mantine** — в будущем можно кастомизировать через `createTheme()` в `MantineProvider` для фирменных цветов Lumos CRM.
4. **API logout** — функция `logout()` из `authApi.ts` существует, но не вызывается из UI. При реализации кнопки выхода стоит вызывать серверный logout перед очисткой токена (чтобы инвалидировать JWT на сервере).
