<?php

namespace App\Application\Auth\DTO;

class LoginDTO
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
    ) {}
}
