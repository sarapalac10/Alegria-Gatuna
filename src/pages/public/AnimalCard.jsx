import { useNavigate } from 'react-router-dom'
import styles from './AnimalCard.module.css'

const EMOJIS = { gato: '🐱', perro: '🐶' }
const BG = { gato: '#EFF8E8', perro: '#FFF3EC' }

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

export default function AnimalCard({ animal }) {
  const navigate = useNavigate()
  const disponible = animal.estado === 'disponible'

  return (
    <div className={styles.card}>
      <div className={styles.img} style={{ background: BG[animal.especie] }}>
        {animal.foto_url
          ? <img src={animal.foto_url} alt={animal.nombre} className={styles.foto} />
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
          onClick={() => navigate('/me-interesa', { state: { animalId: animal.id, animalNombre: animal.nombre } })}
        >
          {disponible ? 'Me interesa' : ESTADO_LABEL[animal.estado]}
        </button>
      </div>
    </div>
  )
}
