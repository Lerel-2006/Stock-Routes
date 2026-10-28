<?php
    function adicionarAresta(array &$grafo, string $a, string $b, int $peso): void {
        $grafo[$a][$b] = $peso;
        $grafo[$b][$a] = $peso;
    }

    function dijkstra(array $grafo, string $origem): array {
        $distancia = [];
        $anterior = [];

        foreach (array_keys($grafo) as $vertice) {
            $distancia[$vertice] = INF;
            $anterior[$vertice] = null;
        }
        $distancia[$origem] = 0;

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

    $grafo = [];

    adicionarAresta($grafo, 'Entrada', 'A1', 2);
    adicionarAresta($grafo, 'A1', 'A2', 1);
    adicionarAresta($grafo, 'A2', 'A3', 1);
    adicionarAresta($grafo, 'Entrada', 'B1', 3);
    adicionarAresta($grafo, 'B1', 'B2', 1);
    adicionarAresta($grafo, 'B2', 'B3', 1);
    adicionarAresta($grafo, 'A3', 'B3', 3);
    adicionarAresta($grafo, 'A1', 'B1', 3);

    $localProduto = [
        'teclado' => 'A1',
        'mouse' => 'A2',
        'monitor' => 'A3',
        'placa de vídeo' => 'B1',
    ];


    $escolhidos = ['placa de vídeo', 'mouse'];

    $rota = rotaColeta($grafo, $localProduto, $escolhidos);

    foreach ($rota as $i => $item) {
        echo ($i + 1) . "º Produto: " . $item['produto'] . "\n";
        echo "Local: " . $item['local'] . "\n";
        echo "Distância: " . $item['distancia'] . "\n";
        echo "\n";
    }
    $distanciaTotal = array_sum(array_column($rota, 'distancia'));
    echo "Distância total a ser percorrida: " . $distanciaTotal;
?>