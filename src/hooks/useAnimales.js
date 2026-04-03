import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAnimales(filtro = 'todos') {
  const [animales, setAnimales] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAnimales() {
      setCargando(true)
      let query = supabase
        .from('animales')
        .select('*')
        .neq('estado', 'adoptado')
        .order('created_at', { ascending: false })

      if (filtro === 'gato' || filtro === 'perro' || filtro === 'conejo') {
        query = query.eq('especie', filtro)
      } else if (filtro === 'disponible') {
        query = query.eq('estado', 'disponible')
      }

      const { data, error } = await query

      if (error) setError(error.message)
      else setAnimales(data)

      setCargando(false)
    }

    fetchAnimales()
  }, [filtro])

  return { animales, cargando, error }
}
