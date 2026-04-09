export default function Politica() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px', fontFamily: 'Nunito, Arial, sans-serif', color: '#2D2A22' }}>
      <h1 style={{ fontSize: 28, color: '#3A6B2A', marginBottom: 8 }}>Política de Tratamiento de Datos Personales</h1>
      <p style={{ color: '#8a8070', fontSize: 13, marginBottom: 40 }}>Última actualización: abril de 2026</p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={h2}>1. Responsable del tratamiento</h2>
        <p style={p}>
          <strong>Hogar de Paso Alegría Gatuna</strong><br />
          Correo electrónico: <a href="mailto:adopciones@alegriagatuna.com" style={{ color: '#E8572A' }}>adopciones@alegriagatuna.com</a><br />
          Sitio web: <a href="https://www.alegriagatuna.com" style={{ color: '#E8572A' }}>www.alegriagatuna.com</a>
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={h2}>2. Datos que recolectamos</h2>
        <p style={p}>Recolectamos los siguientes datos personales a través de nuestros formularios:</p>
        <ul style={ul}>
          <li>Nombre y apellido</li>
          <li>Correo electrónico</li>
          <li>Número de celular</li>
          <li>Descripción del hogar y condiciones de vida</li>
          <li>Información sobre disponibilidad y motivación (formulario de voluntariado)</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={h2}>3. Finalidad del tratamiento</h2>
        <p style={p}>Sus datos personales serán utilizados exclusivamente para:</p>
        <ul style={ul}>
          <li>Evaluar y gestionar solicitudes de adopción de animales</li>
          <li>Coordinar procesos de voluntariado</li>
          <li>Contactarle para dar seguimiento a su solicitud</li>
          <li>Enviarle comunicaciones relacionadas con el proceso de adopción o voluntariado</li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={h2}>4. Uso exclusivo y no compartición</h2>
        <p style={p}>
          Sus datos personales son de uso exclusivo del Hogar de Paso Alegría Gatuna.
          No serán vendidos, cedidos, transferidos ni compartidos con terceros bajo ninguna circunstancia,
          salvo obligación legal expresa.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={h2}>5. Base legal</h2>
        <p style={p}>
          El tratamiento de sus datos se realiza con base en su consentimiento libre, previo, expreso e informado,
          de conformidad con la <strong>Ley 1581 de 2012</strong> y el <strong>Decreto 1377 de 2013</strong> de la
          República de Colombia.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={h2}>6. Derechos del titular</h2>
        <p style={p}>Como titular de sus datos personales, usted tiene derecho a:</p>
        <ul style={ul}>
          <li>Conocer, actualizar y rectificar sus datos personales</li>
          <li>Solicitar prueba del consentimiento otorgado</li>
          <li>Ser informado sobre el uso de sus datos</li>
          <li>Revocar el consentimiento y solicitar la supresión de sus datos</li>
          <li>Acceder gratuitamente a sus datos personales</li>
        </ul>
        <p style={p}>
          Para ejercer estos derechos, puede escribirnos a{' '}
          <a href="mailto:adopciones@alegriagatuna.com" style={{ color: '#E8572A' }}>adopciones@alegriagatuna.com</a>.
          Daremos respuesta en un plazo máximo de 15 días hábiles.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={h2}>7. Conservación de los datos</h2>
        <p style={p}>
          Sus datos serán conservados durante el tiempo necesario para cumplir con la finalidad del tratamiento
          o hasta que usted solicite su eliminación, lo que ocurra primero.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={h2}>8. Seguridad</h2>
        <p style={p}>
          Implementamos medidas técnicas y organizativas para proteger sus datos personales contra acceso
          no autorizado, pérdida o alteración.
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={h2}>9. Modificaciones</h2>
        <p style={p}>
          Nos reservamos el derecho de actualizar esta política. Cualquier cambio será publicado en esta página
          con la fecha de actualización correspondiente.
        </p>
      </section>

      <div style={{ background: '#E4F2DC', borderRadius: 12, padding: '20px 24px', fontSize: 13, color: '#2A5A1A' }}>
        Si tiene preguntas sobre esta política, escríbanos a{' '}
        <a href="mailto:adopciones@alegriagatuna.com" style={{ color: '#E8572A' }}>adopciones@alegriagatuna.com</a>.
      </div>
    </div>
  )
}

const h2 = {
  fontSize: 17,
  color: '#3A6B2A',
  marginBottom: 10,
  marginTop: 0,
}

const p = {
  fontSize: 15,
  lineHeight: 1.75,
  color: '#4a4438',
  margin: '0 0 12px',
}

const ul = {
  fontSize: 15,
  lineHeight: 1.9,
  color: '#4a4438',
  paddingLeft: 20,
  margin: '0 0 12px',
}
