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

const GALERIA = ['🐱','🐶','🐰','🐈','🐕','🦮']
const GAL_BG  = ['#EFF8E8','#FFF3EC','#FEF6DC','#FBEAF0','#E6F1FB','#E4F2DC']

const TESTIMONIOS = [
  { ini: 'CR', color: '#E4F2DC', ctext: '#2A5A1A', nombre: 'Carolina Ríos',   animal: 'Adoptó a Luna · 2023',    texto: 'Adoptar a Luna fue la mejor decisión de mi vida. El proceso fue claro, amoroso y muy bien acompañado. Ya no imagino mi casa sin ella.' },
  { ini: 'AM', color: '#FFF3EC', ctext: '#C04010', nombre: 'Andrés Mejía',    animal: 'Adoptó a Mango · 2024',   texto: 'Me impresionó el cuidado con el que preparan a cada animal. Mango llegó sano, socializado y lleno de amor.' },
  { ini: 'FT', color: '#FEF6DC', ctext: '#9A6A00', nombre: 'Familia Torres',  animal: 'Adoptó a Nube · 2024',    texto: 'El equipo es increíble. Nos acompañaron durante todo el proceso y aún nos escriben para saber cómo está Nube.' },
  { ini: 'MR', color: '#E6F1FB', ctext: '#185FA5', nombre: 'María Rodríguez', animal: 'Voluntaria desde 2022',   texto: 'Ser voluntaria aquí cambió mi perspectiva de vida. Ver cómo un animal asustado se convierte en un ser lleno de confianza no tiene precio.' },
]

export default function Nosotros() {
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
          {GALERIA.map((emoji, i) => (
            <div key={i} className={styles.galeriaItem} style={{ background: GAL_BG[i] }}>
              {emoji}
            </div>
          ))}
        </div>
        <p className={styles.galeriaNote}>
          Reemplaza los emojis con fotos reales — usa etiquetas &lt;img&gt; apuntando a Supabase Storage
        </p>
      </div>

      {/* Testimonios */}
      <div className={styles.testimoniosSection}>
        <h3>Lo que dicen quienes adoptaron</h3>
        <div className={styles.testiGrid}>
          {TESTIMONIOS.map(({ ini, color, ctext, nombre, animal, texto }) => (
            <div key={nombre} className={styles.testiCard}>
              <div className={styles.testiQuote}>"</div>
              <p className={styles.testiTexto}>{texto}</p>
              <div className={styles.testiAuthor}>
                <div className={styles.testiAv} style={{ background: color, color: ctext }}>{ini}</div>
                <div>
                  <div className={styles.testiNombre}>{nombre}</div>
                  <div className={styles.testiAnimal}>{animal}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
