export type UserRole = 'user' | 'admin';

export interface User {
    id: number;
    name: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    role: UserRole;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}

export interface RegisterResponse {
    message: string;
    user: User;
}
