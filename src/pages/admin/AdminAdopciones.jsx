import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './AdminAdopciones.module.css'

const ETAPAS = ['solicitud', 'entrevista', 'visita_hogar', 'aprobacion', 'entrega']
const ETAPA_LABEL = {
  solicitud: 'Solicitud', entrevista: 'Entrevista', visita_hogar: 'Visita hogar',
  aprobacion: 'Aprobación', entrega: 'Entrega', rechazado: 'Rechazado',
}

export default function AdminAdopciones() {
  const [solicitudes, setSolicitudes] = useState([])
  const [archivadas, setArchivadas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEtapa, setFiltroEtapa] = useState('todas')
  const [verArchivadas, setVerArchivadas] = useState(false)
  const [detalle, setDetalle] = useState(null)
  const [notaId, setNotaId] = useState(null)
  const [notaTemp, setNotaTemp] = useState('')

  useEffect(() => { fetchSolicitudes() }, [])

  async function fetchSolicitudes() {
    const { data } = await supabase
      .from('solicitudes_adopcion')
      .select('*, animales(nombre, especie, foto_url)')
      .order('created_at', { ascending: false })
    if (data) {
      setSolicitudes(data.filter(s => s.etapa !== 'rechazado'))
      setArchivadas(data.filter(s => s.etapa === 'rechazado'))
    }
    setCargando(false)
  }

  async function avanzarEtapa(s) {
    const idx = ETAPAS.indexOf(s.etapa)
    if (idx === ETAPAS.length - 1) return
    const nuevaEtapa = ETAPAS[idx + 1]
    setSolicitudes(prev => prev.map(x => x.id === s.id ? { ...x, etapa: nuevaEtapa } : x))
    if (detalle?.id === s.id) setDetalle(d => ({ ...d, etapa: nuevaEtapa }))
    await supabase.from('solicitudes_adopcion').update({ etapa: nuevaEtapa }).eq('id', s.id)

    // Email al adoptante sobre el avance
    await supabase.functions.invoke('avance-etapa', {
      body: {
        nombre:       s.nombre,
        correo:       s.correo,
        animalNombre: s.animales?.nombre || 'el animalito',
        etapa:        nuevaEtapa,
      },
    })

    if (nuevaEtapa === 'entrega' && s.animal_id) {
      await supabase.from('animales').update({ estado: 'adoptado' }).eq('id', s.animal_id)
    }
  }

  async function rechazar(id) {
    const sol = solicitudes.find(s => s.id === id)
    setSolicitudes(prev => prev.filter(s => s.id !== id))
    setArchivadas(prev => [{ ...sol, etapa: 'rechazado' }, ...prev])
    setDetalle(null)
    await supabase.from('solicitudes_adopcion').update({ etapa: 'rechazado' }).eq('id', id)
  }

  async function restaurar(id) {
    const sol = archivadas.find(s => s.id === id)
    setArchivadas(prev => prev.filter(s => s.id !== id))
    setSolicitudes(prev => [{ ...sol, etapa: 'solicitud' }, ...prev])
    await supabase.from('solicitudes_adopcion').update({ etapa: 'solicitud' }).eq('id', id)
  }

  async function guardarNota(id, nota) {
    await supabase.from('solicitudes_adopcion').update({ notas_admin: nota }).eq('id', id)
    setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, notas_admin: nota } : s))
    if (detalle?.id === id) setDetalle(d => ({ ...d, notas_admin: nota }))
    setNotaId(null)
  }

  const lista = (verArchivadas ? archivadas : solicitudes).filter(s => {
    const matchBusqueda = `${s.nombre} ${s.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
    const matchEtapa = filtroEtapa === 'todas' || s.etapa === filtroEtapa
    return matchBusqueda && matchEtapa
  })

  const fecha = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })

  return (
    <div>
      <div className={styles.header}>
        <h2>Procesos de adopción</h2>
        <div className={styles.headerRight}>
          <button className={`${styles.archiveToggle} ${verArchivadas ? styles.archiveToggleActive : ''}`} onClick={() => setVerArchivadas(!verArchivadas)}>
            {verArchivadas ? '← Activas' : `Archivadas (${archivadas.length})`}
          </button>
          <span className={styles.count}>{lista.length} {verArchivadas ? 'archivadas' : 'activas'}</span>
        </div>
      </div>

      {/* Búsqueda y filtros */}
      <div className={styles.toolbar}>
        <input className={styles.search} type="text" placeholder="Buscar por nombre…" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        {!verArchivadas && (
          <select className={styles.filterSel} value={filtroEtapa} onChange={e => setFiltroEtapa(e.target.value)}>
            <option value="todas">Todas las etapas</option>
            {ETAPAS.map(e => <option key={e} value={e}>{ETAPA_LABEL[e]}</option>)}
          </select>
        )}
      </div>

      {cargando && <p className={styles.loading}>Cargando… 🐾</p>}
      {!cargando && lista.length === 0 && <div className={styles.empty}>No hay solicitudes con ese filtro.</div>}

      <div className={styles.list}>
        {lista.map(s => {
          const etapaIdx = ETAPAS.indexOf(s.etapa)
          return (
            <div key={s.id} className={`${styles.card} ${s.etapa === 'entrega' ? styles.cardDone : ''}`}>
              <div className={styles.cardTop}>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTitle}>{s.animales?.nombre || 'Animal'} → {s.nombre} {s.apellido}</div>
                  <div className={styles.cardSub}>{fecha(s.created_at)} · {s.correo} · {s.celular}</div>
                </div>
                <span className={`${styles.badge} ${s.etapa === 'entrega' ? styles.badgeGreen : s.etapa === 'rechazado' ? styles.badgeGray : styles.badgeOrange}`}>
                  {ETAPA_LABEL[s.etapa]}
                </span>
              </div>

              {s.etapa !== 'rechazado' && (
                <div className={styles.steps}>
                  {ETAPAS.map((etapa, i) => (
                    <div key={etapa} className={styles.stepWrap}>
                      <span className={`${styles.step} ${i < etapaIdx ? styles.stepDone : ''} ${i === etapaIdx ? styles.stepCur : ''}`}>
                        {ETAPA_LABEL[etapa]}
                      </span>
                      {i < ETAPAS.length - 1 && <span className={styles.stepArr}>›</span>}
                    </div>
                  ))}
                </div>
              )}

              {s.notas_admin && notaId !== s.id && (
                <div className={styles.notaDisplay}>📝 {s.notas_admin}</div>
              )}

              {notaId === s.id && (
                <div className={styles.notaWrap}>
                  <textarea className={styles.notaInput} value={notaTemp} onChange={e => setNotaTemp(e.target.value)} placeholder="Notas internas…" rows={2} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className={styles.notaGuardar} onClick={() => guardarNota(s.id, notaTemp)}>Guardar</button>
                    <button className={styles.notaCancelar} onClick={() => setNotaId(null)}>Cancelar</button>
                  </div>
                </div>
              )}

              <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={() => { setDetalle(s); setNotaTemp(s.notas_admin || '') }}>Ver perfil</button>
                {!verArchivadas && s.etapa !== 'entrega' && (
                  <button className={`${styles.actionBtn} ${styles.actionPrimary}`} onClick={() => avanzarEtapa(s)}>
                    Avanzar → {ETAPA_LABEL[ETAPAS[etapaIdx + 1]] || ''}
                  </button>
                )}
                <button className={styles.actionBtn} onClick={() => { setNotaId(s.id); setNotaTemp(s.notas_admin || '') }}>
                  {s.notas_admin ? 'Editar nota' : 'Agregar nota'}
                </button>
                <a className={styles.actionBtn} href={`mailto:${s.correo}`}>Contactar</a>
                {!verArchivadas && s.etapa !== 'entrega' && (
                  <button className={`${styles.actionBtn} ${styles.actionDanger}`} onClick={() => rechazar(s.id)}>Rechazar</button>
                )}
                {verArchivadas && (
                  <button className={`${styles.actionBtn} ${styles.actionRestore}`} onClick={() => restaurar(s.id)}>Restaurar</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal perfil solicitante */}
      {detalle && (
        <div className={styles.overlay} onClick={() => setDetalle(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setDetalle(null)}>✕</button>
            <div className={styles.modalHeader}>
              <div className={styles.modalAvatar}>
                {detalle.nombre.charAt(0)}{detalle.apellido.charAt(0)}
              </div>
              <div>
                <div className={styles.modalNombre}>{detalle.nombre} {detalle.apellido}</div>
                <div className={styles.modalEtapa}>{ETAPA_LABEL[detalle.etapa]}</div>
              </div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Contacto</div>
                <div className={styles.modalRow}><span>Correo</span><a href={`mailto:${detalle.correo}`} className={styles.modalLink}>{detalle.correo}</a></div>
                <div className={styles.modalRow}><span>Celular</span><a href={`tel:${detalle.celular}`} className={styles.modalLink}>{detalle.celular}</a></div>
                <div className={styles.modalRow}><span>Animal</span><span>{detalle.animales?.nombre || '—'}</span></div>
                <div className={styles.modalRow}><span>Solicitud</span><span>{fecha(detalle.created_at)}</span></div>
              </div>

              {detalle.descripcion_hogar && (
                <div className={styles.modalSection}>
                  <div className={styles.modalSectionTitle}>Descripción del hogar</div>
                  <p className={styles.modalDesc}>{detalle.descripcion_hogar}</p>
                </div>
              )}

              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Compromisos</div>
                <div className={styles.modalChecks}>
                  {[
                    { key: 'tiene_espacio', label: 'Tiene espacio suficiente' },
                    { key: 'todos_acuerdo', label: 'Todos en casa de acuerdo' },
                    { key: 'compromiso_vet', label: 'Compromiso veterinario' },
                  ].map(({ key, label }) => (
                    <span key={key} className={`${styles.checkBadge} ${detalle[key] ? styles.checkSi : styles.checkNo}`}>
                      {detalle[key] ? '✓' : '✗'} {label}
                    </span>
                  ))}
                </div>
              </div>

              {detalle.notas_admin && (
                <div className={styles.modalSection}>
                  <div className={styles.modalSectionTitle}>Notas internas</div>
                  <p className={styles.modalDesc}>{detalle.notas_admin}</p>
                </div>
              )}

              <div className={styles.modalActions}>
                <a className={styles.modalPrimaryBtn} href={`mailto:${detalle.correo}`}>Contactar por email</a>
                {detalle.etapa !== 'entrega' && detalle.etapa !== 'rechazado' && (
                  <button className={styles.modalDangerBtn} onClick={() => rechazar(detalle.id)}>Rechazar solicitud</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
