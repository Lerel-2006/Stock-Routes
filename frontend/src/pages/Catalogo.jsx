import { useState } from 'react'
import '../styles/Catalogo.css'

const PRODUTOS = [
  { id: 1, nome: 'Pc RTX4060', quantidade: 37, local: 'A3' },
  { id: 2, nome: 'Pc RTX3060', quantidade: 59, local: 'A4' },
  { id: 3, nome: 'Mouse', quantidade: 183, local: 'A1' },
  { id: 4, nome: 'Teclado', quantidade: 22, local: 'B5' },
  { id: 5, nome: 'Pc AMD', quantidade: 53, local: 'B9' },
  { id: 6, nome: 'Celular POCO', quantidade: 187, local: 'C1' },
  { id: 7, nome: 'NotGamer', quantidade: 57, local: 'A3' },
  { id: 8, nome: 'Placa de video', quantidade: 82, local: 'C4' },
]

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" className="catalogo-search-icon" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 16.5L21 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Catalogo() {
  const [busca, setBusca] = useState('')
  const [selecionados, setSelecionados] = useState([])

  const produtosFiltrados = PRODUTOS.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.trim().toLowerCase())
  )

  function alternarProduto(id) {
    setSelecionados((atual) =>
      atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id]
    )
  }

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

      <section className="catalogo-grid">
        {produtosFiltrados.map((produto) => {
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
              <span>quantidade: {produto.quantidade}</span>
              <span>{produto.local}</span>
            </button>
          )
        })}
      </section>

      <button type="button" className="catalogo-rota">
        {selecionados.length > 1 ? (
          <span className="catalogo-rota-badge">{selecionados.length}</span>
        ) : null}
        Rota
      </button>
    </div>
  )
}

export default Catalogo
