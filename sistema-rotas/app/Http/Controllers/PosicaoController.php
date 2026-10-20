<?php

namespace App\Http\Controllers;

use App\Models\Posicao;
use Illuminate\Http\Request;

class PosicaoController extends Controller
{
    public function index(){//função que vou usar para retornar todas as posições

        $posicoes = Posicao::all();//vai consultar as tabelas e retornar todos os registros utilizando o Eloquent que é o ORM do Laravel
                                    //o ORM serve para interagir com o banco de dados usando objetos e classes em vez de escrever SQL puro

        return response()->json($posicoes); //retorna um json igual nas aulas do Santi, vou usar o Postman para visualizar

    }

    //método para cadastrar uma nova posição
    public function store(Request $request){
        $dados = $request->validate([
            'codigo' => 'required|string|max:255|unique:posicoes,codigo',//sem espaços aqui, se não vai dar erro, O laravel vai achar que os espaços fazem parte do nome dos campos
            'x'      => 'required|numeric',
            'y'      => 'required|numeric',
            'z'      => 'required|numeric|min:0'
        ]);

        $posicao = Posicao::create($dados);

        return response()->json($posicao, 201);
    }
}
