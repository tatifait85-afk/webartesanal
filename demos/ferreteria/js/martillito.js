/* ============================================
   FERRETERÍA EL BUEN VECINO — martillito.js
   Chatbot Martillito, presente en todo el sitio.
   Sigue el documento oficial: trabaja con la necesidad del
   cliente (no solo el nombre del producto), hace preguntas
   de aclaración antes de recomendar, usa los 19 productos
   reales de productos.js, nunca inventa soluciones, y ante
   fugas grandes / electricidad riesgosa / gas / estructuras
   remite a asistencia profesional o contacto directo.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var conversacion = document.getElementById('martilloConversacion');
  if (!conversacion) return; // esta página no tiene la sección de Martillito

  var inputLibre = document.getElementById('martilloPreguntaLibre');
  var btnEnviarLibre = document.getElementById('martilloEnviarPregunta');

  function formatoColones(numero) {
    var texto = String(Math.round(numero));
    return '₡' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function scrollAbajo() { conversacion.scrollTop = conversacion.scrollHeight; }

  function agregarBurbujaBot(html) {
    var div = document.createElement('div');
    div.className = 'martillito-burbuja-bot';
    div.innerHTML = html;
    conversacion.appendChild(div);
    scrollAbajo();
  }

  function agregarBurbujaUsuario(texto) {
    var div = document.createElement('div');
    div.className = 'martillito-burbuja-usuario';
    div.textContent = texto;
    conversacion.appendChild(div);
    scrollAbajo();
  }

  function limpiarInteractivos() {
    conversacion.querySelectorAll('.martillito-opciones:not(.martillito-productos-grupo)').forEach(function (el) { el.remove(); });
  }

  function mostrarOpciones(opciones, onSeleccion) {
    limpiarInteractivos();
    var contenedor = document.createElement('div');
    contenedor.className = 'martillito-opciones';
    opciones.forEach(function (texto) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'martillito-opcion-btn';
      btn.textContent = texto;
      btn.addEventListener('click', function () {
        agregarBurbujaUsuario(texto);
        limpiarInteractivos();
        onSeleccion(texto);
      });
      contenedor.appendChild(btn);
    });
    conversacion.appendChild(contenedor);
    scrollAbajo();
  }

  function mostrarProductosChat(ids, mensajeExtra) {
    limpiarInteractivos();
    var contenedor = document.createElement('div');
    contenedor.className = 'martillito-opciones martillito-productos-grupo';

    ids.forEach(function (id) {
      var producto = buscarProductoPorId(id);
      if (!producto) return;

      var tarjeta = document.createElement('div');
      tarjeta.className = 'martillito-tarjeta-producto-chat';
      tarjeta.innerHTML =
        '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">' +
        '<div class="info">' +
          '<span class="nombre">' + producto.nombre + '</span>' +
          '<span class="precio">' + formatoColones(producto.precio) + '</span>' +
        '</div>' +
        '<div class="acciones">' +
          '<a href="producto.html?id=' + producto.id + '" class="ver-producto">Ver producto</a>' +
          '<button type="button" class="agregar-producto" data-id="' + producto.id + '">Agregar</button>' +
        '</div>';
      contenedor.appendChild(tarjeta);
    });

    conversacion.appendChild(contenedor);

    contenedor.querySelectorAll('.agregar-producto').forEach(function (boton) {
      boton.addEventListener('click', function () {
        var producto = buscarProductoPorId(boton.dataset.id);
        if (producto && window.agregarAlCarritoFerre) {
          window.agregarAlCarritoFerre(producto.id, producto.nombre, producto.precio, producto.imagen);
          boton.textContent = '✓';
        }
      });
    });

    scrollAbajo();

    setTimeout(function () {
      mostrarOpciones(['Agregarlos al carrito', 'Seguir preguntando', 'Ver mi carrito'], function (opcion) {
        if (opcion === 'Agregarlos al carrito') {
          ids.forEach(function (id) {
            var producto = buscarProductoPorId(id);
            if (producto && window.agregarAlCarritoFerre) {
              window.agregarAlCarritoFerre(producto.id, producto.nombre, producto.precio, producto.imagen);
            }
          });
          agregarBurbujaBot('Listo, ya los agregué a su carrito. ¿Le ayudo con algo más?');
          mostrarMenuPrincipal(false);
        } else if (opcion === 'Ver mi carrito') {
          if (window.abrirCarritoFerre) window.abrirCarritoFerre();
        } else {
          mostrarMenuPrincipal(false);
        }
      });
    }, 300);
  }

  /* ---------- ESCENARIOS (necesidad → preguntas → recomendación) ---------- */
  var ESCENARIOS = {
    tubo_inicio: {
      bot: 'Primero cierre la llave de paso del agua para evitar que siga saliendo. Para ayudarle a encontrar lo que necesita, ¿el tubo es de PVC blanco o es una tubería flexible?',
      opciones: [
        { texto: 'Es PVC blanco', siguiente: 'tubo_pvc' },
        { texto: 'Es una tubería flexible', siguiente: 'tubo_flexible' }
      ]
    },
    tubo_pvc: {
      bot: 'Perfecto. ¿La parte quebrada quedó completamente separada o tiene una grieta pequeña?',
      opciones: [
        { texto: 'Se partió completamente', siguiente: 'tubo_completo' },
        { texto: 'Tiene una grieta pequeña', siguiente: 'tubo_grieta' }
      ]
    },
    tubo_flexible: {
      bot: 'Para tuberías flexibles, esta demo no tiene la pieza específica en el catálogo. Lo más seguro es que nos contacte directamente para revisar su caso.',
      contacto: true
    },
    tubo_completo: {
      bot: 'Entonces probablemente necesite una pieza para unir nuevamente el tubo y pegamento para PVC:',
      productos: ['conector-pvc', 'pegamento-pvc']
    },
    tubo_grieta: {
      bot: 'Para una grieta pequeña, el pegamento para PVC puede ayudar a sellarla. Si la grieta es grande, lo más seguro es reemplazar esa sección del tubo.',
      productos: ['pegamento-pvc']
    },

    fuga_grande: {
      bot: 'Si la fuga es importante, lo primero y más urgente es cerrar la llave de paso general del agua para evitar daños mayores. Después de eso, con gusto le ayudo a encontrar la pieza que necesita — ¿me puede contar más del problema? Por ejemplo, "se me quebró un tubo de agua".',
    },

    pintar_inicio: {
      bot: 'Claro. ¿La pared ya está pintada o es una pared nueva?',
      opciones: [
        { texto: 'Ya está pintada', siguiente: 'pintar_pintada' },
        { texto: 'Es una pared nueva', siguiente: 'pintar_nueva' }
      ]
    },
    pintar_pintada: {
      bot: 'Perfecto. Para una habitación puede necesitar pintura para interior y herramientas para aplicarla:',
      productos: ['pintura-blanca-interior', 'rodillo-pintura', 'brocha-2-pulgadas']
    },
    pintar_nueva: {
      bot: 'Para paredes nuevas normalmente se necesita un sellador previo, que esta demo no incluye en el catálogo. Le recomendamos que nos contacte directamente para ese caso.',
      contacto: true
    },

    colgar_inicio: {
      bot: 'Entendido. ¿La pared es de concreto o es de gypsum/drywall?',
      opciones: [
        { texto: 'Es de concreto', siguiente: 'colgar_concreto' },
        { texto: 'Es de gypsum o drywall', siguiente: 'colgar_gypsum' }
      ]
    },
    colgar_concreto: {
      bot: 'En paredes de concreto, un clavo solo no aguanta bien un objeto pesado. Le recomiendo un tarugo junto con el tornillo adecuado:',
      productos: ['tarugos-concreto', 'tornillos-autorroscantes']
    },
    colgar_gypsum: {
      bot: 'Para paredes de gypsum o drywall se necesitan anclajes especiales que esta demo no incluye en el catálogo. Le recomendamos que nos contacte directamente para ese caso.',
      contacto: true
    },

    agujeros_inicio: {
      bot: '¿En qué material necesita hacer los agujeros: madera, concreto/pared, o metal?',
      opciones: [
        { texto: 'Madera', siguiente: 'agujeros_resultado' },
        { texto: 'Concreto o pared', siguiente: 'agujeros_resultado' },
        { texto: 'Metal', siguiente: 'agujeros_resultado' }
      ]
    },
    agujeros_resultado: {
      bot: 'Para eso le recomiendo un taladro inalámbrico — funciona bien para perforar madera, pared y metal liviano:',
      productos: ['taladro-inalambrico']
    },

    tornillos_inicio: {
      bot: 'Con gusto. ¿Los tornillos son para trabajar con madera, o para fijar lámina metálica delgada?',
      opciones: [
        { texto: 'Para madera', siguiente: 'tornillos_madera' },
        { texto: 'Para lámina metálica', siguiente: 'tornillos_metal' }
      ]
    },
    tornillos_madera: {
      bot: 'Para eso le recomiendo tornillos para madera:',
      productos: ['tornillos-madera']
    },
    tornillos_metal: {
      bot: 'Para lámina metálica delgada le recomiendo tornillos autorroscantes:',
      productos: ['tornillos-autorroscantes']
    },

    no_se_inicio: {
      bot: 'No hay problema. Cuénteme, ¿qué trabajo o proyecto quiere hacer? Por ejemplo: pintar, reparar algo, colgar un objeto, o hacer una perforación.',
    }
  };

  function irAContacto() {
    limpiarInteractivos();
    var contenedor = document.createElement('div');
    contenedor.className = 'martillito-opciones';
    contenedor.innerHTML = '<a href="contacto.html" class="martillito-opcion-btn" style="text-align:center;">Ir a Contacto →</a>';
    conversacion.appendChild(contenedor);
    scrollAbajo();
  }

  function avanzarA(clave) {
    var paso = ESCENARIOS[clave];
    if (!paso) return;

    agregarBurbujaBot(paso.bot);

    if (paso.productos) {
      mostrarProductosChat(paso.productos);
    } else if (paso.opciones) {
      mostrarOpciones(paso.opciones.map(function (o) { return o.texto; }), function (textoElegido) {
        var opcion = paso.opciones.find(function (o) { return o.texto === textoElegido; });
        if (opcion) avanzarA(opcion.siguiente);
      });
    } else if (paso.contacto) {
      irAContacto();
    }
  }

  /* ---------- MENÚ PRINCIPAL ---------- */
  function mostrarMenuPrincipal(limpiarTodo) {
    if (limpiarTodo) conversacion.innerHTML = '';
    agregarBurbujaBot('¿En qué le puedo ayudar? Elija una opción o escríbame su problema abajo:');
    mostrarOpciones([
      'Se me quebró un tubo de agua',
      'Tengo una fuga importante de agua',
      'Quiero pintar una habitación',
      'Quiero colgar un cuadro pesado',
      'Necesito hacer agujeros',
      'Necesito unos tornillos',
      'No sé qué herramienta necesito'
    ], function (opcion) {
      if (opcion === 'Se me quebró un tubo de agua') avanzarA('tubo_inicio');
      else if (opcion === 'Tengo una fuga importante de agua') avanzarA('fuga_grande');
      else if (opcion === 'Quiero pintar una habitación') avanzarA('pintar_inicio');
      else if (opcion === 'Quiero colgar un cuadro pesado') avanzarA('colgar_inicio');
      else if (opcion === 'Necesito hacer agujeros') avanzarA('agujeros_inicio');
      else if (opcion === 'Necesito unos tornillos') avanzarA('tornillos_inicio');
      else if (opcion === 'No sé qué herramienta necesito') avanzarA('no_se_inicio');
    });
  }

  /* ---------- PREGUNTA LIBRE (texto escrito) ---------- */
  var ROSTRO_TEMAS = [
    { claves: ['tubo', 'pvc', 'quebr', 'roto', 'rota', 'tuberia'], ir: 'tubo_inicio' },
    { claves: ['fuga'], ir: 'fuga_grande' },
    { claves: ['pintar', 'pintura', 'habitacion', 'cuarto'], ir: 'pintar_inicio' },
    { claves: ['colgar', 'cuadro', 'clavar en pared'], ir: 'colgar_inicio' },
    { claves: ['agujero', 'perforar', 'taladrar', 'hueco'], ir: 'agujeros_inicio' },
    { claves: ['tornillo'], ir: 'tornillos_inicio' }
  ];

  var TEMAS_INFO = [
    { claves: ['horario', 'hora abren', 'hora cierran'], respuesta: 'Abrimos de lunes a sábado de 7:00 a. m. a 6:00 p. m., y domingo de 8:00 a. m. a 1:00 p. m.' },
    { claves: ['ubicacion', 'direccion', 'donde estan', 'donde queda'], respuesta: 'Estamos 200 metros al este del Parque Central de Esparza, Puntarenas, frente a la plaza comunal.' },
    { claves: ['entrega', 'express', 'domicilio'], respuesta: 'Puede retirar en tienda, o pedir el servicio Express a domicilio en Esparza y zonas cercanas por ' + formatoColones(1500) + '.' },
    { claves: ['pago', 'sinpe', 'tarjeta'], respuesta: 'Aceptamos efectivo, tarjeta o SINPE Móvil.' }
  ];

  var TEMAS_PELIGROSOS = ['gas', 'electric', 'cortocircuito', 'corto circuito', 'estructura', 'columna', 'viga', 'derrumbe', 'incendio'];

  function normalizarTexto(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function responderTextoLibre(texto) {
    var normalizado = normalizarTexto(texto);

    // Límite de seguridad: gas, electricidad de riesgo, estructuras — nunca
    // se improvisa una instrucción técnica; se remite a contacto directo.
    var esPeligroso = TEMAS_PELIGROSOS.some(function (clave) { return normalizado.indexOf(clave) !== -1; });
    if (esPeligroso) {
      agregarBurbujaBot('Para temas de gas, electricidad de riesgo o estructuras, lo más seguro es que un profesional lo revise, o que nos contacte directamente — no quiero darle una instrucción que pueda ser peligrosa.');
      irAContacto();
      return;
    }

    var temaEncontrado = ROSTRO_TEMAS.find(function (t) {
      return t.claves.some(function (c) { return normalizado.indexOf(c) !== -1; });
    });
    if (temaEncontrado) {
      avanzarA(temaEncontrado.ir);
      return;
    }

    var infoEncontrada = TEMAS_INFO.find(function (t) {
      return t.claves.some(function (c) { return normalizado.indexOf(c) !== -1; });
    });
    if (infoEncontrada) {
      agregarBurbujaBot(infoEncontrada.respuesta);
      irAContacto();
      return;
    }

    agregarBurbujaBot('No estoy seguro de haber entendido bien. ¿Me cuenta un poco más sobre el problema o lo que quiere hacer? También puede elegir una opción del menú.');
    mostrarMenuPrincipal(false);
  }

  btnEnviarLibre.addEventListener('click', function () { enviarPreguntaLibre(); });
  inputLibre.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); enviarPreguntaLibre(); } });

  function enviarPreguntaLibre() {
    var valor = inputLibre.value.trim();
    if (!valor) return;
    agregarBurbujaUsuario(valor);
    inputLibre.value = '';
    limpiarInteractivos();
    responderTextoLibre(valor);
  }

  /* ---------- INICIO AUTOMÁTICO (ya no es un widget flotante) ---------- */
  agregarBurbujaBot('¡Hola! Soy Martillito 🔨 Cuénteme qué quiere hacer o qué problema tiene, y le ayudo a encontrar lo que necesita.');
  mostrarMenuPrincipal(false);
});
