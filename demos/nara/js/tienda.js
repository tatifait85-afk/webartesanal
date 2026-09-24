/* ============================================
   NARA — tienda.js
   Filtros, orden y render del catálogo. Toda la lógica
   trabaja sobre la misma fuente única PRODUCTOS
   (productos.js) — nunca datos duplicados.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('gridTienda');
  if (!grid) return;

  var tabsContenedor = document.getElementById('tabsCategoria');
  var filtroTallasBox = document.getElementById('filtroTallas');
  var filtroColoresBox = document.getElementById('filtroColores');
  var filtroPrecioBox = document.getElementById('filtroPrecio');
  var selectOrden = document.getElementById('selectOrden');
  var contador = document.getElementById('contadorResultados');
  var sinResultados = document.getElementById('sinResultados');
  var btnLimpiar = document.getElementById('btnLimpiarFiltros');

  var estado = {
    categoria: 'todo',
    tallas: [],
    colores: [],
    precio: 'todos',
    orden: 'recomendados'
  };

  function formatoColones(numero) {
    var texto = String(Math.round(numero));
    return '₡' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /* ---------- Construir opciones de talla y color a partir de los productos ---------- */
  function construirFiltrosDinamicos() {
    var tallasUnicas = [];
    var coloresUnicos = []; // { nombre, hex }

    PRODUCTOS.forEach(function (p) {
      p.tallas.forEach(function (t) { if (tallasUnicas.indexOf(t) === -1) tallasUnicas.push(t); });
      p.colores.forEach(function (c) {
        if (!coloresUnicos.some(function (existente) { return existente.nombre === c.nombre; })) {
          coloresUnicos.push(c);
        }
      });
    });

    tallasUnicas.forEach(function (talla) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip-filtro-nara';
      btn.textContent = talla;
      btn.dataset.talla = talla;
      btn.addEventListener('click', function () {
        toggleEnArray(estado.tallas, talla);
        btn.classList.toggle('activo');
        renderizar();
      });
      filtroTallasBox.appendChild(btn);
    });

    coloresUnicos.forEach(function (color) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swatch-filtro-nara';
      btn.style.background = color.hex;
      btn.title = color.nombre;
      btn.dataset.color = color.nombre;
      btn.addEventListener('click', function () {
        toggleEnArray(estado.colores, color.nombre);
        btn.classList.toggle('activo');
        renderizar();
      });
      filtroColoresBox.appendChild(btn);
    });
  }

  function toggleEnArray(arr, valor) {
    var i = arr.indexOf(valor);
    if (i === -1) arr.push(valor); else arr.splice(i, 1);
  }

  /* ---------- Tabs de categoría ---------- */
  function seleccionarCategoria(categoria) {
    estado.categoria = categoria;
    tabsContenedor.querySelectorAll('.tab-categoria-nara').forEach(function (btn) {
      btn.classList.toggle('activa', btn.dataset.categoria === categoria);
    });
    renderizar();
  }

  tabsContenedor.querySelectorAll('.tab-categoria-nara').forEach(function (btn) {
    btn.addEventListener('click', function () { seleccionarCategoria(btn.dataset.categoria); });
  });

  /* ---------- Filtro de precio ---------- */
  filtroPrecioBox.querySelectorAll('.chip-filtro-nara').forEach(function (btn) {
    btn.addEventListener('click', function () {
      estado.precio = btn.dataset.precio;
      filtroPrecioBox.querySelectorAll('.chip-filtro-nara').forEach(function (b) { b.classList.remove('activo'); });
      btn.classList.add('activo');
      renderizar();
    });
  });

  /* ---------- Orden ---------- */
  selectOrden.addEventListener('change', function () {
    estado.orden = selectOrden.value;
    renderizar();
  });

  /* ---------- Limpiar filtros ---------- */
  btnLimpiar.addEventListener('click', function () {
    estado.tallas = [];
    estado.colores = [];
    estado.precio = 'todos';
    estado.orden = 'recomendados';
    filtroTallasBox.querySelectorAll('.chip-filtro-nara').forEach(function (b) { b.classList.remove('activo'); });
    filtroColoresBox.querySelectorAll('.swatch-filtro-nara').forEach(function (b) { b.classList.remove('activo'); });
    filtroPrecioBox.querySelectorAll('.chip-filtro-nara').forEach(function (b) { b.classList.toggle('activo', b.dataset.precio === 'todos'); });
    selectOrden.value = 'recomendados';
    renderizar();
  });

  /* ---------- Filtrado y orden ---------- */
  function cumplePrecio(producto, bracket) {
    if (bracket === 'todos') return true;
    if (bracket === 'hasta20') return producto.precio <= 20000;
    if (bracket === '20a30') return producto.precio > 20000 && producto.precio <= 30000;
    if (bracket === 'mas30') return producto.precio > 30000;
    return true;
  }

  function obtenerProductosFiltrados() {
    var lista = PRODUCTOS.filter(function (p) {
      var pasaCategoria = estado.categoria === 'todo' || p.categoria === estado.categoria;
      var pasaTalla = estado.tallas.length === 0 || estado.tallas.some(function (t) { return p.tallas.indexOf(t) !== -1; });
      var pasaColor = estado.colores.length === 0 || estado.colores.some(function (c) { return p.colores.some(function (pc) { return pc.nombre === c; }); });
      var pasaPrecio = cumplePrecio(p, estado.precio);
      return pasaCategoria && pasaTalla && pasaColor && pasaPrecio;
    });

    if (estado.orden === 'precio-asc') lista.sort(function (a, b) { return a.precio - b.precio; });
    else if (estado.orden === 'precio-desc') lista.sort(function (a, b) { return b.precio - a.precio; });
    else if (estado.orden === 'recientes') lista = lista.slice().reverse();
    // "recomendados" conserva el orden original del catálogo oficial

    return lista;
  }

  function crearTarjeta(producto) {
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
    return tarjeta;
  }

  function renderizar() {
    var lista = obtenerProductosFiltrados();
    grid.innerHTML = '';

    if (lista.length === 0) {
      sinResultados.style.display = 'block';
    } else {
      sinResultados.style.display = 'none';
      lista.forEach(function (p) { grid.appendChild(crearTarjeta(p)); });
    }

    contador.textContent = lista.length + (lista.length === 1 ? ' prenda encontrada' : ' prendas encontradas');
  }

  /* ---------- Estado inicial según el hash de la URL (#vestidos, #tops, etc.) ---------- */
  function categoriaDesdeHash() {
    var mapa = {
      vestidos: 'Vestidos',
      tops: 'Tops',
      pantalones: 'Pantalones',
      faldas: 'Faldas',
      conjuntos: 'Conjuntos'
    };
    var hash = window.location.hash.replace('#', '');
    return mapa[hash] || 'todo';
  }

  construirFiltrosDinamicos();
  seleccionarCategoria(categoriaDesdeHash());
});
