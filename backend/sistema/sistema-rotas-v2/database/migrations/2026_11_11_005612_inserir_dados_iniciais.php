
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Funcionário de teste
        DB::table('funcionarios')->insert([
            'email' => 'teste@estoque.com',
            'password' => Hash::make('123456'),
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // 2. Entrada do estoque
        DB::table('estantes')->insert([
            'codigo' => 'ENTRADA',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // 3. Cadastrar 20 estantes
        for ($i = 1; $i <= 20; $i++) {
            DB::table('estantes')->insert([
                'codigo' => 'E' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Buscar os IDs das estantes
        $estantes = DB::table('estantes')
            ->pluck('id', 'codigo');

        // 4. Cadastrar produtos
        $produtos = [
            ['Teclado', 20, 'E01'],
            ['Mouse', 35, 'E02'],
            ['Monitor', 12, 'E03'],
            ['Headset', 25, 'E04'],
            ['Webcam', 18, 'E05'],
            ['Microfone', 15, 'E06'],
            ['Controle', 30, 'E07'],
            ['Caixa de Som', 10, 'E08'],
            ['Notebook', 8, 'E09'],
            ['Impressora', 7, 'E10'],
            ['SSD', 40, 'E11'],
            ['HD Externo', 22, 'E12'],
            ['Memória RAM', 50, 'E13'],
            ['Placa de Vídeo', 9, 'E14'],
            ['Processador', 16, 'E15'],
            ['Placa-Mãe', 14, 'E16'],
            ['Fonte', 24, 'E17'],
            ['Gabinete', 11, 'E18'],
            ['Roteador', 19, 'E19'],
            ['Switch de Rede', 13, 'E20']
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

        // 5. Conexões entre as estantes
        // Grafo não direcionado
        // Distâncias em metros
        // Apenas conexões horizontais e verticais

        $arestas = [
            // Entrada
            ['ENTRADA', 'E01', 2],

            // Corredores horizontais - Linha 1
            ['E01', 'E02', 4],
            ['E02', 'E03', 4],
            ['E03', 'E04', 4],
            ['E04', 'E05', 4],

            // Corredores horizontais - Linha 2
            ['E06', 'E07', 4],
            ['E07', 'E08', 4],
            ['E08', 'E09', 4],
            ['E09', 'E10', 4],

            // Corredores horizontais - Linha 3
            ['E11', 'E12', 4],
            ['E12', 'E13', 4],
            ['E13', 'E14', 4],
            ['E14', 'E15', 4],

            // Corredores horizontais - Linha 4
            ['E16', 'E17', 4],
            ['E17', 'E18', 4],
            ['E18', 'E19', 4],
            ['E19', 'E20', 4],

            // Corredores verticais - Coluna 1
            ['E01', 'E06', 3],
            ['E06', 'E11', 3],
            ['E11', 'E16', 3],

            // Corredores verticais - Coluna 2
            ['E02', 'E07', 3],
            ['E07', 'E12', 3],
            ['E12', 'E17', 3],

            // Corredores verticais - Coluna 3
            ['E03', 'E08', 3],
            ['E08', 'E13', 3],
            ['E13', 'E18', 3],

            // Corredores verticais - Coluna 4
            ['E04', 'E09', 3],
            ['E09', 'E14', 3],
            ['E14', 'E19', 3],

            // Corredores verticais - Coluna 5
            ['E05', 'E10', 3],
            ['E10', 'E15', 3],
            ['E15', 'E20', 3]
        ];

        // Inserir arestas utilizando os IDs
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
        $codigos = ['ENTRADA'];

        for ($i = 1; $i <= 20; $i++) {
            $codigos[] = 'E' . str_pad($i, 2, '0', STR_PAD_LEFT);
        }

        $ids = DB::table('estantes')
            ->whereIn('codigo', $codigos)
            ->pluck('id');

        // Remover arestas
        DB::table('arestas')
            ->whereIn('estante_origem_id', $ids)
            ->delete();

        DB::table('arestas')
            ->whereIn('estante_destino_id', $ids)
            ->delete();

        // Remover produtos
        DB::table('produtos')
            ->whereIn('estante_id', $ids)
            ->delete();

        // Remover estantes
        DB::table('estantes')
            ->whereIn('id', $ids)
            ->delete();

        // Remover funcionário de teste
        DB::table('funcionarios')
            ->where('email', 'teste@estoque.com')
            ->delete();
    }
};
