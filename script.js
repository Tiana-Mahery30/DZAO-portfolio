/* ══════════════════════════════════
   1. TYPEWRITER — alterne les titres
   ══════════════════════════════════ */
const words   = ['Graphic designer', 'Web designer'];
const el      = document.getElementById('typewriter');
let wordIndex = 0;
let charIndex = 0;
let deleting  = false;

const SPEED_TYPE   = 90;   // ms par caractère à l'écriture
const SPEED_DELETE = 50;   // ms par caractère à l'effacement
const PAUSE_FULL   = 2000; // pause quand le mot est complet
const PAUSE_EMPTY  = 400;  // pause avant d'écrire le mot suivant

function tick() {
  const word    = words[wordIndex];
  const visible = word.slice(0, charIndex);
  el.textContent = visible;

  el.style.animation = charIndex === word.length && !deleting
    ? 'cursorBlink 0.8s step-end infinite'
    : 'none';
  el.style.borderRight = '2px solid #555';

  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(tick, SPEED_TYPE);
  } else if (!deleting && charIndex === word.length) {
    deleting = true;
    setTimeout(tick, PAUSE_FULL);
  } else if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(tick, SPEED_DELETE);
  } else {
    deleting  = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(tick, PAUSE_EMPTY);
  }
}

tick();

/* ══════════════════════════════════
   2. SCROLL REVEAL — .transition-text (toutes les occurrences)
   ══════════════════════════════════ */
const revealEls = document.querySelectorAll('.transition-text');

revealEls.forEach((elToReveal) => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        elToReveal.classList.add('visible');
        observer.disconnect();
      }
    },
    { threshold: 0.2 }
  );
  observer.observe(elToReveal);
});

/* ══════════════════════════════════
   3. BURGER MENU + SCROLL FLUIDE AU CLIC
   ══════════════════════════════════ */
const burger = document.getElementById('burgerBtn');
const nav    = document.getElementById('mainNav');

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('nav-open');
  burger.classList.toggle('burger-active', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});

nav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const targetId = link.getAttribute('href');
    const target   = document.querySelector(targetId);

    const wasOpen = nav.classList.contains('nav-open');

    nav.classList.remove('nav-open');
    burger.classList.remove('burger-active');
    burger.setAttribute('aria-expanded', false);

    if (target) {
      // léger délai pour laisser le menu mobile se refermer avant le scroll
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, wasOpen ? 150 : 0);
    }
  });
});

/* ══════════════════════════════════
   4. BACK TO TOP
   ══════════════════════════════════ */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});