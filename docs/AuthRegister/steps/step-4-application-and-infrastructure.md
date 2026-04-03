# Этап 4 — Backend: Application и Infrastructure слои

## Задачи

12. Создать DTO (RegisterDTO, LoginDTO)
13. Создать `AuthService`
14. Создать `EloquentUserRepository`
15. Зарегистрировать binding в `AppServiceProvider`

---

## 1.5. Слой приложения (Application)

### 1.5.1. DTO

**RegisterDTO:**
- `name: string`
- `email: string`
- `password: string`

**LoginDTO:**
- `email: string`
- `password: string`

### 1.5.2. AuthService

Файл: `app/Application/Auth/Services/AuthService.php`

Методы:

**`register(RegisterDTO $dto): User`**
1. Создать пользователя через `UserRepositoryInterface` со статусом `pending`
2. Вернуть созданного пользователя

**`login(LoginDTO $dto): string`**
1. Попытаться аутентифицировать через `auth('api')->attempt()`
2. Если credentials неверные — выбросить `InvalidCredentialsException`
3. Получить пользователя, проверить `isApproved()`
4. Если не подтверждён — выбросить `UserNotApprovedException`
5. Вернуть JWT-токен

**`me(): User`**
1. Вернуть текущего аутентифицированного пользователя

**`logout(): void`**
1. Инвалидировать текущий токен через `auth('api')->logout()`

**`refresh(): string`**
1. Обновить токен через `auth('api')->refresh()`

---

## 1.6. Инфраструктурный слой (Infrastructure)

### 1.6.1. EloquentUserRepository

Файл: `app/Infrastructure/Auth/Repositories/EloquentUserRepository.php`

Реализация `UserRepositoryInterface` через Eloquent-модель `User`.

### 1.6.2. Регистрация в сервис-контейнере

Создать `app/Providers/AuthServiceProvider.php` (или использовать `AppServiceProvider`):

```php
$this->app->bind(
    UserRepositoryInterface::class,
    EloquentUserRepository::class
);
```
