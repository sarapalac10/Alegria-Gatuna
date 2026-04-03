import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL    = Deno.env.get('ADMIN_EMAIL')    // correo del admin
const FROM_EMAIL     = Deno.env.get('FROM_EMAIL')     // ej: adopciones@alegriagatuna.com

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { nombre, apellido, correo, animalNombre } = await req.json()

    // 1. Email de confirmación al adoptante
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Alegría Gatuna <${FROM_EMAIL}>`,
        to: correo,
        subject: `¡Recibimos tu solicitud para adoptar a ${animalNombre}! 🐾`,
        html: emailConfirmacion({ nombre, animalNombre }),
      }),
    })

    // 2. Notificación al admin
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Alegría Gatuna <${FROM_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `Nueva solicitud de adopción — ${nombre} ${apellido} quiere a ${animalNombre}`,
        html: emailAdmin({ nombre, apellido, correo, animalNombre }),
      }),
    })

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// ── Templates ────────────────────────────────────────────────

function emailConfirmacion({ nombre, animalNombre }: { nombre: string; animalNombre: string }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F2EA;font-family:'Nunito',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" style="background:white;border-radius:20px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:#3A6B2A;padding:32px;text-align:center;">
          <h1 style="color:white;font-size:28px;margin:0;font-family:Arial,sans-serif;">🏠 Alegría Gatuna</h1>
          <p style="color:#E4F2DC;margin:8px 0 0;font-size:14px;">Hogar de paso · Medellín</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <h2 style="color:#2D2A22;font-size:22px;margin:0 0 12px;">¡Hola, ${nombre}! 🐾</h2>
          <p style="color:#6a6050;font-size:15px;line-height:1.7;margin:0 0 20px;">
            Recibimos tu solicitud para adoptar a <strong style="color:#E8572A;">${animalNombre}</strong>. 
            Estamos muy felices de que quieras darle un hogar lleno de amor.
          </p>
          <div style="background:#E4F2DC;border-radius:12px;padding:20px;margin:0 0 24px;">
            <p style="color:#2A5A1A;font-size:14px;font-weight:bold;margin:0 0 8px;">¿Qué sigue?</p>
            <ol style="color:#2A5A1A;font-size:14px;line-height:1.8;margin:0;padding-left:20px;">
              <li>Revisaremos tu solicitud en las próximas 48 horas</li>
              <li>Te contactaremos para una entrevista</li>
              <li>Coordinaremos una visita a tu hogar</li>
              <li>Si todo está bien, ¡${animalNombre} será tuyo!</li>
            </ol>
          </div>
          <p style="color:#6a6050;font-size:14px;line-height:1.7;margin:0;">
            Si tienes alguna pregunta, escríbenos por Instagram 
            <a href="https://instagram.com/alegria.gatuna" style="color:#E8572A;text-decoration:none;">@alegria.gatuna</a>
            o al <a href="tel:3137080752" style="color:#E8572A;text-decoration:none;">313 708 0752</a>.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F7F2EA;padding:24px 40px;text-align:center;border-top:1px solid #e8e0d4;">
          <p style="color:#8a8070;font-size:12px;margin:0;">
            Con amor, el equipo de <strong>Alegría Gatuna</strong> 🐱
          </p>
          <p style="color:#8a8070;font-size:12px;margin:6px 0 0;">
            <a href="https://alegria-gatuna.vercel.app" style="color:#3A6B2A;text-decoration:none;">alegria-gatuna.vercel.app</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function emailAdmin({ nombre, apellido, correo, animalNombre }: {
  nombre: string; apellido: string; correo: string; animalNombre: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F2EA;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="500" cellpadding="0" cellspacing="0" style="background:white;border-radius:20px;overflow:hidden;">

        <tr><td style="background:#E8572A;padding:28px;text-align:center;">
          <h2 style="color:white;font-size:20px;margin:0;">🔔 Nueva solicitud de adopción</h2>
        </td></tr>

        <tr><td style="padding:32px;">
          <p style="color:#2D2A22;font-size:15px;margin:0 0 20px;">
            <strong>${nombre} ${apellido}</strong> quiere adoptar a <strong style="color:#E8572A;">${animalNombre}</strong>.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
            <tr style="border-bottom:1px solid #e8e0d4;">
              <td style="padding:10px 0;color:#8a8070;width:40%;">Nombre</td>
              <td style="padding:10px 0;font-weight:bold;color:#2D2A22;">${nombre} ${apellido}</td>
            </tr>
            <tr style="border-bottom:1px solid #e8e0d4;">
              <td style="padding:10px 0;color:#8a8070;">Correo</td>
              <td style="padding:10px 0;font-weight:bold;"><a href="mailto:${correo}" style="color:#E8572A;text-decoration:none;">${correo}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#8a8070;">Animal</td>
              <td style="padding:10px 0;font-weight:bold;color:#2D2A22;">${animalNombre}</td>
            </tr>
          </table>
          <div style="margin-top:24px;text-align:center;">
            <a href="https://alegria-gatuna.vercel.app/admin/adopciones" 
               style="background:#E8572A;color:white;text-decoration:none;padding:12px 28px;border-radius:100px;font-size:14px;font-weight:bold;display:inline-block;">
              Ver en el panel admin →
            </a>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
