
import { useState } from 'react'
import Login from './pages/Login.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Rotas from './pages/Rotas.jsx'

const API = 'http://127.0.0.1:8000/api'

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || ''
  })

  // Sempre iniciar na tela de login
  const [tela, setTela] = useState('login')

  const [produtosRota, setProdutosRota] = useState([])
  const [rotaCalculada, setRotaCalculada] = useState([])
  const [distanciaTotal, setDistanciaTotal] = useState(0)
  const [carregandoRota, setCarregandoRota] = useState(false)
  const [erroRota, setErroRota] = useState('')

  function entrar(funcionario, novoToken) {
    localStorage.setItem('token', novoToken)
    localStorage.setItem('funcionario', JSON.stringify(funcionario))

    setToken(novoToken)
    setTela('catalogo')
  }

  function sair() {
    localStorage.removeItem('token')
    localStorage.removeItem('funcionario')

    setToken('')
    setProdutosRota([])
    setRotaCalculada([])
    setDistanciaTotal(0)
    setErroRota('')
    setTela('login')
  }

  async function calcularRota(selecionados) {
    if (!selecionados.length || carregandoRota) return

    setCarregandoRota(true)
    setErroRota('')

    try {
      const ids = selecionados.map((produto) => produto.id)

      const response = await fetch(`${API}/rota-coleta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          produtos: ids,
          inicio: 'E01'
        })
      })

      const dados = await response.json().catch(() => null)

      if (response.status === 401) {
        sair()
        throw new Error('Sua sessão expirou. Faça login novamente.')
      }

      if (!response.ok) {
        throw new Error(
          dados?.erro || dados?.message || 'Erro ao calcular a rota.'
        )
      }

      if (!Array.isArray(dados?.rota)) {
        throw new Error('A API não retornou uma rota válida.')
      }

      setProdutosRota(selecionados)
      setRotaCalculada(dados.rota)
      setDistanciaTotal(dados.distancia_total ?? 0)

      setTela('rotas')

    } catch (erro) {
      setErroRota(erro.message)
    } finally {
      setCarregandoRota(false)
    }
  }

  // Transformar os caminhos retornados pelo Dijkstra
  // em uma sequência de estantes.
  const dikstra = rotaCalculada.flatMap((parada, indice) => {
    const caminho = Array.isArray(parada.caminho)
      ? parada.caminho
      : []

    return indice === 0 ? caminho : caminho.slice(1)
  })

  if (tela === 'login') {
    return <Login onLogin={entrar} />
  }

  return (
    <>
      <div hidden={tela !== 'catalogo'}>
        <Catalogo
          token={token}
          onConfirmarRota={calcularRota}
          onSair={sair}
        />

        {carregandoRota && (
          <p>Calculando a melhor rota...</p>
        )}

        {erroRota && (
          <p>{erroRota}</p>
        )}
      </div>

      {tela === 'rotas' && (
        <Rotas
          produtos={produtosRota}
          dikstra={dikstra}
          rotaCalculada={rotaCalculada}
          distanciaTotal={distanciaTotal}
          onVoltar={() => setTela('catalogo')}
          onSair={sair}
        />
      )}
    </>
  )
}

export default App
