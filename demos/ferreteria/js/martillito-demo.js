/* ============================================
   FERRETERÍA EL BUEN VECINO — martillito-demo.js
   Mini-demo clicable de Martillito para la página de
   Consejos. Los 3 escenarios están tomados de los
   ejemplos del documento oficial del chatbot. No inventa
   productos: cuando el catálogo de la demo no tiene la
   pieza adecuada, lo dice honestamente y remite a contacto
   directo, tal como exige el documento.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var contenedorInicial = document.getElementById('demoPreguntasIniciales');
  var conversacion = document.getElementById('demoConversacion');
  var btnReiniciar = document.getElementById('demoReiniciar');
  if (!contenedorInicial || !conversacion) return;

  function formatoColones(numero) {
    var texto = String(Math.round(numero));
    return '₡' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  var ESCENARIOS = {
    tubo_inicio: [
      { tipo: 'bot', texto: 'Primero cierre la llave de paso del agua para evitar que siga saliendo. Para ayudarle a encontrar lo que necesita, ¿el tubo es de PVC blanco o es una tubería flexible?' },
      { tipo: 'opciones', opciones: [
        { texto: 'Es PVC blanco', siguiente: 'tubo_pvc' },
        { texto: 'Es una tubería flexible', siguiente: 'tubo_flexible' }
      ]}
    ],
    tubo_pvc: [
      { tipo: 'bot', texto: 'Perfecto. ¿La parte quebrada quedó completamente separada o tiene una grieta pequeña?' },
      { tipo: 'opciones', opciones: [
        { texto: 'Se partió completamente', siguiente: 'tubo_completo' },
        { texto: 'Tiene una grieta pequeña', siguiente: 'tubo_grieta' }
      ]}
    ],
    tubo_flexible: [
      { tipo: 'bot', texto: 'Para tuberías flexibles, esta demo no tiene la pieza específica en el catálogo. Lo más seguro es que nos contacte directamente para revisar su caso.' }
    ],
    tubo_completo: [
      { tipo: 'bot', texto: 'Entonces probablemente necesite una pieza para unir nuevamente el tubo y pegamento para PVC. Le muestro opciones del catálogo:' },
      { tipo: 'productos', ids: ['conector-pvc', 'pegamento-pvc'] }
    ],
    tubo_grieta: [
      { tipo: 'bot', texto: 'Para una grieta pequeña, el pegamento para PVC puede ayudar a sellarla. Si la grieta es grande, lo más seguro es reemplazar esa sección del tubo.' },
      { tipo: 'productos', ids: ['pegamento-pvc'] }
    ],

    pintar_inicio: [
      { tipo: 'bot', texto: 'Claro. ¿La pared ya está pintada o es una pared nueva?' },
      { tipo: 'opciones', opciones: [
        { texto: 'Ya está pintada', siguiente: 'pintar_pintada' },
        { texto: 'Es una pared nueva', siguiente: 'pintar_nueva' }
      ]}
    ],
    pintar_pintada: [
      { tipo: 'bot', texto: 'Perfecto. Para una habitación puede necesitar pintura para interior y herramientas para aplicarla. Le recomiendo:' },
      { tipo: 'productos', ids: ['pintura-blanca-interior', 'rodillo-pintura', 'brocha-2-pulgadas'] }
    ],
    pintar_nueva: [
      { tipo: 'bot', texto: 'Para paredes nuevas normalmente se necesita un sellador previo, que esta demo no incluye en el catálogo. Le recomendamos que nos contacte directamente para ese caso.' }
    ],

    colgar_inicio: [
      { tipo: 'bot', texto: 'Entendido. ¿La pared es de concreto o es de gypsum/drywall?' },
      { tipo: 'opciones', opciones: [
        { texto: 'Es de concreto', siguiente: 'colgar_concreto' },
        { texto: 'Es de gypsum o drywall', siguiente: 'colgar_gypsum' }
      ]}
    ],
    colgar_concreto: [
      { tipo: 'bot', texto: 'En paredes de concreto, un clavo solo no aguanta bien un objeto pesado. Le recomiendo un tarugo junto con el tornillo adecuado:' },
      { tipo: 'productos', ids: ['tarugos-concreto', 'tornillos-autorroscantes'] }
    ],
    colgar_gypsum: [
      { tipo: 'bot', texto: 'Para paredes de gypsum o drywall se necesitan anclajes especiales que esta demo no incluye en el catálogo. Le recomendamos que nos contacte directamente para ese caso.' }
    ]
  };

  var PREGUNTAS_INICIALES = {
    tubo: { texto: 'Se me quebró un tubo de agua, ¿qué hago?', siguiente: 'tubo_inicio' },
    pintar: { texto: 'Quiero pintar una habitación y no sé qué comprar.', siguiente: 'pintar_inicio' },
    colgar: { texto: 'Quiero colgar un cuadro pesado.', siguiente: 'colgar_inicio' }
  };

  function agregarBurbujaUsuario(texto) {
    var div = document.createElement('div');
    div.className = 'demo-burbuja-usuario';
    div.textContent = texto;
    conversacion.appendChild(div);
  }

  function agregarBurbujaBot(texto) {
    var div = document.createElement('div');
    div.className = 'demo-burbuja-bot';
    div.innerHTML = '<img src="assets/img/chatbot-ferre.webp" alt="">' + '<span>' + texto + '</span>';
    conversacion.appendChild(div);
  }

  function quitarOpcionesActivas() {
    var existentes = conversacion.querySelectorAll('.demo-opciones');
    existentes.forEach(function (el) { el.remove(); });
  }

  function agregarOpciones(opciones) {
    quitarOpcionesActivas();
    var contenedor = document.createElement('div');
    contenedor.className = 'demo-opciones';
    opciones.forEach(function (opcion) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = opcion.texto;
      btn.addEventListener('click', function () {
        agregarBurbujaUsuario(opcion.texto);
        quitarOpcionesActivas();
        avanzarA(opcion.siguiente);
      });
      contenedor.appendChild(btn);
    });
    conversacion.appendChild(contenedor);
  }

  function agregarProductos(ids) {
    var grid = document.createElement('div');
    grid.className = 'demo-recomendacion-grid';
    ids.forEach(function (id) {
      var producto = buscarProductoPorId(id);
      if (!producto) return;
      var enlace = document.createElement('a');
      enlace.href = 'producto.html?id=' + producto.id;
      enlace.className = 'demo-mini-producto';
      enlace.innerHTML =
        '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">' +
        '<span class="nombre">' + producto.nombre + '</span>' +
        '<span class="precio">' + formatoColones(producto.precio) + '</span>';
      grid.appendChild(enlace);
    });
    conversacion.appendChild(grid);
  }

  function avanzarA(nombrePaso) {
    var pasos = ESCENARIOS[nombrePaso];
    if (!pasos) return;
    pasos.forEach(function (paso) {
      if (paso.tipo === 'bot') agregarBurbujaBot(paso.texto);
      if (paso.tipo === 'opciones') agregarOpciones(paso.opciones);
      if (paso.tipo === 'productos') agregarProductos(paso.ids);
    });
    conversacion.scrollTop = conversacion.scrollHeight;
    btnReiniciar.style.display = 'inline-block';
  }

  contenedorInicial.querySelectorAll('.demo-pregunta-btn').forEach(function (boton) {
    boton.addEventListener('click', function () {
      var clave = boton.dataset.escenario;
      var inicial = PREGUNTAS_INICIALES[clave];
      if (!inicial) return;

      conversacion.innerHTML = '';
      conversacion.classList.add('activa');
      contenedorInicial.style.display = 'none';

      agregarBurbujaUsuario(inicial.texto);
      avanzarA(inicial.siguiente);
    });
  });

  btnReiniciar.addEventListener('click', function () {
    conversacion.innerHTML = '';
    conversacion.classList.remove('activa');
    contenedorInicial.style.display = 'flex';
    btnReiniciar.style.display = 'none';
  });
});
