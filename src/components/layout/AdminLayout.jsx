import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import styles from './AdminLayout.module.css'

const adminNav = [
  { to: '/admin/animales',     label: '🐾 Animales' },
  { to: '/admin/adopciones',   label: '📋 Adopciones' },
  { to: '/admin/voluntarios',  label: '🌿 Voluntarios' },
  { to: '/admin/nuevo-animal', label: '➕ Subir animal' },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          Alegría <span>Gatuna</span>
          <small>Admin</small>
        </div>

        <nav className={styles.sideNav}>
          {adminNav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? `${styles.sideTab} ${styles.sideTabActive}` : styles.sideTab
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <NavLink to="/" className={styles.siteLink}>← Ver sitio público</NavLink>
          <button onClick={handleLogout} className={styles.logoutBtn}>Cerrar sesión</button>
        </div>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
