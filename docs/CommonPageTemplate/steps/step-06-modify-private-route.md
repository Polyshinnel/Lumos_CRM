# Шаг 6. Модификация PrivateRoute.tsx — интеграция AppLayout

**Этап:** 3 — Интеграция  
**Файл:** `resources/js/components/PrivateRoute.tsx`  
**Статус:** [ ] Не выполнен

---

## Цель

Заменить голый `<Outlet />` на `<AppLayout />` внутри `PrivateRoute`, чтобы все защищённые страницы автоматически получали header, sidebar и единый layout.

---

## Зависимости

- **Предварительно:** Шаги 2–5 (все layout-компоненты созданы)
- **Компоненты:** `AppLayout` (из `./layout/AppLayout`)
- **Zustand:** `useAuthStore`
- **React Router:** `Navigate`

---

## Текущее состояние

```tsx
// PrivateRoute.tsx (текущий)
export function PrivateRoute() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Outlet />;
}
```

---

## Новая реализация

```tsx
// PrivateRoute.tsx (новый)
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';
import { AppLayout } from './layout/AppLayout';

export function PrivateRoute() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <AppLayout />;
}
```

**Ключевое изменение:** `<Outlet />` → `<AppLayout />`. Теперь `Outlet` рендерится уже внутри `AppLayout`, в `AppShell.Main`.

---

## Схема маршрутизации после изменения

```
Routes
├── /login → LoginPage          (без layout)
├── /register → RegisterPage    (без layout)
├── PrivateRoute → AppLayout    (содержит AppShell + Outlet)
│   ├── / → HomePage
│   └── /about → AboutPage
└── * → Navigate(/login)
```

---

## Что важно проверить

- Удалить импорт `Outlet` из `PrivateRoute.tsx` (больше не нужен)
- Убедиться, что `AppLayout` корректно импортируется
- Проверить, что структура маршрутов в `App.tsx` не изменилась (вложенные `<Route>` внутри `<Route element={<PrivateRoute />}>`)

---

## Критерии завершения

- [ ] `PrivateRoute` рендерит `<AppLayout />` вместо `<Outlet />`
- [ ] Импорт `Outlet` удалён из `PrivateRoute.tsx`
- [ ] Импорт `AppLayout` добавлен
- [ ] Авторизация по-прежнему работает (redirect на `/login` для неавторизованных)
- [ ] Все вложенные маршруты рендерятся внутри `AppShell.Main`
