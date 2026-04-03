import { api } from '../../../api/axios';
import type { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse, User } from '../types/auth.types';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
};

export const getMe = async (): Promise<User> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
};

export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};

export const refreshToken = async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh');
    return response.data;
};
