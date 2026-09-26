// functions/api/enviar-contacto.js
//
// Cloudflare Pages Function para el formulario de contacto simple
// (nombre, correo, mensaje). Variables de entorno vía context.env,
// no process.env — ver la nota en enviar-cuestionario.js.

const CORREO_DESTINO = '506webartesanal@gmail.com';
const CORREO_REMITENTE = 'Web Artesanal <contacto@webartesanal.site>';

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let datos;
  try {
    datos = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: 'JSON inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  var nombre = (datos.nombre || '').trim();
  var correo = (datos.correo || '').trim();
  var mensaje = (datos.mensaje || '').trim();

  if (!nombre || !correo || !mensaje) {
    return new Response(JSON.stringify({ ok: false, error: 'Faltan campos obligatorios' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ ok: false, error: 'RESEND_API_KEY no configurada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  var html =
    '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">' +
      '<h2 style="color:#16294f;">Nuevo mensaje de contacto — Web Artesanal</h2>' +
      '<p><strong>Nombre:</strong> ' + escaparHtml(nombre) + '</p>' +
      '<p><strong>Correo:</strong> ' + escaparHtml(correo) + '</p>' +
      '<p><strong>Mensaje:</strong><br>' + escaparHtml(mensaje).replace(/\n/g, '<br>') + '</p>' +
    '</div>';

  try {
    const respuestaResend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: CORREO_REMITENTE,
        to: [CORREO_DESTINO],
        reply_to: correo,
        subject: 'Nuevo mensaje de contacto — Web Artesanal',
        html: html
      })
    });

    if (!respuestaResend.ok) {
      const detalle = await respuestaResend.text();
      return new Response(JSON.stringify({ ok: false, error: detalle }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
