import { create } from 'zustand';

import type { User } from '../types/auth.types';
import { getMe } from '../api/authApi';

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User) => void;
    setUser: (user: User) => void;
    loadUser: () => Promise<void>;
    logout: () => void;
}

const ACCESS_TOKEN_KEY = 'access_token';
const initialToken = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;

export const useAuthStore = create<AuthState>((set) => ({
    token: initialToken,
    user: null,
    isAuthenticated: Boolean(initialToken),
    setAuth: (token, user) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        set({
            token,
            user,
            isAuthenticated: true,
        });
    },
    setUser: (user) => {
        set({ user });
    },
    loadUser: async () => {
        try {
            const user = await getMe();
            set({
                user: {
                    ...user,
                    role: user.role ?? 'user',
                },
            });
        } catch {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            set({
                token: null,
                user: null,
                isAuthenticated: false,
            });
        }
    },
    logout: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        set({
            token: null,
            user: null,
            isAuthenticated: false,
        });
    },
}));
