# Этап 3 — Backend: Миграция

## Задачи

11. Создать миграцию `add_status_to_users_table`

---

## 1.3. Миграция базы данных

Создать новую миграцию `add_status_to_users_table`:

```php
Schema::table('users', function (Blueprint $table) {
    $table->string('status')->default('pending')->after('password');
});
```

Поле `status` будет принимать значения из enum `UserStatus`:
- `pending` — ожидает подтверждения администратором (значение по умолчанию)
- `approved` — подтверждён, может авторизоваться
- `rejected` — отклонён
