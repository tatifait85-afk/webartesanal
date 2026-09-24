/* ============================================
   WEB ARTESANAL — main.js
   Menú móvil + Cuestionario + Carrito + Chatbot La Hojita
   ============================================ */

/* ==========================================================
   MOTOR DE RECOMENDACIÓN (FUENTE ÚNICA)
   Usado tanto por el cuestionario del Home como por el
   chatbot La Hojita — misma lógica, mismos precios, un solo
   lugar donde se define. Cruza varias respuestas (no solo
   una) contra los precios oficiales de Web Artesanal. Nunca
   inventa precios: lo no confirmado se marca como nota, no
   como cifra.
   ========================================================== */
function obtenerPresupuestoMax(q7) {
  var mapa = {
    'Hasta ₡15.000': 15000,
    '₡15.000–₡30.000': 30000,
    '₡30.000–₡50.000': 50000,
    '₡50.000–₡75.000': 75000,
    'Más de ₡75.000': Infinity
  };
  return Object.prototype.hasOwnProperty.call(mapa, q7) ? mapa[q7] : null;
}

function calcularRecomendacion(r) {
  var contiene = function (campo, valor) {
    return Array.isArray(r[campo]) && r[campo].indexOf(valor) !== -1;
  };

  var budgetMax = obtenerPresupuestoMax(r.q7);

  // Con presupuesto muy ajustado, se usa la Simple Page (₡15.000) en vez
  // del Sitio Web completo (₡50.000) — es una opción real y más económica
  // ya incluida en la lista oficial de precios, no un invento.
  var usarSimplePage = budgetMax !== null && budgetMax <= 30000;
  var base = usarSimplePage
    ? { nombre: 'Simple Page', precio: 15000, notaExtra: 'Versión sencilla de una página; se puede ampliar a Sitio Web completo más adelante.' }
    : { nombre: 'Sitio Web', precio: 50000 };

  // Lista de deseos, en orden de prioridad (lo más importante primero)
  var deseados = [];

  if (!contiene('q5', 'Logo')) {
    deseados.push({ nombre: 'Logo', precio: 10000 });
  }

  var vendeProductos = r.q4 && r.q4 !== 'No vendo productos; ofrezco servicios';
  if (vendeProductos) {
    var muchosProductos = (r.q4 === '11–20' || r.q4 === 'Más de 20');
    deseados.push({
      nombre: 'Catálogo (hasta 10 productos)',
      precio: 20000,
      notaExtra: muchosProductos ? '+₡1.500 por cada producto adicional (más de 10)' : null
    });
  }

  var quiereCarrito = contiene('q3', 'Hacer pedidos por WhatsApp') || contiene('q6', 'Carrito de pedidos por WhatsApp');
  if (quiereCarrito) {
    if (r.q4 === '11–20' || r.q4 === 'Más de 20') {
      deseados.push({ nombre: 'Carrito WhatsApp Ampliado (hasta 20 productos)', precio: 60000 });
    } else {
      deseados.push({ nombre: 'Carrito WhatsApp Básico (hasta 10 productos)', precio: 35000 });
    }
  }

  var quiereTienda = contiene('q3', 'Comprar y pagar en línea') || contiene('q6', 'Pago online');
  if (quiereTienda) {
    deseados.push({ nombre: 'Tienda PayPal', precio: 75000, desde: true });
  }

  var quiereReservas = contiene('q3', 'Reservar una cita') || contiene('q6', 'Reservas y calendario');
  if (quiereReservas) {
    deseados.push({ nombre: 'Reservas y calendario', precio: 15000 });
  }

  var quiereBlog = contiene('q6', 'Blog') || contiene('q2', 'Compartir información o contenido');
  if (quiereBlog) {
    deseados.push({ nombre: 'Blog (3 artículos iniciales)', precio: 30000 });
  }

  // Repartir entre "ahora" (dentro del presupuesto) y "próxima etapa"
  var ahora = [base];
  var despues = [];
  var acumulado = base.precio;

  if (budgetMax === null || budgetMax === Infinity) {
    // Sin un tope claro de presupuesto: se recomienda todo junto.
    deseados.forEach(function (item) {
      ahora.push(item);
      acumulado += (item.precio || 0);
    });
  } else {
    deseados.forEach(function (item) {
      if (acumulado + item.precio <= budgetMax) {
        ahora.push(item);
        acumulado += item.precio;
      } else {
        despues.push(item);
      }
    });
  }

  return { ahora: ahora, despues: despues, total: acumulado, budgetMax: budgetMax };
}

function formatoColones(numero) {
  // Formato manual (no toLocaleString) — evita el bug ya conocido de
  // espacio en vez de punto como separador de miles.
  var texto = String(Math.round(numero));
  var conPuntos = texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return '₡' + conPuntos;
}

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- MENÚ MÓVIL ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var abierto = navLinks.classList.toggle('abierto');
      navToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
  }

  /* ---------- CUESTIONARIO ---------- */
  var form = document.getElementById('formCuestionario');
  if (!form) return; // esta página no tiene cuestionario

  // Corrección de bug: sin esto, presionar Enter dentro del formulario lo
  // envía de verdad (recarga la página con las respuestas pegadas en la URL,
  // ej. index.html?q1=...&q8=...). Nunca debe enviarse como formulario normal.
  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
  });

  var pasos = Array.prototype.slice.call(form.querySelectorAll('.q-paso'));
  var totalPreguntas = 8; // los pasos 9 (resumen) y 10 (confirmación) no cuentan para la barra de progreso
  var pasoActual = 1;
  var esPrimeraVista = true;

  var btnAtras = document.getElementById('qBtnAtras');
  var btnSiguiente = document.getElementById('qBtnSiguiente');
  var navBotones = document.getElementById('qNavBotones');
  var progresoRelleno = document.getElementById('qProgresoRelleno');
  var progresoTexto = document.getElementById('qProgresoTexto');
  var resumenBox = document.getElementById('qResumen');
  var recomendacionBox = document.getElementById('qRecomendacion');
  var errorEnvioEl = document.getElementById('qErrorEnvio');
  var cuestionarioWrap = document.querySelector('.cuestionario-wrap');

  var respuestas = {}; // guarda todas las respuestas del cuestionario

  // Etiquetas legibles para el resumen
  var etiquetas = {
    q1: '¿Cuál es su negocio?',
    q2: '¿Qué quiere conseguir?',
    q3: '¿Qué podrán hacer sus clientes?',
    q4: 'Cantidad de productos/servicios',
    q5: 'Materiales que ya tiene',
    q6: 'Funciones que necesita',
    q7: 'Presupuesto aproximado',
    q8: 'Su idea en sus palabras'
  };

  function mostrarPaso(numero) {
    pasos.forEach(function (paso) {
      paso.classList.toggle('activo', parseInt(paso.dataset.paso, 10) === numero);
    });

    var pasoParaBarra = Math.min(numero, totalPreguntas);
    var porcentaje = (pasoParaBarra / totalPreguntas) * 100;
    progresoRelleno.style.width = porcentaje + '%';

    if (numero <= totalPreguntas) {
      progresoTexto.textContent = 'Pregunta ' + numero + ' de ' + totalPreguntas;
    } else if (numero === totalPreguntas + 1) {
      progresoTexto.textContent = 'Revisión final';
    } else {
      progresoTexto.textContent = '¡Listo!';
    }

    btnAtras.style.visibility = numero === 1 ? 'hidden' : 'visible';

    if (numero === totalPreguntas + 1) {
      btnSiguiente.textContent = 'Enviar cuestionario →';
    } else if (numero > totalPreguntas + 1) {
      navBotones.style.display = 'none';
    } else {
      btnSiguiente.textContent = 'Siguiente →';
      navBotones.style.display = 'flex';
    }

    // Scroll automático: no hace falta ajustar la página a mano. Se omite en
    // la primera carga para no mover la vista sin que el usuario haga nada.
    if (!esPrimeraVista && cuestionarioWrap) {
      cuestionarioWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    esPrimeraVista = false;
  }

  function obtenerPasoActualEl() {
    return form.querySelector('.q-paso[data-paso="' + pasoActual + '"]');
  }

  function ocultarError(pasoEl) {
    var error = pasoEl.querySelector('.q-error');
    if (error) error.classList.remove('visible');
  }

  function mostrarError(pasoEl) {
    var error = pasoEl.querySelector('.q-error');
    if (error) error.classList.add('visible');
  }

  function validarYGuardarPaso() {
    var pasoEl = obtenerPasoActualEl();
    if (!pasoEl) return true;

    var nombreCampo = 'q' + pasoActual;
    var inputTexto = pasoEl.querySelector('.q-input-texto');
    var textarea = pasoEl.querySelector('.q-textarea');
    var bloque = pasoEl.querySelector('.q-block');

    if (inputTexto) {
      var valor = inputTexto.value.trim();
      if (valor === '') { mostrarError(pasoEl); return false; }
      respuestas[nombreCampo] = valor;
      ocultarError(pasoEl);
      return true;
    }

    if (textarea) {
      var valorTA = textarea.value.trim();
      if (valorTA === '') { mostrarError(pasoEl); return false; }
      respuestas[nombreCampo] = valorTA;
      ocultarError(pasoEl);
      return true;
    }

    if (bloque) {
      var marcados = Array.prototype.slice.call(bloque.querySelectorAll('input:checked'));
      if (marcados.length === 0) { mostrarError(pasoEl); return false; }
      respuestas[nombreCampo] = marcados.map(function (input) { return input.value; });
      ocultarError(pasoEl);
      return true;
    }

    return true;
  }

  function construirResumen() {
    resumenBox.innerHTML = '';
    Object.keys(etiquetas).forEach(function (clave) {
      var valor = respuestas[clave];
      if (!valor) return;
      var textoValor = Array.isArray(valor) ? valor.join(', ') : valor;

      var item = document.createElement('div');
      item.className = 'q-resumen-item';
      var strong = document.createElement('strong');
      strong.textContent = etiquetas[clave];
      var texto = document.createElement('span');
      texto.textContent = textoValor;
      item.appendChild(strong);
      item.appendChild(texto);
      resumenBox.appendChild(item);
    });
  }

  /* ==========================================================
     El motor de recomendación (obtenerPresupuestoMax,
     calcularRecomendacion, formatoColones) ahora es compartido
     — definido arriba, fuera de este bloque — para que el
     chatbot use exactamente la misma lógica y los mismos
     precios que este cuestionario.
     ========================================================== */

  function filaRecomendacion(item) {
    var precioTexto = (item.desde ? 'Desde ' : '') + formatoColones(item.precio);
    var extra = item.notaExtra ? '<div class="q-recomendacion-nota" style="margin:0 0 0.4rem 0;">' + item.notaExtra + '</div>' : '';
    return '<div class="q-recomendacion-item"><span>' + item.nombre + '</span><span>' + precioTexto + '</span></div>' + extra;
  }

  function construirRecomendacion() {
    if (!recomendacionBox) return;
    var r = calcularRecomendacion(respuestas);

    var html = '<div class="q-recomendacion-lista">';
    r.ahora.forEach(function (item) { html += filaRecomendacion(item); });
    html += '</div>';

    html += '<div class="q-recomendacion-total"><span>Estimado (primera etapa)</span><span>' + formatoColones(r.total) + '</span></div>';

    if (r.budgetMax !== null) {
      html += '<p class="q-recomendacion-nota">Este paquete se ajusta al presupuesto que usted indicó (<strong>' + respuestas.q7 + '</strong>). El monto final se confirma con usted antes de iniciar el trabajo.</p>';
    } else {
      html += '<p class="q-recomendacion-nota">Este estimado es orientativo, con base en sus respuestas y la lista oficial de precios. El presupuesto final se confirma con usted antes de iniciar el trabajo.</p>';
    }

    if (r.despues.length > 0) {
      html += '<div style="margin-top:1rem; padding-top:0.8rem; border-top:1px dashed var(--color-border);">';
      html += '<p class="q-pregunta" style="font-size:0.95rem; margin-bottom:0.6rem;">Para una próxima etapa (no incluido en el estimado de arriba)</p>';
      html += '<div class="q-recomendacion-lista">';
      r.despues.forEach(function (item) { html += filaRecomendacion(item); });
      html += '</div>';
      html += '<p class="q-recomendacion-nota">Puede agregar estos servicios más adelante, cuando lo desee.</p>';
      html += '</div>';
    }

    recomendacionBox.innerHTML = html;
  }

  function enviarCuestionario() {
    return fetch('/api/enviar-cuestionario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(respuestas)
    })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (datos) { return !!(datos && datos.ok); })
      .catch(function () { return false; });
  }

  function irAlSiguientePaso() {
    if (pasoActual <= totalPreguntas) {
      if (!validarYGuardarPaso()) return;
    }

    if (pasoActual === totalPreguntas + 1) {
      if (errorEnvioEl) errorEnvioEl.classList.remove('visible');
      btnSiguiente.disabled = true;
      btnSiguiente.textContent = 'Enviando...';

      enviarCuestionario().then(function (exito) {
        btnSiguiente.disabled = false;
        if (exito) {
          pasoActual++;
          mostrarPaso(pasoActual);
        } else {
          btnSiguiente.textContent = 'Enviar cuestionario →';
          if (errorEnvioEl) errorEnvioEl.classList.add('visible');
        }
      });

      return;
    }

    pasoActual++;

    if (pasoActual === totalPreguntas + 1) {
      construirRecomendacion();
      construirResumen();
    }

    mostrarPaso(pasoActual);
  }

  btnSiguiente.addEventListener('click', irAlSiguientePaso);

  btnAtras.addEventListener('click', function () {
    if (pasoActual === 1) return;
    pasoActual--;
    mostrarPaso(pasoActual);
  });

  // Enter avanza igual que "Siguiente" (mouse y teclado hacen lo mismo).
  // Excepción: dentro del <textarea> (pregunta 8), Enter escribe un salto de
  // línea normal; solo Ctrl/Cmd+Enter o el botón avanzan ahí.
  form.addEventListener('keydown', function (evento) {
    if (evento.key !== 'Enter') return;

    var elementoActivo = document.activeElement;
    var estaEnTextarea = elementoActivo && elementoActivo.tagName === 'TEXTAREA';

    if (estaEnTextarea && !(evento.ctrlKey || evento.metaKey)) {
      return;
    }

    evento.preventDefault();
    irAlSiguientePaso();
  });

  mostrarPaso(pasoActual);
});

/* ==========================================================
   FORMULARIO DE CONTACTO (página contacto.html)
   Independiente del cuestionario — validación simple y envío
   real vía Resend con su propia función de Cloudflare.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var formContacto = document.getElementById('formContacto');
  if (!formContacto) return; // esta página no tiene formulario de contacto

  var btnEnviar = document.getElementById('contactoBtnEnviar');
  var errorValidacion = document.getElementById('contactoError');
  var errorEnvio = document.getElementById('contactoErrorEnvio');
  var mensajeExito = document.getElementById('contactoExito');

  function correoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  }

  btnEnviar.addEventListener('click', function () {
    var nombre = document.getElementById('contactoNombre').value.trim();
    var correo = document.getElementById('contactoCorreo').value.trim();
    var mensaje = document.getElementById('contactoMensaje').value.trim();

    errorValidacion.classList.remove('visible');
    errorEnvio.classList.remove('visible');
    mensajeExito.style.display = 'none';

    if (!nombre || !mensaje || !correoValido(correo)) {
      errorValidacion.classList.add('visible');
      return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    fetch('/api/enviar-contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombre, correo: correo, mensaje: mensaje })
    })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (datos) {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar mensaje →';

        if (datos && datos.ok) {
          mensajeExito.style.display = 'block';
          formContacto.reset();
        } else {
          errorEnvio.classList.add('visible');
        }
      })
      .catch(function () {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar mensaje →';
        errorEnvio.classList.add('visible');
      });
  });
});

/* ==========================================================
   CARRITO DE WHATSAPP (presente en todas las páginas)
   Persiste en localStorage para que se mantenga al navegar
   entre páginas. Envío real por correo vía Resend.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var carritoBtn = document.getElementById('carritoBtn');
  if (!carritoBtn) return; // esta página no tiene el carrito instalado

  var CARRITO_KEY = 'webartesanal_carrito';

  var panel = document.getElementById('carritoPanel');
  var overlay = document.getElementById('carritoOverlay');
  var contador = document.getElementById('carritoContador');
  var itemsBox = document.getElementById('carritoItems');
  var totalBox = document.getElementById('carritoTotal');
  var vacioMsg = document.getElementById('carritoVacioMsg');
  var checkoutBox = document.getElementById('carritoCheckout');
  var cerrarBtn = document.getElementById('carritoCerrar');
  var enviarBtn = document.getElementById('carritoEnviarBtn');
  var errorValidacion = document.getElementById('carritoErrorValidacion');
  var errorEnvio = document.getElementById('carritoErrorEnvio');
  var exitoMsg = document.getElementById('carritoExito');

  function formatoColonesCarrito(numero) {
    var texto = String(Math.round(numero));
    var conPuntos = texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return '₡' + conPuntos;
  }

  function leerCarrito() {
    try {
      return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function guardarCarrito(items) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
  }

  function actualizarContador() {
    var items = leerCarrito();
    var totalUnidades = items.reduce(function (suma, item) { return suma + item.cantidad; }, 0);
    if (totalUnidades > 0) {
      contador.textContent = totalUnidades;
      contador.style.display = 'inline-block';
    } else {
      contador.style.display = 'none';
    }
  }

  function agregarAlCarrito(nombre, precio) {
    var items = leerCarrito();
    var existente = items.find(function (item) { return item.nombre === nombre; });
    if (existente) {
      existente.cantidad += 1;
    } else {
      items.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }
    guardarCarrito(items);
    actualizarContador();
    renderCarrito();
  }

  function cambiarCantidad(indice, delta) {
    var items = leerCarrito();
    if (!items[indice]) return;
    items[indice].cantidad += delta;
    if (items[indice].cantidad <= 0) {
      items.splice(indice, 1);
    }
    guardarCarrito(items);
    actualizarContador();
    renderCarrito();
  }

  function quitarDelCarrito(indice) {
    var items = leerCarrito();
    items.splice(indice, 1);
    guardarCarrito(items);
    actualizarContador();
    renderCarrito();
  }

  function renderCarrito() {
    var items = leerCarrito();
    itemsBox.innerHTML = '';

    if (items.length === 0) {
      vacioMsg.style.display = 'block';
      checkoutBox.style.display = 'none';
      totalBox.parentElement.style.display = 'none';
      return;
    }

    vacioMsg.style.display = 'none';
    checkoutBox.style.display = 'grid';
    totalBox.parentElement.style.display = 'flex';

    var total = 0;
    items.forEach(function (item, indice) {
      var subtotal = item.precio * item.cantidad;
      total += subtotal;

      var fila = document.createElement('div');
      fila.className = 'carrito-item';
      fila.innerHTML =
        '<div class="carrito-item-info">' +
          '<span class="carrito-item-nombre">' + item.nombre + '</span>' +
          '<span class="carrito-item-precio">' + formatoColonesCarrito(item.precio) + ' c/u — Subtotal: ' + formatoColonesCarrito(subtotal) + '</span>' +
        '</div>' +
        '<div class="carrito-item-qty">' +
          '<button type="button" class="carrito-qty-btn" data-accion="restar" data-indice="' + indice + '">−</button>' +
          '<span>' + item.cantidad + '</span>' +
          '<button type="button" class="carrito-qty-btn" data-accion="sumar" data-indice="' + indice + '">+</button>' +
          '<button type="button" class="carrito-item-quitar" data-accion="quitar" data-indice="' + indice + '">Quitar</button>' +
        '</div>';
      itemsBox.appendChild(fila);
    });

    totalBox.textContent = formatoColonesCarrito(total);
  }

  itemsBox.addEventListener('click', function (evento) {
    var boton = evento.target.closest('button[data-accion]');
    if (!boton) return;
    var indice = parseInt(boton.dataset.indice, 10);
    if (boton.dataset.accion === 'sumar') cambiarCantidad(indice, 1);
    if (boton.dataset.accion === 'restar') cambiarCantidad(indice, -1);
    if (boton.dataset.accion === 'quitar') quitarDelCarrito(indice);
  });

  function abrirCarrito() {
    panel.hidden = false;
    overlay.hidden = false;
    renderCarrito();
  }

  function cerrarCarrito() {
    panel.hidden = true;
    overlay.hidden = true;
  }

  carritoBtn.addEventListener('click', abrirCarrito);
  cerrarBtn.addEventListener('click', cerrarCarrito);
  overlay.addEventListener('click', cerrarCarrito);

  // Botones "Agregar al carrito" en las tarjetas de servicios/productos
  document.querySelectorAll('.btn-agregar-carrito').forEach(function (boton) {
    boton.addEventListener('click', function () {
      var nombre = boton.dataset.nombre;
      var precio = parseFloat(boton.dataset.precio);
      agregarAlCarrito(nombre, precio);

      var textoOriginal = boton.textContent;
      boton.textContent = 'Agregado ✓';
      setTimeout(function () { boton.textContent = textoOriginal; }, 1200);
    });
  });

  function correoValidoCarrito(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  }

  enviarBtn.addEventListener('click', function () {
    var nombre = document.getElementById('carritoNombre').value.trim();
    var telefono = document.getElementById('carritoTelefono').value.trim();
    var correo = document.getElementById('carritoEmail').value.trim();
    var items = leerCarrito();

    errorValidacion.classList.remove('visible');
    errorEnvio.classList.remove('visible');

    if (!nombre || !telefono || !correoValidoCarrito(correo) || items.length === 0) {
      errorValidacion.classList.add('visible');
      return;
    }

    enviarBtn.disabled = true;
    enviarBtn.textContent = 'Enviando...';

    fetch('/api/enviar-carrito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente: { nombre: nombre, telefono: telefono, correo: correo },
        items: items
      })
    })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (datos) {
        enviarBtn.disabled = false;
        enviarBtn.textContent = 'Enviar pedido →';

        if (datos && datos.ok) {
          guardarCarrito([]);
          actualizarContador();
          exitoMsg.style.display = 'block';
          itemsBox.innerHTML = '';
          checkoutBox.style.display = 'none';
          totalBox.parentElement.style.display = 'none';
          vacioMsg.style.display = 'none';
        } else {
          errorEnvio.classList.add('visible');
        }
      })
      .catch(function () {
        enviarBtn.disabled = false;
        enviarBtn.textContent = 'Enviar pedido →';
        errorEnvio.classList.add('visible');
      });
  });

  // Estado inicial al cargar cualquier página
  actualizarContador();
});

/* ==========================================================
   CHATBOT LA HOJITA
   Sigue la especificación V2: reutiliza el MISMO cuestionario
   de 8 preguntas y el MISMO motor de recomendación
   (calcularRecomendacion, definido arriba) que usa el Home —
   no crea un cuestionario ni una lógica de precios distinta.
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var hojitaBtn = document.getElementById('hojitaBtn');
  if (!hojitaBtn) return; // esta página no tiene el chatbot instalado

  var panel = document.getElementById('hojitaPanel');
  var cerrarBtn = document.getElementById('hojitaCerrar');
  var conversacion = document.getElementById('hojitaConversacion');

  // Mismas 8 preguntas y mismas opciones que el cuestionario del Home.
  var PREGUNTAS = [
    { id: 'q1', tipo: 'texto', texto: '¿Cuál es el nombre de tu negocio y a qué se dedica?' },
    { id: 'q2', tipo: 'checkbox', texto: '¿Qué quieres conseguir con tu presencia en internet?', opciones: ['Dar a conocer mi negocio', 'Conseguir nuevos clientes', 'Mostrar mis productos o servicios', 'Recibir pedidos', 'Permitir reservas', 'Vender por internet', 'Compartir información o contenido', 'Todavía no lo tengo claro'] },
    { id: 'q3', tipo: 'checkbox', texto: '¿Qué quieres que tus clientes puedan hacer desde tu sitio?', opciones: ['Ver mis productos o servicios', 'Consultar precios', 'Hacer pedidos por WhatsApp', 'Reservar una cita', 'Comprar y pagar en línea', 'Contactarme directamente', 'Leer información o artículos', 'Todavía no lo sé'] },
    { id: 'q4', tipo: 'radio', texto: '¿Cuántos productos o servicios necesitas mostrar aproximadamente?', opciones: ['1–5', '6–10', '11–20', 'Más de 20', 'No vendo productos; ofrezco servicios'] },
    { id: 'q5', tipo: 'checkbox', texto: '¿Ya tienes alguno de estos materiales?', opciones: ['Logo', 'Fotografías propias', 'Textos', 'Lista de productos/servicios y precios', 'Redes sociales', 'Ninguno todavía', 'Tengo algunos, pero necesito ayuda para prepararlos'] },
    { id: 'q6', tipo: 'checkbox', texto: '¿Necesitas alguna de estas funciones?', opciones: ['Reservas y calendario', 'Carrito de pedidos por WhatsApp', 'Pago online', 'Blog', 'Ninguna por ahora', 'No estoy seguro/a; necesito orientación'] },
    { id: 'q7', tipo: 'radio', texto: '¿Cuánto te gustaría invertir aproximadamente en tu proyecto digital?', opciones: ['Hasta ₡15.000', '₡15.000–₡30.000', '₡30.000–₡50.000', '₡50.000–₡75.000', 'Más de ₡75.000', 'No estoy seguro/a; necesito orientación'] },
    { id: 'q8', tipo: 'texto', texto: 'Cuéntanos brevemente qué tienes en mente.' }
  ];

  // Explicación breve y no técnica por servicio, para cuando La Hojita
  // presenta una recomendación (sección 12 y matriz de decisión del documento V2).
  var EXPLICACIONES = {
    'Simple Page': 'Una página sencilla que presenta tu negocio, tus servicios y tu contacto, sin pagar por funciones que no necesitas todavía.',
    'Sitio Web': 'Una presencia web más completa, con varias secciones, para organizar mejor la información de tu negocio.',
    'Logo': 'Una imagen profesional para tu marca, si todavía no tienes una.',
    'Catálogo (hasta 10 productos)': 'Muestra tus productos o servicios con foto, descripción y precio.',
    'Carrito WhatsApp Básico (hasta 10 productos)': 'Tus clientes arman su pedido en el sitio y te llega listo por WhatsApp.',
    'Carrito WhatsApp Ampliado (hasta 20 productos)': 'Lo mismo que el Carrito Básico, pero con espacio para más categorías y productos.',
    'Tienda PayPal': 'Para vender en línea y cobrar de forma segura con PayPal.',
    'Reservas y calendario': 'Tus clientes agendan una cita directamente desde tu sitio, sin llamadas.',
    'Blog (3 artículos iniciales)': 'Para compartir noticias, consejos y novedades de tu negocio.'
  };

  // Estado de la conversación
  var estado = { enCuestionario: false, pasoActual: 0, respuestas: {}, seleccionMultiple: [] };

  function scrollAbajo() {
    conversacion.scrollTop = conversacion.scrollHeight;
  }

  function agregarBurbujaBot(html) {
    var div = document.createElement('div');
    div.className = 'hojita-burbuja-bot';
    div.innerHTML = html;
    conversacion.appendChild(div);
    scrollAbajo();
  }

  function agregarBurbujaUsuario(texto) {
    var div = document.createElement('div');
    div.className = 'hojita-burbuja-usuario';
    div.textContent = texto;
    conversacion.appendChild(div);
    scrollAbajo();
  }

  function limpiarOpcionesActivas() {
    var existentes = conversacion.querySelectorAll('.hojita-opciones, .hojita-input-fila');
    existentes.forEach(function (el) { el.remove(); });
  }

  function mostrarOpciones(opciones, onSeleccion) {
    limpiarOpcionesActivas();
    var contenedor = document.createElement('div');
    contenedor.className = 'hojita-opciones';
    opciones.forEach(function (texto) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hojita-opcion-btn';
      btn.textContent = texto;
      btn.addEventListener('click', function () { onSeleccion(texto, btn); });
      contenedor.appendChild(btn);
    });
    conversacion.appendChild(contenedor);
    scrollAbajo();
  }

  function mostrarOpcionesMultiples(opciones, onConfirmar) {
    limpiarOpcionesActivas();
    var seleccionadas = [];
    var contenedor = document.createElement('div');
    contenedor.className = 'hojita-opciones';

    opciones.forEach(function (texto) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hojita-opcion-btn';
      btn.textContent = texto;
      btn.addEventListener('click', function () {
        var i = seleccionadas.indexOf(texto);
        if (i === -1) { seleccionadas.push(texto); btn.classList.add('seleccionada'); }
        else { seleccionadas.splice(i, 1); btn.classList.remove('seleccionada'); }
      });
      contenedor.appendChild(btn);
    });

    var btnConfirmar = document.createElement('button');
    btnConfirmar.type = 'button';
    btnConfirmar.className = 'hojita-opcion-btn';
    btnConfirmar.style.fontWeight = '800';
    btnConfirmar.textContent = 'Continuar →';
    btnConfirmar.addEventListener('click', function () {
      if (seleccionadas.length === 0) return;
      onConfirmar(seleccionadas);
    });
    contenedor.appendChild(btnConfirmar);

    conversacion.appendChild(contenedor);
    scrollAbajo();
  }

  function mostrarEntradaTexto(placeholder, onEnviar) {
    limpiarOpcionesActivas();
    var fila = document.createElement('div');
    fila.className = 'hojita-input-fila';
    fila.innerHTML = '<input type="text" placeholder="' + placeholder + '"><button type="button">Enviar</button>';
    var input = fila.querySelector('input');
    var boton = fila.querySelector('button');

    function enviar() {
      var valor = input.value.trim();
      if (!valor) return;
      onEnviar(valor);
    }

    boton.addEventListener('click', enviar);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); enviar(); } });

    conversacion.appendChild(fila);
    input.focus();
    scrollAbajo();
  }

  /* ---------- MENÚ INICIAL ---------- */
  function mostrarSaludoInicial() {
    estado.enCuestionario = false;
    actualizarDisponibilidadPreguntaLibre();
    conversacion.innerHTML = '';
    agregarBurbujaBot('¡Hola! Soy La Hojita 🌿 ¿En qué puedo ayudarte hoy?');
    mostrarOpciones([
      'Quiero crear una página web',
      'Quiero vender',
      'Quiero recibir pedidos',
      'Quiero reservas',
      'Quiero conocer los servicios',
      'No sé qué necesito'
    ], manejarOpcionInicial);
  }

  function manejarOpcionInicial(opcion) {
    agregarBurbujaUsuario(opcion);

    if (opcion === 'No sé qué necesito') {
      agregarBurbujaBot('No hay problema. Te voy a hacer 8 preguntas rápidas sobre tu negocio para poder recomendarte lo que realmente necesitas.');
      iniciarCuestionario();
      return;
    }

    if (opcion === 'Quiero crear una página web') {
      agregarBurbujaBot('Para eso tenemos el <strong>Sitio Web</strong> (' + formatoColones(50000) + ') si necesitas varias secciones, o la <strong>Simple Page</strong> (' + formatoColones(15000) + ') si quieres algo sencillo para empezar. ¿Quieres que te ayude a saber cuál te conviene, o prefieres ver el detalle en Servicios?');
    } else if (opcion === 'Quiero vender') {
      agregarBurbujaBot('Para vender puedes usar un <strong>Catálogo</strong> (' + formatoColones(20000) + ') para mostrar tus productos, un <strong>Carrito WhatsApp</strong> (desde ' + formatoColones(35000) + ') para recibir pedidos, o una <strong>Tienda PayPal</strong> (desde ' + formatoColones(75000) + ') si quieres cobrar en línea. ¿Te ayudo a saber cuál encaja mejor con tu negocio?');
    } else if (opcion === 'Quiero recibir pedidos') {
      agregarBurbujaBot('El <strong>Carrito WhatsApp</strong> es justo para eso: tus clientes arman su pedido en tu sitio y te llega listo por WhatsApp. Básico ' + formatoColones(35000) + ' (hasta 10 productos) o Ampliado ' + formatoColones(60000) + ' (hasta 20 productos).');
    } else if (opcion === 'Quiero reservas') {
      agregarBurbujaBot('<strong>Reservas y calendario</strong> (' + formatoColones(15000) + ') permite que tus clientes agenden una cita directamente desde tu sitio, sin llamadas ni mensajes de ida y vuelta.');
    } else if (opcion === 'Quiero conocer los servicios') {
      agregarBurbujaBot('Con gusto — ahí tienes el detalle completo de todo lo que ofrecemos, con precios.');
      mostrarAccionesFinales(null);
      return;
    }

    mostrarOpciones(['Hacer el diagnóstico completo', 'Ver otras opciones', 'Hablar sobre mi proyecto'], function (siguiente) {
      agregarBurbujaUsuario(siguiente);
      if (siguiente === 'Hacer el diagnóstico completo') {
        iniciarCuestionario();
      } else if (siguiente === 'Ver otras opciones') {
        mostrarSaludoInicial();
      } else {
        irAContacto();
      }
    });
  }

  /* ---------- CUESTIONARIO (mismo del Home) ---------- */
  function iniciarCuestionario() {
    estado.enCuestionario = true;
    actualizarDisponibilidadPreguntaLibre();
    estado.pasoActual = 0;
    estado.respuestas = {};
    mostrarPreguntaChat();
  }

  function mostrarPreguntaChat() {
    var pregunta = PREGUNTAS[estado.pasoActual];
    agregarBurbujaBot('<strong>Pregunta ' + (estado.pasoActual + 1) + ' de 8:</strong><br>' + pregunta.texto);

    if (pregunta.tipo === 'texto') {
      mostrarEntradaTexto('Escribe tu respuesta...', function (valor) {
        agregarBurbujaUsuario(valor);
        registrarRespuesta(pregunta.id, valor);
      });
    } else if (pregunta.tipo === 'radio') {
      mostrarOpciones(pregunta.opciones, function (valor) {
        agregarBurbujaUsuario(valor);
        registrarRespuesta(pregunta.id, valor);
      });
    } else if (pregunta.tipo === 'checkbox') {
      mostrarOpcionesMultiples(pregunta.opciones, function (valores) {
        agregarBurbujaUsuario(valores.join(', '));
        registrarRespuesta(pregunta.id, valores);

        // Sección 15 del documento: si el único material indicado es
        // "Ninguno todavía", dar la respuesta de tranquilidad específica.
        if (pregunta.id === 'q5' && valores.length === 1 && valores[0] === 'Ninguno todavía') {
          agregarBurbujaBot('No te preocupes. No necesitas tenerlo todo listo para empezar — podemos ayudarte a preparar el logo, las imágenes o los textos que hagan falta.');
        }
      });
    }
  }

  function registrarRespuesta(id, valor) {
    estado.respuestas[id] = valor;
    estado.pasoActual++;
    if (estado.pasoActual < PREGUNTAS.length) {
      setTimeout(mostrarPreguntaChat, 300);
    } else {
      setTimeout(mostrarRecomendacionChat, 300);
    }
  }

  /* ---------- RECOMENDACIÓN (mismo motor que el Home) ---------- */
  function mostrarRecomendacionChat() {
    estado.enCuestionario = false;
    actualizarDisponibilidadPreguntaLibre();
    limpiarOpcionesActivas();
    var r = calcularRecomendacion(estado.respuestas);

    agregarBurbujaBot('Con base en tus respuestas, esto es lo que te recomiendo:');

  // Lleva cada ítem recomendado a su sección exacta dentro de Servicios,
  // en vez de mandar siempre a la parte de arriba de la página.
  function anchorServicioPorNombre(nombre) {
    var mapa = {
      'Sitio Web': 'servicios.html#sitio-web',
      'Logo': 'servicios.html#logo',
      'Catálogo (hasta 10 productos)': 'servicios.html#catalogo',
      'Carrito WhatsApp Ampliado (hasta 20 productos)': 'servicios.html#carrito-whatsapp',
      'Carrito WhatsApp Básico (hasta 10 productos)': 'servicios.html#carrito-whatsapp',
      'Tienda PayPal': 'servicios.html#tienda-paypal',
      'Reservas y calendario': 'servicios.html#reservas',
      'Blog (3 artículos iniciales)': 'servicios.html#blog'
    };
    return mapa[nombre] || 'servicios.html';
  }

    r.ahora.forEach(function (item) {
      var precioTexto = (item.desde ? 'Desde ' : '') + formatoColones(item.precio);
      var explicacion = EXPLICACIONES[item.nombre] || '';
      var esSimplePage = item.nombre === 'Simple Page';

      var tarjeta = document.createElement('div');
      tarjeta.className = 'hojita-tarjeta-recomendacion';
      tarjeta.innerHTML =
        '<span class="nombre">' + item.nombre + '</span>' +
        '<span class="precio">' + precioTexto + '</span>' +
        '<span>' + explicacion + '</span>' +
        (item.notaExtra ? '<div style="margin-top:0.4rem; font-size:0.78rem; color:var(--color-text-light);">' + item.notaExtra + '</div>' : '') +
        (esSimplePage
          ? '<div style="margin-top:0.5rem;"><a href="/demos/melany-express/" target="_blank" rel="noopener" class="hojita-opcion-btn" style="display:inline-block; text-decoration:none;">Ver ejemplo: Servicio Express →</a></div>'
          : '<div style="margin-top:0.5rem;"><a href="' + anchorServicioPorNombre(item.nombre) + '" class="hojita-opcion-btn" style="display:inline-block; text-decoration:none;">Ver ' + item.nombre + ' →</a></div>');
      conversacion.appendChild(tarjeta);
    });
    scrollAbajo();

    var totalHtml = '<strong>Estimado total: ' + formatoColones(r.total) + '</strong>';
    if (r.budgetMax !== null) {
      totalHtml += '<br><span style="font-size:0.8rem; color:var(--color-text-light);">Ajustado al presupuesto que indicaste: ' + estado.respuestas.q7 + '</span>';
    }
    agregarBurbujaBot(totalHtml);

    if (r.despues.length > 0) {
      var listaDespues = r.despues.map(function (item) {
        return item.nombre + ' (' + (item.desde ? 'Desde ' : '') + formatoColones(item.precio) + ')';
      }).join(', ');
      agregarBurbujaBot('Para una próxima etapa, cuando quieras ampliar: ' + listaDespues + '.');
    }

    mostrarAccionesFinales(r);
  }

  function mostrarAccionesFinales(recomendacion) {
    mostrarOpciones(['Ver mi recomendación', 'Ver otras opciones', 'Hablar sobre mi proyecto'], function (accion) {
      agregarBurbujaUsuario(accion);
      if (accion === 'Ver mi recomendación') {
        if (recomendacion) {
          conversacion.scrollTop = 0;
          mostrarAccionesFinales(recomendacion);
        } else {
          window.location.href = 'servicios.html';
        }
      } else if (accion === 'Ver otras opciones') {
        estado.enCuestionario = false;
        mostrarSaludoInicial();
      } else {
        irAContacto();
      }
    });
  }

  function irAContacto() {
    agregarBurbujaBot('Con gusto. Te dejo el enlace directo para hablar con nosotros.');
    limpiarOpcionesActivas();
    var contenedor = document.createElement('div');
    contenedor.className = 'hojita-opciones';
    contenedor.innerHTML = '<a href="contacto.html" class="hojita-opcion-btn" style="text-align:center; text-decoration:none;">Ir a Contacto →</a>';
    conversacion.appendChild(contenedor);
    scrollAbajo();
  }

  /* ==========================================================
     PREGUNTAS LIBRES SOBRE EL SITIO
     Solo responde con información real y ya publicada en el
     sitio (precios, servicios, proceso, contacto). Si la
     pregunta no coincide con nada configurado, no inventa una
     respuesta — ofrece contacto humano (sección 17-18 del
     documento V2).
     ========================================================== */
  function normalizarTexto(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quita acentos
  }

  var BASE_PREGUNTAS = [
    {
      claves: ['precio', 'precios', 'cuesta', 'cuanto vale', 'tarifa', 'costo'],
      respuesta: 'Todos nuestros precios están en colones, sin sorpresas. Por ejemplo: Sitio Web ' + formatoColones(50000) + ', Simple Page ' + formatoColones(15000) + ', Catálogo ' + formatoColones(20000) + ', Carrito WhatsApp desde ' + formatoColones(35000) + ', Tienda PayPal desde ' + formatoColones(75000) + ', Reservas ' + formatoColones(15000) + ', Blog ' + formatoColones(30000) + ' y Logo ' + formatoColones(10000) + '. La lista completa está en Precios y Productos.',
      destino: { url: 'precios-y-productos.html', texto: 'Ver lista de precios →' }
    },
    {
      claves: ['servicio', 'servicios', 'que ofrecen', 'que hacen', 'que tienen'],
      respuesta: 'Ofrecemos Sitio Web, Simple Page, Catálogo, Carrito WhatsApp, Tienda PayPal, Reservas y calendario, Blog y Logo. Puedes ver el detalle de cada uno en Servicios.',
      destino: { url: 'servicios.html', texto: 'Ver todos los servicios →' }
    },
    {
      claves: ['carrito', 'pedido', 'pedidos'],
      respuesta: 'El Carrito WhatsApp permite que tus clientes armen su pedido en tu sitio y te llegue listo por WhatsApp. Básico ' + formatoColones(35000) + ' (hasta 10 productos) o Ampliado ' + formatoColones(60000) + ' (hasta 20 productos).',
      destino: { url: 'servicios.html#carrito-whatsapp', texto: 'Ver Carrito WhatsApp →' }
    },
    {
      claves: ['tienda', 'paypal', 'pago en linea', 'vender en linea', 'cobrar en linea'],
      respuesta: 'La Tienda PayPal te permite vender en línea y cobrar de forma segura. El precio es desde ' + formatoColones(75000) + ', según la cantidad de productos y funciones que necesites.',
      destino: { url: 'servicios.html#tienda-paypal', texto: 'Ver Tienda PayPal →' }
    },
    {
      claves: ['reserva', 'reservas', 'cita', 'citas', 'agendar', 'calendario'],
      respuesta: 'Reservas y calendario (' + formatoColones(15000) + ') conecta tu sitio a un Google Calendar real: cuando alguien agenda, ese horario se bloquea automáticamente, sin que se dupliquen citas.',
      destino: { url: 'servicios.html#reservas', texto: 'Ver Reservas y calendario →' }
    },
    {
      claves: ['blog', 'articulo', 'articulos', 'noticias'],
      respuesta: 'El Blog (' + formatoColones(30000) + ') incluye 3 artículos iniciales, para compartir noticias, consejos y novedades de tu negocio.',
      destino: { url: 'servicios.html#blog', texto: 'Ver Blog →' }
    },
    {
      claves: ['logo', 'marca', 'identidad visual'],
      respuesta: 'Podemos hacerte un Logo profesional para tu marca por ' + formatoColones(10000) + '.',
      destino: { url: 'servicios.html#logo', texto: 'Ver Logo →' }
    },
    {
      claves: ['catalogo', 'catálogo', 'productos'],
      respuesta: 'El Catálogo (' + formatoColones(20000) + ') muestra hasta 10 de tus productos o servicios, con foto, descripción y precio.',
      destino: { url: 'servicios.html#catalogo', texto: 'Ver Catálogo →' }
    },
    {
      claves: ['sitio web', 'pagina web', 'simple page', 'pagina simple', 'landing page'],
      respuesta: 'Tenemos 3 opciones de página: Landing Page (' + formatoColones(20000) + ') para algo puntual, Simple Page (' + formatoColones(15000) + ') para presentar tu negocio de forma sencilla, y el Sitio Web completo (' + formatoColones(50000) + ') con Inicio, Servicios y Contacto, más lo que tu proyecto necesite.',
      destino: { url: 'servicios.html#sitio-web', texto: 'Ver Sitio Web →' }
    },
    {
      claves: ['como funciona', 'proceso', 'pasos', 'cuanto tarda', 'cuanto demora', 'tiempo de entrega'],
      respuesta: 'Trabajamos en 4 pasos: conocemos tu negocio, diseñamos la solución, la construimos paso a paso mostrándote avances, y probamos y publicamos. Puedes ver el detalle en Cómo Funciona.',
      destino: { url: 'como-funciona.html', texto: 'Ver Cómo Funciona →' }
    },
    {
      claves: ['que recibo', 'manual', 'manuales', 'kit', 'administrar mi sitio'],
      respuesta: 'Con tu sitio recibes manuales y guías para administrarlo tú mismo, según las funciones que contrates — puedes verlo en Qué Recibirá. Si prefieres, también podemos encargarnos nosotros de la gestión.',
      destino: { url: 'que-recibira.html', texto: 'Ver Qué Recibirá →' }
    },
    {
      claves: ['cambio', 'cambios', 'mantenimiento', 'arreglar', 'actualizar', 'por hora'],
      respuesta: 'No cobramos por hora. Los cambios puntuales se cobran por elemento, y si algo deja de funcionar bien preferimos reconstruirlo completo en vez de parchearlo — siempre te avisamos el costo antes de empezar. Los errores nuestros se corrigen sin costo.',
      destino: { url: 'como-funciona.html', texto: 'Ver política de cambios →' }
    },
    {
      claves: ['dominio', 'hosting', 'alojamiento'],
      respuesta: 'El dominio (extensión .site) y el hosting están incluidos sin costo el primer año. Después, el Alojamiento + mantenimiento técnico básico cuesta ' + formatoColones(10000) + ' por mes (' + formatoColones(108000) + ' al año, con descuento) — esto es distinto del Mantenimiento Mensual de ' + formatoColones(50000) + '. Si prefieres otra extensión de dominio, o un correo personalizado con Google Workspace, cada uno cuesta ' + formatoColones(15000) + ' por mes por cuenta.',
      destino: { url: 'precios-y-productos.html', texto: 'Ver detalles →' }
    },
    {
      claves: ['web marketing', 'seo', 'posicionamiento', 'google maps', 'google business', 'anuncio', 'anuncios', 'publicidad', 'google ads', 'facebook ads', 'pauta'],
      respuesta: 'En Web Marketing tenemos SEO básico + Ficha de Google Maps (' + formatoColones(20000) + '), estadísticas del sitio (' + formatoColones(10000) + '), anuncios en Google Ads o Facebook Ads (' + formatoColones(20000) + ' cada uno, más el presupuesto de la pauta que se paga aparte), y creación de página de Facebook o Instagram con una publicación inicial (' + formatoColones(20000) + ' cada una).',
      destino: { url: 'servicios.html#web-marketing', texto: 'Ver Web Marketing →' }
    },
    {
      claves: ['redes sociales', 'facebook', 'instagram'],
      respuesta: 'Conectar tus redes sociales existentes a tu sitio ya está incluido, sin costo. Crear una página nueva, manejar contenido o hacer anuncios pagados es parte de Web Marketing.',
      destino: { url: 'servicios.html#web-marketing', texto: 'Ver Web Marketing →' }
    },
    {
      claves: ['mantenimiento mensual', 'plan mensual', 'soporte mensual'],
      respuesta: 'El Mantenimiento Mensual (' + formatoColones(50000) + ' por mes) incluye SEO básico y ficha de Google Maps, estadísticas del sitio, hasta 2 cambios básicos al mes, revisión de que todo funcione bien, y atención prioritaria.',
      destino: { url: 'servicios.html#mantenimiento-mensual', texto: 'Ver Mantenimiento Mensual →' }
    },
    {
      claves: ['sinpe', 'sinpe movil', 'como se paga', 'como pagan', 'diferencia entre paypal'],
      respuesta: 'Depende del servicio: en el Carrito WhatsApp, el pago se coordina directamente por WhatsApp, normalmente con SINPE Móvil. En la Tienda PayPal, el pago se procesa dentro del sitio, con tarjeta y siempre en dólares.',
      destino: { url: 'como-funciona.html#pagos', texto: 'Ver cómo funcionan los pagos →' }
    },
    {
      claves: ['chatbot', 'chatbots', 'asistente virtual', 'bot'],
      respuesta: 'Cada chatbot se configura a la medida de tu negocio: puede responder precios, horarios, ubicación, cómo pedir o agendar, y lo que tú le indiques. También se le pueden poner límites — por ejemplo, un chatbot de veterinaria puede tener prohibido dar diagnósticos.',
      destino: { url: 'como-funciona.html', texto: 'Ver cómo funcionan los chatbots →' }
    },
    {
      claves: ['cuenta', 'cuentas', 'contraseña', 'contrasenas', 'clave', 'claves', 'acceso'],
      respuesta: 'Si necesitas una cuenta nueva (como PayPal o Google Calendar), la creamos para tu negocio y te entregamos las claves. Si ya tienes una cuenta, solo nos das acceso como administrador — nunca necesitamos tu contraseña.',
      destino: { url: 'como-funciona.html', texto: 'Ver más sobre cuentas y accesos →' }
    },
    {
      claves: ['ejemplo', 'ejemplos', 'demo', 'demos', 'como queda', 'como se ve'],
      respuesta: 'Tenemos ejemplos de distintos tipos de negocio en la sección Ejemplos: ferretería, veterinaria, servicio express, panadería, tienda de ropa y bufete de abogados.',
      destino: { url: 'ejemplos.html', texto: 'Ver Ejemplos →' }
    },
    {
      claves: ['contacto', 'whatsapp', 'correo', 'email', 'telefono', 'hablar con'],
      respuesta: 'Puedes escribirnos por WhatsApp al +506 8707-1092, al correo 506webartesanal@gmail.com, o desde la página de Contacto.',
      destino: { url: 'contacto.html', texto: 'Ir a Contacto →' }
    }
  ];

  function mostrarBotonDestino(destino) {
    var contenedor = document.createElement('div');
    contenedor.className = 'hojita-opciones';
    contenedor.innerHTML = '<a href="' + destino.url + '" class="hojita-opcion-btn" style="text-align:center; text-decoration:none;">' + destino.texto + '</a>';
    conversacion.appendChild(contenedor);
    scrollAbajo();
  }

  function responderPreguntaLibre(pregunta) {
    var normalizada = normalizarTexto(pregunta);
    var encontrada = BASE_PREGUNTAS.find(function (item) {
      return item.claves.some(function (clave) { return normalizada.indexOf(clave) !== -1; });
    });

    if (encontrada) {
      agregarBurbujaBot(encontrada.respuesta);
      if (encontrada.destino) mostrarBotonDestino(encontrada.destino);
    } else {
      agregarBurbujaBot('Esa información específica no la tengo configurada todavía. Prefiero conectarte directamente con nosotros para darte una respuesta exacta.');
      irAContacto();
    }
  }

  var inputPreguntaLibre = document.getElementById('hojitaPreguntaLibre');
  var btnEnviarPreguntaLibre = document.getElementById('hojitaEnviarPregunta');

  function enviarPreguntaLibre() {
    var valor = inputPreguntaLibre.value.trim();
    if (!valor) return;
    agregarBurbujaUsuario(valor);
    inputPreguntaLibre.value = '';
    responderPreguntaLibre(valor);
  }

  btnEnviarPreguntaLibre.addEventListener('click', enviarPreguntaLibre);
  inputPreguntaLibre.addEventListener('keydown', function (evento) {
    if (evento.key === 'Enter') { evento.preventDefault(); enviarPreguntaLibre(); }
  });

  // Durante el cuestionario de diagnóstico se desactiva esta entrada libre,
  // para no mezclarla con las respuestas estructuradas de las 8 preguntas.
  function actualizarDisponibilidadPreguntaLibre() {
    var deshabilitar = estado.enCuestionario;
    inputPreguntaLibre.disabled = deshabilitar;
    btnEnviarPreguntaLibre.disabled = deshabilitar;
    inputPreguntaLibre.placeholder = deshabilitar
      ? 'Responda las preguntas de arriba...'
      : 'Escriba su pregunta sobre el sitio...';
  }

  /* ---------- ABRIR / CERRAR ---------- */
  var yaAbrioAlgunaVez = false;
  function abrirHojita() {
    panel.hidden = false;
    if (!yaAbrioAlgunaVez) {
      mostrarSaludoInicial();
      yaAbrioAlgunaVez = true;
    }
  }
  function cerrarHojita() {
    panel.hidden = true;
  }

  hojitaBtn.addEventListener('click', abrirHojita);
  cerrarBtn.addEventListener('click', cerrarHojita);
});
