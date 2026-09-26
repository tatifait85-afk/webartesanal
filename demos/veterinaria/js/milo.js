/* ============================================
   VETERINARIA DR LEE — milo.js
   Chatbot Milo, presente en las 4 páginas. Sigue el
   documento oficial: 6 temas configurados, deriva a la
   veterinaria ante síntomas/medicamentos/dosis, nunca
   diagnostica, y usa las mismas frases y datos reales del
   sitio (sin inventar precios que no están publicados).
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var miloBtn = document.getElementById('miloBtnVet');
  if (!miloBtn) return;

  var panel = document.getElementById('miloPanelVet');
  var cerrarBtn = document.getElementById('miloCerrarVet');
  var conversacion = document.getElementById('miloConversacionVet');
  var inputLibre = document.getElementById('miloPreguntaVet');
  var btnEnviar = document.getElementById('miloEnviarVet');

  function scrollAbajo() { conversacion.scrollTop = conversacion.scrollHeight; }

  // En vez de saltar siempre hasta el final (lo que esconde la respuesta
  // detrás de un menú largo), se ancla la vista al inicio de la respuesta
  // de este turno, para que el usuario la vea primero.
  function marcarInicioTurno() { return conversacion.children.length; }
  function anclarFinTurno(marca) {
    var el = conversacion.children[marca];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else scrollAbajo();
  }

  function agregarBurbujaBot(html) {
    var div = document.createElement('div');
    div.className = 'milo-burbuja-bot-vet';
    div.innerHTML = html;
    conversacion.appendChild(div);
  }

  function agregarBurbujaUsuario(texto) {
    var div = document.createElement('div');
    div.className = 'milo-burbuja-usuario-vet';
    div.textContent = texto;
    conversacion.appendChild(div);
  }

  function limpiarOpciones() {
    conversacion.querySelectorAll('.milo-opciones-vet').forEach(function (el) { el.remove(); });
  }

  function mostrarOpciones(opciones) {
    limpiarOpciones();
    var contenedor = document.createElement('div');
    contenedor.className = 'milo-opciones-vet';
    opciones.forEach(function (op) {
      if (op.href) {
        var a = document.createElement('a');
        a.href = op.href;
        a.className = 'milo-opcion-btn-vet';
        a.textContent = op.texto;
        if (op.externo) { a.target = '_blank'; a.rel = 'noopener'; }
        contenedor.appendChild(a);
      } else {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'milo-opcion-btn-vet';
        btn.textContent = op.texto;
        btn.addEventListener('click', function () {
          var marca = marcarInicioTurno();
          agregarBurbujaUsuario(op.texto);
          limpiarOpciones();
          op.accion();
          anclarFinTurno(marca);
        });
        contenedor.appendChild(btn);
      }
    });
    conversacion.appendChild(contenedor);
  }

  // Frases breves de bienestar — varían para no sonar mecánico.
  var FRASES_BIENESTAR = [
    'Mantener al día la salud de tu mascota es una de las mejores formas de cuidarla. 🐾',
    'La prevención también es una forma de demostrarle cuánto te importa.',
    'Un pequeño cuidado hoy puede hacer una gran diferencia en su bienestar.',
    'Cuidar su salud es ayudarle a disfrutar más momentos a tu lado.',
    'La mejor atención empieza con una decisión sencilla: cuidar a tiempo.'
  ];
  function fraseBienestarAleatoria() {
    return FRASES_BIENESTAR[Math.floor(Math.random() * FRASES_BIENESTAR.length)];
  }

  function ofrecerAgendarConBienestar(mensajePrevio) {
    agregarBurbujaBot(mensajePrevio);
    var marca = marcarInicioTurno();
    setTimeout(function () {
      agregarBurbujaBot('¿Querés agendar una cita? ' + fraseBienestarAleatoria());
      mostrarOpciones([
        { texto: 'Agendar cita', href: 'agendar-cita.html' },
        { texto: 'Ver otros temas', accion: mostrarMenuPrincipal }
      ]);
      anclarFinTurno(marca);
    }, 300);
  }

  /* ---------- 6 TEMAS DEL DOCUMENTO ---------- */
  function temaServicios() {
    agregarBurbujaBot('Ofrecemos consulta veterinaria, vacunación, desparasitación, esterilización y castración, y atención preventiva.');
    mostrarOpciones([
      { texto: 'Ver todos los servicios', href: 'servicios.html' },
      { texto: 'Agendar cita', href: 'agendar-cita.html' },
      { texto: 'Ver otros temas', accion: mostrarMenuPrincipal }
    ]);
  }

  function temaCuidadosPreventivos() {
    agregarBurbujaBot('La prevención es clave: vacunación al día, desparasitación regular y controles periódicos ayudan a que tu mascota tenga una vida más saludable.');
    mostrarOpciones([
      { texto: 'Agendar un control preventivo', href: 'agendar-cita.html' },
      { texto: 'Ver otros temas', accion: mostrarMenuPrincipal }
    ]);
  }

  function temaPerrosYGatos() {
    agregarBurbujaBot('Cada mascota tiene necesidades distintas según su especie, edad y estilo de vida. Para una recomendación puntual sobre alimentación o cuidados, lo mejor es que la Dra. Lee la valore en una consulta.');
    mostrarOpciones([
      { texto: 'Agendar cita', href: 'agendar-cita.html' },
      { texto: 'Ver otros temas', accion: mostrarMenuPrincipal }
    ]);
  }

  function temaPreciosYAtencion() {
    agregarBurbujaBot('No tenemos publicada acá una lista de precios exacta. Te recomiendo escribirnos por WhatsApp o llamarnos para consultar el costo según el servicio que necesites.');
    mostrarOpciones([
      { texto: 'Escribir por WhatsApp', href: 'https://wa.me/50688888888', externo: true },
      { texto: 'Llamar', href: 'tel:+50688888888' },
      { texto: 'Ver otros temas', accion: mostrarMenuPrincipal }
    ]);
  }

  function temaCitas() {
    agregarBurbujaBot('Podés reservar tu cita eligiendo el día y la hora que más te convenga, directo desde nuestra página de reservas.');
    mostrarOpciones([
      { texto: 'Agendar cita', href: 'agendar-cita.html' },
      { texto: 'Ver otros temas', accion: mostrarMenuPrincipal }
    ]);
  }

  function temaContacto() {
    agregarBurbujaBot('Estamos en Esparza, Puntarenas, Costa Rica. Horario: lunes a sábado, 8:00 a. m. a 5:00 p. m. Teléfono/WhatsApp: +506 8888-8888.');
    mostrarOpciones([
      { texto: 'Cómo llegar', href: 'https://www.google.com/maps/search/?api=1&query=Esparza%2C%20Puntarenas%2C%20Costa%20Rica', externo: true },
      { texto: 'Escribir por WhatsApp', href: 'https://wa.me/50688888888', externo: true },
      { texto: 'Ver otros temas', accion: mostrarMenuPrincipal }
    ]);
  }

  function mostrarMenuPrincipal() {
    agregarBurbujaBot('¿Sobre qué te gustaría saber más? Elegí un tema:');
    mostrarOpciones([
      { texto: 'Servicios', accion: temaServicios },
      { texto: 'Cuidados preventivos', accion: temaCuidadosPreventivos },
      { texto: 'Perros y gatos', accion: temaPerrosYGatos },
      { texto: 'Precios y formas de atención', accion: temaPreciosYAtencion },
      { texto: 'Citas', accion: temaCitas },
      { texto: 'Contacto, ubicación y horario', accion: temaContacto }
    ]);
  }

  /* ---------- SEGURIDAD: síntomas, diagnóstico, medicamentos y dosis ---------- */
  var PALABRAS_RIESGO = [
    'dosis', 'medicamento', 'medicina', 'pastilla', 'antibiotico', 'desparasitante',
    'diagnostic', 'que tiene', 'sintoma', 'le duele', 'esta enfermo', 'esta enferma',
    'vomita', 'diarrea', 'fiebre', 'cojea', 'no come', 'no quiere comer', 'sangra',
    'convulsion', 'herida', 'hinchado', 'hinchada', 'envenen'
  ];

  var PALABRAS_EMERGENCIA = [
    'emergencia', 'urgente', 'no respira', 'atropell', 'convulsion', 'sangra mucho', 'inconsciente'
  ];

  function normalizar(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function responderTextoLibre(texto) {
    var normalizado = normalizar(texto);

    var esEmergencia = PALABRAS_EMERGENCIA.some(function (p) { return normalizado.indexOf(p) !== -1; });
    if (esEmergencia) {
      agregarBurbujaBot('Si es una emergencia, lo mejor es que te comuniques directamente con nosotros ahora mismo o busques atención veterinaria inmediata — no puedo evaluar la gravedad de una emergencia por chat.');
      mostrarOpciones([
        { texto: 'Llamar ahora', href: 'tel:+50688888888' },
        { texto: 'Escribir por WhatsApp', href: 'https://wa.me/50688888888', externo: true }
      ]);
      return;
    }

    var esRiesgoso = PALABRAS_RIESGO.some(function (p) { return normalizado.indexOf(p) !== -1; });
    if (esRiesgoso) {
      ofrecerAgendarConBienestar('Ese tipo de consulta es importante que la valore la veterinaria directamente, porque depende de examinar a tu mascota — no puedo diagnosticar, indicar medicamentos ni dosis por chat.');
      return;
    }

    var mapa = [
      { claves: ['servicio', 'consulta', 'vacun', 'desparasit', 'esteriliz', 'castra'], fn: temaServicios },
      { claves: ['prevencion', 'preventiv'], fn: temaCuidadosPreventivos },
      { claves: ['perro', 'gato', 'mascota', 'cachorro', 'gatito'], fn: temaPerrosYGatos },
      { claves: ['precio', 'costo', 'cuanto cuesta', 'tarifa', 'pago'], fn: temaPreciosYAtencion },
      { claves: ['cita', 'reserva', 'agendar', 'turno'], fn: temaCitas },
      { claves: ['ubicacion', 'direccion', 'donde', 'horario', 'telefono', 'contacto'], fn: temaContacto }
    ];

    var encontrado = mapa.find(function (m) {
      return m.claves.some(function (c) { return normalizado.indexOf(c) !== -1; });
    });

    if (encontrado) {
      encontrado.fn();
    } else {
      agregarBurbujaBot('No estoy seguro de haber entendido bien. ¿Podés elegir un tema del menú, o preferís hablar directo con nosotros?');
      mostrarMenuPrincipal();
    }
  }

  /* ---------- ENTRADA LIBRE ---------- */
  function enviarPreguntaLibre() {
    var valor = inputLibre.value.trim();
    if (!valor) return;
    var marca = marcarInicioTurno();
    agregarBurbujaUsuario(valor);
    inputLibre.value = '';
    limpiarOpciones();
    responderTextoLibre(valor);
    anclarFinTurno(marca);
  }
  btnEnviar.addEventListener('click', enviarPreguntaLibre);
  inputLibre.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); enviarPreguntaLibre(); } });

  /* ---------- ABRIR / CERRAR ---------- */
  var yaAbrio = false;
  miloBtn.addEventListener('click', function () {
    panel.hidden = false;
    if (!yaAbrio) {
      var marca = marcarInicioTurno();
      agregarBurbujaBot('¡Hola! Soy Milo, el asistente virtual de Veterinaria Dr Lee. ¿En qué puedo ayudarte?');
      mostrarMenuPrincipal();
      anclarFinTurno(marca);
      yaAbrio = true;
    }
  });
  cerrarBtn.addEventListener('click', function () { panel.hidden = true; });
});
