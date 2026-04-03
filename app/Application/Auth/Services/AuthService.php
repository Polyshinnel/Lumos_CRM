<?php

namespace App\Application\Auth\Services;

use App\Application\Auth\DTO\LoginDTO;
use App\Application\Auth\DTO\RegisterDTO;
use App\Domain\Auth\Entities\User;
use App\Domain\Auth\Enums\UserStatus;
use App\Domain\Auth\Exceptions\InvalidCredentialsException;
use App\Domain\Auth\Exceptions\UserNotApprovedException;
use App\Domain\Auth\Repositories\UserRepositoryInterface;
use Illuminate\Auth\AuthenticationException;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function register(RegisterDTO $dto): User
    {
        return $this->userRepository->create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => $dto->password,
            'status' => UserStatus::Pending,
        ]);
    }

    /**
     * @throws InvalidCredentialsException
     * @throws UserNotApprovedException
     */
    public function login(LoginDTO $dto): string
    {
        $token = auth('api')->attempt([
            'email' => $dto->email,
            'password' => $dto->password,
        ]);

        if ($token === false) {
            throw new InvalidCredentialsException();
        }

        $user = auth('api')->user();

        if (! $user instanceof User) {
            throw new AuthenticationException();
        }

        if (! $user->isApproved()) {
            throw new UserNotApprovedException();
        }

        return $token;
    }

    public function me(): User
    {
        $user = auth('api')->user();

        if (! $user instanceof User) {
            throw new AuthenticationException();
        }

        return $user;
    }

    public function logout(): void
    {
        auth('api')->logout();
    }

    public function refresh(): string
    {
        return auth('api')->refresh();
    }
}
