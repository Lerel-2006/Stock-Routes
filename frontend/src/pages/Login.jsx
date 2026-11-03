import { useState } from 'react'
import '../styles/Login.css'
import logo from "../../img/logost.png";

function Logo() {
    return (
      
        <div className="login-header">
            <img 
                src={logo} 
                alt="Stock Routes" 
                className="login-logo" 
            />
            <p className="login-description">
                Seu estoque, sempre no lugar certo.
            </p>
        </div>
    );
}
function IconMail() {
  return (
    <svg viewBox="0 0 24 24" className="login-icon" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" className="login-icon" aria-hidden="true">
      <rect x="5" y="10" width="14" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function IconEye({ off }) {
  return (
    <svg viewBox="0 0 24 24" className="login-icon login-icon-eye" aria-hidden="true">
      {off ? (
        <>
          <path d="M3 3l18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path
            d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a18.3 18.3 0 0 1-4.2 4.7M6.1 6.1A18 18 0 0 0 2 12s4 7 10 7c1.3 0 2.5-.2 3.6-.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
        </>
      )}
    </svg>
  )
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    onLogin?.()
  }

   return (
    <div className="login">

      <Logo />

      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Bem-vindo de volta</h2>

          <label className="login-field">
            Email
            <span className="login-input">
              <IconMail />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </span>
          </label>

          <label className="login-field">
            Senha
            <span className="login-input">
              <IconLock />
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-toggle"
                onClick={() => setMostrarSenha((atual) => !atual)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <IconEye off={mostrarSenha} />
              </button>
            </span>
          </label>

          <button type="submit" className="login-submit">
            Entrar
          </button>
        </form>

        
      </section>
    </div>
  )
}

export default Login
