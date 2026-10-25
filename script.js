// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav-menu');

if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
}

// Animación de entrada al hacer scroll
const revealables = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add('in'));
}

// Resaltar la sección visible en el menú o en la barra del caso
const spyLinks = [...document.querySelectorAll('[data-spy] a[href^="#"]')];

if (spyLinks.length && 'IntersectionObserver' in window) {
  const byId = new Map(spyLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      spyLinks.forEach((a) => a.classList.remove('active'));
      const link = byId.get(entry.target.id);
      if (!link) return;
      link.classList.add('active');
      const list = link.closest('ol');
      if (list && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: link.offsetLeft - 22, behavior: 'smooth' });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) spy.observe(section);
  });
}

// Galerías deslizables
document.querySelectorAll('[data-scroller]').forEach((wrap) => {
  const track = wrap.querySelector('.scroller');
  const prev = wrap.querySelector('[data-dir="-1"]');
  const next = wrap.querySelector('[data-dir="1"]');
  if (!track || !prev || !next) return;

  const update = () => {
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  [prev, next].forEach((btn) => btn.addEventListener('click', () => {
    const slide = track.querySelector('.slide');
    const step = slide ? slide.getBoundingClientRect().width + 22 : track.clientWidth * .8;
    track.scrollBy({ left: step * Number(btn.dataset.dir), behavior: 'smooth' });
  }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});

// Ampliar imágenes
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
