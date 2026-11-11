
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Cadastrar estantes
        for ($i = 1; $i <= 8; $i++) {
            DB::table('estantes')->insert([
                'codigo' => 'E' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 2. Buscar os IDs das estantes
        $estantes = DB::table('estantes')
            ->pluck('id', 'codigo');

        // 3. Cadastrar produtos
        $produtos = [
            ['Teclado', 20, 'E01'],
            ['Mouse', 35, 'E02'],
            ['Monitor', 12, 'E03'],
            ['Headset', 25, 'E04'],
            ['Webcam', 18, 'E05'],
            ['Microfone', 15, 'E06'],
            ['Controle', 30, 'E07'],
            ['Caixa de Som', 10, 'E08']
        ];

        foreach ($produtos as $produto) {
            DB::table('produtos')->insert([
                'nome' => $produto[0],
                'quantidade' => $produto[1],
                'estante_id' => $estantes[$produto[2]],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 4. Cadastrar arestas
        // Grafo não direcionado
        // Distâncias em metros
        $arestas = [
            ['E01', 'E02', 4],
            ['E02', 'E03', 6],
            ['E01', 'E04', 3],
            ['E02', 'E05', 5],
            ['E03', 'E06', 2],
            ['E04', 'E05', 7],
            ['E05', 'E06', 4],
            ['E04', 'E07', 6],
            ['E05', 'E08', 3],
            ['E07', 'E08', 5]
        ];

        foreach ($arestas as $aresta) {
            DB::table('arestas')->insert([
                'estante_origem_id' => $estantes[$aresta[0]],
                'estante_destino_id' => $estantes[$aresta[1]],
                'distancia' => $aresta[2],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }

    public function down(): void
    {
        // Remover apenas os registros iniciais
        $codigos = [
            'E01', 'E02', 'E03', 'E04',
            'E05', 'E06', 'E07', 'E08'
        ];

        $ids = DB::table('estantes')
            ->whereIn('codigo', $codigos)
            ->pluck('id');

        DB::table('arestas')
            ->whereIn('estante_origem_id', $ids)
            ->whereIn('estante_destino_id', $ids)
            ->delete();

        DB::table('produtos')
            ->whereIn('estante_id', $ids)
            ->delete();

        DB::table('estantes')
            ->whereIn('id', $ids)
            ->delete();
    }
};
