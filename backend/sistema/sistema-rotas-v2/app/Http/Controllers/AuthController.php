<?php

namespace App\Http\Controllers;

use App\Models\Funcionario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function login(Request $request){
        $dados = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $funcionario = Funcionario::where('email', $dados['email'])->first();

        if(!$funcionario || !Hash::check($dados['password'], $funcionario->password)){
            return response()->json([
                'mensagem' => 'E-mail ou senha inválidos.'
            ], 401);
        }

        //$token = $funcionario->createToken('token-funcionario')->plainTextToken;//Depois se der tempo eu faço com token

        return response()->json([
            'mensagem' => 'Login Realizado com sucesso!',
            //'token' => $token,//Depois se der tempo eu faço com token
            'funcionario' => [
                'id' => $funcionario->id,
                'email' => $funcionario->email
            ]
        ]);
    }
    
    /*
    pulbic function logout(Request $request){
        $request->user()->
    }
    */
}
