import { useRef } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import styles from './PublicLayout.module.css'

const navItems = [
  { to: '/',             label: 'Adoptar',      end: true },
  { to: '/me-interesa',  label: 'Me interesa' },
  { to: '/voluntariado', label: 'Voluntariado' },
  { to: '/donaciones',   label: 'Donaciones' },
  { to: '/nosotros',     label: 'Nosotros' },
]

const LONG_PRESS_MS = 3000

export default function PublicLayout() {
  const navigate = useNavigate()
  const timerRef = useRef(null)

  function startPress() {
    timerRef.current = setTimeout(() => {
      navigate('/admin/login')
    }, LONG_PRESS_MS)
  }

  function cancelPress() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return (
    <div>
      <header className={styles.topbar}>
        <NavLink
          to="/"
          className={styles.logo}
          onMouseDown={startPress}
          onMouseUp={cancelPress}
          onMouseLeave={cancelPress}
          onTouchStart={startPress}
          onTouchEnd={cancelPress}
          onTouchCancel={cancelPress}
          onClick={cancelPress}
        >
          <img src={logo} alt="Alegría Gatuna" className={styles.logoImg} />
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
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
