# Шаг 9. Рефакторинг AboutPage.tsx — адаптация под новый layout

**Этап:** 3 — Интеграция  
**Файл:** `resources/js/pages/AboutPage.tsx`  
**Статус:** [ ] Не выполнен

---

## Цель

Аналогично шагу 8 — убрать самостоятельные обёртки и перевести страницу на `PageContent`.

---

## Зависимости

- **Предварительно:** Шаг 5 (PageContent создан), Шаг 6 (PrivateRoute интегрирован)
- **Компонент:** `PageContent` из `../components/layout/PageContent`

---

## Текущее состояние

```tsx
export function AboutPage() {
    return (
        <Container>
            <Card>
                <Title>О системе</Title>
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

export function AboutPage() {
    return (
        <PageContent title="О системе">
            {/* контент страницы без Container/Card обёрток */}
        </PageContent>
    );
}
```

---

## Действия

### 9.1 Убрать лишние обёртки

- Удалить `Container` — layout управляет отступами
- Удалить `Card` — если была обёрткой всей страницы
- Удалить `Title` — заголовок рендерит `PageContent`

### 9.2 Обернуть контент в `PageContent`

- Добавить импорт `PageContent`
- Обернуть содержимое в `<PageContent title="О системе">`

### 9.3 Очистить неиспользуемые импорты

- Удалить импорты компонентов, которые больше не используются

---

## Ожидаемый результат

На странице «О системе»:
- Отображаются breadcrumbs: `Главная > О системе`
- Заголовок `Title order={2}` — «О системе»
- Ниже — контент страницы
- Всё внутри AppLayout (header + sidebar + main)

---

## Критерии завершения

- [ ] `Container` / `Card` обёртки удалены из `AboutPage.tsx`
- [ ] Контент обёрнут в `<PageContent title="О системе">`
- [ ] Неиспользуемые импорты удалены
- [ ] Страница корректно отображается внутри AppLayout
- [ ] Breadcrumbs отображаются: «Главная > О системе»
