import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AnimalCard.module.css'

const EMOJIS = { gato: '🐱', perro: '🐶', conejo: '🐰', otro: '🐾' }
const BG = { gato: '#EFF8E8', perro: '#FFF3EC', conejo: '#FEF6DC', otro: '#F7F2EA' }

const ESTADO_LABEL = {
  disponible: 'Disponible',
  en_proceso: 'En proceso',
  reservado:  'Reservado',
  adoptado:   'Adoptado',
}
const ESTADO_CLASS = {
  disponible: 'badgeGreen',
  en_proceso: 'badgeOrange',
  reservado:  'badgeAmber',
  adoptado:   'badgeGray',
}

const CHECKS = [
  { key: 'vacunado',      label: '💉 Vacunado' },
  { key: 'desparasitado', label: '🪱 Desparasitado' },
  { key: 'esterilizado',  label: '✂️ Esterilizado' },
  { key: 'con_ninos',     label: '👶 Apto con niños' },
  { key: 'con_animales',  label: '🐾 Apto con otros animales' },
]

export default function AnimalCard({ animal }) {
  const navigate = useNavigate()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [fotoIdx, setFotoIdx] = useState(0)
  const disponible = animal.estado === 'disponible'

  // Construir array de fotos: fotos[] si existe, si no foto_url
  const fotos = (animal.fotos?.length > 0)
    ? animal.fotos
    : animal.foto_url ? [animal.foto_url] : []

  function abrirModal(e) {
    e.stopPropagation()
    setFotoIdx(0)
    setModalAbierto(true)
  }

  function cerrarModal(e) {
    e?.stopPropagation()
    setModalAbierto(false)
  }

  function irAInteresa(e) {
    e.stopPropagation()
    setModalAbierto(false)
    navigate('/me-interesa', { state: { animalId: animal.id, animalNombre: animal.nombre } })
  }

  function prevFoto(e) {
    e.stopPropagation()
    setFotoIdx(i => (i - 1 + fotos.length) % fotos.length)
  }

  function nextFoto(e) {
    e.stopPropagation()
    setFotoIdx(i => (i + 1) % fotos.length)
  }

  return (
    <>
      {/* Tarjeta */}
      <div className={styles.card} onClick={abrirModal} style={{ cursor: 'pointer' }}>
        <div className={styles.img} style={{ background: BG[animal.especie] }}>
          {fotos.length > 0
            ? <img src={fotos[0]} alt={animal.nombre} className={styles.foto} />
            : <span className={styles.emoji}>{EMOJIS[animal.especie]}</span>
          }
        </div>

        <div className={styles.body}>
          <div className={styles.nombre}>{animal.nombre}</div>
          <div className={styles.meta}>
            {animal.especie.charAt(0).toUpperCase() + animal.especie.slice(1)} · {animal.sexo === 'macho' ? 'Macho' : 'Hembra'} · {animal.edad}
          </div>

          <span className={`${styles.badge} ${styles[ESTADO_CLASS[animal.estado]]}`}>
            {ESTADO_LABEL[animal.estado]}
          </span>

          <button
            className={`${styles.btn} ${!disponible ? styles.btnOff : ''}`}
            disabled={!disponible}
            onClick={disponible ? irAInteresa : e => e.stopPropagation()}
          >
            {disponible ? 'Me interesa' : ESTADO_LABEL[animal.estado]}
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className={styles.overlay} onClick={cerrarModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.cerrar} onClick={cerrarModal}>✕</button>

            {/* Carrusel de fotos */}
            <div className={styles.modalFotoWrap} style={{ background: BG[animal.especie] }}>
              {fotos.length > 0 ? (
                <>
                  <img
                    src={fotos[fotoIdx]}
                    alt={`${animal.nombre} ${fotoIdx + 1}`}
                    className={styles.modalFoto}
                  />
                  {fotos.length > 1 && (
                    <>
                      <button className={`${styles.carruselBtn} ${styles.carruselPrev}`} onClick={prevFoto}>‹</button>
                      <button className={`${styles.carruselBtn} ${styles.carruselNext}`} onClick={nextFoto}>›</button>
                      <div className={styles.carruselDots}>
                        {fotos.map((_, i) => (
                          <span
                            key={i}
                            className={`${styles.dot} ${i === fotoIdx ? styles.dotActive : ''}`}
                            onClick={e => { e.stopPropagation(); setFotoIdx(i) }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <span className={styles.modalEmoji}>{EMOJIS[animal.especie]}</span>
              )}
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalHeader}>
                <div>
                  <div className={styles.modalNombre}>{animal.nombre}</div>
                  <div className={styles.modalMeta}>
                    {animal.especie.charAt(0).toUpperCase() + animal.especie.slice(1)} · {animal.sexo === 'macho' ? 'Macho' : 'Hembra'} · {animal.edad}
                    {animal.raza ? ` · ${animal.raza}` : ''}
                  </div>
                </div>
                <span className={`${styles.badge} ${styles[ESTADO_CLASS[animal.estado]]}`}>
                  {ESTADO_LABEL[animal.estado]}
                </span>
              </div>

              {animal.descripcion && (
                <p className={styles.modalDesc}>{animal.descripcion}</p>
              )}

              <div className={styles.modalChecks}>
                {CHECKS.map(({ key, label }) => (
                  animal[key] !== undefined && (
                    <span
                      key={key}
                      className={`${styles.checkBadge} ${animal[key] ? styles.checkSi : styles.checkNo}`}
                    >
                      {animal[key] ? '✓' : '✗'} {label}
                    </span>
                  )
                ))}
              </div>

              <button
                className={`${styles.modalBtn} ${!disponible ? styles.btnOff : ''}`}
                disabled={!disponible}
                onClick={disponible ? irAInteresa : undefined}
              >
                {disponible ? '❤️ Me interesa adoptarlo' : ESTADO_LABEL[animal.estado]}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
