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
        //entidade/Tabela associativa Pedido 1 ───── N ItemPedido N ───── 1 Produto
        Schema::create('item_pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')
                  ->constrained('pedidos');
            $table->foreignId('produto_id')
                  ->constrained('produtos');
            $table->unsignedInteger('quantidade');
            $table->timestamps();

            $table->unique(['pedido_id', 'produto_id']);//impedir que o mesmo produto apareça 2x no mesmo pedido
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_pedidos');
    }
};
