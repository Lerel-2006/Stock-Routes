<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemPedido extends Model
{
    protected $fillable = [
        'pedido_id',
        'produto_id',
        'quantidade'
    ];

    //Duas funções BelongsTo pq como é um tabela associativa, ela tem um relacionamento 1-- N
    //tanto com produto e pedido
    public function pedido(): BelongsTo{

        return $this->belongsTo(Pedido::class);

    }

    public function produto(): BelongsTo{
        
        return $this->belongsTo(Produto::class);

    }

    public function itensColeta(): HasMany{
        
        return $this->hasMany(ColetaItem::class);

    }
}
