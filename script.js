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
const spyLinks = [...document.querySelectorAll('[data-spy-key]')];

if (spyLinks.length && 'IntersectionObserver' in window) {
  const keys = new Set(spyLinks.map((l) => l.dataset.spyKey));
  const keyOf = (el) => el.dataset.section || el.id;
  const targets = [...document.querySelectorAll('[data-section], section[id]')]
    .filter((el) => keys.has(keyOf(el)) || el.dataset.section === 'none');

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const key = keyOf(entry.target);
      spyLinks.forEach((l) => {
        const on = l.dataset.spyKey === key;
        l.classList.toggle('active', on);
        if (on) l.setAttribute('aria-current', 'location'); else l.removeAttribute('aria-current');
      });
      const link = spyLinks.find((l) => l.dataset.spyKey === key);
      const list = link && link.closest('ol');
      if (list && list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: link.offsetLeft - 22, behavior: 'smooth' });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  targets.forEach((el) => spy.observe(el));
}

// Menús desplegables (casos de estudio)
const canHover = window.matchMedia('(hover: hover) and (min-width: 761px)');

document.querySelectorAll('[data-menu]').forEach((menu) => {
  const btn = menu.querySelector('.menu-btn');
  let timer;
  const set = (open) => {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Con mouse el menú ya se abre al pasar el cursor: el clic lo mantiene abierto
    set(canHover.matches ? true : !menu.classList.contains('open'));
  });
  menu.addEventListener('mouseenter', () => { if (canHover.matches) { clearTimeout(timer); set(true); } });
  menu.addEventListener('mouseleave', () => { if (canHover.matches) timer = setTimeout(() => set(false), 180); });
  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) set(false); });
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { set(false); btn.focus(); }
  });
  menu.querySelectorAll('.menu-panel a').forEach((a) => a.addEventListener('click', () => set(false)));
});

// Barra de progreso de lectura
const progress = document.querySelector('.progress span');

if (progress) {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
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
