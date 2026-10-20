<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;//Para criar a relação entre tabela
// HasMany = N
// BelongsTo = 1
// Relacionamento: 1 ---- N

class Posicao extends Model
{
    protected $table = 'posicoes';

    protected $fillable = [
        'codigo',
        'x', 
        'y',
        'z'
    ];

    public function produtos(): HasMany{
        return $this->hasMany(Produto::class);
    }
}
