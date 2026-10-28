// Nav-Schatten beim Scrollen
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // aktiven Menüpunkt in der Mobil-Leiste sichtbar machen
  const active = nav.querySelector('[aria-current="page"]');
  if (active && active.scrollIntoView) active.scrollIntoView({ inline: 'center', block: 'nearest' });
}

// Scroll-Reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), (i % 4) * 90);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Zahlen formatieren (deutsches Format: 7.500 und 227,5)
const fmt = (n, dec = 0) =>
  n.toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec });

// Zähler-Animation
const co = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const dur = 1800, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * eased, dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    co.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.count').forEach(el => co.observe(el));

// Müll-Rechner (schule.html)
const sl1 = document.getElementById('schueler');
const sl2 = document.getElementById('stueck');
if (sl1 && sl2) {
  const TAGE = 190;      // Annahme: Schultage pro Jahr
  const GRAMM = 10;      // Annahme: Gewicht pro Verpackung in Gramm
  const out = {
    jahr: document.getElementById('r-jahr'),
    woche: document.getElementById('r-woche'),
    kg: document.getElementById('r-kg')
  };
  const pop = (el) => { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); };
  const update = () => {
    const s = +sl1.value, k = +sl2.value;
    document.getElementById('v-schueler').textContent = fmt(s);
    document.getElementById('v-stueck').textContent = fmt(k);
    const jahr = s * k * TAGE;
    out.jahr.textContent = fmt(jahr);
    out.woche.textContent = fmt(s * k * 5);
    out.kg.textContent = fmt(Math.round(jahr * GRAMM / 1000));
    Object.values(out).forEach(pop);
  };
  sl1.addEventListener('input', update);
  sl2.addEventListener('input', update);
  update();
}

// 7-Tage-Challenge (mitmachen.html)
const list = document.querySelector('.checklist');
if (list) {
  const boxes = [...list.querySelectorAll('input[type="checkbox"]')];
  const bar = document.querySelector('.progress .bar');
  const win = document.querySelector('.win');
  const KEY = 'challenge-v2';
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}
  boxes.forEach((b, i) => { b.checked = !!saved[i]; });

  const render = () => {
    const n = boxes.filter(b => b.checked).length;
    bar.style.width = (n / boxes.length * 100) + '%';
    boxes.forEach(b => b.closest('li').classList.toggle('done', b.checked));
    win.classList.remove('show');
    if (n === boxes.length) {
      win.textContent = '🎉 Geschafft! Du bist ein Klima-Held! 🌍';
      void win.offsetWidth; win.classList.add('show');
    } else {
      win.textContent = n + ' von ' + boxes.length + ' erledigt';
    }
    try { localStorage.setItem(KEY, JSON.stringify(boxes.map(b => b.checked))); } catch (e) {}
  };
  boxes.forEach(b => b.addEventListener('change', render));
  render();
}
