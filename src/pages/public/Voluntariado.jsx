import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './Voluntariado.module.css'

const TIPOS = [
  { key: 'cuidado_directo',   icon: '🐾', label: 'Cuidado directo',    desc: 'Alimentación, aseo y paseos. Mínimo 4h a la semana.' },
  { key: 'hogar_transito',    icon: '🏠', label: 'Hogar de tránsito',  desc: 'Recibe un animal temporalmente mientras encontramos hogar definitivo.' },
  { key: 'apoyo_veterinario', icon: '💉', label: 'Apoyo veterinario',  desc: 'Si eres vet o estudiante, apoya en jornadas de salud.' },
  { key: 'difusion_redes',    icon: '📱', label: 'Difusión en redes',  desc: 'Ayúdanos a dar a conocer los animales en adopción.' },
]

const FORM_INICIAL = { nombre: '', correo: '', tipo: 'cuidado_directo', disponibilidad: '2-4 horas', motivacion: '' }

export default function Voluntariado() {
  const [form, setForm] = useState(FORM_INICIAL)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function selTipo(key) {
    setForm(f => ({ ...f, tipo: key }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    const { error } = await supabase.from('voluntarios').insert([form])
    if (error) setError('Hubo un problema. Intenta de nuevo.')
    else { setEnviado(true); setForm(FORM_INICIAL) }
    setEnviando(false)
  }

  return (
    <div className="page-container">
      <div className={styles.intro}>
        <h2>Únete al equipo</h2>
        <p>Alegría Gatuna es hoy el trabajo y el amor de una sola persona — Marlen. ¿Quieres ser el primero en acompañarla? Escoge cómo puedes ayudar.</p>
      </div>

      <div className={styles.tiposGrid}>
        {TIPOS.map(({ key, icon, label, desc }) => (
          <div
            key={key}
            className={`${styles.tipoCard} ${form.tipo === key ? styles.tipoActive : ''}`}
            onClick={() => selTipo(key)}
          >
            <span className={styles.tipoIcon}>{icon}</span>
            <div className={styles.tipoLabel}>{label}</div>
            <div className={styles.tipoDesc}>{desc}</div>
          </div>
        ))}
      </div>

      <div className={styles.formWrap}>
        {enviado && (
          <div className={styles.success}>
            ¡Te registramos! Pronto nos ponemos en contacto contigo. 🌿
          </div>
        )}
        {error && <div className={styles.errorMsg}>{error}</div>}

        <div className={styles.card}>
          <h2>Formulario de voluntariado</h2>
          <p className={styles.sub}>Cuéntanos cómo quieres ayudar y nos contactaremos pronto.</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.twoCol}>
              <div className={styles.frow}>
                <label>Nombre completo</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" required />
              </div>
              <div className={styles.frow}>
                <label>Correo</label>
                <input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="correo@ejemplo.com" required />
              </div>
            </div>
            <div className={styles.twoCol}>
              <div className={styles.frow}>
                <label>Tipo de voluntariado</label>
                <select name="tipo" value={form.tipo} onChange={handleChange}>
                  {TIPOS.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
              </div>
              <div className={styles.frow}>
                <label>Disponibilidad semanal</label>
                <select name="disponibilidad" value={form.disponibilidad} onChange={handleChange}>
                  <option>2-4 horas</option>
                  <option>4-8 horas</option>
                  <option>Más de 8 horas</option>
                </select>
              </div>
            </div>
            <div className={styles.frow}>
              <label>¿Por qué quieres ser voluntario?</label>
              <textarea name="motivacion" value={form.motivacion} onChange={handleChange}
                placeholder="Cuéntanos tu motivación…" rows={3} />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={enviando}>
              {enviando ? 'Enviando…' : 'Inscribirme'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
