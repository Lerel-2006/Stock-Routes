<?php

namespace App\Http\Controllers;

use App\Models\Estante;

class EstanteController extends Controller
{
    public function index(){
        $estantes = Estante::all();
        return response()->json($estantes);
    }
}
