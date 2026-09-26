/* ============================================
   LA ESPIGA ARTESANAL — productos.js
   Fuente única de los 5 productos oficiales.
   No inventar productos, precios, ingredientes ni
   disponibilidad fuera de esta lista (documentos oficiales).
   ========================================================== */

var PRODUCTOS = [
  {
    id: 'baguette-artesanal',
    nombre: 'Baguette Artesanal',
    categoria: 'Panes',
    categoriaAncla: 'panes',
    precio: 1200,
    imagen: 'assets/img/baguette.jpeg',
    descripcion: 'Pan de trigo con corteza crujiente y miga ligera.',
    ingredientes: 'Harina de trigo, agua, levadura y sal.',
    disponibilidad: 'Disponible todos los días.'
  },
  {
    id: 'pan-masa-madre',
    nombre: 'Pan de Masa Madre',
    categoria: 'Panes especiales',
    categoriaAncla: 'panes',
    precio: 1800,
    imagen: 'assets/img/pan-masa-madre.jpeg',
    descripcion: 'Pan de fermentación lenta, con corteza crujiente y sabor intenso.',
    ingredientes: 'Harina de trigo, agua, masa madre y sal.',
    disponibilidad: 'Se hornea únicamente los miércoles y sábados. Se recomienda reservarlo con anticipación por WhatsApp.'
  },
  {
    id: 'croissant-mantequilla',
    nombre: 'Croissant de Mantequilla',
    categoria: 'Repostería',
    categoriaAncla: 'reposteria',
    precio: 1200,
    imagen: 'assets/img/croissant.jpeg',
    descripcion: 'Hojaldre dorado y crujiente elaborado con mantequilla.',
    ingredientes: 'Harina de trigo, mantequilla, leche, huevo, azúcar y levadura.',
    disponibilidad: 'Disponible todos los días.'
  },
  {
    id: 'galletas-chocolate',
    nombre: 'Galletas de Chocolate',
    categoria: 'Repostería',
    categoriaAncla: 'reposteria',
    precio: 2500,
    imagen: 'assets/img/galletas-chocolate.jpeg',
    descripcion: 'Galletas artesanales con chocolate. Presentación de 6 unidades.',
    ingredientes: 'Información de ingredientes no detallada para la demo.',
    disponibilidad: 'Disponible todos los días.'
  },
  {
    id: 'tarta-chocolate',
    nombre: 'Tarta de Chocolate',
    categoria: 'Repostería',
    categoriaAncla: 'reposteria',
    precio: 3500,
    imagen: 'assets/img/tarta-chocolate.jpeg',
    descripcion: 'Bizcocho de chocolate con cobertura cremosa; ideal para compartir.',
    ingredientes: 'Información de ingredientes no detallada para la demo.',
    disponibilidad: 'Disponible todos los días.'
  }
];

function buscarProductoPorId(id) {
  return PRODUCTOS.find(function (p) { return p.id === id; });
}
