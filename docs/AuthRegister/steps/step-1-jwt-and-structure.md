# Этап 1 — Backend: Настройка JWT и структура

## Задачи

1. Опубликовать конфиг `tymon/jwt-auth`
2. Сгенерировать `JWT_SECRET`
3. Добавить guard `api` в `config/auth.php`
4. Создать DDD-структуру каталогов
5. Обновить `composer.json` autoload, выполнить `composer dump-autoload`

---

## 1.1. Организация DDD-структуры каталогов

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

## 1.2. Настройка tymon/jwt-auth

### 1.2.1. Публикация конфигурации

```bash
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
```

Будет создан файл `config/jwt.php`.

### 1.2.2. Генерация секретного ключа

```bash
php artisan jwt:secret
```

В `.env` будет добавлена переменная `JWT_SECRET`.

### 1.2.3. Настройка config/auth.php

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

### 1.2.4. Реализация интерфейса JWTSubject в модели User

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
