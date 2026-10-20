<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Funcionario extends Authenticatable
{
    protected $fillable = [
        //id não precisa pois ele será auto incrementado, evitando que o usuário coloque qualquer valor aleatório e fora de ordem
        'nome',
        'matricula',
        'password',
        'ativo'
    ];

    protected $hidden = [
        'password'
    ];

    protected function casts(): array{

        return [
            'ativo' => 'boolean',
            'password' => 'hashed',
        ];

    }

    public function coletas(): HasMany{

        return $this->hasMany(Coleta::class);

    }
}
