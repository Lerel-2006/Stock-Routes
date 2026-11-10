<?php

namespace App\Http\Controllers;
use App\Models\Aresta;


class ArestaController extends Controller
{
    public function index(){
        $arestas = Aresta::with(['estanteOrigem', 'estanteDestino'])->get();

        return response()->json($arestas);
    }
}
