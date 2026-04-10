import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAnimales } from '../../hooks/useAnimales'
import AnimalCard from '../../components/public/AnimalCard'
import styles from './Adoptar.module.css'
import logo from '/logo.jpg'

const FILTROS_BASE = [
  { key: 'todos',      label: 'Todos',       especie: null },
  { key: 'gato',       label: 'Gatos',       especie: 'gato' },
  { key: 'perro',      label: 'Perros',      especie: 'perro' },
  { key: 'disponible', label: 'Disponibles', especie: null },
]

export default function Adoptar() {
  const [filtro, setFiltro] = useState('todos')
  const [especies, setEspecies] = useState([])
  const { animales, cargando, error } = useAnimales(filtro)
  const navigate = useNavigate()

  // Cargar qué especies existen para mostrar solo los filtros relevantes
  useEffect(() => {
    supabase
      .from('animales')
      .select('especie')
      .then(({ data }) => {
        if (data) {
          const unicas = [...new Set(data.map(a => a.especie.toLowerCase()))]
          setEspecies(unicas)
        }
      })
  }, [])

  // Filtros visibles: siempre "Todos" y "Disponibles", y solo las especies que existen
  const filtrosVisibles = FILTROS_BASE.filter(f => {
    if (!f.especie) return true // "Todos" y "Disponibles" siempre
    return especies.includes(f.especie)
  })

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
              <span className={styles.statN}>16</span>
              <span className={styles.statL}>años de labor</span>
            </div>
          </div>
        </div>
        <div className={styles.heroArt}><img src={logo} alt="Alegría Gatuna" /></div>
      </div>

      {/* Filtros dinámicos */}
      <div className={styles.filtros}>
        {filtrosVisibles.map(({ key, label }) => (
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
        <div className={styles.estado}>Cargando a tu próximo mejor amigo… 🐾</div>
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
