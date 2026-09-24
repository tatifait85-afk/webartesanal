document.addEventListener('DOMContentLoaded', function () {
  var contenedor = document.getElementById('gridEquipo');
  if (!contenedor) return;

  ABOGADOS.forEach(function (abogado) {
    var tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-equipo-pagina-jmc';
    tarjeta.innerHTML =
      '<img src="' + abogado.imagen + '" alt="' + abogado.nombre + '">' +
      '<div class="cuerpo">' +
        '<span class="area-kicker">' + abogado.area + '</span>' +
        '<h3>' + abogado.nombre + '</h3>' +
        '<p>' + abogado.intro + '</p>' +
        '<a href="abogado.html?id=' + abogado.id + '" class="boton-secundario-jmc" style="text-align:center; margin-top:0.8rem;">Conocer más →</a>' +
      '</div>';
    contenedor.appendChild(tarjeta);
  });
});
