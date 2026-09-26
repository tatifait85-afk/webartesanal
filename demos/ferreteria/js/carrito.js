/* ============================================
   FERRETERÍA EL BUEN VECINO — carrito.js
   Carrito completo según el documento oficial:
   agregar/quitar productos, cantidades, retiro o Express,
   forma de pago, datos de contacto, comentarios, y el
   mensaje final preparado para WhatsApp.

   Nota honesta: el número de WhatsApp de esta demo es
   ficticio (8XXX-XXXX), así que el botón final no puede
   abrir un chat real. En su lugar, se arma el mensaje
   completo y se puede copiar — en el sitio real, ese mismo
   mensaje se enviaría directo por WhatsApp.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var carritoBtn = document.getElementById('carritoBtnFerre');
  if (!carritoBtn) return;

  var CARRITO_KEY = 'ferreteria_carrito';
  var COSTO_EXPRESS = 1500;

  var panel = document.getElementById('carritoPanelFerre');
  var overlay = document.getElementById('carritoOverlayFerre');
  var contador = document.getElementById('carritoContadorFerre');
  var cerrarBtn = document.getElementById('carritoCerrarFerre');
  var cuerpo = document.getElementById('carritoCuerpoFerre');

  function formatoColones(numero) {
    var texto = String(Math.round(numero));
    return '₡' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function leerCarrito() {
    try { return JSON.parse(localStorage.getItem(CARRITO_KEY)) || []; }
    catch (e) { return []; }
  }

  function guardarCarrito(items) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
  }

  function actualizarContador() {
    var items = leerCarrito();
    var total = items.reduce(function (s, i) { return s + i.cantidad; }, 0);
    if (total > 0) {
      contador.textContent = total;
      contador.style.display = 'inline-block';
    } else {
      contador.style.display = 'none';
    }
  }

  function agregarAlCarrito(id, nombre, precio, imagen) {
    var items = leerCarrito();
    var existente = items.find(function (i) { return i.id === id; });
    if (existente) {
      existente.cantidad += 1;
    } else {
      items.push({ id: id, nombre: nombre, precio: precio, imagen: imagen, cantidad: 1 });
    }
    guardarCarrito(items);
    actualizarContador();
  }

  function cambiarCantidad(id, delta) {
    var items = leerCarrito();
    var item = items.find(function (i) { return i.id === id; });
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) {
      items = items.filter(function (i) { return i.id !== id; });
    }
    guardarCarrito(items);
    actualizarContador();
    renderizarCarrito();
  }

  function quitarDelCarrito(id) {
    var items = leerCarrito().filter(function (i) { return i.id !== id; });
    guardarCarrito(items);
    actualizarContador();
    renderizarCarrito();
  }

  function calcularSubtotal(items) {
    return items.reduce(function (s, i) { return s + i.precio * i.cantidad; }, 0);
  }

  function renderizarCarrito() {
    var items = leerCarrito();

    if (items.length === 0) {
      cuerpo.innerHTML = '<div class="carrito-vacio-ferre">Su carrito está vacío.</div>';
      return;
    }

    var subtotal = calcularSubtotal(items);

    var html = '<div id="carritoListaFerre">';
    items.forEach(function (item) {
      html +=
        '<div class="carrito-item-ferre">' +
          '<img src="' + item.imagen + '" alt="' + item.nombre + '">' +
          '<div class="carrito-item-info-ferre">' +
            '<span class="carrito-item-nombre-ferre">' + item.nombre + '</span>' +
            '<span class="carrito-item-precio-ferre">' + formatoColones(item.precio) + ' c/u</span>' +
            '<div class="carrito-item-qty-ferre">' +
              '<button type="button" data-accion="restar" data-id="' + item.id + '">−</button>' +
              '<span>' + item.cantidad + '</span>' +
              '<button type="button" data-accion="sumar" data-id="' + item.id + '">+</button>' +
              '<button type="button" class="carrito-item-quitar-ferre" data-accion="quitar" data-id="' + item.id + '">Quitar</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    });
    html += '</div>';

    html += '<div class="carrito-subtotal-ferre"><span>Subtotal</span><span id="carritoSubtotalFerre">' + formatoColones(subtotal) + '</span></div>';

    // Entrega
    html +=
      '<div class="carrito-seccion-ferre">' +
        '<h4>¿Cómo quiere recibir su pedido?</h4>' +
        '<label class="carrito-opcion-radio"><input type="radio" name="entregaFerre" value="retiro" checked> Retiro en tienda</label>' +
        '<label class="carrito-opcion-radio"><input type="radio" name="entregaFerre" value="express"> Quiero servicio Express a domicilio (+' + formatoColones(COSTO_EXPRESS) + ')</label>' +
        '<div class="carrito-campo-ferre" id="campoDireccionFerre" style="display:none;">' +
          '<input type="text" id="direccionFerre" placeholder="Dirección de entrega">' +
        '</div>' +
      '</div>';

    // Pago
    html +=
      '<div class="carrito-seccion-ferre">' +
        '<h4>Forma de pago</h4>' +
        '<label class="carrito-opcion-radio"><input type="radio" name="pagoFerre" value="Efectivo" checked> Efectivo</label>' +
        '<label class="carrito-opcion-radio"><input type="radio" name="pagoFerre" value="Tarjeta"> Tarjeta</label>' +
        '<label class="carrito-opcion-radio"><input type="radio" name="pagoFerre" value="SINPE Móvil"> SINPE Móvil</label>' +
      '</div>';

    // Datos del cliente
    html +=
      '<div class="carrito-seccion-ferre">' +
        '<h4>Sus datos</h4>' +
        '<div class="carrito-campo-ferre"><input type="text" id="nombreFacturaFerre" placeholder="Nombre para la factura"></div>' +
        '<div class="carrito-campo-ferre"><input type="text" id="contactoFerre" placeholder="Teléfono o correo de contacto"></div>' +
        '<div class="carrito-campo-ferre"><textarea id="comentariosFerre" rows="2" placeholder="Comentarios (opcional)"></textarea></div>' +
      '</div>';

    // Total
    html += '<div class="carrito-total-ferre"><span>Total</span><span id="carritoTotalFerre">' + formatoColones(subtotal) + '</span></div>';

    html += '<p class="q-error" id="carritoErrorFerre" style="display:none; color:#c0392b; font-size:0.85rem; font-weight:600;">Complete el nombre para la factura' + '' + ' y, si eligió Express, la dirección de entrega.</p>';

    html += '<button type="button" class="boton-primario" id="btnVerMensajeFerre" style="width:100%;">Ver mensaje para WhatsApp →</button>';

    html += '<div id="mensajePreviewFerre" style="display:none;">' +
      '<h4 style="margin-top:1rem;">Mensaje listo para enviar</h4>' +
      '<textarea class="mensaje-whatsapp-preview" id="textoMensajeFerre" readonly></textarea>' +
      '<div style="display:flex; gap:0.6rem; margin-top:0.6rem;">' +
        '<button type="button" class="boton-secundario" id="btnCopiarMensajeFerre" style="flex:1;">Copiar mensaje</button>' +
      '</div>' +
      '<span class="btn-enviar-pendiente-ferre" style="margin-top:0.6rem;">📱 Enviar por WhatsApp (próximamente — número ficticio en esta demo)</span>' +
    '</div>';

    cuerpo.innerHTML = html;

    // Mostrar/ocultar dirección según modalidad de entrega
    var radiosEntrega = cuerpo.querySelectorAll('input[name="entregaFerre"]');
    var campoDireccion = document.getElementById('campoDireccionFerre');
    var totalSpan = document.getElementById('carritoTotalFerre');

    function actualizarTotal() {
      var esExpress = cuerpo.querySelector('input[name="entregaFerre"]:checked').value === 'express';
      campoDireccion.style.display = esExpress ? 'block' : 'none';
      var total = subtotal + (esExpress ? COSTO_EXPRESS : 0);
      totalSpan.textContent = formatoColones(total);
    }

    radiosEntrega.forEach(function (r) { r.addEventListener('change', actualizarTotal); });

    // Cantidad y quitar
    document.getElementById('carritoListaFerre').addEventListener('click', function (evento) {
      var btn = evento.target.closest('button[data-accion]');
      if (!btn) return;
      var id = btn.dataset.id;
      if (btn.dataset.accion === 'sumar') cambiarCantidad(id, 1);
      if (btn.dataset.accion === 'restar') cambiarCantidad(id, -1);
      if (btn.dataset.accion === 'quitar') quitarDelCarrito(id);
    });

    // Armar mensaje para WhatsApp
    document.getElementById('btnVerMensajeFerre').addEventListener('click', function () {
      var nombreFactura = document.getElementById('nombreFacturaFerre').value.trim();
      var contacto = document.getElementById('contactoFerre').value.trim();
      var comentarios = document.getElementById('comentariosFerre').value.trim();
      var esExpress = cuerpo.querySelector('input[name="entregaFerre"]:checked').value === 'express';
      var direccion = document.getElementById('direccionFerre').value.trim();
      var pago = cuerpo.querySelector('input[name="pagoFerre"]:checked').value;
      var errorEl = document.getElementById('carritoErrorFerre');

      if (!nombreFactura || (esExpress && !direccion)) {
        errorEl.style.display = 'block';
        return;
      }
      errorEl.style.display = 'none';

      var totalFinal = subtotal + (esExpress ? COSTO_EXPRESS : 0);

      var lineas = [];
      lineas.push('Pedido — Ferretería El Buen Vecino');
      lineas.push('');
      items.forEach(function (item) {
        lineas.push('• ' + item.nombre + ' x' + item.cantidad + ' — ' + formatoColones(item.precio * item.cantidad));
      });
      lineas.push('');
      lineas.push('Subtotal: ' + formatoColones(subtotal));
      if (esExpress) lineas.push('Servicio Express: ' + formatoColones(COSTO_EXPRESS));
      lineas.push('Total: ' + formatoColones(totalFinal));
      lineas.push('');
      lineas.push('Entrega: ' + (esExpress ? 'Servicio Express a domicilio' : 'Retiro en tienda'));
      if (esExpress) lineas.push('Dirección: ' + direccion);
      lineas.push('Forma de pago: ' + pago);
      lineas.push('Nombre para factura: ' + nombreFactura);
      if (contacto) lineas.push('Contacto: ' + contacto);
      if (comentarios) lineas.push('Comentarios: ' + comentarios);

      document.getElementById('textoMensajeFerre').value = lineas.join('\n');
      document.getElementById('mensajePreviewFerre').style.display = 'block';
    });

    cuerpo.addEventListener('click', function (evento) {
      if (evento.target.id === 'btnCopiarMensajeFerre') {
        var texto = document.getElementById('textoMensajeFerre');
        texto.select();
        navigator.clipboard.writeText(texto.value).then(function () {
          evento.target.textContent = '¡Copiado!';
          setTimeout(function () { evento.target.textContent = 'Copiar mensaje'; }, 1500);
        }).catch(function () {
          // Si el navegador bloquea el portapapeles (frecuente en file://),
          // el texto ya quedó seleccionado para copiar manualmente.
        });
      }
    });
  }

  function abrirCarrito() {
    panel.hidden = false;
    overlay.hidden = false;
    renderizarCarrito();
  }

  function cerrarCarrito() {
    panel.hidden = true;
    overlay.hidden = true;
  }

  carritoBtn.addEventListener('click', abrirCarrito);
  cerrarBtn.addEventListener('click', cerrarCarrito);
  overlay.addEventListener('click', cerrarCarrito);

  // Botones "Agregar al carrito" de las tarjetas de producto
  document.querySelectorAll('.btn-agregar-carrito-ferre').forEach(function (boton) {
    boton.addEventListener('click', function () {
      var id = boton.dataset.id;
      var producto = typeof buscarProductoPorId === 'function' ? buscarProductoPorId(id) : null;
      if (!producto) return;

      agregarAlCarrito(producto.id, producto.nombre, producto.precio, producto.imagen);

      var textoOriginal = boton.textContent;
      boton.textContent = 'Agregado ✓';
      setTimeout(function () { boton.textContent = textoOriginal; }, 1200);
    });
  });

  actualizarContador();

  // Se exponen para que el chatbot Martillito pueda agregar productos al
  // carrito y abrirlo directamente desde la conversación, sin duplicar
  // esta lógica en otro archivo.
  window.agregarAlCarritoFerre = agregarAlCarrito;
  window.abrirCarritoFerre = abrirCarrito;
});
