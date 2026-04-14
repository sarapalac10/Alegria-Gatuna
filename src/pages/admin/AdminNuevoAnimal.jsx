import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import styles from './AdminNuevoAnimal.module.css'

const FORM_INICIAL = {
  nombre: '', especie: 'gato', sexo: 'hembra', edad: '',
  raza: '', descripcion: '',
  vacunado: false, desparasitado: false, esterilizado: false,
  con_animales: false, con_ninos: false,
  estado: 'disponible',
}

export default function AdminNuevoAnimal() {
  const [form, setForm] = useState(FORM_INICIAL)
  const [fotosExistentes, setFotosExistentes] = useState([]) // URLs ya guardadas
  const [fotosNuevas, setFotosNuevas] = useState([])         // { file, preview }
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState(null)
  const [editando, setEditando] = useState(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const animalId = searchParams.get('id')

  useEffect(() => {
    if (!animalId) return
    setEditando(true)
    supabase.from('animales').select('*').eq('id', animalId).single()
      .then(({ data }) => {
        if (!data) return
        setForm({
          nombre: data.nombre, especie: data.especie, sexo: data.sexo,
          edad: data.edad || '', raza: data.raza || '',
          descripcion: data.descripcion || '',
          vacunado: data.vacunado, desparasitado: data.desparasitado,
          esterilizado: data.esterilizado, con_animales: data.con_animales,
          con_ninos: data.con_ninos, estado: data.estado,
        })
        // Cargar fotos existentes: foto_url + fotos[]
        const existentes = []
        if (data.foto_url) existentes.push(data.foto_url)
        if (data.fotos?.length) {
          data.fotos.forEach(url => { if (url !== data.foto_url) existentes.push(url) })
        }
        setFotosExistentes(existentes)
      })
  }, [animalId])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleFotos(e) {
    const files = Array.from(e.target.files)
    const nuevas = files.map(file => ({ file, preview: URL.createObjectURL(file) }))
    setFotosNuevas(prev => [...prev, ...nuevas])
  }

  function quitarFotoExistente(url) {
    setFotosExistentes(prev => prev.filter(u => u !== url))
  }

  function quitarFotoNueva(index) {
    setFotosNuevas(prev => prev.filter((_, i) => i !== index))
  }

  async function subirFoto(id, file, index) {
    const ext = file.name.split('.').pop()
    const path = `${id}_${Date.now()}_${index}.${ext}`
    const { error } = await supabase.storage.from('animales').upload(path, file, { upsert: true })
    if (error) throw new Error('Error subiendo foto: ' + error.message)
    return supabase.storage.from('animales').getPublicUrl(path).data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      let id = animalId

      // Insertar o actualizar datos básicos
      if (editando) {
        const { error } = await supabase.from('animales').update(form).eq('id', animalId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('animales').insert([form]).select().single()
        if (error) throw error
        id = data.id
      }

      // Subir fotos nuevas
      const urlsNuevas = await Promise.all(
        fotosNuevas.map((f, i) => subirFoto(id, f.file, i))
      )

      // Combinar fotos existentes + nuevas
      const todasFotos = [...fotosExistentes, ...urlsNuevas]
      const foto_url = todasFotos[0] || null

      await supabase.from('animales').update({
        foto_url,
        fotos: todasFotos,
      }).eq('id', id)

      setExito(true)
      setTimeout(() => navigate('/admin/animales'), 1500)
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const CHECKS = [
    { name: 'vacunado',      label: 'Vacunado' },
    { name: 'desparasitado', label: 'Desparasitado' },
    { name: 'esterilizado',  label: 'Esterilizado / castrado' },
    { name: 'con_animales',  label: 'Compatible con otros animales' },
    { name: 'con_ninos',     label: 'Compatible con niños' },
  ]

  const totalFotos = fotosExistentes.length + fotosNuevas.length

  return (
    <div>
      <div className={styles.header}>
        <h2>{editando ? 'Editar animal' : 'Registrar nuevo animal'}</h2>
        <button className={styles.backBtn} onClick={() => navigate('/admin/animales')}>← Volver</button>
      </div>

      {exito && <div className={styles.success}>✅ {editando ? 'Animal actualizado' : 'Animal publicado'} correctamente. Redirigiendo…</div>}
      {error && <div className={styles.errorMsg}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>

        {/* Fotos múltiples */}
        <div className={styles.frow}>
          <label>Fotos ({totalFotos} agregada{totalFotos !== 1 ? 's' : ''})</label>

          <div className={styles.fotosGrid}>
            {/* Fotos existentes */}
            {fotosExistentes.map((url, i) => (
              <div key={url} className={styles.fotoItem}>
                {i === 0 && <span className={styles.fotoPrincipal}>Principal</span>}
                <img src={url} alt={`foto ${i + 1}`} className={styles.fotoThumb} />
                <button type="button" className={styles.fotoQuitar} onClick={() => quitarFotoExistente(url)}>✕</button>
              </div>
            ))}

            {/* Fotos nuevas */}
            {fotosNuevas.map((f, i) => (
              <div key={i} className={styles.fotoItem}>
                {fotosExistentes.length === 0 && i === 0 && <span className={styles.fotoPrincipal}>Principal</span>}
                <img src={f.preview} alt={`nueva ${i + 1}`} className={styles.fotoThumb} />
                <button type="button" className={styles.fotoQuitar} onClick={() => quitarFotoNueva(i)}>✕</button>
              </div>
            ))}

            {/* Botón agregar */}
            <label className={styles.fotoAgregar}>
              <span>+</span>
              <span className={styles.fotoAgregarLabel}>Agregar foto</span>
              <input type="file" accept="image/*" multiple onChange={handleFotos} className={styles.fotoInput} />
            </label>
          </div>
          <p className={styles.fotoHint}>La primera foto es la principal. Puedes agregar hasta 10 fotos.</p>
        </div>

        {/* Básicos */}
        <div className={styles.twoCol}>
          <div className={styles.frow}>
            <label>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del animal" required />
          </div>
          <div className={styles.frow}>
            <label>Especie</label>
            <select name="especie" value={form.especie} onChange={handleChange}>
              <option value="gato">Gato</option>
              <option value="perro">Perro</option>
            </select>
          </div>
        </div>

        <div className={styles.twoCol}>
          <div className={styles.frow}>
            <label>Sexo</label>
            <select name="sexo" value={form.sexo} onChange={handleChange}>
              <option value="hembra">Hembra</option>
              <option value="macho">Macho</option>
            </select>
          </div>
          <div className={styles.frow}>
            <label>Edad aproximada</label>
            <input name="edad" value={form.edad} onChange={handleChange} placeholder="Ej: 2 años, 8 meses" />
          </div>
        </div>

        <div className={styles.frow}>
          <label>Raza / características físicas</label>
          <input name="raza" value={form.raza} onChange={handleChange} placeholder="Mestizo, pelo corto, color café…" />
        </div>

        <div className={styles.frow}>
          <label>Historia y personalidad</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
            placeholder="¿Cómo llegó al hogar? ¿Cómo es su carácter?…" rows={4} />
        </div>

        {/* Salud */}
        <div className={styles.checksSection}>
          <div className={styles.checksTitle}>Salud y compatibilidad</div>
          <div className={styles.checksGrid}>
            {CHECKS.map(({ name, label }) => (
              <label key={name} className={styles.checkRow}>
                <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.frow} style={{ maxWidth: 240 }}>
          <label>Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="disponible">Disponible</option>
            <option value="en_proceso">En proceso</option>
            <option value="reservado">Reservado</option>
            <option value="adoptado">Adoptado</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={guardando}>
          {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Publicar animal'}
        </button>
      </form>
    </div>
  )
}
