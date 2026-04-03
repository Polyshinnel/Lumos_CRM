# Шаг 8. Рефакторинг HomePage.tsx — адаптация под новый layout

**Этап:** 3 — Интеграция  
**Файл:** `resources/js/pages/HomePage.tsx`  
**Статус:** [x] Выполнен

---

## Цель

Убрать из `HomePage` самостоятельные обёртки (`Container`, `Card` и т.п.), которые больше не нужны, и обернуть контент в `PageContent` для единообразного отображения заголовка и breadcrumbs.

---

## Зависимости

- **Предварительно:** Шаг 5 (PageContent создан), Шаг 6 (PrivateRoute интегрирован)
- **Компонент:** `PageContent` из `../components/layout/PageContent`

---

## Текущее состояние

`HomePage.tsx` рендерит контент напрямую, вероятно обёрнутый в `Container` и/или `Card`:

```tsx
export function HomePage() {
    return (
        <Container>
            <Card>
                <Title>Главная</Title>
                {/* контент */}
            </Card>
        </Container>
    );
}
```

---

## Новая реализация

```tsx
import { PageContent } from '../components/layout/PageContent';

export function HomePage() {
    return (
        <PageContent title="Главная">
            {/* контент страницы без Container/Card обёрток */}
        </PageContent>
    );
}
```

---

## Действия

### 8.1 Убрать лишние обёртки

- Удалить `Container` — layout уже управляет шириной и отступами через `AppShell`
- Удалить `Card` — если использовалась как визуальная обёртка всей страницы
- Удалить `Title` с заголовком страницы — теперь это делает `PageContent`

### 8.2 Обернуть контент в `PageContent`

- Добавить импорт `PageContent`
- Обернуть оставшийся контент в `<PageContent title="Главная">`

### 8.3 Очистить неиспользуемые импорты

- Удалить импорты `Container`, `Card`, `Title` если они больше не используются
- Проверить, что нет «мёртвых» импортов

---

## Что важно

- **Не удалять** содержимое страницы — только убрать внешние обёртки
- **PageContent** берёт на себя: breadcrumbs (для главной не показываются) + заголовок + scroll-контейнер
- Контент страницы рендерится как `children` внутри `PageContent`

---

## Критерии завершения

- [x] `Container` / `Card` обёртки удалены из `HomePage.tsx`
- [x] Контент обёрнут в `<PageContent title="Главная">`
- [x] Неиспользуемые импорты удалены
- [x] Страница корректно отображается внутри AppLayout
- [x] Breadcrumbs на главной **не отображаются** (так задумано)
