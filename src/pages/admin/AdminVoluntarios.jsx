import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './AdminVoluntarios.module.css'

const TIPO_LABEL = {
  cuidado_directo: 'Cuidado directo', hogar_transito: 'Hogar de tránsito',
  apoyo_veterinario: 'Apoyo veterinario', difusion_redes: 'Difusión en redes',
}
const ESTADO_LABEL = { pendiente: 'Pendiente', activo: 'Activo', inactivo: 'Inactivo' }
const COLORS = ['#E4F2DC','#FFF3EC','#FEF6DC','#E6F1FB','#FBEAF0']
const COLORS_T = ['#2A5A1A','#C04010','#9A6A00','#185FA5','#7B2255']
const INITIALS = (n) => n.split(' ').map(x => x[0]).join('').slice(0,2).toUpperCase()

export default function AdminVoluntarios() {
  const [voluntarios, setVoluntarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [detalle, setDetalle] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => { fetchVoluntarios() }, [])

  async function fetchVoluntarios() {
    const { data } = await supabase.from('voluntarios').select('*').order('created_at', { ascending: false })
    if (data) setVoluntarios(data)
    setCargando(false)
  }

  async function cambiarEstado(id, estado) {
    setVoluntarios(prev => prev.map(v => v.id === id ? { ...v, estado } : v))
    if (detalle?.id === id) setDetalle(d => ({ ...d, estado }))
    await supabase.from('voluntarios').update({ estado }).eq('id', id)
  }

  async function eliminar(id) {
    setVoluntarios(prev => prev.filter(v => v.id !== id))
    setConfirmDelete(null)
    setDetalle(null)
    await supabase.from('voluntarios').delete().eq('id', id)
  }

  const filtrados = voluntarios.filter(v => {
    const matchBusqueda = v.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.correo.toLowerCase().includes(busqueda.toLowerCase())
    const matchTipo = filtroTipo === 'todos' || v.tipo === filtroTipo
    const matchEstado = filtroEstado === 'todos' || v.estado === filtroEstado
    return matchBusqueda && matchTipo && matchEstado
  })

  const metrics = {
    activo: voluntarios.filter(v => v.estado === 'activo').length,
    pendiente: voluntarios.filter(v => v.estado === 'pendiente').length,
    inactivo: voluntarios.filter(v => v.estado === 'inactivo').length,
  }

  const fecha = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div>
      <div className={styles.header}>
        <h2>Voluntarios inscritos</h2>
        <span className={styles.count}>{metrics.activo} activos</span>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}><span className={`${styles.mn} ${styles.green}`}>{metrics.activo}</span><span className={styles.ml}>Activos</span></div>
        <div className={styles.metric}><span className={`${styles.mn} ${styles.amber}`}>{metrics.pendiente}</span><span className={styles.ml}>Pendientes</span></div>
        <div className={styles.metric}><span className={styles.mn}>{metrics.inactivo}</span><span className={styles.ml}>Inactivos</span></div>
      </div>

      <div className={styles.toolbar}>
        <input className={styles.search} type="text" placeholder="Buscar por nombre o correo…" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        <select className={styles.filterSel} value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
          <option value="todos">Todos los tipos</option>
          {Object.entries(TIPO_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={styles.filterSel} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="todos">Todos los estados</option>
          {Object.entries(ESTADO_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {cargando && <p className={styles.loading}>Cargando… 🌿</p>}
      {!cargando && filtrados.length === 0 && <div className={styles.empty}>No hay voluntarios con ese filtro.</div>}

      <div className={styles.list}>
        {filtrados.map((v, i) => {
          const ci = i % COLORS.length
          return (
            <div key={v.id} className={styles.card}>
              <div className={styles.avatar} style={{ background: COLORS[ci], color: COLORS_T[ci] }}>
                {INITIALS(v.nombre)}
              </div>
              <div className={styles.info}>
                <div className={styles.nombre}>{v.nombre}</div>
                <div className={styles.meta}>{TIPO_LABEL[v.tipo]} · {v.disponibilidad} · {v.correo}</div>
              </div>
              <select
                className={`${styles.estadoSel} ${styles[v.estado]}`}
                value={v.estado}
                onChange={e => cambiarEstado(v.id, e.target.value)}
              >
                {Object.entries(ESTADO_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
              <div className={styles.acciones}>
                <button className={styles.verBtn} onClick={() => setDetalle(v)}>Ver</button>
                <a className={styles.contactBtn} href={`mailto:${v.correo}`}>Contactar</a>
                <button className={styles.deleteBtn} onClick={() => setConfirmDelete(v)}>🗑</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal perfil completo */}
      {detalle && (
        <div className={styles.overlay} onClick={() => setDetalle(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setDetalle(null)}>✕</button>
            <div className={styles.modalHeader}>
              <div className={styles.modalAvatar} style={{ background: COLORS[0], color: COLORS_T[0] }}>
                {INITIALS(detalle.nombre)}
              </div>
              <div>
                <div className={styles.modalNombre}>{detalle.nombre}</div>
                <div className={styles.modalTipo}>{TIPO_LABEL[detalle.tipo]}</div>
              </div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Información</div>
                <div className={styles.modalRow}><span>Correo</span><a href={`mailto:${detalle.correo}`} className={styles.modalLink}>{detalle.correo}</a></div>
                <div className={styles.modalRow}><span>Disponibilidad</span><span>{detalle.disponibilidad}</span></div>
                <div className={styles.modalRow}><span>Inscrito</span><span>{fecha(detalle.created_at)}</span></div>
                <div className={styles.modalRow}>
                  <span>Estado</span>
                  <select
                    className={styles.modalEstadoSel}
                    value={detalle.estado}
                    onChange={e => cambiarEstado(detalle.id, e.target.value)}
                  >
                    {Object.entries(ESTADO_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                  </select>
                </div>
              </div>

              {detalle.motivacion && (
                <div className={styles.modalSection}>
                  <div className={styles.modalSectionTitle}>Motivación</div>
                  <p className={styles.modalDesc}>"{detalle.motivacion}"</p>
                </div>
              )}

              <div className={styles.modalActions}>
                <a className={styles.modalPrimaryBtn} href={`mailto:${detalle.correo}`}>Contactar</a>
                <button className={styles.modalDangerBtn} onClick={() => setConfirmDelete(detalle)}>Eliminar</button>
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
            <p>Esta acción no se puede deshacer.</p>
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
