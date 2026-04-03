import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import styles from './AdminAnimales.module.css'

const ESTADOS = ['disponible', 'en_proceso', 'reservado', 'adoptado']
const ESTADO_LABEL = {
  disponible: 'Disponible',
  en_proceso: 'En proceso',
  reservado:  'Reservado',
  adoptado:   'Adoptado',
}
const EMOJIS = { gato: '🐱', perro: '🐶', conejo: '🐰', otro: '🐾' }
const BG = { gato: '#EFF8E8', perro: '#FFF3EC', conejo: '#FEF6DC', otro: '#F7F2EA' }

export default function AdminAnimales() {
  const [animales, setAnimales] = useState([])
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAnimales()
  }, [])

  async function fetchAnimales() {
    const { data } = await supabase
      .from('animales')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setAnimales(data)
    setCargando(false)
  }

  async function cambiarEstado(id, nuevoEstado) {
    // Optimistic update
    setAnimales(prev =>
      prev.map(a => a.id === id ? { ...a, estado: nuevoEstado } : a)
    )
    await supabase
      .from('animales')
      .update({ estado: nuevoEstado })
      .eq('id', id)
  }

  // Métricas
  const metrics = {
    disponible: animales.filter(a => a.estado === 'disponible').length,
    en_proceso: animales.filter(a => a.estado === 'en_proceso').length,
    reservado:  animales.filter(a => a.estado === 'reservado').length,
    adoptado:   animales.filter(a => a.estado === 'adoptado').length,
  }

  return (
    <div>
      {/* Métricas */}
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={`${styles.metricN} ${styles.green}`}>{metrics.disponible}</span>
          <span className={styles.metricL}>Disponibles</span>
        </div>
        <div className={styles.metric}>
          <span className={`${styles.metricN} ${styles.orange}`}>{metrics.en_proceso}</span>
          <span className={styles.metricL}>En proceso</span>
        </div>
        <div className={styles.metric}>
          <span className={`${styles.metricN} ${styles.amber}`}>{metrics.reservado}</span>
          <span className={styles.metricL}>Reservados</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricN}>{metrics.adoptado}</span>
          <span className={styles.metricL}>Adoptados</span>
        </div>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <h2>Animales registrados</h2>
        <button className={styles.addBtn} onClick={() => navigate('/admin/nuevo-animal')}>
          + Nuevo animal
        </button>
      </div>

      {/* Tabla */}
      {cargando ? (
        <p className={styles.loading}>Cargando… 🐾</p>
      ) : (
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.rowHeader}`}>
            <span></span>
            <span>Animal</span>
            <span>Especie</span>
            <span>Estado</span>
            <span></span>
          </div>

          {animales.map(animal => (
            <div key={animal.id} className={styles.row}>
              <div
                className={styles.avatar}
                style={{ background: BG[animal.especie] }}
              >
                {animal.foto_url
                  ? <img src={animal.foto_url} alt={animal.nombre} className={styles.avatarImg} />
                  : EMOJIS[animal.especie]
                }
              </div>

              <div>
                <div className={styles.animalNombre}>{animal.nombre}</div>
                <div className={styles.animalMeta}>
                  {animal.sexo === 'macho' ? 'Macho' : 'Hembra'} · {animal.edad}
                </div>
              </div>

              <span className={styles.especie}>
                {animal.especie.charAt(0).toUpperCase() + animal.especie.slice(1)}
              </span>

              <select
                className={styles.estadoSelect}
                value={animal.estado}
                onChange={e => cambiarEstado(animal.id, e.target.value)}
              >
                {ESTADOS.map(e => (
                  <option key={e} value={e}>{ESTADO_LABEL[e]}</option>
                ))}
              </select>

              <button
                className={styles.editBtn}
                onClick={() => navigate(`/admin/nuevo-animal?id=${animal.id}`)}
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
