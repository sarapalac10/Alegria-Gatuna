import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnimales } from '../../hooks/useAnimales'
import AnimalCard from '../../components/public/AnimalCard'
import styles from './Adoptar.module.css'

const FILTROS = [
  { key: 'todos',      label: 'Todos' },
  { key: 'gato',       label: 'Gatos' },
  { key: 'perro',      label: 'Perros' },
  { key: 'disponible', label: 'Disponibles' },
]

export default function Adoptar() {
  const [filtro, setFiltro] = useState('todos')
  const { animales, cargando, error } = useAnimales(filtro)
  const navigate = useNavigate()

  return (
    <div className="page-container">

      {/* Hero */}
      <div className={styles.hero}>
        <div>
          <span className={styles.heroTag}>Hogar de paso · Medellín</span>
          <h1 className={styles.heroTitle}>
            Dales un hogar,<br />dales <span>alegría</span>
          </h1>
          <p className={styles.heroDesc}>
            Cada gato y perrito en nuestro hogar espera una segunda oportunidad.
            Conócelos y cambia una vida.
          </p>
          <div className={styles.heroBtns}>
            <button className={styles.btnPrimary} onClick={() => navigate('/me-interesa')}>
              Quiero adoptar
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate('/voluntariado')}>
              Ser voluntario
            </button>
          </div>
          <div className={styles.stats}>
            <div className={styles.statPill}>
              <span className={styles.statN}>{animales.length > 0 ? animales.length : '…'}</span>
              <span className={styles.statL}>en adopción</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statN}>138</span>
              <span className={styles.statL}>adoptados</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statN}>42</span>
              <span className={styles.statL}>voluntarios</span>
            </div>
          </div>
        </div>
        <div className={styles.heroArt}>🐱🐈🐶</div>
      </div>

      {/* Filtros */}
      <div className={styles.filtros}>
        {FILTROS.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.filtroBtn} ${filtro === key ? styles.filtroBtnActive : ''}`}
            onClick={() => setFiltro(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Estados */}
      {cargando && (
        <div className={styles.estado}>Cargando animalitos… 🐾</div>
      )}
      {error && (
        <div className={styles.estadoError}>Error al cargar los animales: {error}</div>
      )}

      {/* Grilla */}
      {!cargando && !error && (
        <>
          {animales.length === 0 ? (
            <div className={styles.estado}>
              No hay animales con ese filtro por ahora.
            </div>
          ) : (
            <div className={styles.grid}>
              {animales.map(animal => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  )
}
