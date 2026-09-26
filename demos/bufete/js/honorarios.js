/* ============================================
   BUFETE JMC — honorarios.js
   Demostración funcional de la calculadora. El monto que
   se muestra es SIMULADO para ilustrar la experiencia —
   no se copia ninguna tabla real del Colegio de Abogados,
   tal como exige el documento. Cuando exista la integración
   oficial (API del Colegio), este mismo flujo consumiría
   ese servicio en lugar de generar un monto de ejemplo.
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var tipoSelect = document.getElementById('tipoServicioHon');
  var procSelect = document.getElementById('procedimientoHon');
  var montoInput = document.getElementById('montoHon');
  var btnCalcular = document.getElementById('btnCalcularHon');
  var resultadoTexto = document.getElementById('resultadoTextoHon');
  var panelResultado = document.getElementById('panelResultadoHon');

  var PROCEDIMIENTOS = {
    laboral: ['Despido y liquidación', 'Reclamo laboral', 'Asesoría contractual', 'Conciliación laboral'],
    familia: ['Divorcio', 'Pensión alimentaria', 'Guarda y crianza', 'Régimen de visitas'],
    penal: ['Defensa penal', 'Medidas cautelares', 'Asesoría en investigación', 'Acompañamiento en audiencia']
  };

  // Bases puramente ilustrativas para esta demostración — NO son
  // tarifas del Colegio de Abogados ni deben tratarse como tales.
  var BASE_DEMO = { laboral: 150000, familia: 200000, penal: 350000 };

  function formatoColones(numero) {
    var texto = String(Math.round(numero));
    return '₡' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  tipoSelect.addEventListener('change', function () {
    var tipo = tipoSelect.value;
    procSelect.innerHTML = '';

    if (!tipo) {
      procSelect.disabled = true;
      procSelect.innerHTML = '<option value="">Seleccione primero un área</option>';
      return;
    }

    procSelect.disabled = false;
    var opcionVacia = document.createElement('option');
    opcionVacia.value = '';
    opcionVacia.textContent = 'Seleccione un procedimiento';
    procSelect.appendChild(opcionVacia);

    PROCEDIMIENTOS[tipo].forEach(function (p) {
      var op = document.createElement('option');
      op.value = p;
      op.textContent = p;
      procSelect.appendChild(op);
    });
  });

  btnCalcular.addEventListener('click', function () {
    var tipo = tipoSelect.value;
    var procedimiento = procSelect.value;

    if (!tipo || !procedimiento) {
      resultadoTexto.innerHTML = '<span style="color:#b5482a; font-size:0.85rem;">Seleccione el tipo de servicio y el procedimiento para continuar.</span>';
      return;
    }

    var monto = parseFloat(montoInput.value) || 0;
    var base = BASE_DEMO[tipo];
    var variable = monto * 0.05;
    var minimo = base + variable * 0.8;
    var maximo = base + variable * 1.4;

    resultadoTexto.innerHTML =
      '<span style="font-size:0.68rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; color:var(--color-text-light);">Estimado de demostración</span>' +
      '<div class="monto">' + formatoColones(minimo) + ' – ' + formatoColones(maximo) + '</div>' +
      '<span style="font-size:0.8rem; color:var(--color-text-light);">' + procedimiento + '</span>';
  });
});
