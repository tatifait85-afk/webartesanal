/* ============================================
   NARA — producto.js
   Arma la ficha según ?id= de la URL, usando la fuente
   única PRODUCTOS (productos.js). Talla, color y cantidad
   son reales y obligatorios antes de agregar al carrito —
   el carrito en sí todavía está pendiente en esta demo.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var contenedor = document.getElementById('fichaContenido');
  var noEncontrado = document.getElementById('fichaNoEncontrado');
  if (!contenedor) return;

  function formatoColones(numero) {
    var texto = String(Math.round(numero));
    return '₡' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  var parametros = new URLSearchParams(window.location.search);
  var id = parametros.get('id');
  var producto = id ? buscarProductoPorId(id) : null;

  if (!producto) {
    contenedor.style.display = 'none';
    noEncontrado.style.display = 'block';
    return;
  }

  document.getElementById('tituloPagina').textContent = producto.nombre + ' — NARA';

  var descripcion = DESCRIPCION_POR_CATEGORIA[producto.categoria] || '';

  var tallasHtml = producto.tallas.map(function (t) {
    return '<button type="button" class="opcion-talla-nara" data-talla="' + t + '">' + t + '</button>';
  }).join('');

  var coloresHtml = producto.colores.map(function (c, indice) {
    return '<button type="button" class="opcion-color-nara" style="background:' + c.hex + ';" data-color="' + c.nombre + '" data-indice="' + indice + '" aria-label="' + c.nombre + '"></button>';
  }).join('');

  contenedor.innerHTML =
    '<div class="migas-nara">' +
      '<a href="index.html">Inicio</a> / <a href="tienda.html">Tienda</a> / ' +
      '<a href="tienda.html#' + producto.categoriaAncla + '">' + producto.categoria + '</a> / ' + producto.nombre +
    '</div>' +
    '<div class="ficha-nara">' +
      '<div class="ficha-nara-imagen"><img src="' + producto.imagen + '" alt="' + producto.nombre + '"></div>' +
      '<div>' +
        '<span class="ficha-nara-categoria">' + producto.categoria + '</span>' +
        '<h1>' + producto.nombre + '</h1>' +
        '<div class="ficha-nara-precio">' + formatoColones(producto.precio) + '</div>' +
        '<p class="ficha-nara-descripcion">' + descripcion + '</p>' +

        '<div class="ficha-nara-seccion">' +
          '<span class="etiqueta">Color<span id="colorElegidoTexto" class="color-elegido-texto"></span></span>' +
          '<div class="opciones-color-nara">' + coloresHtml + '</div>' +
        '</div>' +

        '<div class="ficha-nara-seccion">' +
          '<span class="etiqueta">Talla</span>' +
          '<div class="opciones-talla-nara">' + tallasHtml + '</div>' +
        '</div>' +

        '<div class="ficha-nara-seccion">' +
          '<span class="etiqueta">Cantidad</span>' +
          '<div class="selector-cantidad-nara">' +
            '<button type="button" id="btnRestar" aria-label="Disminuir cantidad">−</button>' +
            '<span id="cantidadValor">1</span>' +
            '<button type="button" id="btnSumar" aria-label="Aumentar cantidad">+</button>' +
          '</div>' +
        '</div>' +

        '<p class="ficha-nara-error" id="errorSeleccion">Elige un color y una talla antes de continuar.</p>' +
        '<button type="button" class="boton-primario-nara" id="btnAgregarCarrito" style="width:100%;">🛍️ Agregar al carrito</button>' +
        '<p class="ficha-nara-error" id="mensajeAgregado" style="color:#1f7a3d;"></p>' +
        '<button type="button" class="favoritos-toggle-nara" id="btnFavorito"><span class="corazon">♡</span> Agregar a favoritos</button>' +

        '<div class="ficha-nara-iconos">' +
          '<div class="icono-item"><span class="icono">🌿</span>Moda consciente</div>' +
          '<div class="icono-item"><span class="icono">🤍</span>Diseño versátil</div>' +
          '<div class="icono-item"><span class="icono">💎</span>Calidad en cada detalle</div>' +
          '<div class="icono-item"><span class="icono">👗</span>Ideal para tu día a día</div>' +
        '</div>' +

        '<div class="franja-beneficios-ficha" style="display:flex; gap:1.2rem; flex-wrap:wrap; font-size:0.78rem; color:var(--color-text-light);">' +
          '<span>🚚 Envíos a todo Costa Rica</span>' +
          '<span>🔒 Pago seguro con PayPal</span>' +
          '<span>📦 Cambios y devoluciones sin complicaciones</span>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="relacionados-nara">' +
      '<div class="encabezado-seccion-nara"><h2>También te puede gustar</h2></div>' +
      '<div class="grid-productos-nara" id="productosRelacionadosNara"></div>' +
    '</div>';

  // Color: selección real
  var colorSeleccionado = null;
  var colorTexto = document.getElementById('colorElegidoTexto');
  contenedor.querySelectorAll('.opcion-color-nara').forEach(function (btn) {
    btn.addEventListener('click', function () {
      contenedor.querySelectorAll('.opcion-color-nara').forEach(function (b) { b.classList.remove('seleccionada'); });
      btn.classList.add('seleccionada');
      colorSeleccionado = btn.dataset.color;
      colorTexto.textContent = ' — ' + colorSeleccionado;
      document.getElementById('errorSeleccion').classList.remove('visible');
    });
  });

  // Talla: selección real
  var tallaSeleccionada = null;
  contenedor.querySelectorAll('.opcion-talla-nara').forEach(function (btn) {
    btn.addEventListener('click', function () {
      contenedor.querySelectorAll('.opcion-talla-nara').forEach(function (b) { b.classList.remove('seleccionada'); });
      btn.classList.add('seleccionada');
      tallaSeleccionada = btn.dataset.talla;
      document.getElementById('errorSeleccion').classList.remove('visible');
    });
  });

  // Cantidad: real, mínimo 1
  var cantidad = 1;
  var cantidadValor = document.getElementById('cantidadValor');
  document.getElementById('btnSumar').addEventListener('click', function () {
    cantidad++;
    cantidadValor.textContent = cantidad;
  });
  document.getElementById('btnRestar').addEventListener('click', function () {
    if (cantidad > 1) {
      cantidad--;
      cantidadValor.textContent = cantidad;
    }
  });

  // Agregar al carrito: exige color y talla, como indica el documento.
  document.getElementById('btnAgregarCarrito').addEventListener('click', function () {
    var errorEl = document.getElementById('errorSeleccion');
    var mensajeEl = document.getElementById('mensajeAgregado');

    if (!colorSeleccionado || !tallaSeleccionada) {
      errorEl.classList.add('visible');
      mensajeEl.textContent = '';
      return;
    }
    errorEl.classList.remove('visible');

    if (window.agregarAlCarritoNara) {
      window.agregarAlCarritoNara({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        color: colorSeleccionado,
        talla: tallaSeleccionada,
        cantidad: cantidad
      });
      mensajeEl.textContent = '✓ Agregado al carrito.';
    }
  });

  // Favoritos: toggle visual real (sin backend, no persiste entre sesiones)
  var btnFavorito = document.getElementById('btnFavorito');
  var esFavorito = false;
  btnFavorito.addEventListener('click', function () {
    esFavorito = !esFavorito;
    btnFavorito.classList.toggle('activo', esFavorito);
    btnFavorito.innerHTML = esFavorito
      ? '<span class="corazon">♥</span> Agregado a favoritos'
      : '<span class="corazon">♡</span> Agregar a favoritos';
  });

  // También te puede gustar: productos reales de la misma categoría
  // (o de otras si la categoría no tiene suficientes), nunca inventados.
  function formatoColonesRel(numero) {
    var texto = String(Math.round(numero));
    return '₡' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  var relacionadosBox = document.getElementById('productosRelacionadosNara');
  var mismaCategoria = PRODUCTOS.filter(function (p) { return p.categoria === producto.categoria && p.id !== producto.id; });
  var otros = PRODUCTOS.filter(function (p) { return p.categoria !== producto.categoria; });
  var relacionados = mismaCategoria.concat(otros).slice(0, 4);

  relacionados.forEach(function (p) {
    var swatches = p.colores.map(function (c) {
      return '<span class="swatch-nara" style="background:' + c.hex + ';" title="' + c.nombre + '"></span>';
    }).join('');

    var tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-producto-nara';
    tarjeta.innerHTML =
      '<a href="producto.html?id=' + p.id + '" class="tarjeta-producto-nara-imagen">' +
        '<span class="wishlist-icono">♡</span>' +
        '<img src="' + p.imagen + '" alt="' + p.nombre + '">' +
      '</a>' +
      '<a href="producto.html?id=' + p.id + '" style="color:inherit;"><h3>' + p.nombre + '</h3></a>' +
      '<span class="precio-nara">' + formatoColonesRel(p.precio) + '</span>' +
      '<div class="swatches-nara">' + swatches + '</div>';
    relacionadosBox.appendChild(tarjeta);
  });
});
