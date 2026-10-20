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
        Schema::create('coleta_itens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coleta_id')
                    ->constrained('coletas');
            $table->foreignId('item_pedido_id')
                    ->constrained('item_pedidos');
            $table->unsignedInteger('ordem');
            $table->string('status')->default('PENDENTE');
            $table->timestamp('coletado_em')->nullable();
            $table->timestamps();

            $table->unique(['coleta_id', 'ordem']);//garante que eu não tenha 2 ítens na mesma posição da sequência
            $table->unique(['coleta_id', 'item_pedido_id']);//um mesmo item de pedido não seja inserido 2x na mesma coleta
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coleta_itens');
    }
};
