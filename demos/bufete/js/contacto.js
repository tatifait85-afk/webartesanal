document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('btnEnviarContactoJmc');
  if (!btn) return;

  function correoValido(correo) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo); }

  btn.addEventListener('click', function () {
    var nombre = document.getElementById('nombreContactoJmc').value.trim();
    var correo = document.getElementById('correoContactoJmc').value.trim();
    var telefono = document.getElementById('telefonoContactoJmc').value.trim();
    var area = document.getElementById('areaContactoJmc').value;
    var mensaje = document.getElementById('mensajeContactoJmc').value.trim();
    var privacidad = document.getElementById('privacidadContactoJmc').checked;
    var errorEl = document.getElementById('errorContactoJmc');

    if (!nombre || !correoValido(correo) || !telefono || !area || !mensaje || !privacidad) {
      errorEl.classList.add('visible');
      return;
    }
    errorEl.classList.remove('visible');

    var cuerpo = 'Nombre: ' + nombre + '\nTeléfono: ' + telefono + '\nÁrea: ' + area + '\n\nMensaje:\n' + mensaje;
    var asunto = 'Consulta desde el sitio — ' + area;
    window.location.href = 'mailto:info@bufetejmc.com?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo) + '&cc=' + encodeURIComponent(correo);
  });
});
