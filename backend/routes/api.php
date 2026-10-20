<?php

use Illuminate\Support\Facades\Routes;
use App\Http\Controllers\PosicaoController;
use App\Http\Controllers\ProdutoController;

Route::get('/teste', function(){
    return response()->json([
        'mensagem' => 'API do sistema de rotas funcionando!'
    ]);
});

//Rotas

//Posições
//retorna todas as posições
Route::get('/posicoes', [PosicaoController::class, 'index']);//Aqui eu chamo aquela função index que lista todas as posições cadastradas no banco que está nos Controllers
//Para testar é só colocar no Postman a seguinte url: http://127.0.0.1:8000/api/posicoes


//Cria uma nova posição
Route::post('/posicoes', [PosicaoController::class, 'store']);

//Produtos
//Retorna TODOS os produtos
Route::get('/produtos', [ProdutoController::class, 'index']);

//Cria um novo produto
Route::post('/produtos', [ProdutoController::class, 'store']);