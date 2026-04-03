<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Domain\Auth\Entities\User;
use App\Domain\Auth\Enums\UserStatus;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('auth:create-approved-user', function () {
    $name = (string) $this->ask('Имя пользователя');
    $email = (string) $this->ask('Почта');
    $password = (string) $this->ask('Пароль (ввод будет видимым)');

    $validator = validator(
        [
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ],
        [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ],
    );

    if ($validator->fails()) {
        foreach ($validator->errors()->all() as $error) {
            $this->error($error);
        }

        return self::FAILURE;
    }

    $user = User::create([
        'name' => $name,
        'email' => $email,
        'password' => $password,
        'status' => UserStatus::Approved,
    ]);

    $this->info('Пользователь успешно создан.');
    $this->line("ID: {$user->id}");
    $this->line("Email: {$user->email}");
    $this->line("Статус: {$user->status->value}");

    return self::SUCCESS;
})->purpose('Создаёт пользователя со статусом approved');
