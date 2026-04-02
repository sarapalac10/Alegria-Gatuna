import { NavLink, Outlet } from 'react-router-dom'
import styles from './PublicLayout.module.css'

const navItems = [
  { to: '/',            label: 'Adoptar',      end: true },
  { to: '/me-interesa', label: 'Me interesa' },
  { to: '/voluntariado',label: 'Voluntariado' },
  { to: '/donaciones',  label: 'Donaciones' },
  { to: '/nosotros',    label: 'Nosotros' },
]

export default function PublicLayout() {
  return (
    <div>
      <header className={styles.topbar}>
        <NavLink to="/" className={styles.logo}>
          Alegría <span>Gatuna</span>
        </NavLink>

        <nav className={styles.nav}>
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <NavLink to="/admin" className={styles.adminBtn}>
          Admin ↗
        </NavLink>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
