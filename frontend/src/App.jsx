import { useState } from 'react'
import Login from './pages/Login.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Rotas from './pages/Rotas.jsx'

function App() {
  const [tela, setTela] = useState('login')
  const [produtosRota, setProdutosRota] = useState([])
  // Sequência de estantes calculada pelo algoritmo. Ainda não é preenchida.
  const dikstra = null

  if (tela === 'login') {
    return <Login onLogin={() => setTela('catalogo')} />
  }

  return (
    <>
      <div hidden={tela !== 'catalogo'}>
        <Catalogo
          onConfirmarRota={(selecionados) => {
            setProdutosRota(selecionados)
            setTela('rotas')
          }}
        />
      </div>

      {tela === 'rotas' && (
        <Rotas
          produtos={produtosRota}
          dikstra={dikstra}
          onVoltar={() => setTela('catalogo')}
        />
      )}
    </>
  )
}

export default App
