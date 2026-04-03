import { useEffect } from 'react'
import styles from './Nosotros.module.css'

const HITOS = [
  { year: '2019', icon: '📦', title: 'El primer rescate',           desc: 'Valentina encuentra cinco gatitos abandonados y los acoge en su apartamento. El apartamento nunca volvió a ser el mismo — para mejor.' },
  { year: '2020', icon: '🌱', title: 'Nace Alegría Gatuna',         desc: 'Con la ayuda de amigos y vecinos, formalizamos el hogar de paso. Llegaron los primeros voluntarios y las primeras adopciones exitosas.' },
  { year: '2021', icon: '📱', title: 'Comunidad en Instagram',      desc: 'Abrimos @alegria.gatuna y la comunidad respondió con amor. Las adopciones se triplicaron gracias a la difusión digital.' },
  { year: '2022–2024', icon: '🏥', title: 'Alianzas veterinarias',  desc: 'Logramos convenios con clínicas de Medellín para atención a menor costo. Hoy atendemos en promedio 15 animales simultáneos.' },
  { year: '2025', icon: '💻', title: 'Plataforma digital propia',   desc: 'Lanzamos esta plataforma para conectar mejor a los animales con sus futuros hogares, y a la comunidad con nuestra causa.' },
]

const IMPACTO = [
  { n: '+350', l: 'Animales rescatados' },
  { n: '138',  l: 'Adoptados con éxito' },
  { n: '42',   l: 'Voluntarios activos' },
  { n: '5',    l: 'Años de labor continua' },
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
          <h2 className={styles.heroTitle}>Nació del amor,<br />creció con <span>propósito</span></h2>
          <p className={styles.heroDesc}>
            Alegría Gatuna empezó en 2019 cuando nuestra fundadora, Valentina, encontró una caja con
            cinco gatitos abandonados en su puerta. Lo que comenzó como un acto de compasión se
            convirtió en un hogar de paso que hoy salva decenas de vidas cada mes en Medellín.
            Cada animal que pasa por nuestras manos recibe amor, cuidado veterinario y una segunda oportunidad.
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
