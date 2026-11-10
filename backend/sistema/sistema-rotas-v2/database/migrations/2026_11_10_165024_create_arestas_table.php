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
        Schema::create('arestas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('estante_origem_id')
                ->constrained('estantes');

            $table->foreignId('estante_destino_id')
                ->constrained('estantes');

            $table->unsignedInteger('distancia');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arestas');
    }
};
