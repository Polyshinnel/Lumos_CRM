<?php

namespace App\Domain\Auth\Exceptions;

use Exception;

class UserNotApprovedException extends Exception
{
    protected $message = 'User account is not approved.';
}
