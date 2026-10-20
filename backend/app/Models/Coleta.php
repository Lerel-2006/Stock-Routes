<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coleta extends Model
{
    protected $fillable = [
        'pedido_id',
        'funcionario_id',
        'status',
        'iniciado_em',
        'concluido_em'
    ];

    public function pedido(): BelongsTo{

        return $this->belongsTo(Pedido::class);

    }

    public function funcionario(): BelongsTo{

        return $this->belongsTo(Funcionario::class);

    }

    public function itens(): HasMany{

        return $this->hasMany(ColetaItem::class);

    }
}
