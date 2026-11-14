import { useEffect, useMemo, useState } from 'react'
import '../styles/Rotas.css'

const API = 'http://127.0.0.1:8000/api'

function lerJson(response) {
  if (!response.ok) {
    throw new Error('Erro ao carregar dados')
  }

  return response.json()
}

function codigoDoProduto(produto, estantesPorId) {
  if (produto?.estante?.codigo) return produto.estante.codigo
  if (produto?.local) return produto.local

  return estantesPorId.get(produto?.estante_id)?.codigo ?? ''
}

function idDaEstante(produto, estantesPorId) {
  if (produto?.estante?.id) return produto.estante.id
  if (estantesPorId.has(produto?.estante_id)) return produto.estante_id

  return null
}


function calcularPosicoes(estantes) {
  const espacoX = 120
  const espacoY = 110
  const margem = 70
  const colunas = 5
  const mapa = new Map()

  estantes.forEach((estante) => {
    if (estante.codigo === 'ENTRADA') {
      mapa.set(estante.id, {
        x: margem,
        y: margem
      })
      return
    }

    const numero = Number(estante.codigo.substring(1))
    const indice = numero - 1

    mapa.set(estante.id, {
      x: margem + (indice % colunas) * espacoX,
      y: margem + espacoY + Math.floor(indice / colunas) * espacoY
    })
  })

  return {
    mapa,
    largura: margem * 2 + (colunas - 1) * espacoX,
    altura: margem * 2 + 4 * espacoY
  }
}


function indiceNaSequencia(parada, dikstra) {
  return dikstra.findIndex((posicao) => {
    const valor = String(posicao)
    return valor === String(parada.codigo) || valor === String(parada.estanteId)
  })
}

// `dikstra` é a sequência de posições da rota (códigos ou ids das estantes).
// Enquanto vier vazia, a coleta segue a ordem escolhida no catálogo.
function montarParadas(produtos, estantes, dikstra) {
  const estantesPorId = new Map(estantes.map((estante) => [estante.id, estante]))
  const paradas = produtos
    .map((produto) => ({
      produto,
      codigo: codigoDoProduto(produto, estantesPorId),
      estanteId: idDaEstante(produto, estantesPorId),
    }))
    .filter((parada) => parada.codigo)

  if (!Array.isArray(dikstra) || dikstra.length === 0) {
    return paradas
  }

  return [...paradas].sort((a, b) => {
    const indiceA = indiceNaSequencia(a, dikstra)
    const indiceB = indiceNaSequencia(b, dikstra)

    if (indiceA === -1 && indiceB === -1) return 0
    if (indiceA === -1) return 1
    if (indiceB === -1) return -1
    return indiceA - indiceB
  })
}

function mesmaEstante(parada, estante) {
  return parada.estanteId === estante.id || parada.codigo === estante.codigo
}

function estadoDaEstante(estante, paradas, indiceAtual) {
  const indices = paradas
    .map((parada, indice) => (mesmaEstante(parada, estante) ? indice : -1))
    .filter((indice) => indice >= 0)

  if (indices.length === 0) return 'neutra'
  if (indices.every((indice) => indice < indiceAtual)) return 'coletada'
  if (indices.includes(indiceAtual)) return 'atual'
  return 'pendente'
}

function estadoDaParada(indice, indiceAtual) {
  if (indice < indiceAtual) return 'coletada'
  if (indice === indiceAtual) return 'atual'
  return 'pendente'
}

function Rotas({ produtos = [], onVoltar, dikstra = null }) {
  const [estantes, setEstantes] = useState([])
  const [arestas, setArestas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [indiceAtual, setIndiceAtual] = useState(0)

  useEffect(() => {
    let ativo = true

    Promise.all([
      fetch(`${API}/estantes`).then(lerJson),
      fetch(`${API}/arestas`).then(lerJson),
    ])
      .then(([dadosEstantes, dadosArestas]) => {
        if (!ativo) return
        setEstantes(Array.isArray(dadosEstantes) ? dadosEstantes : [])
        setArestas(Array.isArray(dadosArestas) ? dadosArestas : [])
      })
      .catch(() => {
        if (ativo) setErro('Não foi possível carregar o mapa do estoque.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  useEffect(() => {
    setIndiceAtual(0)
  }, [produtos, dikstra])

  const paradas = useMemo(
    () => montarParadas(produtos, estantes, dikstra),
    [produtos, estantes, dikstra]
  )
  const posicoes = useMemo(() => calcularPosicoes(estantes), [estantes])
  const concluida = paradas.length > 0 && indiceAtual >= paradas.length
  const atual = paradas[indiceAtual]

  function confirmarColeta() {
    setIndiceAtual((indice) => Math.min(indice + 1, paradas.length))
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
          <section className="rotas-mapa" aria-label="Mapa do estoque">
            <svg
              viewBox={`0 0 ${posicoes.largura} ${posicoes.altura}`}
              role="img"
              aria-label="Grafo das estantes"
            >
              {arestas.map((aresta) => {
                const origem = posicoes.mapa.get(aresta.estante_origem_id)
                const destino = posicoes.mapa.get(aresta.estante_destino_id)
                if (!origem || !destino) return null

                return (
                  <line
                    key={aresta.id}
                    className="rotas-aresta"
                    x1={origem.x}
                    y1={origem.y}
                    x2={destino.x}
                    y2={destino.y}
                  />
                )
              })}

              {estantes.map((estante) => {
                const ponto = posicoes.mapa.get(estante.id)
                if (!ponto) return null
                const estado = estadoDaEstante(estante, paradas, indiceAtual)

                return (
                  <g key={estante.id} className={`rotas-no rotas-no-${estado}`}>
                    <circle cx={ponto.x} cy={ponto.y} r="30" />
                    <text x={ponto.x} y={ponto.y}>
                      {estante.codigo}
                    </text>
                  </g>
                )
              })}
            </svg>
          </section>

          <aside className="rotas-painel">
            
            <section className="rotas-atual">
              <h2>Produto Atual</h2>

              {paradas.length === 0 && (
                <p>Nenhum produto selecionado para esta rota.</p>
              )}

              {concluida && (
                <p className="rotas-conclusao">
                  Coleta concluída. Todos os produtos da rota foram confirmados.
                </p>
              )}

              {atual && (
                <>
                  <p className="rotas-produto-nome">{atual.produto.nome}</p>
                  <p className="rotas-posicao">Posição: {atual.codigo}</p>
                  <button type="button" className="rotas-confirmar" onClick={confirmarColeta}>
                    Confirmar Coleta
                  </button>
                </>
              )}
            </section>

            <ol className="rotas-lista">
              {paradas.map((parada, indice) => {
                const estado = estadoDaParada(indice, indiceAtual)
              
                return (
                  <li key={parada.produto.id} className={`rotas-item rotas-item-${estado}`}>
                    <span className="rotas-item-marca" aria-hidden="true" />
                    <span>
                      {indice + 1}. {parada.produto.nome} - {parada.codigo}
                    </span>
                  </li>
                )
              })}
            </ol>
            <button type="button" className="rotas-voltar" onClick={onVoltar}>
          Voltar
        </button>
          </aside>
        </div>
      )}
    </div>
  )
}

export default Rotas
