<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    public function index(){

        $produtos = Produto::with('posicao')->get();
        // Veja a diferença
        // Produto::all(); pega todos os produtos, todavia NÃO incluí os dados da posição no JSON
        // Produto::with('posicao')->get();com with busca os produtos e suas posições relacionadas, isso é chamado de Eager Loading

        return response()->json($produtos);
    }

    public function store(Request $request){
        $dados = $request->validate([
            'nome'               => 'required|string|max:255',
            'peso'               => 'required|numeric|min:0',
            'quantidade_estoque' => 'required|integer|min:0',
            'posicao_id'         => 'required|integer|exists:posicoes,id',//exists quer dizer que a posição precisa existir na tabela posições
            'ativo'              => 'sometimes|boolean'//sometimes, o campo só será validado quando estiver presente, ou seja se não colocar nada não precisa validar, se colocar ele precisa ser validado 
        ]);

        $produto = Produto::create($dados);

        return response()->json($produto, 201);
    }
}
