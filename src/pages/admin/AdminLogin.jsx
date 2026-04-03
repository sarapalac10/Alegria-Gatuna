import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setCargando(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password,
    })

    if (error) {
      setError('Correo o contraseña incorrectos.')
      setCargando(false)
    } else {
      navigate('/admin/animales')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          Alegría <span>Gatuna</span>
        </div>
        <p className={styles.sub}>Panel de administración</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.frow}>
            <label>Correo</label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              placeholder="admin@alegriagatuna.com"
              required
              autoFocus
            />
          </div>
          <div className={styles.frow}>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className={styles.btn} disabled={cargando}>
            {cargando ? 'Entrando…' : 'Entrar al panel'}
          </button>
        </form>
      </div>
    </div>
  )
}
