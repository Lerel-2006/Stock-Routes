<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\ArestaController;
use App\Http\Controllers\EstanteController;
use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/produtos', [ProdutoController::class, 'index'])->middleware('auth:sanctum');

Route::get('/arestas', [ArestaController::class, 'index'])->middleware('auth:sanctum');

Route::get('/estantes', [EstanteController::class, 'index'])->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);