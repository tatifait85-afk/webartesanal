document.addEventListener('DOMContentLoaded', function () {
  var contenedor = document.getElementById('fichaContenido');
  var noEncontrado = document.getElementById('fichaNoEncontrado');
  if (!contenedor) return;

  var parametros = new URLSearchParams(window.location.search);
  var id = parametros.get('id');
  var abogado = id ? buscarAbogadoPorId(id) : null;

  if (!abogado) {
    contenedor.style.display = 'none';
    noEncontrado.style.display = 'block';
    return;
  }

  document.getElementById('tituloPagina').textContent = abogado.nombre + ' — Bufete JMC y Asociados';

  var listaServicios = abogado.servicios.map(function (s) { return '<li>' + s + '</li>'; }).join('');

  contenedor.innerHTML =
    '<button type="button" onclick="history.back()" class="boton-secundario-jmc" style="margin-bottom:1rem; border:none; cursor:pointer;">← Atrás</button>' +
    '<div class="migas-jmc"><a href="index.html">Inicio</a> / <a href="nuestro-equipo.html">Nuestro Equipo</a> / ' + abogado.nombre + '</div>' +
    '<div class="ficha-abogado-jmc">' +
      '<div>' +
        '<img src="' + abogado.imagen + '" alt="' + abogado.nombre + '">' +
      '</div>' +
      '<div>' +
        '<span class="area-kicker">' + abogado.area + '</span>' +
        '<h1>' + abogado.nombre + '</h1>' +
        '<p>' + abogado.intro + '</p>' +
        '<p>' + abogado.bio + '</p>' +

        '<div class="datos-profesionales">' +
          '<div><strong>Formación:</strong> ' + abogado.formacion + '</div>' +
          '<div><strong>Experiencia:</strong> ' + abogado.experiencia + '</div>' +
          '<div><strong>Colegiatura:</strong> ' + abogado.colegiado + '</div>' +
        '</div>' +

        '<span class="ficha-pan-etiqueta" style="font-size:0.75rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; color:var(--color-navy); display:block; margin-bottom:0.5rem;">Áreas de trabajo</span>' +
        '<ul class="lista-servicio-jmc">' + listaServicios + '</ul>' +

        '<p class="quote-servicio-jmc">"' + abogado.frase + '"</p>' +

        '<a href="agendar-cita.html" class="boton-primario-jmc">📅 Agendar Cita</a>' +
      '</div>' +
    '</div>';
});
