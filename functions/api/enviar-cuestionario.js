// functions/api/enviar-cuestionario.js
//
// Cloudflare Pages Function. Se activa automáticamente en la ruta
// POST /api/enviar-cuestionario cuando el proyecto se despliega en Cloudflare Pages.
//
// IMPORTANTE sobre la variable de entorno:
// En Cloudflare Pages Functions las variables de entorno NO se leen con
// `process.env` (eso es Node.js). Cloudflare las entrega en el objeto `env`
// que recibe la función. RESEND_API_KEY ya está configurada en Cloudflare,
// así que aquí simplemente se lee de `context.env.RESEND_API_KEY`.

const CORREO_DESTINO = '506webartesanal@gmail.com';
const CORREO_REMITENTE = 'Web Artesanal <cuestionario@webartesanal.site>';

const ETIQUETAS = {
  q1: '¿Cuál es su negocio?',
  q2: '¿Qué quiere conseguir?',
  q3: '¿Qué podrán hacer sus clientes?',
  q4: 'Cantidad de productos/servicios',
  q5: 'Materiales que ya tiene',
  q6: 'Funciones que necesita',
  q7: 'Presupuesto aproximado',
  q8: 'Su idea en sus palabras'
};

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function construirHtmlCorreo(datos) {
  var filas = '';
  for (var clave in ETIQUETAS) {
    var valor = datos[clave];
    if (!valor) continue;
    var texto = Array.isArray(valor) ? valor.join(', ') : valor;
    filas +=
      '<tr>' +
        '<td style="padding:8px;border-bottom:1px solid #e2e6ea;font-weight:bold;color:#16294f;vertical-align:top;white-space:nowrap;">' +
          escaparHtml(ETIQUETAS[clave]) +
        '</td>' +
        '<td style="padding:8px;border-bottom:1px solid #e2e6ea;">' + escaparHtml(texto) + '</td>' +
      '</tr>';
  }

  return (
    '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">' +
      '<h2 style="color:#16294f;">Nuevo cuestionario recibido — Web Artesanal</h2>' +
      '<table style="width:100%;border-collapse:collapse;font-size:14px;">' + filas + '</table>' +
    '</div>'
  );
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

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ ok: false, error: 'RESEND_API_KEY no configurada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

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
        subject: 'Nuevo cuestionario recibido — Web Artesanal',
        html: construirHtmlCorreo(datos)
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
