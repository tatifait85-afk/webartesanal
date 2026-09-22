/* ============================================
   NARA — home.js
   Renderiza los productos destacados del Home a partir
   de la fuente única de datos (productos.js), para no
   duplicar precios ni nombres en el HTML.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var contenedor = document.getElementById('productosDestacadosNara');
  if (!contenedor) return;

  // Documento oficial: "Productos destacados del Home"
  var IDS_DESTACADOS = ['vestido-alma', 'blusa-vera', 'pantalon-roma', 'falda-terra', 'set-lino'];

  function formatoColones(numero) {
    var texto = String(Math.round(numero));
    return '₡' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  IDS_DESTACADOS.forEach(function (id) {
    var producto = buscarProductoPorId(id);
    if (!producto) return;

    var swatches = producto.colores.map(function (c) {
      return '<span class="swatch-nara" style="background:' + c.hex + ';" title="' + c.nombre + '"></span>';
    }).join('');

    var tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-producto-nara';
    tarjeta.innerHTML =
      '<a href="producto.html?id=' + producto.id + '" class="tarjeta-producto-nara-imagen">' +
        '<span class="wishlist-icono">♡</span>' +
        '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">' +
      '</a>' +
      '<a href="producto.html?id=' + producto.id + '" style="color:inherit;"><h3>' + producto.nombre + '</h3></a>' +
      '<span class="precio-nara">' + formatoColones(producto.precio) + '</span>' +
      '<div class="swatches-nara">' + swatches + '</div>';

    contenedor.appendChild(tarjeta);
  });
});
