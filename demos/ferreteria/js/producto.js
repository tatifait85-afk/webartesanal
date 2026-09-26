/* ============================================
   FERRETERÍA EL BUEN VECINO — producto.js
   Arma la ficha de producto según el parámetro ?id=
   de la URL, usando la fuente única PRODUCTOS
   (definida en productos.js).
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

  document.getElementById('tituloPagina').textContent = producto.nombre + ' — Ferretería El Buen Vecino';

  contenedor.innerHTML =
    '<div class="ficha-producto">' +
      '<div class="ficha-imagen"><img src="' + producto.imagen + '" alt="' + producto.nombre + '"></div>' +
      '<div>' +
        '<span class="ficha-categoria-chip">' + producto.categoria + '</span>' +
        '<h1>' + producto.nombre + '</h1>' +
        '<div class="ficha-precio">' + formatoColones(producto.precio) + '</div>' +
        '<div class="ficha-disponibilidad">✔ ' + DISPONIBILIDAD_DEMO + '</div>' +
        '<p>' + producto.descripcion + '</p>' +
        '<div class="ficha-ideal-para"><strong>Ideal para:</strong> ' + producto.idealPara + '</div>' +
        '<div class="selector-cantidad">' +
          '<button type="button" id="btnRestar" aria-label="Disminuir cantidad">−</button>' +
          '<span id="cantidadValor">1</span>' +
          '<button type="button" id="btnSumar" aria-label="Aumentar cantidad">+</button>' +
        '</div>' +
        '<button type="button" class="btn-agregar-carrito-ferre" data-id="' + producto.id + '" style="max-width:280px;">🛒 Agregar al carrito</button>' +
        '<div class="ficha-navegacion">' +
          '<a href="catalogo.html#' + producto.categoriaAncla + '" class="boton-secundario">← Volver a ' + producto.categoria + '</a>' +
          '<a href="catalogo.html" style="align-self:center; font-weight:700; color:var(--color-carbon);">Seguir viendo el catálogo →</a>' +
        '</div>' +
      '</div>' +
    '</div>';

  // Selector de cantidad — funcional de verdad (mínimo 1), aunque el
  // botón de agregar al carrito siga pendiente hasta que exista el carrito.
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
});
