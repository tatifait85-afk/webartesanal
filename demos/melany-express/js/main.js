document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('whatsappBtnMelany');
  var globo = document.getElementById('whatsappGloboMelany');
  var ctaBtn = document.getElementById('ctaWhatsappMelany');
  if (!btn || !globo) return;

  function mostrarGlobo() {
    globo.style.display = 'block';
    globo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  btn.addEventListener('click', function () {
    globo.style.display = globo.style.display === 'none' ? 'block' : 'none';
  });

  if (ctaBtn) {
    ctaBtn.addEventListener('click', mostrarGlobo);
  }
});
