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

// ── Validaciones ──────────────────────────────────────────────
function validar(form) {
  const errores = {}

  if (!form.nombre.trim())
    errores.nombre = 'El nombre es obligatorio.'
  else if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/.test(form.nombre.trim()))
    errores.nombre = 'Solo se permiten letras.'

  if (!form.apellido.trim())
    errores.apellido = 'El apellido es obligatorio.'
  else if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/.test(form.apellido.trim()))
    errores.apellido = 'Solo se permiten letras.'

  if (!form.correo.trim())
    errores.correo = 'El correo es obligatorio.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim()))
    errores.correo = 'Ingresa un correo válido.'

  if (!form.celular.trim())
    errores.celular = 'El celular es obligatorio.'
  else if (!/^3\d{9}$/.test(form.celular.replace(/\s/g, '')))
    errores.celular = 'Debe ser un celular colombiano de 10 dígitos (ej: 3001234567).'

  if (!form.acepta_politica)
    errores.acepta_politica = 'Debes aceptar la política de tratamiento de datos.'

  return errores
}

export default function MeInteresa() {
  const location = useLocation()
  const [form, setForm] = useState(ESTADO_INICIAL)
  const [errores, setErrores] = useState({})
  const [animales, setAnimales] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [errorGlobal, setErrorGlobal] = useState(null)

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
    const newValue = type === 'checkbox' ? checked : value
    setForm(f => ({ ...f, [name]: newValue }))
    // Limpiar error del campo al modificarlo
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nuevosErrores = validar(form)
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }

    setEnviando(true)
    setErrorGlobal(null)

    const { error } = await supabase
      .from('solicitudes_adopcion')
      .insert([{
        animal_id:         form.animal_id || null,
        nombre:            form.nombre.trim(),
        apellido:          form.apellido.trim(),
        correo:            form.correo.trim().toLowerCase(),
        celular:           form.celular.replace(/\s/g, ''),
        descripcion_hogar: form.descripcion_hogar,
        tiene_espacio:     form.tiene_espacio,
        todos_acuerdo:     form.todos_acuerdo,
        compromiso_vet:    form.compromiso_vet,
      }])

    if (error) {
      setErrorGlobal('Hubo un problema al enviar la solicitud. Intenta de nuevo.')
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
            nombre:       form.nombre.trim(),
            apellido:     form.apellido.trim(),
            correo:       form.correo.trim().toLowerCase(),
            animalNombre: animalSeleccionado?.nombre || 'el animalito',
          }),
        })
      } catch (e) {
        console.error('Error enviando email:', e)
      }
      setEnviado(true)
      setForm(ESTADO_INICIAL)
      setErrores({})
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

        {errorGlobal && (
          <div className={styles.errorToast}>{errorGlobal}</div>
        )}

        <div className={styles.card}>
          <h2>Quiero adoptar</h2>
          <p className={styles.sub}>
            Cuéntanos sobre ti. Revisaremos tu solicitud y nos pondremos en contacto en menos de 48 horas.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.twoCol}>
              <div className={styles.frow}>
                <label>Nombre</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className={errores.nombre ? styles.inputError : ''}
                />
                {errores.nombre && <span className={styles.fieldError}>{errores.nombre}</span>}
              </div>
              <div className={styles.frow}>
                <label>Apellido</label>
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                  className={errores.apellido ? styles.inputError : ''}
                />
                {errores.apellido && <span className={styles.fieldError}>{errores.apellido}</span>}
              </div>
            </div>

            <div className={styles.twoCol}>
              <div className={styles.frow}>
                <label>Correo</label>
                <input
                  name="correo"
                  type="email"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className={errores.correo ? styles.inputError : ''}
                />
                {errores.correo && <span className={styles.fieldError}>{errores.correo}</span>}
              </div>
              <div className={styles.frow}>
                <label>Celular</label>
                <input
                  name="celular"
                  type="tel"
                  value={form.celular}
                  onChange={handleChange}
                  placeholder="3001234567"
                  maxLength={10}
                  className={errores.celular ? styles.inputError : ''}
                />
                {errores.celular && <span className={styles.fieldError}>{errores.celular}</span>}
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
              {errores.acepta_politica && <span className={styles.fieldError}>{errores.acepta_politica}</span>}
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
