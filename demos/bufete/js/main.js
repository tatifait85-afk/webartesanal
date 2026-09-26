document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var abierto = navLinks.classList.toggle('abierto');
      navToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
  }
});
