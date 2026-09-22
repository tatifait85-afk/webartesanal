document.addEventListener('DOMContentLoaded', function () {
  var contenedor = document.getElementById('destacadosPan');
  if (!contenedor) return;

  function formatoColones(numero) {
    var texto = String(Math.round(numero));
    return '₡' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  var IDS_DESTACADOS = ['baguette-artesanal', 'pan-masa-madre', 'tarta-chocolate'];

  IDS_DESTACADOS.forEach(function (id) {
    var producto = buscarProductoPorId(id);
    if (!producto) return;

    var tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-producto-pan';
    tarjeta.innerHTML =
      '<a href="producto.html?id=' + producto.id + '" class="tarjeta-producto-pan-imagen">' +
        '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">' +
      '</a>' +
      '<div class="tarjeta-producto-pan-cuerpo">' +
        '<a href="producto.html?id=' + producto.id + '" style="color:inherit;"><h3>' + producto.nombre + '</h3></a>' +
        '<p>' + producto.descripcion + '</p>' +
        '<span class="precio-pan">' + formatoColones(producto.precio) + '</span>' +
        '<button type="button" class="boton-primario-pan btn-agregar-tarjeta-pan" style="border:none; cursor:pointer; margin-bottom:0.5rem;">🛒 Agregar</button>' +
        '<a href="producto.html?id=' + producto.id + '" class="boton-secundario-pan" style="text-align:center;">Ver producto</a>' +
      '</div>';

    tarjeta.querySelector('.btn-agregar-tarjeta-pan').addEventListener('click', function () {
      if (window.agregarAlCarritoPan) {
        window.agregarAlCarritoPan(producto);
        var btn = tarjeta.querySelector('.btn-agregar-tarjeta-pan');
        var textoOriginal = btn.textContent;
        btn.textContent = '✓ Agregado';
        setTimeout(function () { btn.textContent = textoOriginal; }, 1200);
      }
    });

    contenedor.appendChild(tarjeta);
  });
});
