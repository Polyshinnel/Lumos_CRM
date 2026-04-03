import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Anchor, Button, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { AxiosError } from 'axios';

import { login } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';
import type { ApiErrorResponse } from '../../../types/api.types';

interface LoginFieldErrors {
    email?: string;
    password?: string;
}

export function LoginForm() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        setFieldErrors({});
        setIsSubmitting(true);

        try {
            const response = await login({ email, password });
            setAuth(response.access_token, {
                ...response.user,
                role: response.user.role ?? 'user',
            });
            navigate('/', { replace: true });
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const responseData = axiosError.response?.data;

            setFormError(responseData?.message ?? 'Не удалось выполнить вход. Попробуйте позже.');

            if (responseData?.errors) {
                setFieldErrors({
                    email: responseData.errors.email?.[0],
                    password: responseData.errors.password?.[0],
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                {formError ? <Alert color="red">{formError}</Alert> : null}

                <TextInput
                    label="Email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    error={fieldErrors.email}
                    required
                />

                <PasswordInput
                    label="Пароль"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    error={fieldErrors.password}
                    required
                />

                <Button type="submit" loading={isSubmitting} fullWidth>
                    Войти
                </Button>

                <Text size="sm" ta="center">
                    Нет аккаунта?{' '}
                    <Anchor component={Link} to="/register">
                        Зарегистрируйтесь
                    </Anchor>
                </Text>
            </Stack>
        </form>
    );
}
