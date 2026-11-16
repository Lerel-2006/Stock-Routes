
import { useEffect, useMemo, useState } from 'react'
import '../styles/Rotas.css'

const API = 'http://127.0.0.1:8000/api'

function lerJson(response) {
  if (!response.ok) {
    throw new Error('Erro ao carregar dados')
  }

  return response.json()
}

function normalizarCodigo(valor) {
  return String(valor ?? '').trim().toUpperCase()
}

function chaveDaAresta(origem, destino) {
  return [normalizarCodigo(origem), normalizarCodigo(destino)]
    .sort()
    .join('::')
}

function codigoDoPonto(ponto, estantesPorId) {
  const estante = estantesPorId.get(String(ponto))
  return normalizarCodigo(estante?.codigo ?? ponto)
}

function calcularPosicoes(estantes) {
  const ordenadas = [...estantes].sort((a, b) =>
    String(a.codigo).localeCompare(String(b.codigo), 'pt-BR')
  )

  const colunas = Math.max(1, Math.ceil(Math.sqrt(ordenadas.length)))
  const espacoX = 120
  const espacoY = 110
  const margem = 58
  const mapa = new Map()

  ordenadas.forEach((estante, indice) => {
    mapa.set(estante.id, {
      x: margem + (indice % colunas) * espacoX,
      y: margem + Math.floor(indice / colunas) * espacoY,
    })
  })

  const linhas = Math.ceil(ordenadas.length / colunas) || 1

  return {
    mapa,
    largura: margem * 2 + Math.max(0, colunas - 1) * espacoX,
    altura: margem * 2 + Math.max(0, linhas - 1) * espacoY,
  }
}

function montarParadas(produtos, estantes, rotaCalculada) {
  if (Array.isArray(rotaCalculada) && rotaCalculada.length > 0) {
    return rotaCalculada.map((item) => {
      const produtoOriginal = produtos.find(
        (produto) =>
          String(produto.id) === String(item.produto_id)
      )

      const estante = estantes.find(
        (estante) =>
          normalizarCodigo(estante.codigo) ===
          normalizarCodigo(item.local)
      )

      return {
        produto: {
          id: item.produto_id,
          nome:
            produtoOriginal?.nome ||
            produtoOriginal?.produto ||
            item.produto,
        },
        codigo: item.local,
        estanteId: estante?.id ?? null,
        distancia: item.distancia,
        caminho: Array.isArray(item.caminho)
          ? item.caminho
          : [],
      }
    })
  }

  // Alternativa caso a rota ainda não tenha sido recebida.
  return produtos
    .map((produto) => {
      const estanteId =
        produto?.estante?.id ?? produto?.estante_id

      const estante = estantes.find(
        (item) => String(item.id) === String(estanteId)
      )

      return {
        produto,
        codigo:
          produto?.estante?.codigo ||
          produto?.local ||
          estante?.codigo ||
          '',
        estanteId: estante?.id ?? estanteId ?? null,
        caminho: [],
        distancia: 0,
      }
    })
    .filter((parada) => parada.codigo)
}

function mesmaEstante(parada, estante) {
  return (
    String(parada.estanteId) === String(estante.id) ||
    normalizarCodigo(parada.codigo) ===
      normalizarCodigo(estante.codigo)
  )
}

function estadoDaEstante(estante, paradas, indiceAtual) {
  const indices = paradas
    .map((parada, indice) =>
      mesmaEstante(parada, estante) ? indice : -1
    )
    .filter((indice) => indice >= 0)

  if (indices.length === 0) return 'neutra'

  if (indices.every((indice) => indice < indiceAtual)) {
    return 'coletada'
  }

  if (indices.includes(indiceAtual)) {
    return 'atual'
  }

  return 'pendente'
}

function estadoDaParada(indice, indiceAtual) {
  if (indice < indiceAtual) return 'coletada'
  if (indice === indiceAtual) return 'atual'
  return 'pendente'
}

function Rotas({
  produtos = [],
  onVoltar,
  rotaCalculada = [],
  dikstra = null,
  distanciaTotal = 0,
}) {
  const [estantes, setEstantes] = useState([])
  const [arestas, setArestas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [indiceAtual, setIndiceAtual] = useState(0)

  // Carregar estantes e conexões.
  useEffect(() => {
    let ativo = true

    Promise.all([
      fetch(`${API}/estantes`).then(lerJson),
      fetch(`${API}/arestas`).then(lerJson),
    ])
      .then(([dadosEstantes, dadosArestas]) => {
        if (!ativo) return

        // A E01 será o início visual da rota.
        // Não precisamos de uma estante chamada Entrada.
        const estantesValidas = Array.isArray(dadosEstantes)
          ? dadosEstantes.filter(
              (estante) =>
                normalizarCodigo(estante.codigo) !== 'ENTRADA'
            )
          : []

        const arestasValidas = Array.isArray(dadosArestas)
          ? dadosArestas.filter(
              (aresta) =>
                estantesValidas.some(
                  (e) =>
                    String(e.id) ===
                    String(aresta.estante_origem_id)
                ) &&
                estantesValidas.some(
                  (e) =>
                    String(e.id) ===
                    String(aresta.estante_destino_id)
                )
            )
          : []

        setEstantes(estantesValidas)
        setArestas(arestasValidas)
      })
      .catch(() => {
        if (ativo) {
          setErro('Não foi possível carregar o mapa do estoque.')
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  // Reiniciar o progresso quando uma nova rota for recebida.
  useEffect(() => {
    setIndiceAtual(0)
  }, [rotaCalculada])

  const estantesPorId = useMemo(
    () =>
      new Map(
        estantes.map((estante) => [
          String(estante.id),
          estante,
        ])
      ),
    [estantes]
  )

  const posicoes = useMemo(
    () => calcularPosicoes(estantes),
    [estantes]
  )

  // Produtos na ordem calculada pelo Dijkstra.
  const paradas = useMemo(
    () => montarParadas(produtos, estantes, rotaCalculada),
    [produtos, estantes, rotaCalculada]
  )

  // Identificar todas as conexões usadas nos caminhos do Dijkstra.
  const arestasDaRota = useMemo(() => {
    const pares = new Set()

    function adicionarCaminho(caminho) {
      if (!Array.isArray(caminho)) return

      for (let i = 0; i < caminho.length - 1; i++) {
        const origem = codigoDoPonto(
          caminho[i],
          estantesPorId
        )

        const destino = codigoDoPonto(
          caminho[i + 1],
          estantesPorId
        )

        if (origem && destino) {
          pares.add(chaveDaAresta(origem, destino))
        }
      }
    }

    // Caminhos individuais retornados pelo Laravel.
    if (Array.isArray(rotaCalculada)) {
      rotaCalculada.forEach((parada) => {
        adicionarCaminho(parada.caminho)
      })
    }

    // Sequência consolidada recebida do App.
    adicionarCaminho(dikstra)

    return pares
  }, [rotaCalculada, dikstra, estantesPorId])

  const estanteEntrada = estantes.find(
    (estante) => normalizarCodigo(estante.codigo) === 'E01'
  )

  const pontoEntrada = estanteEntrada
    ? posicoes.mapa.get(estanteEntrada.id)
    : null

  const concluida =
    paradas.length > 0 && indiceAtual >= paradas.length

  const atual = paradas[indiceAtual]

  function confirmarColeta() {
    setIndiceAtual((indice) =>
      Math.min(indice + 1, paradas.length)
    )
  }

  return (
    <div className="rotas">

      <header className="rotas-header">
        <div>
          <h1>Rota de coleta</h1>
          <p>Acompanhe as posições no estoque</p>
        </div>
      </header>

      {carregando && <p>Carregando mapa...</p>}

      {erro && <p>{erro}</p>}

      {!carregando && !erro && (
        <div className="rotas-layout">

          <section
            className="rotas-mapa"
            aria-label="Mapa do estoque"
          >

            <svg
              viewBox={`0 0 ${posicoes.largura} ${posicoes.altura}`}
              role="img"
              aria-label="Grafo das estantes com entrada na E01"
            >

              {/* Conexões das estantes */}
              {arestas.map((aresta) => {
                const origem = posicoes.mapa.get(
                  Number(aresta.estante_origem_id)
                ) || posicoes.mapa.get(aresta.estante_origem_id)

                const destino = posicoes.mapa.get(
                  Number(aresta.estante_destino_id)
                ) || posicoes.mapa.get(aresta.estante_destino_id)

                if (!origem || !destino) return null

                const codigoOrigem = estantesPorId.get(
                  String(aresta.estante_origem_id)
                )?.codigo

                const codigoDestino = estantesPorId.get(
                  String(aresta.estante_destino_id)
                )?.codigo

                const chave = chaveDaAresta(
                  codigoOrigem,
                  codigoDestino
                )

                const ativa = arestasDaRota.has(chave)

                return (
                  <line
                    key={aresta.id}
                    className={
                      ativa
                        ? 'rotas-aresta rotas-aresta-ativa'
                        : 'rotas-aresta'
                    }
                    x1={origem.x}
                    y1={origem.y}
                    x2={destino.x}
                    y2={destino.y}
                    stroke={ativa ? '#1687e8' : '#8d8d8d'}
                    strokeWidth={ativa ? 7 : 4}
                    strokeLinecap="round"
                  />
                )
              })}

              {/* Nós das estantes */}
              {estantes.map((estante) => {
                const ponto = posicoes.mapa.get(estante.id)

                if (!ponto) return null

                const estado = estadoDaEstante(
                  estante,
                  paradas,
                  indiceAtual
                )

                return (
                  <g
                    key={estante.id}
                    className={`rotas-no rotas-no-${estado}`}
                  >
                    <circle
                      cx={ponto.x}
                      cy={ponto.y}
                      r="30"
                    />

                    <text
                      x={ponto.x}
                      y={ponto.y}
                    >
                      {estante.codigo}
                    </text>
                  </g>
                )
              })}

              {/* Identificação da entrada no início E01 */}
              {pontoEntrada && (
                <g className="rotas-entrada">
                  <text
                    x={pontoEntrada.x}
                    y={pontoEntrada.y - 43}
                    textAnchor="middle"
                    fill="#1687e8"
                    fontSize="15"
                    fontWeight="700"
                  >
                    ENTRADA
                  </text>

                  <line
                    x1={pontoEntrada.x}
                    y1={pontoEntrada.y - 31}
                    x2={pontoEntrada.x}
                    y2={pontoEntrada.y - 27}
                    stroke="#1687e8"
                    strokeWidth="3"
                  />
                </g>
              )}

            </svg>
          </section>

          <aside className="rotas-painel">

            <section className="rotas-atual">

              <h2>Produto Atual</h2>

              <p className="rotas-distancia">
                Distância total: {distanciaTotal} unidades
              </p>

              {!atual && !concluida && (
                <p>
                  Nenhum produto selecionado para esta rota.
                </p>
              )}

              {concluida && (
                <p className="rotas-conclusao">
                  Coleta concluída. Todos os produtos da rota
                  foram confirmados.
                </p>
              )}

              {atual && (
                <>
                  <p className="rotas-produto-nome">
                    {atual.produto.nome}
                  </p>

                  <p className="rotas-posicao">
                    Posição: {atual.codigo}
                  </p>

                  <button
                    type="button"
                    className="rotas-confirmar"
                    onClick={confirmarColeta}
                  >
                    Confirmar Coleta
                  </button>
                </>
              )}

            </section>

            <ol className="rotas-lista">
              {paradas.map((parada, indice) => {
                const estado = estadoDaParada(
                  indice,
                  indiceAtual
                )

                return (
                  <li
                    key={`${parada.produto.id}-${indice}`}
                    className={`rotas-item rotas-item-${estado}`}
                  >
                    <span
                      className="rotas-item-marca"
                      aria-hidden="true"
                    />

                    <span>
                      {indice + 1}. {parada.produto.nome} - {parada.codigo}
                    </span>
                  </li>
                )
              })}
            </ol>

            <button
              type="button"
              className="rotas-voltar"
              onClick={onVoltar}
            >
              Voltar
            </button>

          </aside>
        </div>
      )}
    </div>
  )
}

export default Rotas
