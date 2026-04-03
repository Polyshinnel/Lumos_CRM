# Этап 7 — Frontend: Auth store и API

## Задачи

25. Создать `useAuthStore` (Zustand)
26. Создать `authApi.ts`

---

## 2.5. Zustand Auth Store

### 2.5.1. `features/auth/store/useAuthStore.ts`

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

## 2.6. Auth API функции

### 2.6.1. `features/auth/api/authApi.ts`

Использует экземпляр axios из `api/axios.ts`:

- `login(data: LoginRequest): Promise<AuthResponse>` → POST `/auth/login`
- `register(data: RegisterRequest): Promise<RegisterResponse>` → POST `/auth/register`
- `getMe(): Promise<User>` → GET `/auth/me`
- `logout(): Promise<void>` → POST `/auth/logout`
- `refreshToken(): Promise<AuthResponse>` → POST `/auth/refresh`
