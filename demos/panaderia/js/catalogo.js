document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('gridProductos');
  if (!grid) return;

  var tabsContenedor = document.getElementById('tabsCategoria');
  var categoriaActual = 'todo';

  function formatoColones(numero) {
    var texto = String(Math.round(numero));
    return '₡' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function crearTarjeta(producto) {
    var esEspecial = producto.id === 'pan-masa-madre';
    var tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-producto-pan';
    tarjeta.innerHTML =
      '<a href="producto.html?id=' + producto.id + '" class="tarjeta-producto-pan-imagen">' +
        '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">' +
      '</a>' +
      '<div class="tarjeta-producto-pan-cuerpo">' +
        (esEspecial ? '<span class="etiqueta-disponibilidad-pan">Solo miércoles y sábados</span>' : '') +
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

    return tarjeta;
  }

  function renderizar() {
    grid.innerHTML = '';
    var lista = PRODUCTOS.filter(function (p) {
      return categoriaActual === 'todo' || p.categoriaAncla === categoriaActual;
    });
    lista.forEach(function (p) { grid.appendChild(crearTarjeta(p)); });
  }

  function seleccionarCategoria(cat) {
    categoriaActual = cat;
    tabsContenedor.querySelectorAll('.tab-categoria-pan').forEach(function (btn) {
      btn.classList.toggle('activa', btn.dataset.categoria === cat);
    });
    renderizar();
  }

  tabsContenedor.querySelectorAll('.tab-categoria-pan').forEach(function (btn) {
    btn.addEventListener('click', function () { seleccionarCategoria(btn.dataset.categoria); });
  });

  var hash = window.location.hash.replace('#', '');
  seleccionarCategoria((hash === 'panes' || hash === 'reposteria') ? hash : 'todo');
});
