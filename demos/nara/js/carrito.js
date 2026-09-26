/* ============================================
   NARA — carrito.js
   Carrito real (agregar, quitar, cambiar cantidad),
   con un resumen de estilo PayPal y acceso directo a la
   página de prueba real de pago.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var carritoBtn = document.getElementById('carritoBtnNara');
  if (!carritoBtn) return;

  var CARRITO_KEY = 'nara_carrito';

  var overlay = document.getElementById('carritoOverlayNara');
  var panel = document.getElementById('carritoPanelNara');
  var cerrarBtn = document.getElementById('carritoCerrarNara');
  var cuerpo = document.getElementById('carritoCuerpoNara');
  var contador = document.getElementById('carritoContadorNara');

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

  // clave = id + color + talla, para que la misma prenda en otra
  // combinación se guarde como línea aparte del carrito.
  function agregarAlCarrito(datos) {
    var items = leerCarrito();
    var clave = datos.id + '|' + datos.color + '|' + datos.talla;
    var existente = items.find(function (i) { return i.clave === clave; });
    if (existente) {
      existente.cantidad += datos.cantidad;
    } else {
      items.push({
        clave: clave,
        id: datos.id,
        nombre: datos.nombre,
        precio: datos.precio,
        imagen: datos.imagen,
        color: datos.color,
        talla: datos.talla,
        cantidad: datos.cantidad
      });
    }
    guardarCarrito(items);
    actualizarContador();
  }

  function cambiarCantidad(clave, delta) {
    var items = leerCarrito();
    var item = items.find(function (i) { return i.clave === clave; });
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) items = items.filter(function (i) { return i.clave !== clave; });
    guardarCarrito(items);
    actualizarContador();
    renderizar();
  }

  function quitarDelCarrito(clave) {
    var items = leerCarrito().filter(function (i) { return i.clave !== clave; });
    guardarCarrito(items);
    actualizarContador();
    renderizar();
  }

  function calcularSubtotal(items) {
    return items.reduce(function (s, i) { return s + i.precio * i.cantidad; }, 0);
  }

  function renderizar() {
    var items = leerCarrito();

    if (items.length === 0) {
      cuerpo.innerHTML = '<div class="carrito-vacio-nara">Tu carrito está vacío.</div>';
      return;
    }

    var subtotal = calcularSubtotal(items);
    var html = '';

    items.forEach(function (item) {
      html +=
        '<div class="carrito-item-nara">' +
          '<img src="' + item.imagen + '" alt="' + item.nombre + '">' +
          '<div class="carrito-item-info-nara">' +
            '<span class="carrito-item-nombre-nara">' + item.nombre + '</span>' +
            '<span class="carrito-item-variante-nara">Color: ' + item.color + ' · Talla: ' + item.talla + '</span>' +
            '<span class="carrito-item-precio-nara">' + formatoColones(item.precio) + '</span>' +
            '<div class="carrito-item-qty-nara">' +
              '<button type="button" data-accion="restar" data-clave="' + item.clave + '">−</button>' +
              '<span>' + item.cantidad + '</span>' +
              '<button type="button" data-accion="sumar" data-clave="' + item.clave + '">+</button>' +
              '<button type="button" class="carrito-item-quitar-nara" data-accion="quitar" data-clave="' + item.clave + '">Quitar</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    });

    html += '<div class="carrito-subtotal-fila-nara"><span>Subtotal</span><span>' + formatoColones(subtotal) + '</span></div>';

    html +=
      '<div class="resumen-paypal-nara">' +
        '<div class="fila"><span>Productos</span><span>' + formatoColones(subtotal) + '</span></div>' +
        '<div class="fila"><span>Envío</span><span>Se calcula en el pago</span></div>' +
        '<div class="fila total"><span>Total</span><span>' + formatoColones(subtotal) + '</span></div>' +
      '</div>';

    html += '<button type="button" class="btn-checkout-pendiente-nara" disabled>🅿️ Pagar con PayPal (próximamente)</button>';

    html += '<p class="nota-moneda-nara">Los precios del sitio se muestran en colones (₡), pero PayPal siempre cobra en dólares (USD) — el monto se convierte automáticamente al pagar.</p>';

    html +=
      '<div class="caja-prueba-real-nara">' +
        '<p>¿Quieres ver cómo se ve una transacción real de PayPal?</p>' +
        '<a href="prueba-paypal.html" class="boton-primario-nara">Probarlo aquí →</a>' +
      '</div>';

    cuerpo.innerHTML = html;

    cuerpo.querySelectorAll('button[data-accion]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var clave = btn.dataset.clave;
        if (btn.dataset.accion === 'sumar') cambiarCantidad(clave, 1);
        if (btn.dataset.accion === 'restar') cambiarCantidad(clave, -1);
        if (btn.dataset.accion === 'quitar') quitarDelCarrito(clave);
      });
    });
  }

  function abrirCarrito() {
    overlay.hidden = false;
    panel.hidden = false;
    renderizar();
  }

  function cerrarCarrito() {
    overlay.hidden = true;
    panel.hidden = true;
  }

  carritoBtn.addEventListener('click', abrirCarrito);
  cerrarBtn.addEventListener('click', cerrarCarrito);
  overlay.addEventListener('click', cerrarCarrito);

  actualizarContador();

  // Se expone para que la ficha de producto pueda agregar productos
  // reales (con color y talla ya elegidos) a este mismo carrito.
  window.agregarAlCarritoNara = agregarAlCarrito;
  window.abrirCarritoNara = abrirCarrito;
});
