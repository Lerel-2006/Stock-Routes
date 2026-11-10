<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Aresta extends Model
{
    protected $fillable = [
        'estante_origem_id',
        'estante_destino_id',
        'distancia',
    ];

    public function estanteOrigem(): BelongsTo{
        return $this->belongsTo(Estante::class, 'estante_origem_id');
    }

    public function estanteDestino(): BelongsTo{
        return $this->belongsTo(Estante::class, 'estante_destino_id');
    }
}
