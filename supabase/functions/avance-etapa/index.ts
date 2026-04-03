import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL     = Deno.env.get('FROM_EMAIL')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ETAPA_INFO: Record<string, { asunto: string; titulo: string; mensaje: string; emoji: string }> = {
  entrevista: {
    emoji: '💬',
    asunto: 'Tu proceso de adopción avanzó — Entrevista',
    titulo: '¡Tu solicitud fue aprobada!',
    mensaje: 'Nos alegra informarte que tu solicitud pasó a la etapa de <strong>entrevista</strong>. Pronto nos pondremos en contacto para coordinar una llamada o encuentro.'
  },
  visita_hogar: {
    emoji: '🏠',
    asunto: 'Tu proceso de adopción avanzó — Visita al hogar',
    titulo: '¡Viene la visita al hogar!',
    mensaje: 'Tu proceso avanzó a la etapa de <strong>visita al hogar</strong>. Coordinaremos una visita para conocer el espacio donde vivirá el animalito.'
  },
  aprobacion: {
    emoji: '✅',
    asunto: 'Tu proceso de adopción avanzó — ¡Aprobado!',
    titulo: '¡Tu adopción fue aprobada!',
    mensaje: '¡Tenemos una noticia increíble! Tu solicitud fue <strong>aprobada</strong>. Solo falta coordinar la entrega del animalito. ¡Pronto estarás con tu nuevo compañero!'
  },
  entrega: {
    emoji: '🎉',
    asunto: '¡Felicitaciones! Tu adopción está lista',
    titulo: '¡Bienvenido a la familia adoptante!',
    mensaje: '¡Es el gran día! Tu proceso de adopción está completo. Gracias por darle un hogar lleno de amor a uno de nuestros animalitos. ¡Que sean muy felices juntos!'
  },
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { nombre, correo, animalNombre, etapa } = await req.json()

    const info = ETAPA_INFO[etapa]
    if (!info) return new Response(JSON.stringify({ ok: true, skipped: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Alegría Gatuna <${FROM_EMAIL}>`,
        to: correo,
        subject: `${info.emoji} ${info.asunto} — ${animalNombre}`,
        html: emailEtapa({ nombre, animalNombre, ...info }),
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

function emailEtapa({ nombre, animalNombre, emoji, titulo, mensaje }: {
  nombre: string; animalNombre: string; emoji: string; titulo: string; mensaje: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F2EA;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" style="background:white;border-radius:20px;overflow:hidden;">

        <tr><td style="background:#3A6B2A;padding:32px;text-align:center;">
          <div style="font-size:48px;margin-bottom:8px;">${emoji}</div>
          <h1 style="color:white;font-size:24px;margin:0;">Alegría Gatuna</h1>
          <p style="color:#E4F2DC;margin:6px 0 0;font-size:13px;">Actualización de tu proceso de adopción</p>
        </td></tr>

        <tr><td style="padding:36px 40px;">
          <h2 style="color:#2D2A22;font-size:22px;margin:0 0 12px;">${titulo}</h2>
          <p style="color:#6a6050;font-size:15px;line-height:1.7;margin:0 0 20px;">
            Hola <strong>${nombre}</strong>, tenemos novedades sobre tu proceso para adoptar a 
            <strong style="color:#E8572A;">${animalNombre}</strong>.
          </p>
          <div style="background:#EFF8E8;border-radius:12px;padding:20px;margin:0 0 24px;border-left:4px solid #3A6B2A;">
            <p style="color:#2A5A1A;font-size:15px;line-height:1.7;margin:0;">${mensaje}</p>
          </div>
          <p style="color:#6a6050;font-size:14px;line-height:1.7;margin:0;">
            ¿Tienes preguntas? Escríbenos por Instagram 
            <a href="https://instagram.com/alegria.gatuna" style="color:#E8572A;text-decoration:none;">@alegria.gatuna</a>
            o al <a href="tel:3137080752" style="color:#E8572A;text-decoration:none;">313 708 0752</a>.
          </p>
        </td></tr>

        <tr><td style="background:#F7F2EA;padding:24px 40px;text-align:center;border-top:1px solid #e8e0d4;">
          <p style="color:#8a8070;font-size:12px;margin:0;">Con amor, el equipo de <strong>Alegría Gatuna</strong> 🐱</p>
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
