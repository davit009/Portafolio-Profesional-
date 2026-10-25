// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav-menu');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Borde del encabezado y botón "volver arriba" al desplazarse
const header = document.querySelector('.site-header');
const toTop = document.querySelector('.to-top');

const onScroll = () => {
  const y = window.scrollY;
  if (header) header.classList.toggle('scrolled', y > 8);
  if (toTop) toTop.classList.toggle('show', y > 900);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Resaltar la sección visible en el índice o el menú
const spyLinks = [...document.querySelectorAll('[data-spy] a[href^="#"]')];

if (spyLinks.length && 'IntersectionObserver' in window) {
  const byId = new Map(spyLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      spyLinks.forEach((a) => a.classList.remove('active'));
      const link = byId.get(entry.target.id);
      if (!link) return;
      link.classList.add('active');
      // En móvil el índice es una fila horizontal: mantener visible la pestaña activa
      const list = link.closest('ol');
      if (list && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: link.offsetLeft - 20, behavior: 'smooth' });
      }
    });
  }, { rootMargin: '-35% 0px -60% 0px' });

  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

// Ampliar imágenes de las galerías
const lightbox = document.querySelector('.lightbox');

if (lightbox) {
  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');

  document.querySelectorAll('.zoom').forEach((btn) => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt;
      lightbox.showModal();
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });
}

// Tooltips de las gráficas
const tipTargets = document.querySelectorAll('[data-tip]');

if (tipTargets.length) {
  const tip = document.createElement('div');
  tip.className = 'tip';
  tip.hidden = true;
  document.body.appendChild(tip);

  tipTargets.forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      tip.textContent = el.dataset.tip;
      tip.hidden = false;
      const x = Math.min(e.clientX + 12, window.innerWidth - tip.offsetWidth - 8);
      tip.style.left = `${x}px`;
      tip.style.top = `${e.clientY - tip.offsetHeight - 10}px`;
    });
    el.addEventListener('pointerleave', () => { tip.hidden = true; });
  });
}
