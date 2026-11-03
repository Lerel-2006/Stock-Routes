<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Funcionario extends Model
{
    protected $table = 'funcionarios';

    protected $fillable = [
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts():array{
        return[
            'password' => 'hashed',
        ];
    }
}
