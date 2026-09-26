/* ============================================
   VETERINARIA DR LEE — reservas.js
   Calendario y horarios funcionan de verdad en el
   navegador (selección real, estados reales), pero esta
   demo NO está conectada a un Google Calendar real todavía
   — así que la confirmación final se marca honestamente
   como simulación, tal como exige el documento (no afirmar
   una reserva registrada si el sistema no la registró).
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var calendarioGrid = document.getElementById('calendarioGrid');
  if (!calendarioGrid) return;

  var mesActualTexto = document.getElementById('mesActualTexto');
  var horariosGrid = document.getElementById('horariosGrid');
  var textoHorarios = document.getElementById('textoHorarios');
  var tarjetaFormulario = document.getElementById('tarjetaFormulario');

  var NOMBRES_MES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var NOMBRES_DIA = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

  var hoy = new Date();
  var mesVista = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  var fechaSeleccionada = null;
  var horaSeleccionada = null;

  // Fechas de ejemplo ya "llenas" en esta demo, para mostrar el estado
  // No disponible incluso en un día que de otro modo sería hábil.
  function claveFecha(d) {
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  var FECHAS_LLENAS_DEMO = {};
  (function marcarEjemplos() {
    var a = new Date(hoy); a.setDate(a.getDate() + 3);
    var b = new Date(hoy); b.setDate(b.getDate() + 10);
    FECHAS_LLENAS_DEMO[claveFecha(a)] = true;
    FECHAS_LLENAS_DEMO[claveFecha(b)] = true;
  })();

  function esFechaDisponible(d) {
    if (d < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) return false; // fechas pasadas
    if (d.getDay() === 0) return false; // domingo cerrado
    if (FECHAS_LLENAS_DEMO[claveFecha(d)]) return false; // ejemplo de día lleno
    return true;
  }

  function renderCalendario() {
    mesActualTexto.textContent = NOMBRES_MES[mesVista.getMonth()] + ' ' + mesVista.getFullYear();
    calendarioGrid.innerHTML = '';

    NOMBRES_DIA.forEach(function (n) {
      var el = document.createElement('div');
      el.className = 'dia-nombre';
      el.textContent = n;
      calendarioGrid.appendChild(el);
    });

    var primerDiaSemana = new Date(mesVista.getFullYear(), mesVista.getMonth(), 1).getDay();
    var diasEnMes = new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 0).getDate();

    for (var i = 0; i < primerDiaSemana; i++) {
      var vacio = document.createElement('div');
      vacio.className = 'calendario-dia-vet vacio';
      calendarioGrid.appendChild(vacio);
    }

    for (var dia = 1; dia <= diasEnMes; dia++) {
      var fecha = new Date(mesVista.getFullYear(), mesVista.getMonth(), dia);
      var celda = document.createElement('div');
      celda.textContent = dia;

      var disponible = esFechaDisponible(fecha);
      var esSeleccionada = fechaSeleccionada && claveFecha(fecha) === claveFecha(fechaSeleccionada);

      celda.className = 'calendario-dia-vet ' + (esSeleccionada ? 'seleccionado' : (disponible ? 'disponible' : 'no-disponible'));

      if (disponible) {
        celda.addEventListener('click', function (fechaCapturada) {
          return function () {
            fechaSeleccionada = fechaCapturada;
            horaSeleccionada = null;
            tarjetaFormulario.style.display = 'none';
            renderCalendario();
            renderHorarios();
          };
        }(fecha));
      }

      calendarioGrid.appendChild(celda);
    }
  }

  function generarHorariosBase() {
    var horas = [];
    var bloques = [[8, 0, 11, 30], [13, 0, 16, 30]]; // 8:00–11:30 y 1:00–4:30 (hora de almuerzo cerrada)
    bloques.forEach(function (b) {
      var h = b[0], m = b[1];
      while (h < b[2] || (h === b[2] && m <= b[3])) {
        horas.push({ h: h, m: m });
        m += 30;
        if (m >= 60) { m = 0; h++; }
      }
    });
    return horas;
  }

  function formatoHora(h, m) {
    var periodo = h < 12 ? 'a. m.' : 'p. m.';
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + (m === 0 ? '00' : m) + ' ' + periodo;
  }

  // Horarios ya "ocupados" de ejemplo, para mostrar el estado deshabilitado.
  var HORARIOS_OCUPADOS_DEMO = ['10:00', '14:30'];

  function renderHorarios() {
    horariosGrid.innerHTML = '';

    if (!fechaSeleccionada) {
      textoHorarios.textContent = 'Elegí primero una fecha disponible.';
      return;
    }

    textoHorarios.textContent = 'Horarios disponibles para el ' + fechaSeleccionada.getDate() + ' de ' + NOMBRES_MES[fechaSeleccionada.getMonth()] + '.';

    generarHorariosBase().forEach(function (hr) {
      var clave24 = (hr.h < 10 ? '0' : '') + hr.h + ':' + (hr.m === 0 ? '00' : hr.m);
      var ocupado = HORARIOS_OCUPADOS_DEMO.indexOf(clave24) !== -1;
      var texto = formatoHora(hr.h, hr.m);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'horario-btn-vet' + (ocupado ? ' ocupado' : '') + (horaSeleccionada === texto ? ' seleccionado' : '');
      btn.textContent = texto;

      if (ocupado) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', function () {
          horaSeleccionada = texto;
          renderHorarios();
          tarjetaFormulario.style.display = 'block';
          tarjetaFormulario.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }

      horariosGrid.appendChild(btn);
    });
  }

  document.getElementById('mesAnterior').addEventListener('click', function () {
    mesVista = new Date(mesVista.getFullYear(), mesVista.getMonth() - 1, 1);
    renderCalendario();
  });
  document.getElementById('mesSiguiente').addEventListener('click', function () {
    mesVista = new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 1);
    renderCalendario();
  });

  // ---------- Formulario y confirmación ----------
  function correoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  }

  document.getElementById('btnConfirmarCita').addEventListener('click', function () {
    var nombre = document.getElementById('nombrePropietario').value.trim();
    var mascota = document.getElementById('nombreMascota').value.trim();
    var tipo = document.querySelector('input[name="tipoMascota"]:checked');
    var motivo = document.getElementById('motivoCita').value;
    var telefono = document.getElementById('telefonoReserva').value.trim();
    var correo = document.getElementById('correoReserva').value.trim();
    var errorEl = document.getElementById('errorReserva');

    if (!nombre || !mascota || !tipo || !motivo || !telefono || !correoValido(correo)) {
      errorEl.classList.add('visible');
      return;
    }
    errorEl.classList.remove('visible');

    var fechaTexto = fechaSeleccionada.getDate() + ' de ' + NOMBRES_MES[fechaSeleccionada.getMonth()] + ' de ' + fechaSeleccionada.getFullYear();

    document.getElementById('formReserva').style.display = 'none';
    var confirmacion = document.getElementById('confirmacionReserva');
    confirmacion.style.display = 'block';
    confirmacion.innerHTML =
      '<div class="check">✓</div>' +
      '<h3>¡Solicitud lista, ' + nombre.split(' ')[0] + '!</h3>' +
      '<p style="color:var(--color-text-light);">' + mascota + ' — ' + tipo.value + '<br>' + motivo + '<br>' + fechaTexto + ' a las ' + horaSeleccionada + '</p>' +
      '<p style="font-size:0.8rem; color:var(--color-text-light); max-width:360px; margin:0.8rem auto 0 auto;">Esta es una demostración: la cita todavía no quedó registrada en un calendario real. Cuando se conecte Google Calendar, este mismo paso reservará el horario de verdad y bloqueará ese espacio para otras personas.</p>';
  });

  renderCalendario();
  renderHorarios();
});
