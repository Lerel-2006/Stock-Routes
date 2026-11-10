<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    public function index(){
        $produtos = Produto::all();//é como fazer isso: SELECT * FROM produtos;

        return response()->json($produtos);//Retornar os dados no formato json
    }
}
