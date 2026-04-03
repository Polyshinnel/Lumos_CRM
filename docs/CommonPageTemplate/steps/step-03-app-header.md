# Шаг 3. Создание AppHeader.tsx — Header

**Этап:** 2 — Layout-компоненты  
**Файл:** `resources/js/components/layout/AppHeader.tsx`  
**Статус:** [x] Выполнен

---

## Цель

Создать компонент header с логотипом, информацией о пользователе (имя + роль) и кнопкой выхода. На мобильных — Burger для открытия sidebar.

---

## Зависимости

- **Предварительно:** Шаг 1 (типы), Шаг 2 (AppLayout — для получения props burger)
- **Mantine:** `Group`, `Text`, `UnstyledButton`, `ActionIcon`, `Tooltip`, `Burger`
- **Tabler Icons:** `IconHelmet` (или `IconTool`/`IconHammer`), `IconUser`, `IconCrown`, `IconLogout`
- **React Router:** `Link`, `useNavigate`
- **Zustand:** `useAuthStore` (user, logout)

---

## Визуальная структура

```
┌──────────────────────────────────────────────────────┐
│  [🍔] [👷 Lumos CRM]              [👤 Имя / роль] [⏻]  │
└──────────────────────────────────────────────────────┘
```

- `[🍔]` — Burger (только на мобильных, `hiddenFrom="sm"`)
- `[👷 Lumos CRM]` — логотип-ссылка на главную
- `[👤 Имя / роль]` — информация о пользователе
- `[⏻]` — кнопка выхода

---

## Props компонента

```typescript
interface AppHeaderProps {
    burgerOpened: boolean;
    onBurgerClick: () => void;
}
```

---

## Реализация по частям

### 3.1 Левая часть — Логотип

- Иконка: `IconHelmet` из `@tabler/icons-react` (строительная каска — тематика ремонта/потолков)
  - Альтернативы: `IconTool`, `IconHammer` — выбрать наиболее подходящую
- Текст: «Lumos CRM» — компонент `Text`, `fw={700}`, `size="lg"`
- Обёртка: `UnstyledButton` с `component={Link} to="/"`
- При наведении — лёгкий hover-эффект

### 3.2 Burger (мобильная версия)

- Компонент `Burger` с `hiddenFrom="sm"`
- `opened={burgerOpened}`
- `onClick={onBurgerClick}`
- Располагается слева от логотипа

### 3.3 Правая часть — Информация о пользователе

**а) Блок пользователя:**
- `Group` с `gap="xs"`
- `IconUser` — иконка пользователя (или `Avatar` с первой буквой имени)
- `Stack` с `gap={0}`:
  - `Text` — имя пользователя (`user.name`), `size="sm"`, `fw={500}`
  - `Group` с `gap={4}`:
    - `Text` — роль: «Пользователь» / «Администратор», `size="xs"`, `c="dimmed"`
    - Если `role === 'admin'`: `IconCrown` размером 14px, цвет `yellow.6`

**Маппинг роли на текст:**

```typescript
const roleLabels: Record<UserRole, string> = {
    user: 'Пользователь',
    admin: 'Администратор',
};
```

**Fallback для роли:**

```typescript
const userRole = user.role ?? 'user';
```

### 3.4 Правая часть — Кнопка выхода

- `ActionIcon` с `variant="subtle"`
- Иконка: `IconLogout`
- `Tooltip` с текстом «Выход»
- Обработчик:

```typescript
const handleLogout = () => {
    logout();                // из useAuthStore — очищает token и state
    navigate('/login');      // react-router navigate
};
```

---

## Мобильная адаптация

| Элемент | Desktop (`sm` и выше) | Mobile (меньше `sm`) |
|---|---|---|
| Burger | Скрыт (`hiddenFrom="sm"`) | Виден |
| Имя пользователя | Виден (`visibleFrom="sm"`) | Скрыт — только аватар |
| Логотип | Виден | Виден |
| Кнопка выхода | Видна | Видна |

---

## Используемые компоненты

| Компонент | Источник |
|---|---|
| `Group`, `Text`, `UnstyledButton`, `ActionIcon`, `Tooltip`, `Burger`, `Stack` | `@mantine/core` |
| `IconHelmet`, `IconUser`, `IconCrown`, `IconLogout` | `@tabler/icons-react` |
| `Link`, `useNavigate` | `react-router-dom` |
| `useAuthStore` | Zustand стор |

---

## Критерии завершения

- [x] Файл `AppHeader.tsx` создан в `resources/js/components/layout/`
- [x] Логотип «Lumos CRM» с иконкой и ссылкой на `/`
- [x] Burger отображается на мобильных экранах
- [x] Блок пользователя: имя + роль + иконка короны для админа
- [x] Кнопка выхода с Tooltip и обработчиком logout + navigate
- [x] Используется fallback `user.role ?? 'user'`
- [x] Мобильная адаптация: имя скрыто, Burger виден
