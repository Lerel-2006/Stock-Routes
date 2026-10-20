<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
//usado para criar a relação entre tabelas
// HasMany = possuí vários   -> nesse caso N
// BelongsTo = pertence a    -> nesse caso 1
// Relacionamento: 1 ---- N

class Produto extends Model
{
    protected $fillable = [
        'nome',
        'peso',
        'quantidade_estoque',
        'posicao_id',
        'ativo'
    ];

    public function posicao(): BelongsTo{

        return $this->belongsTo(Posicao::class);

    }

    public function itensPedido(): HasMany{

        return $this->hasMany(ItemPedido::class);

    }
}
