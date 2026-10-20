<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pedido extends Model
{
    protected $fillable = [
        'status'
    ];

    public function itens(): HasMany{

        return $this->hasMany(ItemPedido::class);

    }

    public function coletas(): HasMany{

        return $this->hasMany(Coleta::class);

    }
}
