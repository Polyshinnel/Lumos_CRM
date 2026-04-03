<?php

namespace App\Presentation\Auth\Controllers;

use App\Application\Auth\DTO\LoginDTO;
use App\Application\Auth\DTO\RegisterDTO;
use App\Application\Auth\Services\AuthService;
use App\Domain\Auth\Entities\User;
use App\Domain\Auth\Exceptions\InvalidCredentialsException;
use App\Domain\Auth\Exceptions\UserNotApprovedException;
use App\Http\Controllers\Controller;
use App\Presentation\Auth\Requests\LoginRequest;
use App\Presentation\Auth\Requests\RegisterRequest;
use App\Presentation\Auth\Resources\UserResource;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService,
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = $this->authService->register(new RegisterDTO(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'],
        ));

        return response()->json([
            'message' => 'Регистрация прошла успешно. Ожидайте подтверждения администратором.',
            'user' => UserResource::make($user),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            $token = $this->authService->login(new LoginDTO(
                email: $data['email'],
                password: $data['password'],
            ));
        } catch (InvalidCredentialsException) {
            return response()->json([
                'message' => 'Неверный email или пароль.',
            ], 401);
        } catch (UserNotApprovedException) {
            return response()->json([
                'message' => 'Ваш аккаунт ещё не подтверждён администратором.',
            ], 403);
        }

        return $this->tokenResponse($token, $this->authService->me());
    }

    public function me(): JsonResponse
    {
        return response()->json([
            'user' => UserResource::make($this->authService->me()),
        ]);
    }

    public function logout(): JsonResponse
    {
        $this->authService->logout();

        return response()->json([
            'message' => 'Вы успешно вышли из системы.',
        ]);
    }

    public function refresh(): JsonResponse
    {
        $token = $this->authService->refresh();
        auth('api')->setToken($token);

        return $this->tokenResponse($token, $this->authService->me());
    }

    private function tokenResponse(string $token, User $user): JsonResponse
    {
        $ttlInSeconds = auth('api')->factory()->getTTL() * 60;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $ttlInSeconds,
            'user' => UserResource::make($user),
        ]);
    }
}
