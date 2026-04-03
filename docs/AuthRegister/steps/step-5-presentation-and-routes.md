# Этап 5 — Backend: Presentation слой и маршруты

## Задачи

16. Создать Form Requests (RegisterRequest, LoginRequest)
17. Создать `UserResource`
18. Создать `AuthController`
19. Создать `routes/api.php`
20. Подключить API маршруты в `bootstrap/app.php`
21. Настроить обработку JWT-исключений

---

## 1.7. Слой презентации (Presentation)

### 1.7.1. Form Requests

**RegisterRequest** — валидация:
- `name` — required, string, max:255
- `email` — required, email, unique:users
- `password` — required, string, min:8, confirmed

**LoginRequest** — валидация:
- `email` — required, email
- `password` — required, string

### 1.7.2. UserResource

API Resource для единообразного формата ответа:
- `id`
- `name`
- `email`
- `status`

### 1.7.3. AuthController

Файл: `app/Presentation/Auth/Controllers/AuthController.php`

| Метод       | HTTP        | URI              | Описание                                  | Auth |
|-------------|-------------|------------------|-------------------------------------------|------|
| `register`  | POST        | `/api/auth/register` | Регистрация нового пользователя           | Нет  |
| `login`     | POST        | `/api/auth/login`    | Авторизация, возврат JWT                  | Нет  |
| `me`        | GET         | `/api/auth/me`       | Получение профиля текущего пользователя   | Да   |
| `logout`    | POST        | `/api/auth/logout`   | Выход, инвалидация токена                 | Да   |
| `refresh`   | POST        | `/api/auth/refresh`  | Обновление JWT-токена                     | Да   |

Формат ответов:

**POST /api/auth/register** — `201 Created`
```json
{
    "message": "Регистрация прошла успешно. Ожидайте подтверждения администратором.",
    "user": { "id": 1, "name": "...", "email": "...", "status": "pending" }
}
```

**POST /api/auth/login** — `200 OK`
```json
{
    "access_token": "eyJ...",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": { "id": 1, "name": "...", "email": "...", "status": "approved" }
}
```

**POST /api/auth/login** (не подтверждён) — `403 Forbidden`
```json
{
    "message": "Ваш аккаунт ещё не подтверждён администратором."
}
```

**POST /api/auth/login** (неверные данные) — `401 Unauthorized`
```json
{
    "message": "Неверный email или пароль."
}
```

---

## 1.8. Маршруты API

### 1.8.1. Создать `routes/api.php`

```php
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });
});
```

### 1.8.2. Подключить API маршруты в `bootstrap/app.php`

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```

Laravel автоматически добавит префикс `/api` к маршрутам из `routes/api.php`.

---

## 1.9. Обработка ошибок JWT

В `bootstrap/app.php` в секции `withExceptions` добавить обработку:

- `TokenExpiredException` → 401, `{"message": "Токен истёк"}`
- `TokenInvalidException` → 401, `{"message": "Невалидный токен"}`
- `JWTException` → 401, `{"message": "Токен не предоставлен"}`
- `AuthenticationException` → 401, `{"message": "Не авторизован"}`

Для API-запросов всегда возвращать JSON (проверка по префиксу `/api` или заголовку `Accept: application/json`).

---

## 1.10. Middleware

Убедиться, что маршруты в группе `auth:api` защищены middleware `auth:api` (guard jwt). Все остальные API-маршруты, которые будут создаваться в будущем, также должны использовать этот middleware. Открытыми остаются только `register` и `login`.
