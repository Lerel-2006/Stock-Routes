import { useState } from 'react'
import Login from './pages/Login.jsx'
import Catalogo from './pages/Catalogo.jsx'

function App() {
  const [tela, setTela] = useState('login')

  if (tela === 'catalogo') {
    return <Catalogo />
  }

  return <Login onLogin={() => setTela('catalogo')} />
}

export default App
