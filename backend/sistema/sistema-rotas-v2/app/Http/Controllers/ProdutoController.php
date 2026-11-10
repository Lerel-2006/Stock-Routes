<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    public function index(){
        //$produtos = Produto::all();//é como fazer isso: SELECT * FROM produtos;
        $produtos = Produto::with('estante')->get();

        $produtosFormatados = $produtos->map(function ($produto) {
            return [
                'id' => $produto->id,
                'nome' => $produto->nome,
                'quantidade' => $produto->quantidade,
                'local' => $produto->estante->codigo
            ];
        });
        return response()->json($produtos);//Retornar os dados no formato json
    }
}
