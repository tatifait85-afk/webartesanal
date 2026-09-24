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

  document.getElementById('tituloPagina').textContent = producto.nombre + ' — La Espiga Artesanal';

  contenedor.innerHTML =
    '<button type="button" onclick="history.back()" class="boton-secundario-pan" style="margin-bottom:1rem; border:none; cursor:pointer;">← Atrás</button>' +
    '<div class="migas-pan">' +
      '<a href="index.html">Inicio</a> / <a href="productos.html">Productos</a> / ' +
      '<a href="productos.html#' + producto.categoriaAncla + '">' + producto.categoria + '</a> / ' + producto.nombre +
    '</div>' +
    '<div class="ficha-pan">' +
      '<div class="ficha-pan-imagen"><img src="' + producto.imagen + '" alt="' + producto.nombre + '"></div>' +
      '<div>' +
        '<span class="ficha-pan-categoria">' + producto.categoria + '</span>' +
        '<h1>' + producto.nombre + '</h1>' +
        '<div class="ficha-pan-precio">' + formatoColones(producto.precio) + '</div>' +
        '<p>' + producto.descripcion + '</p>' +

        '<div class="ficha-pan-seccion">' +
          '<span class="etiqueta">Ingredientes</span>' +
          '<p style="color:var(--color-text-light); margin:0;">' + producto.ingredientes + '</p>' +
        '</div>' +

        '<div class="aviso-disponibilidad-pan">📅 ' + producto.disponibilidad + '</div>' +

        '<button type="button" id="btnAgregarCarritoPan" class="boton-primario-pan" style="width:100%; border:none; cursor:pointer;">🛒 Agregar al pedido</button>' +
        '<p id="mensajeAgregadoPan" style="color:#1f7a3d; font-weight:700; text-align:center; margin-top:0.6rem;"></p>' +
      '</div>' +
    '</div>';

  document.getElementById('btnAgregarCarritoPan').addEventListener('click', function () {
    if (window.agregarAlCarritoPan) {
      window.agregarAlCarritoPan(producto);
      document.getElementById('mensajeAgregadoPan').textContent = '✓ Agregado a su pedido.';
    }
  });
});
