import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import styles from './AdminAnimales.module.css'

const ESTADOS = ['disponible', 'en_proceso', 'reservado', 'adoptado']
const ESTADO_LABEL = { disponible: 'Disponible', en_proceso: 'En proceso', reservado: 'Reservado', adoptado: 'Adoptado' }
const EMOJIS = { gato: '🐱', perro: '🐶' }
const BG = { gato: '#EFF8E8', perro: '#FFF3EC' }

export default function AdminAnimales() {
  const [animales, setAnimales] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEspecie, setFiltroEspecie] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [animalDetalle, setAnimalDetalle] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchAnimales() }, [])

  async function fetchAnimales() {
    const { data } = await supabase.from('animales').select('*').order('created_at', { ascending: false })
    if (data) setAnimales(data)
    setCargando(false)
  }

  async function cambiarEstado(id, nuevoEstado) {
    setAnimales(prev => prev.map(a => a.id === id ? { ...a, estado: nuevoEstado } : a))
    await supabase.from('animales').update({ estado: nuevoEstado }).eq('id', id)
  }

  async function eliminar(id) {
    setAnimales(prev => prev.filter(a => a.id !== id))
    setConfirmDelete(null)
    setAnimalDetalle(null)
    await supabase.from('animales').delete().eq('id', id)
  }

  const filtrados = animales.filter(a => {
    const matchBusqueda = a.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const matchEspecie = filtroEspecie === 'todos' || a.especie === filtroEspecie
    const matchEstado = filtroEstado === 'todos' || a.estado === filtroEstado
    return matchBusqueda && matchEspecie && matchEstado
  })

  const metrics = {
    disponible: animales.filter(a => a.estado === 'disponible').length,
    en_proceso: animales.filter(a => a.estado === 'en_proceso').length,
    reservado:  animales.filter(a => a.estado === 'reservado').length,
    adoptado:   animales.filter(a => a.estado === 'adoptado').length,
  }

  return (
    <div>
      <div className={styles.metrics}>
        <div className={styles.metric}><span className={`${styles.metricN} ${styles.green}`}>{metrics.disponible}</span><span className={styles.metricL}>Disponibles</span></div>
        <div className={styles.metric}><span className={`${styles.metricN} ${styles.orange}`}>{metrics.en_proceso}</span><span className={styles.metricL}>En proceso</span></div>
        <div className={styles.metric}><span className={`${styles.metricN} ${styles.amber}`}>{metrics.reservado}</span><span className={styles.metricL}>Reservados</span></div>
        <div className={styles.metric}><span className={styles.metricN}>{metrics.adoptado}</span><span className={styles.metricL}>Adoptados</span></div>
      </div>

      <div className={styles.header}>
        <h2>Animales registrados</h2>
        <button className={styles.addBtn} onClick={() => navigate('/admin/nuevo-animal')}>+ Nuevo animal</button>
      </div>

      <div className={styles.toolbar}>
        <input className={styles.search} type="text" placeholder="Buscar por nombre…" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        <select className={styles.filterSel} value={filtroEspecie} onChange={e => setFiltroEspecie(e.target.value)}>
          <option value="todos">Todas las especies</option>
          <option value="gato">Gatos</option>
          <option value="perro">Perros</option>
        </select>
        <select className={styles.filterSel} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="todos">Todos los estados</option>
          {ESTADOS.map(e => <option key={e} value={e}>{ESTADO_LABEL[e]}</option>)}
        </select>
      </div>

      {cargando && <p className={styles.loading}>Cargando… 🐾</p>}
      {!cargando && filtrados.length === 0 && <div className={styles.empty}>No hay animales con ese filtro.</div>}

      {!cargando && filtrados.length > 0 && (
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.rowHeader}`}>
            <span></span><span>Animal</span><span>Especie</span><span>Estado</span><span></span>
          </div>
          {filtrados.map(animal => (
            <div key={animal.id} className={styles.row}>
              <div className={styles.avatar} style={{ background: BG[animal.especie] }}>
                {animal.foto_url ? <img src={animal.foto_url} alt={animal.nombre} className={styles.avatarImg} /> : EMOJIS[animal.especie]}
              </div>
              <div>
                <div className={styles.animalNombre}>{animal.nombre}</div>
                <div className={styles.animalMeta}>{animal.sexo === 'macho' ? 'Macho' : 'Hembra'} · {animal.edad}</div>
              </div>
              <span className={styles.especie}>{animal.especie.charAt(0).toUpperCase() + animal.especie.slice(1)}</span>
              <select className={styles.estadoSelect} value={animal.estado} onChange={e => cambiarEstado(animal.id, e.target.value)}>
                {ESTADOS.map(e => <option key={e} value={e}>{ESTADO_LABEL[e]}</option>)}
              </select>
              <div className={styles.acciones}>
                <button className={styles.verBtn} onClick={() => setAnimalDetalle(animal)}>Ver</button>
                <button className={styles.editBtn} onClick={() => navigate(`/admin/nuevo-animal?id=${animal.id}`)}>Editar</button>
                <button className={styles.deleteBtn} onClick={() => setConfirmDelete(animal)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal perfil completo */}
      {animalDetalle && (
        <div className={styles.overlay} onClick={() => setAnimalDetalle(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setAnimalDetalle(null)}>✕</button>
            <div className={styles.modalImg} style={{ background: BG[animalDetalle.especie] }}>
              {animalDetalle.foto_url
                ? <img src={animalDetalle.foto_url} alt={animalDetalle.nombre} className={styles.modalFoto} />
                : <span className={styles.modalEmoji}>{EMOJIS[animalDetalle.especie]}</span>
              }
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalNombre}>{animalDetalle.nombre}</div>
              <div className={styles.modalMeta}>
                {animalDetalle.especie.charAt(0).toUpperCase() + animalDetalle.especie.slice(1)} · {animalDetalle.sexo === 'macho' ? 'Macho' : 'Hembra'} · {animalDetalle.edad}
              </div>
              {animalDetalle.raza && <div className={styles.modalRaza}>{animalDetalle.raza}</div>}
              {animalDetalle.descripcion && <p className={styles.modalDesc}>{animalDetalle.descripcion}</p>}
              <div className={styles.modalChecks}>
                {[
                  { key: 'vacunado',      label: 'Vacunado' },
                  { key: 'desparasitado', label: 'Desparasitado' },
                  { key: 'esterilizado',  label: 'Esterilizado' },
                  { key: 'con_animales',  label: 'Con otros animales' },
                  { key: 'con_ninos',     label: 'Con niños' },
                ].map(({ key, label }) => (
                  <span key={key} className={`${styles.checkBadge} ${animalDetalle[key] ? styles.checkSi : styles.checkNo}`}>
                    {animalDetalle[key] ? '✓' : '✗'} {label}
                  </span>
                ))}
              </div>
              <div className={styles.modalActions}>
                <button className={styles.editBtnFull} onClick={() => { navigate(`/admin/nuevo-animal?id=${animalDetalle.id}`); setAnimalDetalle(null) }}>Editar animal</button>
                <button className={styles.deleteBtnFull} onClick={() => setConfirmDelete(animalDetalle)}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmar eliminación */}
      {confirmDelete && (
        <div className={styles.overlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <div className={styles.confirmIcon}>🗑️</div>
            <h3>¿Eliminar a {confirmDelete.nombre}?</h3>
            <p>Esta acción no se puede deshacer. El animal será eliminado permanentemente.</p>
            <div className={styles.confirmBtns}>
              <button className={styles.cancelBtn} onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className={styles.confirmDeleteBtn} onClick={() => eliminar(confirmDelete.id)}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
