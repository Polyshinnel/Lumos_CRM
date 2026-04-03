# Шаг 4. Создание AppSidebar.tsx — Sidebar (навигация)

**Этап:** 2 — Layout-компоненты  
**Файл:** `resources/js/components/layout/AppSidebar.tsx`  
**Статус:** [x] Выполнен

---

## Цель

Создать боковую панель навигации с вертикальным списком пунктов меню, подсветкой активного маршрута и поддержкой скролла при длинном списке.

---

## Зависимости

- **Предварительно:** Шаг 2 (AppLayout — sidebar рендерится внутри `AppShell.Navbar`)
- **Mantine:** `ScrollArea`, `NavLink`, `Text`, `Code`
- **Tabler Icons:** `IconHome2`, `IconChartBar`, `IconInfoCircle` и др.
- **React Router:** `useLocation`, `Link`

---

## Визуальная структура

```
┌─────────────────┐
│  📊 Главная      │  ← активный (подсвечен)
│  ℹ️ О системе    │
│  📋 Показатели   │
│  👥 Клиенты     │  ← в будущем
│  📦 Заказы      │  ← в будущем
│                 │
│                 │
│  v1.0.0         │
└─────────────────┘
```

---

## Структура данных навигации

```typescript
interface NavItem {
    label: string;
    icon: React.FC<TablerIconProps>;
    path: string;
    children?: NavItem[];   // для вложенных групп в будущем
}

const navigation: NavItem[] = [
    { label: 'Главная', icon: IconHome2, path: '/' },
    { label: 'О системе', icon: IconInfoCircle, path: '/about' },
    // расширяется по мере добавления страниц
];
```

---

## Реализация

### 4.1 Список навигации

- Каждый пункт меню — компонент `NavLink` из Mantine
- Активный пункт определяется сравнением `item.path` с `location.pathname` (из `useLocation()`)
- Иконка рендерится через `leftSection`

```tsx
{navigation.map((item) => (
    <NavLink
        key={item.path}
        component={Link}
        to={item.path}
        label={item.label}
        leftSection={<item.icon size={20} stroke={1.5} />}
        active={location.pathname === item.path}
    />
))}
```

### 4.2 ScrollArea

- Оборачивает весь список навигации
- Нужна на случай, когда пунктов меню станет много и список не будет помещаться по высоте

```tsx
<ScrollArea>
    {/* NavLink items */}
</ScrollArea>
```

### 4.3 Версия приложения (footer sidebar)

- В нижней части sidebar — текст с версией: `Code` компонент
- Пример: `v1.0.0`
- Можно вынести версию в отдельную константу или читать из `package.json`

---

## Будущие расширения

- Вложенные группы через `Collapse` (паттерн `LinksGroup` с ui.mantine.dev)
- Разграничение пунктов по ролям пользователя (скрывать админские разделы)
- Бейджи на пунктах меню (количество непрочитанных и т.п.)

---

## Мобильная адаптация

- `AppShell` автоматически скрывает navbar на экранах меньше `sm`
- Sidebar открывается через Burger в header (состояние `opened` из `AppLayout`)
- При клике на пункт меню на мобильном — sidebar закрывается (опционально, можно добавить позже)

---

## Используемые компоненты

| Компонент | Источник |
|---|---|
| `ScrollArea`, `NavLink`, `Text`, `Code` | `@mantine/core` |
| `IconHome2`, `IconInfoCircle`, `IconChartBar` и др. | `@tabler/icons-react` |
| `useLocation`, `Link` | `react-router-dom` |

---

## Критерии завершения

- [x] Файл `AppSidebar.tsx` создан в `resources/js/components/layout/`
- [x] Массив навигации `navigation` определён с текущими маршрутами (Главная, О системе)
- [x] `NavLink` рендерится для каждого пункта с иконкой
- [x] Активный пункт подсвечивается на основе `location.pathname`
- [x] `ScrollArea` оборачивает навигацию
- [x] Версия приложения отображается внизу sidebar
