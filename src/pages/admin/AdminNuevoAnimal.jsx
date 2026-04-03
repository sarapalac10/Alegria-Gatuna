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
  const [fotoFile, setFotoFile] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
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
        if (data.foto_url) setFotoPreview(data.foto_url)
      })
  }, [animalId])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
  }

  async function subirFoto(id) {
    if (!fotoFile) return null
    const ext = fotoFile.name.split('.').pop()
    const path = `${id}.${ext}`
    const { error } = await supabase.storage.from('animales').upload(path, fotoFile, { upsert: true })
    if (error) throw new Error('Error subiendo la foto: ' + error.message)
    return supabase.storage.from('animales').getPublicUrl(path).data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      let foto_url = (!fotoFile && fotoPreview) ? fotoPreview : null

      if (editando) {
        if (fotoFile) foto_url = await subirFoto(animalId)
        const { error } = await supabase.from('animales')
          .update({ ...form, ...(foto_url !== null && { foto_url }) })
          .eq('id', animalId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('animales').insert([form]).select().single()
        if (error) throw error
        if (fotoFile) {
          foto_url = await subirFoto(data.id)
          await supabase.from('animales').update({ foto_url }).eq('id', data.id)
        }
      }

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

  return (
    <div>
      <div className={styles.header}>
        <h2>{editando ? 'Editar animal' : 'Registrar nuevo animal'}</h2>
        <button className={styles.backBtn} onClick={() => navigate('/admin/animales')}>← Volver</button>
      </div>

      {exito && <div className={styles.success}>✅ {editando ? 'Animal actualizado' : 'Animal publicado'} correctamente. Redirigiendo…</div>}
      {error && <div className={styles.errorMsg}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>

        {/* Foto */}
        <label className={styles.fotoLabel} htmlFor="foto-input">
          {fotoPreview
            ? <img src={fotoPreview} alt="preview" className={styles.fotoPreview} />
            : <div className={styles.fotoDrop}>
                <span className={styles.fotoIcon}>📷</span>
                <p>Arrastra una foto o haz clic para seleccionar</p>
              </div>
          }
        </label>
        <input id="foto-input" type="file" accept="image/*" onChange={handleFoto} className={styles.fotoInput} />
        {fotoPreview && (
          <button type="button" className={styles.fotoRemove}
            onClick={() => { setFotoFile(null); setFotoPreview(null) }}>
            Quitar foto
          </button>
        )}

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
