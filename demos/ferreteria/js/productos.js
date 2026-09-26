/* ============================================
   FERRETERÍA EL BUEN VECINO — productos.js
   Fuente única de datos de los 19 productos.
   Usada por la ficha de producto y, más adelante,
   por el carrito y el chatbot Martillito — para no
   duplicar precios ni descripciones en varios lugares.

   Regla de contenido (documento Ficha de Producto):
   solo se incluye información realmente definida —
   nunca se inventan especificaciones técnicas, marcas,
   medidas exactas o garantías no confirmadas.
   ========================================================== */

var PRODUCTOS = [
  {
    id: 'martillo-carpintero',
    nombre: 'Martillo de carpintero',
    categoria: 'Herramientas',
    categoriaAncla: 'herramientas',
    precio: 6500,
    imagen: 'assets/img/martillo-carpintero.webp',
    descripcion: 'Herramienta manual con cabeza de acero para clavar y sacar clavos, con mango de madera.',
    idealPara: 'Trabajos de carpintería y reparaciones en madera.'
  },
  {
    id: 'taladro-inalambrico',
    nombre: 'Taladro inalámbrico',
    categoria: 'Herramientas',
    categoriaAncla: 'herramientas',
    precio: 32000,
    imagen: 'assets/img/taladro.webp',
    descripcion: 'Taladro con batería recargable para perforar y atornillar sin necesidad de cable.',
    idealPara: 'Perforaciones en madera, metal liviano y pared, y trabajos de ensamblaje.'
  },
  {
    id: 'juego-destornilladores',
    nombre: 'Juego de destornilladores',
    categoria: 'Herramientas',
    categoriaAncla: 'herramientas',
    precio: 8500,
    imagen: 'assets/img/juego-desatornilladores.webp',
    descripcion: 'Set de destornilladores de distintos tamaños, plano y estrella.',
    idealPara: 'Ajustar o quitar tornillos en reparaciones generales del hogar.'
  },
  {
    id: 'alicate-universal',
    nombre: 'Alicate universal',
    categoria: 'Herramientas',
    categoriaAncla: 'herramientas',
    precio: 5500,
    imagen: 'assets/img/alicate-universal.webp',
    descripcion: 'Herramienta manual para sujetar, doblar y cortar alambre o cables.',
    idealPara: 'Trabajos eléctricos, de plomería y reparaciones generales.'
  },
  {
    id: 'tornillos-madera',
    nombre: 'Tornillos para madera',
    categoria: 'Tornillería y fijaciones',
    categoriaAncla: 'tornilleria',
    precio: 1800,
    imagen: 'assets/img/tornillos-madera.webp',
    descripcion: 'Tornillos diseñados para fijar piezas de madera entre sí.',
    idealPara: 'Ensamblaje de muebles y estructuras de madera.'
  },
  {
    id: 'tornillos-autorroscantes',
    nombre: 'Tornillos autorroscantes',
    categoria: 'Tornillería y fijaciones',
    categoriaAncla: 'tornilleria',
    precio: 2200,
    imagen: 'assets/img/tornillos-autorroscantes.webp',
    descripcion: 'Tornillos que forman su propia rosca al atornillarse en el material.',
    idealPara: 'Fijaciones en lámina metálica delgada y materiales similares.'
  },
  {
    id: 'tarugos-concreto',
    nombre: 'Tarugos para concreto',
    categoria: 'Tornillería y fijaciones',
    categoriaAncla: 'tornilleria',
    precio: 1500,
    imagen: 'assets/img/tarugos-concreto.webp',
    descripcion: 'Piezas plásticas que se insertan en concreto o pared para sostener un tornillo.',
    idealPara: 'Colgar objetos en paredes de concreto o mampostería.'
  },
  {
    id: 'pintura-blanca-interior',
    nombre: 'Pintura blanca interior (1 galón)',
    categoria: 'Pintura',
    categoriaAncla: 'pintura',
    precio: 12500,
    imagen: 'assets/img/pintura-blanca-interior-galon.webp',
    descripcion: 'Pintura de interior color blanco, presentación de 1 galón.',
    idealPara: 'Pintar paredes interiores del hogar.'
  },
  {
    id: 'brocha-2-pulgadas',
    nombre: 'Brocha de 2"',
    categoria: 'Pintura',
    categoriaAncla: 'pintura',
    precio: 2500,
    imagen: 'assets/img/Brocha-de-dos-pulgadas.webp',
    descripcion: 'Brocha de 2 pulgadas para aplicar pintura en superficies pequeñas o detalles.',
    idealPara: 'Retoques, bordes y superficies reducidas.'
  },
  {
    id: 'rodillo-pintura',
    nombre: 'Rodillo para pintura',
    categoria: 'Pintura',
    categoriaAncla: 'pintura',
    precio: 3500,
    imagen: 'assets/img/Rodillo-para-pintura.webp',
    descripcion: 'Rodillo para aplicar pintura de forma uniforme en superficies grandes.',
    idealPara: 'Pintar paredes y techos.'
  },
  {
    id: 'cinta-teflon',
    nombre: 'Cinta de teflón',
    categoria: 'Plomería',
    categoriaAncla: 'plomeria',
    precio: 1000,
    imagen: 'assets/img/cinta-de-teflon.webp',
    descripcion: 'Cinta selladora para roscas de tubería.',
    idealPara: 'Evitar fugas en conexiones roscadas de plomería.'
  },
  {
    id: 'llave-de-paso',
    nombre: 'Llave de paso ½"',
    categoria: 'Plomería',
    categoriaAncla: 'plomeria',
    precio: 3800,
    imagen: 'assets/img/llave-de-paso-media.webp',
    descripcion: 'Válvula para abrir o cerrar el paso de agua en una tubería de media pulgada.',
    idealPara: 'Controlar o cortar el suministro de agua en una instalación.'
  },
  {
    id: 'conector-pvc',
    nombre: 'Conector PVC',
    categoria: 'Plomería',
    categoriaAncla: 'plomeria',
    precio: 1200,
    imagen: 'assets/img/conector-pvc.webp',
    descripcion: 'Pieza para unir tramos de tubería de PVC en reparaciones e instalaciones.',
    idealPara: 'Reparaciones y conexiones de tubería PVC.'
  },
  {
    id: 'pegamento-pvc',
    nombre: 'Pegamento PVC',
    categoria: 'Plomería',
    categoriaAncla: 'plomeria',
    precio: 2800,
    imagen: 'assets/img/pegamento-pvc.webp',
    descripcion: 'Adhesivo especial para unir piezas y tuberías de PVC.',
    idealPara: 'Instalaciones y reparaciones de tubería PVC, junto con los conectores.'
  },
  {
    id: 'bombillo-led',
    nombre: 'Bombillo LED',
    categoria: 'Electricidad',
    categoriaAncla: 'electricidad',
    precio: 2000,
    imagen: 'assets/img/bombillo-led.webp',
    descripcion: 'Bombillo de bajo consumo con tecnología LED.',
    idealPara: 'Iluminación general del hogar.'
  },
  {
    id: 'tomacorriente',
    nombre: 'Tomacorriente',
    categoria: 'Electricidad',
    categoriaAncla: 'electricidad',
    precio: 2500,
    imagen: 'assets/img/tomacorriente.webp',
    descripcion: 'Dispositivo para instalar una salida eléctrica en la pared.',
    idealPara: 'Instalaciones y reemplazos eléctricos básicos.'
  },
  {
    id: 'extension-electrica',
    nombre: 'Extensión eléctrica (5m)',
    categoria: 'Electricidad',
    categoriaAncla: 'electricidad',
    precio: 5500,
    imagen: 'assets/img/extencion5metros.webp',
    descripcion: 'Cable con toma eléctrica en el extremo, de 5 metros de largo.',
    idealPara: 'Extender la conexión eléctrica a equipos alejados de un tomacorriente.'
  },
  {
    id: 'cemento-25kg',
    nombre: 'Cemento 25 kg',
    categoria: 'Construcción',
    categoriaAncla: 'construccion',
    precio: 5500,
    imagen: 'assets/img/cemento25k.webp',
    descripcion: 'Cemento de uso general, presentación de 25 kilogramos.',
    idealPara: 'Trabajos de construcción y reparaciones menores de albañilería.'
  },
  {
    id: 'guantes-trabajo',
    nombre: 'Guantes de trabajo',
    categoria: 'Construcción',
    categoriaAncla: 'construccion',
    precio: 2500,
    imagen: 'assets/img/guantes-de-trabajo.webp',
    descripcion: 'Guantes de protección para trabajos manuales.',
    idealPara: 'Proteger las manos durante tareas de construcción, jardinería o mantenimiento.'
  }
];

// Disponibilidad: fija para toda la demo, tal como indica el documento oficial.
var DISPONIBILIDAD_DEMO = 'Disponible';

function buscarProductoPorId(id) {
  return PRODUCTOS.find(function (p) { return p.id === id; });
}
