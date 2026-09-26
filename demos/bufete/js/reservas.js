/* ============================================
   BUFETE JMC — reservas.js
   Calendario y horarios funcionan de verdad en el
   navegador, pero esta demo no está conectada a Google
   Calendar todavía — la confirmación lo indica honestamente,
   tal como exige el documento maestro.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var calendarioGrid = document.getElementById('calendarioGridJmc');
  if (!calendarioGrid) return;

  var mesActualTexto = document.getElementById('mesActualTextoJmc');
  var horariosGrid = document.getElementById('horariosGridJmc');
  var textoHorarios = document.getElementById('textoHorariosJmc');
  var formularioReserva = document.getElementById('formularioReservaJmc');
  var areasContenedor = document.getElementById('areasReservaJmc');

  var NOMBRES_MES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var NOMBRES_DIA = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

  var PROFESIONALES = {
    laboral: 'Lic. Ramiro Cárdenas',
    familia: 'Licda. Vanessa Washington',
    penal: 'Licda. Marlene Hidalgo'
  };

  var hoy = new Date();
  var mesVista = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  var areaSeleccionada = null;
  var fechaSeleccionada = null;
  var horaSeleccionada = null;

  function claveFecha(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

  var FECHAS_LLENAS_DEMO = {};
  (function marcarEjemplos() {
    var a = new Date(hoy); a.setDate(a.getDate() + 4);
    var b = new Date(hoy); b.setDate(b.getDate() + 11);
    FECHAS_LLENAS_DEMO[claveFecha(a)] = true;
    FECHAS_LLENAS_DEMO[claveFecha(b)] = true;
  })();

  function esFechaDisponible(d) {
    if (d < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) return false;
    if (d.getDay() === 0) return false; // domingo cerrado
    if (FECHAS_LLENAS_DEMO[claveFecha(d)]) return false;
    return true;
  }

  areasContenedor.querySelectorAll('.area-reserva-btn-jmc').forEach(function (btn) {
    btn.addEventListener('click', function () {
      areaSeleccionada = btn.dataset.area;
      areasContenedor.querySelectorAll('.area-reserva-btn-jmc').forEach(function (b) { b.classList.remove('activa'); });
      btn.classList.add('activa');
      horaSeleccionada = null;
      formularioReserva.style.display = 'none';
      renderHorarios();
    });
  });

  function renderCalendario() {
    // Ajuste: semana inicia en lunes
    mesActualTexto.textContent = NOMBRES_MES[mesVista.getMonth()] + ' ' + mesVista.getFullYear();
    calendarioGrid.innerHTML = '';

    NOMBRES_DIA.forEach(function (n) {
      var el = document.createElement('div');
      el.className = 'dia-nombre';
      el.textContent = n;
      calendarioGrid.appendChild(el);
    });

    var primerDiaSemana = (new Date(mesVista.getFullYear(), mesVista.getMonth(), 1).getDay() + 6) % 7; // 0=lunes
    var diasEnMes = new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 0).getDate();

    for (var i = 0; i < primerDiaSemana; i++) {
      var vacio = document.createElement('div');
      vacio.className = 'calendario-dia-jmc vacio';
      calendarioGrid.appendChild(vacio);
    }

    for (var dia = 1; dia <= diasEnMes; dia++) {
      var fecha = new Date(mesVista.getFullYear(), mesVista.getMonth(), dia);
      var celda = document.createElement('div');
      celda.textContent = dia;

      var disponible = esFechaDisponible(fecha);
      var esSeleccionada = fechaSeleccionada && claveFecha(fecha) === claveFecha(fechaSeleccionada);
      celda.className = 'calendario-dia-jmc ' + (esSeleccionada ? 'seleccionado' : (disponible ? 'disponible' : 'no-disponible'));

      if (disponible) {
        celda.addEventListener('click', function (fechaCapturada) {
          return function () {
            fechaSeleccionada = fechaCapturada;
            horaSeleccionada = null;
            formularioReserva.style.display = 'none';
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
    var bloques = [[8, 0, 11, 30], [13, 0, 17, 0]];
    bloques.forEach(function (b) {
      var h = b[0], m = b[1];
      while (h < b[2] || (h === b[2] && m <= b[3])) {
        horas.push({ h: h, m: m });
        m += 60;
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

  var HORARIOS_OCUPADOS_DEMO = ['10:00', '15:00'];

  function renderHorarios() {
    horariosGrid.innerHTML = '';

    if (!areaSeleccionada) {
      textoHorarios.textContent = 'Elija primero un área y una fecha disponible.';
      return;
    }
    if (!fechaSeleccionada) {
      textoHorarios.textContent = 'Elija una fecha disponible en el calendario.';
      return;
    }

    textoHorarios.textContent = 'Horarios disponibles para el ' + fechaSeleccionada.getDate() + ' de ' + NOMBRES_MES[fechaSeleccionada.getMonth()] + '.';

    generarHorariosBase().forEach(function (hr) {
      var clave24 = (hr.h < 10 ? '0' : '') + hr.h + ':' + (hr.m === 0 ? '00' : hr.m);
      var ocupado = HORARIOS_OCUPADOS_DEMO.indexOf(clave24) !== -1;
      var texto = formatoHora(hr.h, hr.m);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'horario-btn-jmc' + (ocupado ? ' ocupado' : '') + (horaSeleccionada === texto ? ' seleccionado' : '');
      btn.textContent = texto;

      if (ocupado) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', function () {
          horaSeleccionada = texto;
          renderHorarios();
          formularioReserva.style.display = 'block';
          formularioReserva.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
      horariosGrid.appendChild(btn);
    });
  }

  document.getElementById('mesAnteriorJmc').addEventListener('click', function () {
    mesVista = new Date(mesVista.getFullYear(), mesVista.getMonth() - 1, 1);
    renderCalendario();
  });
  document.getElementById('mesSiguienteJmc').addEventListener('click', function () {
    mesVista = new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 1);
    renderCalendario();
  });

  function correoValido(correo) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo); }

  document.getElementById('btnConfirmarJmc').addEventListener('click', function () {
    var nombre = document.getElementById('nombreJmc').value.trim();
    var telefono = document.getElementById('telefonoJmc').value.trim();
    var correo = document.getElementById('correoJmc').value.trim();
    var comentarios = document.getElementById('comentariosJmc').value.trim();
    var privacidad = document.getElementById('privacidadJmc').checked;
    var modalidad = document.querySelector('input[name="modalidadJmc"]:checked').value;
    var errorEl = document.getElementById('errorReservaJmc');

    if (!nombre || !telefono || !correoValido(correo) || !privacidad) {
      errorEl.classList.add('visible');
      return;
    }
    errorEl.classList.remove('visible');

    var fechaTexto = fechaSeleccionada.getDate() + ' de ' + NOMBRES_MES[fechaSeleccionada.getMonth()] + ' de ' + fechaSeleccionada.getFullYear();

    document.getElementById('formJmc').style.display = 'none';
    var confirmacion = document.getElementById('confirmacionJmc');
    confirmacion.style.display = 'block';
    confirmacion.innerHTML =
      '<div class="check">✓</div>' +
      '<h3>Gracias, ' + nombre.split(' ')[0] + '.</h3>' +
      '<p style="color:var(--color-text-light);">' + PROFESIONALES[areaSeleccionada] + ' — ' + modalidad + '<br>' + fechaTexto + ' a las ' + horaSeleccionada + '</p>' +
      '<p style="font-size:0.8rem; color:var(--color-text-light); max-width:400px; margin:0.8rem auto 0 auto;">Esta es una demostración: la cita todavía no quedó registrada en un calendario real. Cuando se conecte Google Calendar, este mismo paso reservará el horario de verdad y evitará reservas duplicadas.</p>';
  });

  renderCalendario();
  renderHorarios();
});
