<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('funcionarios', function (Blueprint $table) {
            $table->id();//não precisa escrever unique, nem auto_increment, o laravel já faz isso para nós por padrão
            $table->string('nome');
            $table->string('matricula')->unique();
            $table->string('password');//melhor colocar como password para facilitar na hr da autenticação com o laravel
            $table->boolean('ativo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('funcionarios');
    }
};
