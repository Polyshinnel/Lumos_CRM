import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Anchor, Button, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { AxiosError } from 'axios';

import { register } from '../api/authApi';
import type { ApiErrorResponse } from '../../../types/api.types';

interface RegisterFieldErrors {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
}

export function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        setSuccessMessage(null);
        setFieldErrors({});
        setIsSubmitting(true);

        try {
            const response = await register({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            setSuccessMessage(response.message);
            setName('');
            setEmail('');
            setPassword('');
            setPasswordConfirmation('');
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const responseData = axiosError.response?.data;

            setFormError(responseData?.message ?? 'Не удалось выполнить регистрацию. Попробуйте позже.');

            if (responseData?.errors) {
                setFieldErrors({
                    name: responseData.errors.name?.[0],
                    email: responseData.errors.email?.[0],
                    password: responseData.errors.password?.[0],
                    password_confirmation: responseData.errors.password_confirmation?.[0],
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
                {successMessage ? <Alert color="green">{successMessage}</Alert> : null}

                <TextInput
                    label="Имя"
                    placeholder="Иван Иванов"
                    value={name}
                    onChange={(event) => setName(event.currentTarget.value)}
                    error={fieldErrors.name}
                    required
                />

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
                    placeholder="Минимум 8 символов"
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    error={fieldErrors.password}
                    required
                />

                <PasswordInput
                    label="Подтверждение пароля"
                    placeholder="Повторите пароль"
                    value={passwordConfirmation}
                    onChange={(event) => setPasswordConfirmation(event.currentTarget.value)}
                    error={fieldErrors.password_confirmation}
                    required
                />

                <Button type="submit" loading={isSubmitting} fullWidth>
                    Зарегистрироваться
                </Button>

                <Text size="sm" ta="center">
                    Уже есть аккаунт?{' '}
                    <Anchor component={Link} to="/login">
                        Войдите
                    </Anchor>
                </Text>
            </Stack>
        </form>
    );
}
