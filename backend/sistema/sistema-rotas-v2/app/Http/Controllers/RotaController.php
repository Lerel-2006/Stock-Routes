<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produto;
use App\Models\Aresta;

class RotaController extends Controller
{
    public function calcular(Request $request){
        $dados = $request->validate([
            'produtos' => 'required|array|min:1',
            'produtos.*' => 'required|integer|distinct|exists:produtos,id'
        ]);

        //buscando as estantes que cada produto pertence
        $produtos = Produto::with('estante')
            ->whereIn('id', $dados['produtos'])
            ->get();

        $arestas = Aresta::all();
        return response()->json([
            'mensagem' => 'Produtos e estantes encontrados!',
            'produtos' => $produtos,
            'arestas' => $arestas
        ]);
    }
}
