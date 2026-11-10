<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Estante extends Model
{
    protected $fillable = [
        'codigo',
    ];

    public function produto(): HasOne{
        return $this->hasOne(Produto::class);
    }
}
