<?php
    namespace App\Services;

    use Illuminate\Support\Facades\DB;
    Use InvalidArgumentException;
    use SplPriorityQueue;

    class RotaColetaService {

        public function gerar(array $produtoIds, string $inicio = "Entrada") : array {
            $grafo = $this->montarGrafo();

            if (!isset($grafo[$inicio])) {
                throw new InvalidArgumentException("O ponto de início '$inicio' não existe no grafo.");
            }


            $localProduto = DB::table("produtos")
                ->join("estantes", "estantes .id", "=", "produtos.estante_id")
                ->whereIn("produtos.id", $produtoIds)
                ->select("produtos.nome", "estantes.codigo as local")
                ->pluck("local", "nome")
                ->all();


                $escolhido = array_keys($localProduto);

                return $this->rotaColeta($grafo, $localProduto, $escolhido, $inicio);
        }

        private function montarGrafo() : array {

        $arestas = DB::table("arestas")
            ->join("estantes as o", "o.id", "=", "arestas.estante_origem_id")
            ->join("estantes as d", "d.id", "=", "arestas.estante_destino_id")
            ->select("o.codigo as origem", "d.codigo as destino", "arestas.distancia")
            ->get();

            $grafo = [];

            foreach($arestas as $a){
                $this->adicionarAresta($grafo,$a->origem, $a->destino, (int) $a->distancia);
                
            }
            return $grafo;
        }

        private function adicionarAresta(array &$grafo, string $a, string $b, int $peso): void {
            $grafo[$a][$b] = $peso;
            $grafo[$b][$a] = $peso;
        }

        private function dijkstra(array $grafo, string $origem): array {
            $distancia = [];
            $anterior = [];

            foreach(array_keys($grafo) as $vertice) {
                $distancia[$vertice] = INF;
                $anterior[$vertice] = null;
            }
            $distancia [$origem] = 0;

            $fila = new SplPriorityQueue();
            $fila->insert($origem, 0);

            while (!$fila->isEmpty()) {
            $atual = $fila->extract();

            foreach ($grafo[$atual] as $vizinho => $peso) {
                $novaDistancia = $distancia[$atual] + $peso;

                if ($novaDistancia < $distancia[$vizinho]) {
                    $distancia[$vizinho] = $novaDistancia;
                    $anterior[$vizinho] = $atual;
                    $fila->insert($vizinho, -$novaDistancia);
                }
            }
        }

        return [$distancia, $anterior];
        }

        function montarCaminho(array $anterior, string $destino): array {
        $caminho = [];

        for($vertice = $destino; $vertice !== null; $vertice = $anterior[$vertice]) {
            array_unshift($caminho, $vertice);
        }
        return $caminho;
    }

    function rotaColeta (array $grafo, array $localProduto, array $escolhidos, string $inicio = 'Entrada') : array {
        $posicao = $inicio;
        $pendentes = $escolhidos;
        $rota = [];

        while (!empty($pendentes)) {
            [$distancia, $anterior] = dijkstra($grafo, $posicao);

            $melhor = null;
            $menorDistancia = INF;

            foreach ($pendentes as $produto) {
                $d = $distancia[$localProduto[$produto]];

                if ($d < $menorDistancia) {
                    $menorDistancia = $d;
                    $melhor = $produto;
                }
            }
            $destino = $localProduto[$melhor];
            $rota [] = [
                'produto' => $melhor,
                'local' => $destino,
                'distancia' => $menorDistancia,
                'caminho' => montarCaminho($anterior, $destino)
            ];
            $posicao = $destino;
            $pendentes = array_values(array_diff($pendentes, [$melhor]));
        }
        return $rota;
    }


    }
?>