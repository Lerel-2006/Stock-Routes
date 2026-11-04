<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Produto extends Model
{
    protected $fillable = [
        'nome',
        'quantidade',
        'estante_id',
    ];

    public function estante(): BelongsTo{
        return $this->belongsTo(Estante::class);
    }
}
