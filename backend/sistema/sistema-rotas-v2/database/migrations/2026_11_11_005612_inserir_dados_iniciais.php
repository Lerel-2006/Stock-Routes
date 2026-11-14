
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        // Cadastrar funcionário de teste
        DB::table('funcionarios')->insert([
            'email' => 'teste@estoque.com',
            'password' => Hash::make('123456'),
            'created_at' => now(),
            'updated_at' => now()
        ]);
        // 1. Cadastrar a entrada primeiro
        DB::table('estantes')->insert([
            'codigo' => 'ENTRADA',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // 2. Cadastrar as 20 estantes
        for ($i = 1; $i <= 20; $i++) {
            DB::table('estantes')->insert([
                'codigo' => 'E' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // 3. Buscar os IDs das estantes
        $estantes = DB::table('estantes')
            ->pluck('id', 'codigo');

        // 4. Cadastrar os produtos
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

        // 5. Cadastrar as arestas
        // Grafo não direcionado
        // Distâncias em metros
        $arestas = [
            ['ENTRADA', 'E01', 2],
            ['ENTRADA', 'E05', 4],
            ['E01', 'E02', 4],
            ['E02', 'E03', 6],
            ['E03', 'E04', 3],
            ['E04', 'E05', 5],
            ['E05', 'E06', 2],
            ['E06', 'E07', 4],
            ['E07', 'E08', 3],
            ['E08', 'E09', 5],
            ['E09', 'E10', 2],
            ['E10', 'E11', 6],
            ['E11', 'E12', 3],
            ['E12', 'E13', 4],
            ['E13', 'E14', 2],
            ['E14', 'E15', 5],
            ['E15', 'E16', 3],
            ['E16', 'E17', 4],
            ['E17', 'E18', 2],
            ['E18', 'E19', 5],
            ['E19', 'E20', 3],

            // Conexões alternativas
            ['E01', 'E06', 7],
            ['E02', 'E07', 5],
            ['E03', 'E08', 8],
            ['E05', 'E10', 6],
            ['E07', 'E12', 7],
            ['E09', 'E14', 9],
            ['E11', 'E16', 6],
            ['E13', 'E18', 8],
            ['E15', 'E20', 7]
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
        $codigos = ['ENTRADA'];

        for ($i = 1; $i <= 20; $i++) {
            $codigos[] = 'E' . str_pad($i, 2, '0', STR_PAD_LEFT);
        }

        $ids = DB::table('estantes')
            ->whereIn('codigo', $codigos)
            ->pluck('id');

        DB::table('arestas')
            ->whereIn('estante_origem_id', $ids)
            ->delete();

        DB::table('arestas')
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
