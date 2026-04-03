import { useState } from 'react'
import styles from './Donaciones.module.css'

const METODOS = [
  {
    id: 'nequi', icon: '📱', label: 'Nequi / Daviplata / Transfiya', desc: 'Transferencia instantánea',
    detalle: [
      { label: 'Nequi',      valor: '313 708 0752' },
      { label: 'Daviplata',  valor: '313 708 0752' },
      { label: 'Transfiya',  valor: '313 708 0752' },
    ],
    copiar: '3137080752',
  },
  {
    id: 'banco', icon: '🏦', label: 'Bancolombia', desc: 'Cuenta ahorros o llave',
    detalle: [
      { label: 'Cuenta ahorros', valor: '420-066461-01' },
      { label: 'Llave',          valor: '@marlen829' },
      { label: 'A nombre de',    valor: 'Marlen — Alegría Gatuna' },
    ],
    copiar: '42006646101',
  },
  {
    id: 'paypal', icon: '🌐', label: 'PayPal', desc: 'Donaciones internacionales',
    detalle: [{ label: 'Correo PayPal', valor: 'nalmarlen@hotmail.com' }],
    copiar: 'nalmarlen@hotmail.com',
  },
  {
    id: 'insumos', icon: '🛍️', label: 'Donación de insumos', desc: 'Comida, medicamentos, accesorios',
    insumos: true,
  },
]

const IMPACTO = [
  { monto: '$10.000', desc: 'Alimenta un gato durante una semana' },
  { monto: '$30.000', desc: 'Cubre una desparasitación completa' },
  { monto: '$80.000', desc: 'Paga una consulta veterinaria de urgencia' },
]

const INSUMOS = [
  { emoji: '🍽️', nombre: 'Concentrado', sub: 'Adulto y cachorro' },
  { emoji: '💊', nombre: 'Medicamentos', sub: 'Antiparasitarios' },
  { emoji: '🛏️', nombre: 'Camas', sub: 'Tallas variadas' },
  { emoji: '🪮', nombre: 'Accesorios', sub: 'Cepillos, collares' },
  { emoji: '🧴', nombre: 'Shampoo', sub: 'Sin químicos' },
  { emoji: '📦', nombre: 'Arena sanitaria', sub: 'Cualquier marca' },
]

export default function Donaciones() {
  const [montoActivo, setMontoActivo] = useState('$10.000')
  const [montoCustom, setMontoCustom] = useState('')
  const [metodoActivo, setMetodoActivo] = useState('nequi')
  const [copiado, setCopiado] = useState(false)

  function copiar(texto) {
    navigator.clipboard.writeText(texto).catch(() => {})
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="page-container">
      <div className={styles.hero}>
        <span className={styles.tag}>Cada peso suma</span>
        <h2>Tu donación cambia <span>vidas gatunitas</span></h2>
        <p>Los aportes cubren alimento, veterinario, medicamentos y el cariño diario que cada animal necesita.</p>
      </div>

      {/* Selector de monto */}
      <div className={styles.montos}>
        {['$10.000','$20.000','$50.000','$100.000'].map(m => (
          <button
            key={m}
            className={`${styles.montoBtn} ${montoActivo === m && !montoCustom ? styles.montoActive : ''}`}
            onClick={() => { setMontoActivo(m); setMontoCustom('') }}
          >
            {m}
          </button>
        ))}
        <input
          className={styles.montoCustom}
          type="text"
          placeholder="Otro valor"
          value={montoCustom}
          onChange={e => { setMontoCustom(e.target.value); setMontoActivo('') }}
        />
      </div>

      {/* Impacto */}
      <div className={styles.impactoGrid}>
        {IMPACTO.map(({ monto, desc }) => (
          <div key={monto} className={styles.impactoCard}>
            <div className={styles.impactoN}>{monto}</div>
            <div className={styles.impactoD}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Métodos */}
      <div className={styles.metodosGrid}>
        {METODOS.map(m => (
          <div
            key={m.id}
            className={`${styles.metodoCard} ${metodoActivo === m.id ? styles.metodoActive : ''}`}
            onClick={() => setMetodoActivo(metodoActivo === m.id ? null : m.id)}
          >
            <div className={styles.metodoIcon}>{m.icon}</div>
            <div className={styles.metodoLabel}>{m.label}</div>
            <div className={styles.metodoDesc}>{m.desc}</div>

            {metodoActivo === m.id && (
              <div className={styles.metodoDetalle} onClick={e => e.stopPropagation()}>
                {m.insumos ? (
                  <>
                    <div className={styles.insumosGrid}>
                      {INSUMOS.map(({ emoji, nombre, sub }) => (
                        <div key={nombre} className={styles.insumoItem}>
                          <span>{emoji}</span>
                          <div>
                            <div className={styles.insumoNombre}>{nombre}</div>
                            <div className={styles.insumoSub}>{sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.direccion}>
                      <strong>Contacto:</strong> 313 708 0752 · Instagram @alegria.gatuna
                    </div>
                  </>
                ) : (
                  <>
                    {m.detalle.map(({ label, valor }) => (
                      <div key={label} className={styles.detalleRow}>
                        <span className={styles.detalleLabel}>{label}</span>
                        <span className={styles.detalleValor}>{valor}</span>
                      </div>
                    ))}
                    <button className={styles.copiarBtn} onClick={() => copiar(m.copiar)}>
                      {copiado ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
