import { useEffect } from 'react'
import styles from './Nosotros.module.css'

const HITOS = [
  { year: 'Hace 16 años', icon: '❤️', title: 'Una vocación de vida',       desc: 'Marlen Piedrahita Gómez comenzó a cuidar, rescatar y proteger animalitos. Desde entonces, su hogar se convirtió en un refugio de amor para los más vulnerables.' },
  { year: '4 años',       icon: '🌱', title: 'Voluntaria con corazón',      desc: 'Antes de crear su propio hogar, Marlen dedicó cuatro años como voluntaria en una fundación animal, aprendiendo y entregándose por completo a la causa.' },
  { year: '2023',         icon: '🏠', title: 'Nace Alegría Gatuna',         desc: 'Con experiencia, amor y determinación, Marlen creó su propio hogar de paso. Un espacio donde cada animalito recibe cuidado, atención veterinaria y mucho cariño mientras encuentra su familia para siempre.' },
  { year: 'Hoy',          icon: '🐾', title: 'Más de 100 conexiones de amor', desc: 'Alegría Gatuna ha logrado conectar a más de 100 animalitos con sus cuidadores para toda la vida. Cada adopción es una historia de amor que nos motiva a seguir.' },
  { year: '2025',         icon: '💻', title: 'Plataforma digital propia',   desc: 'Lanzamos esta plataforma para que más familias puedan conocer a nuestros animalitos y hacer parte de esta bonita causa.' },
]

const IMPACTO = [
  { n: '+100',  l: 'Animalitos adoptados' },
  { n: '16',    l: 'Años de vocación' },
  { n: '$100k', l: 'Cuesta una esterilización' },
  { n: '1',     l: 'Persona con todo el amor' },
]

const GALERIA = [
  'https://flnrrxddhwgtsdfscyop.supabase.co/storage/v1/object/public/animales/image_1.jpg',
  'https://flnrrxddhwgtsdfscyop.supabase.co/storage/v1/object/public/animales/image_2.jpg',
  'https://flnrrxddhwgtsdfscyop.supabase.co/storage/v1/object/public/animales/image_3.jpg',
  'https://flnrrxddhwgtsdfscyop.supabase.co/storage/v1/object/public/animales/image_4.jpg',
  'https://flnrrxddhwgtsdfscyop.supabase.co/storage/v1/object/public/animales/image_5.jpg',
  'https://flnrrxddhwgtsdfscyop.supabase.co/storage/v1/object/public/animales/image_6.jpg',
]

const POSTS_INSTAGRAM = [
  'https://www.instagram.com/p/DV39ICnkYyF/',
  'https://www.instagram.com/p/DVmeM5AEa-T/',
  'https://www.instagram.com/p/DUgkVVIEcAk/',
  'https://www.instagram.com/p/DUZNDOREUFf/',
  'https://www.instagram.com/p/DUJQveSEcqm/',
  'https://www.instagram.com/p/DTva4WskVoY/',
  'https://www.instagram.com/p/DTWPQcdEd5f/',
  'https://www.instagram.com/p/DTL1IIgkXGS/',
  'https://www.instagram.com/p/DS8l1ZhkXSQ/',
  'https://www.instagram.com/p/DS3n1ISEVJH/',
]

export default function Nosotros() {

  // Carga el script oficial de Instagram para renderizar los embeds
  useEffect(() => {
    // Damos tiempo a que React termine de renderizar todos los blockquotes
    const process = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process()
        return
      }
      const script = document.createElement('script')
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      script.onload = () => window.instgrm?.Embeds.process()
      document.body.appendChild(script)
    }
    const timer = setTimeout(process, 300)
    return () => clearTimeout(timer)
  }, [])

  const VISIBLE = typeof window !== 'undefined' && window.innerWidth <= 640 ? 1 : 3

  function goTo(i) {
    const track = document.getElementById('ig-track')
    const slides = track?.querySelectorAll('[data-slide]')
    if (!track || !slides) return

    const visible = window.innerWidth <= 640 ? 1 : 3
    const max = slides.length - visible
    const idx = Math.max(0, Math.min(i, max))
    const slideW = slides[0].offsetWidth + (window.innerWidth <= 640 ? 12 : 20)
    track.style.transform = `translateX(-${idx * slideW}px)`

    document.querySelectorAll('[data-dot]').forEach((d, j) => {
      d.classList.toggle('dot-active', j === idx)
    })
    document.getElementById('prev-arrow').disabled = idx === 0
    document.getElementById('next-arrow').disabled = idx >= max

    track.dataset.cur = idx
  }

  function scroll(dir) {
    const track = document.getElementById('ig-track')
    const cur = parseInt(track?.dataset.cur || '0')
    goTo(cur + dir)
  }
  return (
    <div className="page-container">

      {/* Historia */}
      <div className={styles.heroCard}>
        <div>
          <span className={styles.tag}>Nuestra historia</span>
          <h2 className={styles.heroTitle}>Una vida dedicada<br />a <span>ellos</span></h2>
          <p className={styles.heroDesc}>
            Alegría Gatuna es el hogar de paso de <strong>Marlen Piedrahita Gómez</strong>, quien
            desde hace 16 años cuida, rescata y protege animalitos en Medellín. Después de cuatro
            años como voluntaria en una fundación, en 2023 creó su propio hogar de paso —
            un espacio lleno de amor donde cada animalito recibe los cuidados y la atención médica que merece mientras
            encuentra su familia para siempre.
          </p>
        </div>
        <div className={styles.heroArt}>🏠🐱</div>
      </div>

      {/* Impacto */}
      <div className={styles.impactoGrid}>
        {IMPACTO.map(({ n, l }) => (
          <div key={l} className={styles.impactoCard}>
            <div className={styles.impactoN}>{n}</div>
            <div className={styles.impactoL}>{l}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className={styles.timelineCard}>
        <h3>Cómo llegamos hasta aquí</h3>
        {HITOS.map(({ year, icon, title, desc }, i) => (
          <div key={year} className={styles.tlItem}>
            <div className={styles.tlLeft}>
              <div className={styles.tlDot}>{icon}</div>
              {i < HITOS.length - 1 && <div className={styles.tlLine} />}
            </div>
            <div className={styles.tlContent}>
              <div className={styles.tlYear}>{year}</div>
              <div className={styles.tlTitle}>{title}</div>
              <div className={styles.tlDesc}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Galería */}
      <div className={styles.galeriaSection}>
        <h3>Momentos que nos mueven</h3>
        <div className={styles.galeriaGrid}>
          {GALERIA.map((url, i) => (
            <div key={i} className={styles.galeriaItem}>
              <img src={url} alt={`Momento ${i + 1}`} className={styles.galeriaImg} />
            </div>
          ))}
        </div>

      </div>

      {/* Testimonios — carrusel de Instagram */}
      <div className={styles.testimoniosSection}>
        <div className={styles.testiHeader}>
          <div>
            <h3>Lo que dicen quienes adoptaron</h3>
            <p className={styles.testiSubtitle}>
              Historias reales compartidas por nuestras familias adoptantes 🐾
            </p>
          </div>
          <div className={styles.arrows}>
            <button
              className={styles.arrow}
              onClick={() => scroll(-1)}
              id="prev-arrow"
              aria-label="anterior"
            >‹</button>
            <button
              className={styles.arrow}
              onClick={() => scroll(1)}
              id="next-arrow"
              aria-label="siguiente"
            >›</button>
          </div>
        </div>

        <div className={styles.carouselWrap}>
          <div className={styles.carouselTrack} id="ig-track">
            {POSTS_INSTAGRAM.map((url, i) => (
              <div key={url} className={styles.igSlide} data-slide={i}>
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={url}
                  data-instgrm-version="14"
                  style={{
                    background: 'white',
                    border: '0.5px solid #e8e0d4',
                    borderRadius: '18px',
                    margin: 0,
                    width: '100%',
                    minWidth: 0,
                  }}
                >
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    Ver post en Instagram
                  </a>
                </blockquote>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.dots} id="ig-dots">
          {POSTS_INSTAGRAM.map((_, i) => (
            <button
              key={i}
              data-dot={i}
              className={`${styles.dot} ${i === 0 ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Post ${i + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
