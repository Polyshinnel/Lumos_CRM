# Этап 2 — Backend: Domain слой

## Задачи

6. Создать enum `UserStatus`
7. Перенести и обновить модель `User` → `Domain/Auth/Entities/User.php`
8. Обновить ссылки на модель (config, factory)
9. Создать интерфейс `UserRepositoryInterface`
10. Создать доменные исключения

---

## 1.4.1. Enum `UserStatus`

Файл: `app/Domain/Auth/Enums/UserStatus.php`

```php
enum UserStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
}
```

---

## 1.4.2. Сущность `User`

Файл: `app/Domain/Auth/Entities/User.php`

- Переместить модель из `app/Models/User.php`
- Добавить `status` в fillable
- Добавить cast `status` → `UserStatus`
- Имплементировать `JWTSubject`
- Добавить метод `isApproved(): bool`

Обновить ссылки на модель:
- `config/auth.php` → `providers.users.model`
- `database/factories/UserFactory.php`

---

## 1.4.3. Интерфейс `UserRepositoryInterface`

Файл: `app/Domain/Auth/Repositories/UserRepositoryInterface.php`

Методы:
- `findByEmail(string $email): ?User`
- `create(array $data): User`

---

## 1.4.4. Доменные исключения

- `UserNotApprovedException` — выбрасывается при попытке входа неподтверждённого пользователя
- `InvalidCredentialsException` — выбрасывается при неверных учётных данных
