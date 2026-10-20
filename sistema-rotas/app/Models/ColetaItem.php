<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ColetaItem extends Model
{
    protected $table = 'coleta_itens';

    protected $fillable = [
        'coleta_id',
        'item_pedido_id',
        'ordem',
        'status',
        'coletado_em'
    ];

    public function coleta(): BelongsTo{

        return $this->belongsTo(Coleta::class);

    }

    public function itemPedido(): BelongsTo{

        return $this->belongsTo(ItemPedido::class);

    }
}
