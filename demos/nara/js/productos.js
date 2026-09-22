/* ============================================
   NARA — productos.js
   Fuente única de los 12 productos oficiales.
   No inventar productos, precios, tallas o colores
   fuera de esta lista (documento oficial de NARA).
   ========================================================== */

var PRODUCTOS = [
  { id: 'vestido-alma', nombre: 'Vestido Alma', categoria: 'Vestidos', categoriaAncla: 'vestidos', precio: 29900, imagen: 'assets/img/vestido-alma.webp', tallas: ['S','M','L','XL'], colores: [{ nombre: 'Terracota', hex: '#C1693F' }, { nombre: 'Marfil', hex: '#F2ECE1' }, { nombre: 'Verde oliva', hex: '#7D7A54' }] },
  { id: 'vestido-siena', nombre: 'Vestido Siena', categoria: 'Vestidos', categoriaAncla: 'vestidos', precio: 32500, imagen: 'assets/img/vestido-siena.webp', tallas: ['S','M','L','XL'], colores: [{ nombre: 'Chocolate', hex: '#4A3728' }, { nombre: 'Arena', hex: '#D8C4A8' }, { nombre: 'Negro', hex: '#2B2B2B' }] },

  { id: 'blusa-vera', nombre: 'Blusa Vera', categoria: 'Tops', categoriaAncla: 'tops', precio: 18900, imagen: 'assets/img/blusa-vera.webp', tallas: ['S','M','L','XL'], colores: [{ nombre: 'Blanco', hex: '#FFFFFF' }, { nombre: 'Arena', hex: '#D8C4A8' }, { nombre: 'Verde oliva', hex: '#7D7A54' }] },
  { id: 'blusa-nube', nombre: 'Blusa Nube', categoria: 'Tops', categoriaAncla: 'tops', precio: 21500, imagen: 'assets/img/blusa-nube.webp', tallas: ['S','M','L','XL'], colores: [{ nombre: 'Blanco', hex: '#FFFFFF' }, { nombre: 'Azul humo', hex: '#8A9BA8' }, { nombre: 'Arena', hex: '#D8C4A8' }] },
  { id: 'top-lia', nombre: 'Top Lía', categoria: 'Tops', categoriaAncla: 'tops', precio: 15900, imagen: 'assets/img/top-lia.webp', tallas: ['S','M','L'], colores: [{ nombre: 'Marfil', hex: '#F2ECE1' }, { nombre: 'Terracota', hex: '#C1693F' }, { nombre: 'Negro', hex: '#2B2B2B' }] },

  { id: 'pantalon-roma', nombre: 'Pantalón Roma', categoria: 'Pantalones', categoriaAncla: 'pantalones', precio: 27900, imagen: 'assets/img/pantalon-roma.webp', tallas: ['S','M','L','XL'], colores: [{ nombre: 'Arena', hex: '#D8C4A8' }, { nombre: 'Chocolate', hex: '#4A3728' }, { nombre: 'Negro', hex: '#2B2B2B' }] },
  { id: 'jean-nara', nombre: 'Jean NARA', categoria: 'Pantalones', categoriaAncla: 'pantalones', precio: 28500, imagen: 'assets/img/jean-nara.webp', tallas: ['4','6','8','10','12'], colores: [{ nombre: 'Denim claro', hex: '#A9C0D9' }, { nombre: 'Denim medio', hex: '#5A7FA6' }, { nombre: 'Denim oscuro', hex: '#2E4A6B' }] },
  { id: 'pantalon-arena', nombre: 'Pantalón Arena', categoria: 'Pantalones', categoriaAncla: 'pantalones', precio: 25900, imagen: 'assets/img/pantalon-arena.webp', tallas: ['S','M','L','XL'], colores: [{ nombre: 'Arena', hex: '#D8C4A8' }, { nombre: 'Verde oliva', hex: '#7D7A54' }, { nombre: 'Chocolate', hex: '#4A3728' }] },

  { id: 'falda-terra', nombre: 'Falda Terra', categoria: 'Faldas', categoriaAncla: 'faldas', precio: 22900, imagen: 'assets/img/falda-terra.webp', tallas: ['S','M','L','XL'], colores: [{ nombre: 'Terracota floral', hex: '#C1693F' }, { nombre: 'Arena', hex: '#D8C4A8' }, { nombre: 'Verde oliva', hex: '#7D7A54' }] },
  { id: 'falda-alba', nombre: 'Falda Alba', categoria: 'Faldas', categoriaAncla: 'faldas', precio: 21500, imagen: 'assets/img/falda-alba.webp', tallas: ['S','M','L','XL'], colores: [{ nombre: 'Marfil', hex: '#F2ECE1' }, { nombre: 'Arena', hex: '#D8C4A8' }, { nombre: 'Negro', hex: '#2B2B2B' }] },

  { id: 'set-lino', nombre: 'Set Lino', categoria: 'Conjuntos', categoriaAncla: 'conjuntos', precio: 34900, imagen: 'assets/img/set-lino.webp', tallas: ['S','M','L','XL'], colores: [{ nombre: 'Arena', hex: '#D8C4A8' }, { nombre: 'Verde salvia', hex: '#9CAF88' }, { nombre: 'Chocolate', hex: '#4A3728' }] },
  { id: 'set-siena', nombre: 'Set Siena', categoria: 'Conjuntos', categoriaAncla: 'conjuntos', precio: 36500, imagen: 'assets/img/set-siena.webp', tallas: ['S','M','L','XL'], colores: [{ nombre: 'Terracota', hex: '#C1693F' }, { nombre: 'Negro', hex: '#2B2B2B' }, { nombre: 'Marfil', hex: '#F2ECE1' }] }
];

function buscarProductoPorId(id) {
  return PRODUCTOS.find(function (p) { return p.id === id; });
}

// Descripción editorial genérica por categoría — tono de marca, sin
// inventar composición de tela, medidas exactas ni cuidados no confirmados.
var DESCRIPCION_POR_CATEGORIA = {
  'Vestidos': 'Un vestido versátil que se adapta a tu día, ya sea para la oficina, una salida o una ocasión especial.',
  'Tops': 'Una prenda ligera y versátil, fácil de combinar con lo que ya tienes en tu armario.',
  'Pantalones': 'Un pantalón cómodo y versátil, pensado para acompañarte en tu día a día.',
  'Faldas': 'Una falda femenina y versátil, ideal para combinar de distintas formas según la ocasión.',
  'Conjuntos': 'Un conjunto completo, pensado para simplificar tu día sin dejar de sentirte tú misma.'
};
