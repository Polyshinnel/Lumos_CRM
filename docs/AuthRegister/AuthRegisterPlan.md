# План реализации авторизации и регистрации

## Текущее состояние проекта

- **Backend:** Laravel 13, PHP 8.3+
- **Frontend:** React 19 + TypeScript + Mantine v8 + react-router-dom v7
- **Сборка:** Vite 8
- **Инфраструктура:** Docker (app + MySQL 8.4 + Redis 7)
- **JWT:** `tymon/jwt-auth ^2.3` установлен через Composer, но не настроен
- **DDD:** отсутствует, стандартная структура Laravel
- **State manager:** отсутствует
- **Axios:** подключён, без interceptors и baseURL
- **API маршруты:** отсутствуют (`routes/api.php` не создан, не подключён в `bootstrap/app.php`)

---

## Часть 1. Backend

### 1.1. Организация DDD-структуры каталогов

Создать следующую структуру внутри `app/`:

```
app/
├── Domain/
│   └── Auth/
│       ├── Entities/
│       │   └── User.php                  # Доменная модель пользователя (Eloquent)
│       ├── Enums/
│       │   └── UserStatus.php            # Enum: pending / approved / rejected
│       ├── Repositories/
│       │   └── UserRepositoryInterface.php  # Контракт репозитория
│       └── Exceptions/
│           ├── UserNotApprovedException.php
│           └── InvalidCredentialsException.php
│
├── Application/
│   └── Auth/
│       ├── Services/
│       │   └── AuthService.php           # Логика регистрации, логина, получения профиля
│       └── DTO/
│           ├── RegisterDTO.php           # Data Transfer Object для регистрации
│           └── LoginDTO.php              # Data Transfer Object для логина
│
├── Infrastructure/
│   └── Auth/
│       └── Repositories/
│           └── EloquentUserRepository.php  # Реализация репозитория через Eloquent
│
└── Presentation/
    └── Auth/
        ├── Controllers/
        │   └── AuthController.php        # API-контроллер: register, login, me, logout, refresh
        ├── Requests/
        │   ├── RegisterRequest.php       # Form Request для валидации регистрации
        │   └── LoginRequest.php          # Form Request для валидации логина
        └── Resources/
            └── UserResource.php          # API Resource для форматирования ответа
```

Обновить `composer.json` — секцию `autoload.psr-4`, добавив неймспейсы:

```json
"psr-4": {
    "App\\": "app/",
    "App\\Domain\\": "app/Domain/",
    "App\\Application\\": "app/Application/",
    "App\\Infrastructure\\": "app/Infrastructure/",
    "App\\Presentation\\": "app/Presentation/",
    "Database\\Factories\\": "database/factories/",
    "Database\\Seeders\\": "database/seeders/"
}
```

После изменений выполнить `composer dump-autoload`.

---

### 1.2. Настройка tymon/jwt-auth

#### 1.2.1. Публикация конфигурации

```bash
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
```

Будет создан файл `config/jwt.php`.

#### 1.2.2. Генерация секретного ключа

```bash
php artisan jwt:secret
```

В `.env` будет добавлена переменная `JWT_SECRET`.

#### 1.2.3. Настройка config/auth.php

Добавить guard `api` с драйвером `jwt`:

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
    ],
],
```

#### 1.2.4. Реализация интерфейса JWTSubject в модели User

Модель `User` (которая будет перенесена в `app/Domain/Auth/Entities/User.php`) должна имплементировать `Tymon\JWTAuth\Contracts\JWTSubject`:

```php
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }
}
```

---

### 1.3. Миграция базы данных

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

---

### 1.4. Доменный слой (Domain)

#### 1.4.1. Enum `UserStatus`

Файл: `app/Domain/Auth/Enums/UserStatus.php`

```php
enum UserStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
}
```

#### 1.4.2. Сущность `User`

Файл: `app/Domain/Auth/Entities/User.php`

- Переместить модель из `app/Models/User.php`
- Добавить `status` в fillable
- Добавить cast `status` → `UserStatus`
- Имплементировать `JWTSubject`
- Добавить метод `isApproved(): bool`

Обновить ссылки на модель:
- `config/auth.php` → `providers.users.model`
- `database/factories/UserFactory.php`

#### 1.4.3. Интерфейс `UserRepositoryInterface`

Файл: `app/Domain/Auth/Repositories/UserRepositoryInterface.php`

Методы:
- `findByEmail(string $email): ?User`
- `create(array $data): User`

#### 1.4.4. Доменные исключения

- `UserNotApprovedException` — выбрасывается при попытке входа неподтверждённого пользователя
- `InvalidCredentialsException` — выбрасывается при неверных учётных данных

---

### 1.5. Слой приложения (Application)

#### 1.5.1. DTO

**RegisterDTO:**
- `name: string`
- `email: string`
- `password: string`

**LoginDTO:**
- `email: string`
- `password: string`

#### 1.5.2. AuthService

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

### 1.6. Инфраструктурный слой (Infrastructure)

#### 1.6.1. EloquentUserRepository

Файл: `app/Infrastructure/Auth/Repositories/EloquentUserRepository.php`

Реализация `UserRepositoryInterface` через Eloquent-модель `User`.

#### 1.6.2. Регистрация в сервис-контейнере

Создать `app/Providers/AuthServiceProvider.php` (или использовать `AppServiceProvider`):

```php
$this->app->bind(
    UserRepositoryInterface::class,
    EloquentUserRepository::class
);
```

---

### 1.7. Слой презентации (Presentation)

#### 1.7.1. Form Requests

**RegisterRequest** — валидация:
- `name` — required, string, max:255
- `email` — required, email, unique:users
- `password` — required, string, min:8, confirmed

**LoginRequest** — валидация:
- `email` — required, email
- `password` — required, string

#### 1.7.2. UserResource

API Resource для единообразного формата ответа:
- `id`
- `name`
- `email`
- `status`

#### 1.7.3. AuthController

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

### 1.8. Маршруты API

#### 1.8.1. Создать `routes/api.php`

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

#### 1.8.2. Подключить API маршруты в `bootstrap/app.php`

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

### 1.9. Обработка ошибок JWT

В `bootstrap/app.php` в секции `withExceptions` добавить обработку:

- `TokenExpiredException` → 401, `{"message": "Токен истёк"}`
- `TokenInvalidException` → 401, `{"message": "Невалидный токен"}`
- `JWTException` → 401, `{"message": "Токен не предоставлен"}`
- `AuthenticationException` → 401, `{"message": "Не авторизован"}`

Для API-запросов всегда возвращать JSON (проверка по префиксу `/api` или заголовку `Accept: application/json`).

---

### 1.10. Middleware

Убедиться, что маршруты в группе `auth:api` защищены middleware `auth:api` (guard jwt). Все остальные API-маршруты, которые будут создаваться в будущем, также должны использовать этот middleware. Открытыми остаются только `register` и `login`.

---

## Часть 2. Frontend

### 2.1. Установка зависимостей

```bash
npm install zustand
```

**Zustand** — минималистичный state manager для React. Выбран за простоту, отсутствие boilerplate и нативную поддержку TypeScript.

---

### 2.2. Структура файлов фронтенда

```
resources/js/
├── app.tsx                         # Точка входа, провайдеры
├── App.tsx                         # Корневой компонент с маршрутами
├── bootstrap.ts                    # Настройка axios (обновить)
│
├── api/
│   └── axios.ts                    # Экземпляр axios с baseURL и interceptors
│
├── features/
│   └── auth/
│       ├── api/
│       │   └── authApi.ts          # API-функции: login, register, me, logout, refresh
│       ├── store/
│       │   └── useAuthStore.ts     # Zustand-стор: token, user, isAuthenticated, actions
│       ├── pages/
│       │   ├── LoginPage.tsx       # Страница авторизации
│       │   └── RegisterPage.tsx    # Страница регистрации
│       ├── components/
│       │   ├── LoginForm.tsx       # Форма авторизации
│       │   └── RegisterForm.tsx    # Форма регистрации
│       └── types/
│           └── auth.types.ts       # Типы: User, LoginRequest, RegisterRequest, AuthResponse
│
├── components/
│   └── PrivateRoute.tsx            # Компонент-обёртка для защищённых маршрутов
│
└── types/
    └── api.types.ts                # Общие типы API-ответов (ApiError и др.)
```

---

### 2.3. Настройка Axios

#### 2.3.1. Создать `resources/js/api/axios.ts`

- Создать экземпляр `axios.create()` с `baseURL: '/api'`
- **Request interceptor:** при каждом запросе получать токен из `useAuthStore.getState().token` и добавлять заголовок `Authorization: Bearer {token}`
- **Response interceptor:** при получении ошибки 401 — очищать стор авторизации (`useAuthStore.getState().logout()`) и перенаправлять на `/login` через `window.location.href`

#### 2.3.2. Обновить `resources/js/bootstrap.ts`

Оставить как есть (для совместимости), но в проекте использовать собственный экземпляр из `api/axios.ts`.

---

### 2.4. Типы (TypeScript)

#### 2.4.1. `features/auth/types/auth.types.ts`

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}

interface RegisterResponse {
    message: string;
    user: User;
}
```

---

### 2.5. Zustand Auth Store

#### 2.5.1. `features/auth/store/useAuthStore.ts`

**State:**
- `token: string | null` — JWT-токен (инициализируется из `localStorage`)
- `user: User | null` — текущий пользователь
- `isAuthenticated: boolean` — computed на основе наличия token

**Actions:**
- `setAuth(token: string, user: User)` — сохранить токен в `localStorage` и в стор
- `logout()` — удалить токен из `localStorage`, сбросить стор
- `setUser(user: User)` — обновить данные пользователя
- `loadUser()` — запрос `/api/auth/me`, обновление user в сторе; при ошибке — logout

При инициализации стора — читать токен из `localStorage.getItem('access_token')`.

---

### 2.6. Auth API функции

#### 2.6.1. `features/auth/api/authApi.ts`

Использует экземпляр axios из `api/axios.ts`:

- `login(data: LoginRequest): Promise<AuthResponse>` → POST `/auth/login`
- `register(data: RegisterRequest): Promise<RegisterResponse>` → POST `/auth/register`
- `getMe(): Promise<User>` → GET `/auth/me`
- `logout(): Promise<void>` → POST `/auth/logout`
- `refreshToken(): Promise<AuthResponse>` → POST `/auth/refresh`

---

### 2.7. Страница авторизации (LoginPage)

**Путь:** `/login`

**UI (Mantine):**
- Центрированная карточка с заголовком «Вход в систему»
- Поля: Email (TextInput), Пароль (PasswordInput)
- Кнопка «Войти» (Button)
- Ссылка «Нет аккаунта? Зарегистрируйтесь» → `/register`
- Отображение ошибок: неверные данные, аккаунт не подтверждён
- При успешном входе: сохранить токен в стор → редирект на `/`

---

### 2.8. Страница регистрации (RegisterPage)

**Путь:** `/register`

**UI (Mantine):**
- Центрированная карточка с заголовком «Регистрация»
- Поля: Имя (TextInput), Email (TextInput), Пароль (PasswordInput), Подтверждение пароля (PasswordInput)
- Кнопка «Зарегистрироваться» (Button)
- Ссылка «Уже есть аккаунт? Войдите» → `/login`
- При успешной регистрации — показать сообщение: «Регистрация прошла успешно. Ожидайте подтверждения администратором.»
- Валидация ошибок с бэкенда: email уже занят, пароль слишком короткий и т.д.

---

### 2.9. Компонент PrivateRoute

Файл: `resources/js/components/PrivateRoute.tsx`

- Проверяет `isAuthenticated` из `useAuthStore`
- Если авторизован — рендерит `<Outlet />` (вложенные маршруты)
- Если не авторизован — `<Navigate to="/login" />`

---

### 2.10. Обновление маршрутизации (App.tsx)

```tsx
<Routes>
    {/* Публичные маршруты */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Защищённые маршруты */}
    <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
    </Route>
</Routes>
```

---

### 2.11. Инициализация приложения

В `App.tsx` или `app.tsx` при монтировании:

1. Проверить наличие токена в `localStorage`
2. Если токен есть — вызвать `loadUser()` из стора для загрузки профиля пользователя
3. Пока идёт загрузка — показывать спиннер (LoadingOverlay из Mantine)
4. Если токен невалиден (ответ 401) — очистить стор и показать страницу логина

---

## Часть 3. Порядок реализации (пошаговый)

### Этап 1 — Backend: Настройка JWT и структура
1. Опубликовать конфиг `tymon/jwt-auth`
2. Сгенерировать `JWT_SECRET`
3. Добавить guard `api` в `config/auth.php`
4. Создать DDD-структуру каталогов
5. Обновить `composer.json` autoload, выполнить `composer dump-autoload`

### Этап 2 — Backend: Domain слой
6. Создать enum `UserStatus`
7. Перенести и обновить модель `User` → `Domain/Auth/Entities/User.php`
8. Обновить ссылки на модель (config, factory)
9. Создать интерфейс `UserRepositoryInterface`
10. Создать доменные исключения

### Этап 3 — Backend: Миграция
11. Создать миграцию `add_status_to_users_table`

### Этап 4 — Backend: Application и Infrastructure слои
12. Создать DTO (RegisterDTO, LoginDTO)
13. Создать `AuthService`
14. Создать `EloquentUserRepository`
15. Зарегистрировать binding в `AppServiceProvider`

### Этап 5 — Backend: Presentation слой и маршруты
16. Создать Form Requests (RegisterRequest, LoginRequest)
17. Создать `UserResource`
18. Создать `AuthController`
19. Создать `routes/api.php`
20. Подключить API маршруты в `bootstrap/app.php`
21. Настроить обработку JWT-исключений

### Этап 6 — Frontend: Инфраструктура
22. Установить `zustand`
23. Создать экземпляр axios с interceptors (`api/axios.ts`)
24. Создать типы (`auth.types.ts`, `api.types.ts`)

### Этап 7 — Frontend: Auth store и API
25. Создать `useAuthStore` (Zustand)
26. Создать `authApi.ts`

### Этап 8 — Frontend: Страницы и маршруты
27. Создать `LoginForm` и `LoginPage`
28. Создать `RegisterForm` и `RegisterPage`
29. Создать `PrivateRoute`
30. Обновить `App.tsx` — маршруты и инициализация
31. Добавить логику инициализации (проверка токена при старте)

### Этап 9 — Тестирование
32. Проверить регистрацию (новый пользователь со статусом `pending`)
33. Проверить вход неподтверждённого пользователя (ошибка 403)
34. Вручную изменить статус на `approved` в БД
35. Проверить вход подтверждённого пользователя (получение токена)
36. Проверить доступ к защищённым маршрутам с токеном
37. Проверить редирект на `/login` при отсутствии/невалидности токена
38. Проверить `logout` (инвалидация токена)
