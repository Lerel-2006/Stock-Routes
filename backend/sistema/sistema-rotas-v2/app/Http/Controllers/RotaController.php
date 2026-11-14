<?php

namespace App\Http\Controllers;

use App\Services\RotaColetaService;
use Illuminate\Http\Request;
use InvalidArgumentException;
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

    public function coleta(Request $request, RotaColetaService $service)
    {
        $dados = $request->validate([
            'produtos'   => 'required|array|min:1',
            'produtos.*' => 'integer|exists:produtos,id',
            'inicio'     => 'nullable|string|exists:estantes,codigo',
        ]);

        try {
            $rota = $service->gerar($dados['produtos'], $dados['inicio'] ?? 'Entrada');
        } catch (InvalidArgumentException $e) {
            return response()->json(['erro' => $e->getMessage()], 422);
        }

        return response()->json([
            'rota' => $rota,
            'distancia_total' => array_sum(array_column($rota, 'distancia')),
        ]);
    }
}