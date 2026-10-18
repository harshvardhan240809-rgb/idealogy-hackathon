import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@vishpath.demo')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      setError('Both email and password are required.')
      return
    }

    localStorage.setItem('vishpath-admin', JSON.stringify({ email, authenticated: true }))
    navigate('/dashboard')
  }

  return (
    <div className="page-shell container auth-wrap">
      <div className="auth-card">
        <span className="eyebrow">Admin access</span>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@vishpath.demo" />
          </label>
          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn btn-primary">Log in</button>
        </form>
      </div>
    </div>
  )
}
