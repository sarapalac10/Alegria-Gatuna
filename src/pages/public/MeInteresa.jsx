import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase, supabaseAnonKey } from '../../lib/supabase'
import styles from './MeInteresa.module.css'

const ESTADO_INICIAL = {
  nombre: '', apellido: '', correo: '', celular: '',
  animal_id: '', descripcion_hogar: '',
  tiene_espacio: false, todos_acuerdo: false, compromiso_vet: false,
  acepta_politica: false,
}

export default function MeInteresa() {
  const location = useLocation()
  const [form, setForm] = useState(ESTADO_INICIAL)
  const [animales, setAnimales] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('animales')
      .select('id, nombre, especie, edad')
      .eq('estado', 'disponible')
      .then(({ data }) => { if (data) setAnimales(data) })
  }, [])

  useEffect(() => {
    if (location.state?.animalId) {
      setForm(f => ({ ...f, animal_id: location.state.animalId }))
    }
  }, [location.state])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.acepta_politica) {
      setError('Debes aceptar la política de tratamiento de datos para continuar.')
      return
    }
    setEnviando(true)
    setError(null)

    const { error } = await supabase
      .from('solicitudes_adopcion')
      .insert([{
        animal_id:         form.animal_id || null,
        nombre:            form.nombre,
        apellido:          form.apellido,
        correo:            form.correo,
        celular:           form.celular,
        descripcion_hogar: form.descripcion_hogar,
        tiene_espacio:     form.tiene_espacio,
        todos_acuerdo:     form.todos_acuerdo,
        compromiso_vet:    form.compromiso_vet,
      }])

    if (error) {
      setError('Hubo un problema al enviar la solicitud. Intenta de nuevo.')
    } else {
      const animalSeleccionado = animales.find(a => a.id === form.animal_id)
      try {
        await fetch('https://flnrrxddhwgtsdfscyop.supabase.co/functions/v1/nueva-solicitud', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            nombre:       form.nombre,
            apellido:     form.apellido,
            correo:       form.correo,
            animalNombre: animalSeleccionado?.nombre || 'el animalito',
          }),
        })
      } catch (e) {
        console.error('Error enviando email:', e)
      }
      setEnviado(true)
      setForm(ESTADO_INICIAL)
    }
    setEnviando(false)
  }

  return (
    <div className="page-container">
      <div className={styles.wrap}>

        {enviado && (
          <div className={styles.successToast}>
            ¡Solicitud enviada con éxito! Te contactaremos en menos de 48 horas. 🐾
          </div>
        )}

        {error && (
          <div className={styles.errorToast}>{error}</div>
        )}

        <div className={styles.card}>
          <h2>Quiero adoptar</h2>
          <p className={styles.sub}>
            Cuéntanos sobre ti. Revisaremos tu solicitud y nos pondremos en contacto en menos de 48 horas.
          </p>

          <form onSubmit={handleSubmit}>
            <div className={styles.twoCol}>
              <div className={styles.frow}>
                <label>Nombre</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" required />
              </div>
              <div className={styles.frow}>
                <label>Apellido</label>
                <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Tu apellido" required />
              </div>
            </div>

            <div className={styles.twoCol}>
              <div className={styles.frow}>
                <label>Correo</label>
                <input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="correo@ejemplo.com" required />
              </div>
              <div className={styles.frow}>
                <label>Celular</label>
                <input name="celular" type="tel" value={form.celular} onChange={handleChange} placeholder="300 000 0000" required />
              </div>
            </div>

            <div className={styles.frow}>
              <label>Animal de interés</label>
              <select name="animal_id" value={form.animal_id} onChange={handleChange}>
                <option value="">Selecciona un animal</option>
                {animales.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.nombre} ({a.especie}, {a.edad})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.frow}>
              <label>Tu hogar</label>
              <textarea
                name="descripcion_hogar"
                value={form.descripcion_hogar}
                onChange={handleChange}
                placeholder="¿Tienes espacio exterior? ¿Convives con más personas o mascotas?"
                rows={3}
              />
            </div>

            <div className={styles.checks}>
              <label className={styles.checkRow}>
                <input type="checkbox" name="tiene_espacio" checked={form.tiene_espacio} onChange={handleChange} />
                Tengo espacio suficiente en casa
              </label>
              <label className={styles.checkRow}>
                <input type="checkbox" name="todos_acuerdo" checked={form.todos_acuerdo} onChange={handleChange} />
                Todos en casa están de acuerdo con adoptar
              </label>
              <label className={styles.checkRow}>
                <input type="checkbox" name="compromiso_vet" checked={form.compromiso_vet} onChange={handleChange} />
                Me comprometo con los cuidados veterinarios
              </label>
            </div>

            <div className={styles.politicaWrap}>
              <label className={styles.checkRow} style={{ alignItems: 'flex-start', gap: 10 }}>
                <input
                  type="checkbox"
                  name="acepta_politica"
                  checked={form.acepta_politica}
                  onChange={handleChange}
                  required
                  style={{ marginTop: 3, flexShrink: 0 }}
                />
                <span>
                  He leído y acepto la{' '}
                  <a href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer" className={styles.politicaLink}>
                    Política de Tratamiento de Datos Personales
                  </a>
                  {' '}del Hogar de Paso Alegría Gatuna, de conformidad con la Ley 1581 de 2012.
                </span>
              </label>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar solicitud'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
