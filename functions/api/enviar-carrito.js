// functions/api/enviar-carrito.js
//
// Cloudflare Pages Function para el carrito de WhatsApp/pedidos.
// Variables de entorno vía context.env, no process.env.

const CORREO_DESTINO = '506webartesanal@gmail.com';
const CORREO_REMITENTE = 'Web Artesanal <pedidos@webartesanal.site>';

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatoColones(numero) {
  var texto = String(Math.round(numero));
  return '₡' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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

  var cliente = datos.cliente || {};
  var nombre = (cliente.nombre || '').trim();
  var telefono = (cliente.telefono || '').trim();
  var correo = (cliente.correo || '').trim();
  var items = Array.isArray(datos.items) ? datos.items : [];

  if (!nombre || !telefono || !correo || items.length === 0) {
    return new Response(JSON.stringify({ ok: false, error: 'Faltan datos del cliente o el carrito está vacío' }), {
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

  var total = 0;
  var filas = '';
  items.forEach(function (item) {
    var subtotal = (Number(item.precio) || 0) * (Number(item.cantidad) || 0);
    total += subtotal;
    filas +=
      '<tr>' +
        '<td style="padding:8px;border-bottom:1px solid #e2e6ea;">' + escaparHtml(item.nombre) + '</td>' +
        '<td style="padding:8px;border-bottom:1px solid #e2e6ea;text-align:center;">' + escaparHtml(item.cantidad) + '</td>' +
        '<td style="padding:8px;border-bottom:1px solid #e2e6ea;text-align:right;">' + formatoColones(item.precio) + '</td>' +
        '<td style="padding:8px;border-bottom:1px solid #e2e6ea;text-align:right;">' + formatoColones(subtotal) + '</td>' +
      '</tr>';
  });

  var html =
    '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">' +
      '<h2 style="color:#16294f;">Nuevo pedido — Web Artesanal</h2>' +
      '<p><strong>Nombre:</strong> ' + escaparHtml(nombre) + '</p>' +
      '<p><strong>Teléfono:</strong> ' + escaparHtml(telefono) + '</p>' +
      '<p><strong>Correo:</strong> ' + escaparHtml(correo) + '</p>' +
      '<table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px;">' +
        '<thead><tr>' +
          '<th style="text-align:left;padding:8px;border-bottom:2px solid #16294f;">Servicio/producto</th>' +
          '<th style="padding:8px;border-bottom:2px solid #16294f;">Cant.</th>' +
          '<th style="text-align:right;padding:8px;border-bottom:2px solid #16294f;">Precio</th>' +
          '<th style="text-align:right;padding:8px;border-bottom:2px solid #16294f;">Subtotal</th>' +
        '</tr></thead>' +
        '<tbody>' + filas + '</tbody>' +
      '</table>' +
      '<p style="text-align:right;font-weight:bold;font-size:16px;margin-top:12px;">Total: ' + formatoColones(total) + '</p>' +
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
        subject: 'Nuevo pedido — Web Artesanal',
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
