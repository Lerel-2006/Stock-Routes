import { useState, useEffect } from 'react'
import '../styles/Catalogo.css'

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" className="catalogo-search-icon" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 16.5L21 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Catalogo({ onConfirmarRota }) {
  const [produtos, setProdutos] = useState([])
  const [busca, setBusca] = useState('')
  const [selecionados, setSelecionados] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [confirmarAberto, setConfirmarAberto] = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/produtos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos')
        }

        return response.json()
      })
      .then(dados => {
        setProdutos(dados)
      })
      .catch(() => {
        setErro('Não foi possível carregar os produtos.')
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [])

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.trim().toLowerCase())
  )

  function alternarProduto(id) {
    setSelecionados((atual) =>
      atual.includes(id)
        ? atual.filter((item) => item !== id)
        : [...atual, id]
    )
  }

  const produtosSelecionados = selecionados
    .map((id) => produtos.find((produto) => produto.id === id))
    .filter(Boolean)

  useEffect(() => {
    if (!confirmarAberto) return

    function fecharComEscape(event) {
      if (event.key === 'Escape') {
        setConfirmarAberto(false)
      }
    }

    window.addEventListener('keydown', fecharComEscape)
    return () => window.removeEventListener('keydown', fecharComEscape)
  }, [confirmarAberto])

  return (
    <div className="catalogo">
      <label className="catalogo-search">
        <IconSearch />
        <input
          type="search"
          placeholder="Pesquisar produto"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </label>

      <header className="catalogo-header">
        <h1>Catálogos de Produtos</h1>
        <p>Encontre o que você precisa de forma rápida</p>
      </header>

      {carregando && <p>Carregando produtos...</p>}

      {erro && <p>{erro}</p>}

      {!carregando && !erro && produtosFiltrados.length === 0 && (
        <p>Nenhum produto encontrado.</p>
      )}

      <section className="catalogo-grid">
        {!carregando && !erro && produtosFiltrados.map((produto) => {
          const ativo = selecionados.includes(produto.id)

          return (
            <button
              key={produto.id}
              type="button"
              className={ativo ? 'catalogo-card catalogo-card-ativo' : 'catalogo-card'}
              onClick={() => alternarProduto(produto.id)}
              aria-pressed={ativo}
            >
              <strong>{produto.nome}</strong>
              <span>Quantidade: {produto.quantidade}</span>
              <span>Estante: {produto.estante_id}</span>
            </button>
          )
        })}
      </section>

      <button type="button" className="catalogo-rota" onClick={() => setConfirmarAberto(true)}>
        {selecionados.length > 1 ? (
          <span className="catalogo-rota-badge">{selecionados.length}</span>
        ) : null}
        Rota
      </button>

      {confirmarAberto && (
        <div className="catalogo-modal-fundo" onClick={() => setConfirmarAberto(false)}>
          <div
            className="catalogo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmar-rota-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="confirmar-rota-titulo">Confirmar Rota?</h2>

            {produtosSelecionados.length > 0 ? (
              <ul className="catalogo-modal-produtos">
                {produtosSelecionados.map((produto) => (
                  <li key={produto.id}>{produto.nome}</li>
                ))}
              </ul>
            ) : (
              <p className="catalogo-modal-vazio">Nenhum produto selecionado.</p>
            )}

            <div className="catalogo-modal-acoes">
              <button
                type="button"
                className="catalogo-modal-sim"
                onClick={() => {
                  if (produtosSelecionados.length === 0) return
                  setConfirmarAberto(false)
                  onConfirmarRota?.(produtosSelecionados)
                }}
              >
                Sim
              </button>
              <button
                type="button"
                className="catalogo-modal-nao"
                onClick={() => setConfirmarAberto(false)}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Catalogo
