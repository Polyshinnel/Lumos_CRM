# Этап 6 — Frontend: Инфраструктура

## Задачи

22. Установить `zustand`
23. Создать экземпляр axios с interceptors (`api/axios.ts`)
24. Создать типы (`auth.types.ts`, `api.types.ts`)

---

## 2.1. Установка зависимостей

```bash
npm install zustand
```

**Zustand** — минималистичный state manager для React. Выбран за простоту, отсутствие boilerplate и нативную поддержку TypeScript.

---

## 2.2. Структура файлов фронтенда

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

## 2.3. Настройка Axios

### 2.3.1. Создать `resources/js/api/axios.ts`

- Создать экземпляр `axios.create()` с `baseURL: '/api'`
- **Request interceptor:** при каждом запросе получать токен из `useAuthStore.getState().token` и добавлять заголовок `Authorization: Bearer {token}`
- **Response interceptor:** при получении ошибки 401 — очищать стор авторизации (`useAuthStore.getState().logout()`) и перенаправлять на `/login` через `window.location.href`

### 2.3.2. Обновить `resources/js/bootstrap.ts`

Оставить как есть (для совместимости), но в проекте использовать собственный экземпляр из `api/axios.ts`.

---

## 2.4. Типы (TypeScript)

### 2.4.1. `features/auth/types/auth.types.ts`

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
