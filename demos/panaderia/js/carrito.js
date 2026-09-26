/* ============================================
   LA ESPIGA ARTESANAL — carrito.js
   Carrito real (agregar, quitar, cambiar cantidad).
   Como todavía no hay número de WhatsApp configurado,
   el pedido se arma como texto y se copia — no se abre
   un chat real, para no simular un número que no existe.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var carritoBtn = document.getElementById('carritoBtnPan');
  if (!carritoBtn) return;

  var CARRITO_KEY = 'espiga_carrito';
  var overlay = document.getElementById('carritoOverlayPan');
  var panel = document.getElementById('carritoPanelPan');
  var cerrarBtn = document.getElementById('carritoCerrarPan');
  var cuerpo = document.getElementById('carritoCuerpoPan');
  var contador = document.getElementById('carritoContadorPan');

  var COSTO_ENTREGA = 1500;

  function formatoColones(numero) {
    var texto = String(Math.round(numero));
    return '₡' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function leerCarrito() {
    try { return JSON.parse(localStorage.getItem(CARRITO_KEY)) || []; }
    catch (e) { return []; }
  }
  function guardarCarrito(items) { localStorage.setItem(CARRITO_KEY, JSON.stringify(items)); }

  function actualizarContador() {
    var items = leerCarrito();
    var total = items.reduce(function (s, i) { return s + i.cantidad; }, 0);
    contador.textContent = total;
    contador.style.display = total > 0 ? 'flex' : 'none';
  }

  function agregarAlCarrito(producto) {
    var items = leerCarrito();
    var existente = items.find(function (i) { return i.id === producto.id; });
    if (existente) existente.cantidad += 1;
    else items.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen, cantidad: 1 });
    guardarCarrito(items);
    actualizarContador();
  }

  function cambiarCantidad(id, delta) {
    var items = leerCarrito();
    var item = items.find(function (i) { return i.id === id; });
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) items = items.filter(function (i) { return i.id !== id; });
    guardarCarrito(items);
    actualizarContador();
    renderizar();
  }

  function quitarDelCarrito(id) {
    guardarCarrito(leerCarrito().filter(function (i) { return i.id !== id; }));
    actualizarContador();
    renderizar();
  }

  function calcularSubtotal(items) { return items.reduce(function (s, i) { return s + i.precio * i.cantidad; }, 0); }

  function tipoEntregaSeleccionado() {
    var el = document.querySelector('input[name="tipoEntregaPan"]:checked');
    return el ? el.value : 'retiro';
  }

  function renderizar() {
    var items = leerCarrito();

    if (items.length === 0) {
      cuerpo.innerHTML = '<div class="carrito-vacio-pan">Su carrito está vacío.</div>';
      return;
    }

    var subtotal = calcularSubtotal(items);
    var html = '';

    items.forEach(function (item) {
      html +=
        '<div class="carrito-item-pan">' +
          '<img src="' + item.imagen + '" alt="' + item.nombre + '">' +
          '<div class="carrito-item-info-pan">' +
            '<span class="carrito-item-nombre-pan">' + item.nombre + '</span>' +
            '<span class="carrito-item-precio-pan">' + formatoColones(item.precio) + '</span>' +
            '<div class="carrito-item-qty-pan">' +
              '<button type="button" data-accion="restar" data-id="' + item.id + '">−</button>' +
              '<span>' + item.cantidad + '</span>' +
              '<button type="button" data-accion="sumar" data-id="' + item.id + '">+</button>' +
              '<button type="button" class="carrito-item-quitar-pan" data-accion="quitar" data-id="' + item.id + '">Quitar</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    });

    html +=
      '<div class="carrito-form-pan">' +
        '<label class="etiqueta" style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:0.4rem;">Forma de entrega</label>' +
        '<div class="entrega-opciones-pan">' +
          '<label><input type="radio" name="tipoEntregaPan" value="retiro" checked> Retiro en local</label>' +
          '<label><input type="radio" name="tipoEntregaPan" value="domicilio"> Entrega a domicilio (+' + formatoColones(COSTO_ENTREGA) + ')</label>' +
        '</div>' +
        '<br>' +
        '<input type="text" id="nombreClientePan" placeholder="Su nombre completo">' +
        '<input type="tel" id="telefonoClientePan" placeholder="Su teléfono">' +
        '<textarea id="comentarioClientePan" placeholder="Comentarios (opcional)" rows="2"></textarea>' +
      '</div>';

    html += '<div class="carrito-subtotal-fila-pan"><span>Subtotal</span><span>' + formatoColones(subtotal) + '</span></div>';
    html += '<div class="carrito-subtotal-fila-pan total" id="filaTotalPan"><span>Total</span><span>' + formatoColones(subtotal) + '</span></div>';

    html += '<button type="button" class="boton-primario-pan" id="btnCopiarPedido" style="width:100%;">📋 Copiar mensaje del pedido</button>';
    html += '<p class="aviso-copiado-pan" id="avisoCopiado">✓ Mensaje copiado. Todavía no hay un número de WhatsApp configurado en esta demo — péguelo cuando lo tengamos.</p>';
    html += '<div class="mensaje-preview-pan" id="previewMensaje"></div>';

    cuerpo.innerHTML = html;

    cuerpo.querySelectorAll('button[data-accion]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.id;
        if (btn.dataset.accion === 'sumar') cambiarCantidad(id, 1);
        if (btn.dataset.accion === 'restar') cambiarCantidad(id, -1);
        if (btn.dataset.accion === 'quitar') quitarDelCarrito(id);
      });
    });

    cuerpo.querySelectorAll('input[name="tipoEntregaPan"]').forEach(function (r) {
      r.addEventListener('change', actualizarTotalConEntrega);
    });

    actualizarTotalConEntrega();
    actualizarVistaMensaje();
    cuerpo.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', actualizarVistaMensaje);
    });

    document.getElementById('btnCopiarPedido').addEventListener('click', copiarPedido);
  }

  function actualizarTotalConEntrega() {
    var items = leerCarrito();
    var subtotal = calcularSubtotal(items);
    var total = subtotal + (tipoEntregaSeleccionado() === 'domicilio' ? COSTO_ENTREGA : 0);
    var fila = document.getElementById('filaTotalPan');
    if (fila) fila.innerHTML = '<span>Total</span><span>' + formatoColones(total) + '</span>';
    actualizarVistaMensaje();
  }

  function construirMensaje() {
    var items = leerCarrito();
    var subtotal = calcularSubtotal(items);
    var entrega = tipoEntregaSeleccionado();
    var total = subtotal + (entrega === 'domicilio' ? COSTO_ENTREGA : 0);
    var nombre = (document.getElementById('nombreClientePan') || {}).value || '';
    var telefono = (document.getElementById('telefonoClientePan') || {}).value || '';
    var comentario = (document.getElementById('comentarioClientePan') || {}).value || '';

    var texto = 'Hola, quisiera hacer el siguiente pedido en La Espiga Artesanal:\n\n';
    items.forEach(function (i) {
      texto += '• ' + i.cantidad + ' x ' + i.nombre + ' — ' + formatoColones(i.precio * i.cantidad) + '\n';
    });
    texto += '\nSubtotal: ' + formatoColones(subtotal) + '\n';
    texto += 'Entrega: ' + (entrega === 'domicilio' ? 'A domicilio (+' + formatoColones(COSTO_ENTREGA) + ')' : 'Retiro en local') + '\n';
    texto += 'Total: ' + formatoColones(total) + '\n';
    if (nombre) texto += '\nNombre: ' + nombre;
    if (telefono) texto += '\nTeléfono: ' + telefono;
    if (comentario) texto += '\nComentarios: ' + comentario;
    return texto;
  }

  function actualizarVistaMensaje() {
    var preview = document.getElementById('previewMensaje');
    if (preview) preview.textContent = construirMensaje();
  }

  function copiarPedido() {
    var texto = construirMensaje();
    var aviso = document.getElementById('avisoCopiado');
    navigator.clipboard.writeText(texto).then(function () {
      aviso.classList.add('visible');
    }).catch(function () {
      aviso.textContent = 'No se pudo copiar automáticamente. Seleccione el texto de arriba y cópielo manualmente.';
      aviso.classList.add('visible');
    });
  }

  function abrirCarrito() { overlay.hidden = false; panel.hidden = false; renderizar(); }
  function cerrarCarrito() { overlay.hidden = true; panel.hidden = true; }

  carritoBtn.addEventListener('click', abrirCarrito);
  cerrarBtn.addEventListener('click', cerrarCarrito);
  overlay.addEventListener('click', cerrarCarrito);

  actualizarContador();
  window.agregarAlCarritoPan = agregarAlCarrito;
});
