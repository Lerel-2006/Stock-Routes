<?php
    namespace App\Services;

    use Illuminate\Support\Facades\DB;
    Use InvalidArgumentException;
    use SplPriorityQueue;

    class RotaColetaService {
    public function gerar(array $produtoIds, string $inicio = 'E01'): array
    {
        $grafo = $this->montarGrafo();

        if (!isset($grafo[$inicio])) {
            throw new InvalidArgumentException(
                "O ponto inicial '$inicio' não existe no grafo."
            );
        }

        // Buscar os produtos selecionados e suas estantes.
        $produtoIds = array_values(array_unique(array_map('intval', $produtoIds)));

        $produtos = DB::table('produtos')
            ->join('estantes', 'estantes.id', '=', 'produtos.estante_id')
            ->whereIn('produtos.id', $produtoIds)
            ->select(
                'produtos.id as produto_id',
                'produtos.nome as produto',
                'estantes.codigo as local'
            )
            ->get()
            ->all();

        if (count($produtos) !== count($produtoIds)) {
            throw new InvalidArgumentException(
                'Um ou mais produtos não foram encontrados.'
            );
        }

        return $this->rotaColeta($grafo, $produtos, $inicio);
    }

    private function montarGrafo(): array
    {
        // Criar os vértices utilizando todas as estantes.
        $estantes = DB::table('estantes')
            ->pluck('codigo')
            ->all();

        $grafo = array_fill_keys($estantes, []);

        // Buscar as conexões entre as estantes.
        $arestas = DB::table('arestas')
            ->join('estantes as origem', 'origem.id', '=', 'arestas.estante_origem_id')
            ->join('estantes as destino', 'destino.id', '=', 'arestas.estante_destino_id')
            ->select(
                'origem.codigo as origem',
                'destino.codigo as destino',
                'arestas.distancia'
            )
            ->get();

        foreach ($arestas as $aresta) {
            $this->adicionarAresta(
                $grafo,
                $aresta->origem,
                $aresta->destino,
                (int) $aresta->distancia
            );
        }

        return $grafo;
    }

    private function adicionarAresta(
        array &$grafo,
        string $origem,
        string $destino,
        int $peso
    ): void {
        $grafo[$origem][$destino] = $peso;
        $grafo[$destino][$origem] = $peso;
    }

    private function dijkstra(array $grafo, string $origem): array
    {
        $distancia = [];
        $anterior = [];

        foreach (array_keys($grafo) as $vertice) {
            $distancia[$vertice] = INF;
            $anterior[$vertice] = null;
        }

        $distancia[$origem] = 0;

        $fila = new SplPriorityQueue();
        $fila->setExtractFlags(SplPriorityQueue::EXTR_BOTH);
        $fila->insert($origem, 0);

        while (!$fila->isEmpty()) {

            $item = $fila->extract();

            $atual = $item['data'];
            $distanciaAtual = -$item['priority'];

            // Ignorar entradas antigas da fila.
            if ($distanciaAtual > $distancia[$atual]) {
                continue;
            }

            foreach ($grafo[$atual] as $vizinho => $peso) {

                $novaDistancia = $distanciaAtual + $peso;

                if ($novaDistancia < $distancia[$vizinho]) {

                    $distancia[$vizinho] = $novaDistancia;
                    $anterior[$vizinho] = $atual;

                    $fila->insert($vizinho, -$novaDistancia);
                }
            }
        }

        return [$distancia, $anterior];
    }

    private function montarCaminho(
        array $anterior,
        string $origem,
        string $destino
    ): array {
        $caminho = [];
        $atual = $destino;

        while ($atual !== null) {

            array_unshift($caminho, $atual);

            if ($atual === $origem) {
                return $caminho;
            }

            $atual = $anterior[$atual] ?? null;
        }

        return [];
    }

    private function rotaColeta(
        array $grafo,
        array $produtos,
        string $inicio
    ): array {

        $posicao = $inicio;
        $pendentes = $produtos;
        $rota = [];

        while (!empty($pendentes)) {

            // Calcular as menores distâncias a partir da posição atual.
            [$distancia, $anterior] = $this->dijkstra(
                $grafo,
                $posicao
            );

            $melhorIndice = null;
            $menorDistancia = INF;

            // Encontrar o produto mais próximo.
            foreach ($pendentes as $indice => $produto) {

                $local = $produto->local;
                $d = $distancia[$local] ?? INF;

                if ($d < $menorDistancia) {

                    $menorDistancia = $d;
                    $melhorIndice = $indice;
                }
            }

            if ($melhorIndice === null) {
                throw new InvalidArgumentException(
                    'Não existe caminho até um ou mais produtos selecionados.'
                );
            }

            $melhor = $pendentes[$melhorIndice];
            $destino = $melhor->local;

            $rota[] = [
                'produto_id' => (int) $melhor->produto_id,
                'produto' => $melhor->produto,
                'local' => $destino,
                'distancia' => $menorDistancia,
                'caminho' => $this->montarCaminho(
                    $anterior,
                    $posicao,
                    $destino
                )
            ];

            // Atualizar posição para a próxima coleta.
            $posicao = $destino;

            // Retirar o produto coletado da lista.
            array_splice($pendentes, $melhorIndice, 1);
        }

        return $rota;
    }
}