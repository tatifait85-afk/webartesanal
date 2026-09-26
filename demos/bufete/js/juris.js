/* ============================================
   BUFETE JMC — juris.js
   Juris (búho) sigue las secciones 10 y 11 del documento
   maestro: horario/ubicación/contacto/servicios/honorarios/
   agendamiento/identificación de área. Nunca da asesoría
   jurídica personalizada, conclusiones sobre casos concretos
   ni predicciones o garantías. Si no logra clasificar una
   consulta, deriva por defecto al Lic. Ramiro Cárdenas.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var jurisBtn = document.getElementById('jurisBtnJmc');
  if (!jurisBtn) return;

  var panel = document.getElementById('jurisPanelJmc');
  var cerrarBtn = document.getElementById('jurisCerrarJmc');
  var conversacion = document.getElementById('jurisConversacionJmc');
  var inputLibre = document.getElementById('jurisPreguntaJmc');
  var btnEnviar = document.getElementById('jurisEnviarJmc');

  var PROFESIONALES = {
    laboral: { nombre: 'Lic. Ramiro Cárdenas', area: 'Derecho Laboral' },
    familia: { nombre: 'Licda. Vanessa Washington', area: 'Derecho de Familia' },
    penal: { nombre: 'Licda. Marlene Hidalgo', area: 'Derecho Penal' }
  };

  function marcarInicioTurno() { return conversacion.children.length; }
  function anclarFinTurno(marca) {
    var el = conversacion.children[marca];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else conversacion.scrollTop = conversacion.scrollHeight;
  }

  function agregarBurbujaBot(html) {
    var div = document.createElement('div');
    div.className = 'juris-burbuja-bot-jmc';
    div.innerHTML = html;
    conversacion.appendChild(div);
  }
  function agregarBurbujaUsuario(texto) {
    var div = document.createElement('div');
    div.className = 'juris-burbuja-usuario-jmc';
    div.textContent = texto;
    conversacion.appendChild(div);
  }
  function limpiarOpciones() {
    conversacion.querySelectorAll('.juris-opciones-jmc').forEach(function (el) { el.remove(); });
  }
  function mostrarOpciones(opciones) {
    limpiarOpciones();
    var contenedor = document.createElement('div');
    contenedor.className = 'juris-opciones-jmc';
    opciones.forEach(function (op) {
      if (op.href) {
        var a = document.createElement('a');
        a.href = op.href;
        a.className = 'juris-opcion-btn-jmc';
        a.textContent = op.texto;
        if (op.externo) { a.target = '_blank'; a.rel = 'noopener'; }
        contenedor.appendChild(a);
      } else {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'juris-opcion-btn-jmc';
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

  function derivarAProfesional(claveArea) {
    var prof = PROFESIONALES[claveArea] || PROFESIONALES.laboral;
    agregarBurbujaBot('Le recomiendo conversar directamente con <strong>' + prof.nombre + '</strong> (' + prof.area + ') para analizar su situación con el detalle que merece.');
    mostrarOpciones([
      { texto: 'Agendar cita con ' + prof.nombre.split(' ').slice(-1)[0], href: 'agendar-cita.html' },
      { texto: 'Ver otros temas', accion: mostrarMenuPrincipal }
    ]);
  }

  /* ---------- TEMAS PRINCIPALES ---------- */
  function temaServicios() {
    agregarBurbujaBot('Contamos con tres áreas: Derecho Laboral (Lic. Ramiro Cárdenas), Derecho de Familia (Licda. Vanessa Washington) y Derecho Penal (Licda. Marlene Hidalgo).');
    mostrarOpciones([
      { texto: 'Ver todos los servicios', href: 'servicios.html' },
      { texto: '¿Cuál área necesito?', accion: temaIdentificarArea },
      { texto: 'Ver otros temas', accion: mostrarMenuPrincipal }
    ]);
  }

  function temaHonorarios() {
    agregarBurbujaBot('En la sección de Honorarios puede obtener un estimado según el Arancel del Colegio de Abogados y Abogadas de Costa Rica. El resultado es siempre un estimado, nunca un precio definitivo — el profesional confirma el monto antes de contratar.');
    mostrarOpciones([
      { texto: 'Ir a Honorarios', href: 'honorarios.html' },
      { texto: 'Ver otros temas', accion: mostrarMenuPrincipal }
    ]);
  }

  function temaAgendar() {
    agregarBurbujaBot('Puede agendar su consulta eligiendo el área legal, la fecha y la hora que más le convenga.');
    mostrarOpciones([
      { texto: 'Agendar cita', href: 'agendar-cita.html' },
      { texto: 'Ver otros temas', accion: mostrarMenuPrincipal }
    ]);
  }

  function temaContacto() {
    agregarBurbujaBot('Estamos en Esparza, Puntarenas, Costa Rica. Teléfono/WhatsApp: +506 8888-8888. Correo: info@bufetejmc.com.');
    mostrarOpciones([
      { texto: 'Cómo llegar', href: 'https://www.google.com/maps/search/?api=1&query=Esparza%2C%20Puntarenas%2C%20Costa%20Rica', externo: true },
      { texto: 'Escribir por WhatsApp', href: 'https://wa.me/50688888888', externo: true },
      { texto: 'Ver otros temas', accion: mostrarMenuPrincipal }
    ]);
  }

  function temaIdentificarArea() {
    agregarBurbujaBot('Cuénteme brevemente de qué se trata, o elija la opción que más se acerque:');
    mostrarOpciones([
      { texto: 'Un tema de trabajo o empleo', accion: function () { derivarAProfesional('laboral'); } },
      { texto: 'Un tema familiar (divorcio, pensión, custodia)', accion: function () { derivarAProfesional('familia'); } },
      { texto: 'Un tema penal o una denuncia', accion: function () { derivarAProfesional('penal'); } },
      { texto: 'No estoy seguro', accion: function () { derivarAProfesional('laboral'); } }
    ]);
  }

  function mostrarMenuPrincipal() {
    agregarBurbujaBot('¿Sobre qué le gustaría saber más?');
    mostrarOpciones([
      { texto: 'Nuestros servicios', accion: temaServicios },
      { texto: '¿Cuál área legal necesito?', accion: temaIdentificarArea },
      { texto: 'Honorarios', accion: temaHonorarios },
      { texto: 'Agendar una cita', accion: temaAgendar },
      { texto: 'Contacto y ubicación', accion: temaContacto }
    ]);
  }

  /* ---------- LÍMITES: nunca asesoría, conclusiones ni predicciones ---------- */
  var PALABRAS_RIESGO = [
    'voy a ganar', 'puedo ganar', 'posibilidades tengo', 'que posibilidades',
    'cuanto me van a dar', 'cuanto tiempo de carcel', 'me pueden meter preso',
    'es legal que', 'es ilegal que', 'puedo demandar', 'que estrategia',
    'que debo hacer en mi caso', 'mi caso especifico', 'analiceme', 'analice mi caso'
  ];

  function normalizar(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function responderTextoLibre(texto) {
    var normalizado = normalizar(texto);

    var esRiesgoso = PALABRAS_RIESGO.some(function (p) { return normalizado.indexOf(p) !== -1; });
    if (esRiesgoso) {
      agregarBurbujaBot('No puedo dar asesoría jurídica personalizada, conclusiones sobre casos concretos ni predicciones sobre resultados — eso depende de un análisis profesional de su situación.');
      derivarAProfesional(null);
      return;
    }

    var mapa = [
      { claves: ['servicio', 'que hacen', 'que ofrecen'], fn: temaServicios },
      { claves: ['honorario', 'precio', 'costo', 'cuanto cuesta', 'tarifa'], fn: temaHonorarios },
      { claves: ['cita', 'agendar', 'reserva', 'consulta'], fn: temaAgendar },
      { claves: ['ubicacion', 'direccion', 'donde', 'telefono', 'contacto', 'whatsapp', 'correo'], fn: temaContacto },
      { claves: ['trabajo', 'laboral', 'despido', 'empleo'], fn: function () { derivarAProfesional('laboral'); } },
      { claves: ['divorcio', 'pension', 'custodia', 'familia', 'guarda'], fn: function () { derivarAProfesional('familia'); } },
      { claves: ['penal', 'denuncia', 'delito', 'acusacion', 'preso'], fn: function () { derivarAProfesional('penal'); } }
    ];

    var encontrado = mapa.find(function (m) {
      return m.claves.some(function (c) { return normalizado.indexOf(c) !== -1; });
    });

    if (encontrado) {
      encontrado.fn();
    } else {
      agregarBurbujaBot('No logro identificar bien su consulta. Le recomiendo conversar directamente con nuestro equipo.');
      derivarAProfesional(null);
    }
  }

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

  var yaAbrio = false;
  jurisBtn.addEventListener('click', function () {
    panel.hidden = false;
    if (!yaAbrio) {
      var marca = marcarInicioTurno();
      agregarBurbujaBot('Hola, soy Juris, el asistente virtual de Bufete JMC y Asociados. ¿En qué puedo orientarle?');
      mostrarMenuPrincipal();
      anclarFinTurno(marca);
      yaAbrio = true;
    }
  });
  cerrarBtn.addEventListener('click', function () { panel.hidden = true; });
});
