# Шаг 14. Линтинг и исправление ошибок

**Этап:** 4 — Финализация  
**Тип:** Техническая проверка  
**Статус:** [ ] Не выполнен

---

## Цель

Выполнить финальную проверку кода: линтинг, проверку типов TypeScript, удаление неиспользуемых импортов и исправление всех найденных ошибок.

---

## Действия

### 14.1 Проверка TypeScript

Запустить проверку типов:

```bash
npx tsc --noEmit
```

**Ожидаемый результат:** 0 ошибок.

**Типичные проблемы:**
- Отсутствие поля `role` в данных из API → убедиться, что используется fallback `user.role ?? 'user'`
- Неправильные типы props в layout-компонентах
- Несовместимые типы при передаче `component={Link}` в Mantine-компоненты

### 14.2 ESLint

Запустить линтер:

```bash
npx eslint resources/js/components/layout/ resources/js/pages/ resources/js/App.tsx resources/js/components/PrivateRoute.tsx
```

**Типичные проблемы:**
- Неиспользуемые импорты (после рефакторинга страниц)
- Missing dependencies в useEffect / useCallback (если применимо)
- Неиспользуемые переменные

### 14.3 Проверка сборки

```bash
npm run build
```

**Ожидаемый результат:** Сборка завершается без ошибок и предупреждений.

---

## Чеклист файлов для проверки

| Файл | Что проверить |
|---|---|
| `features/auth/types/auth.types.ts` | `UserRole` тип, `role` в `User` |
| `components/layout/AppLayout.tsx` | Импорты, AppShell конфигурация |
| `components/layout/AppHeader.tsx` | Импорты, типы props, fallback роли |
| `components/layout/AppSidebar.tsx` | Импорты, навигационные данные |
| `components/layout/PageContent.tsx` | Импорты, типы props, routeNames |
| `components/PrivateRoute.tsx` | Удалён лишний Outlet импорт |
| `pages/HomePage.tsx` | Удалены лишние импорты Container/Card |
| `pages/AboutPage.tsx` | Удалены лишние импорты Container/Card |
| `App.tsx` | Корректная структура маршрутов |

---

## Дополнительно

### 14.4 Удаление временного кода

- [ ] Удалить тестовый контент, добавленный на шагах 10–12 для проверки скролла
- [ ] Убрать `console.log` / `console.debug`, если были добавлены при отладке

### 14.5 CSS-модули (если создавались)

- [ ] Проверить `AppLayout.module.css` — нет ли неиспользуемых классов
- [ ] Убедиться, что CSS-модули корректно импортируются

---

## Критерии завершения

- [ ] `tsc --noEmit` — 0 ошибок
- [ ] ESLint — 0 ошибок (или только pre-existing warnings)
- [ ] `npm run build` — сборка успешна
- [ ] Все неиспользуемые импорты удалены
- [ ] Временный отладочный код удалён
- [ ] Все 14 шагов плана выполнены
