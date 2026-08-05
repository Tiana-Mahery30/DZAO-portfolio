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

// Réserve l'espace nécessaire sur le conteneur (.hero-role) pour le mot le
// plus long, afin que rien ne bouge horizontalement — sans figer la largeur
// du texte lui-même, pour que le curseur reste collé à la fin du mot affiché.
function lockTypewriterWidth() {
  const measurer = document.createElement('span');
  measurer.style.position   = 'absolute';
  measurer.style.visibility = 'hidden';
  measurer.style.whiteSpace = 'nowrap';
  measurer.style.font       = getComputedStyle(el).font;
  document.body.appendChild(measurer);

  let maxWidth = 0;
  words.forEach(word => {
    measurer.textContent = word;
    maxWidth = Math.max(maxWidth, measurer.offsetWidth);
  });

  document.body.removeChild(measurer);

  const heroRole = el.closest('.hero-role');
  const dot       = document.querySelector('.hero-dot');
  const rowStyles = getComputedStyle(heroRole);
  const gap       = parseFloat(rowStyles.columnGap || rowStyles.gap) || 0;
  const dotWidth  = dot ? dot.offsetWidth : 0;

  heroRole.style.minWidth = (dotWidth + gap + maxWidth) + 'px';
}

lockTypewriterWidth();
window.addEventListener('resize', lockTypewriterWidth);

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
   4. VIEW PORTFOLIO — scroll fluide vers les réalisations
   ══════════════════════════════════ */
const viewPortfolioBtn = document.getElementById('viewPortfolioBtn');

if (viewPortfolioBtn) {
  viewPortfolioBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(viewPortfolioBtn.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ══════════════════════════════════
   5. BACK TO TOP
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

/* ══════════════════════════════════
   6. SCROLL REVEAL EN CASCADE — galerie & services
   ══════════════════════════════════ */
function staggerReveal(containerSelector, itemSelector, revealClass, staggerMs = 120) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const items = container.querySelectorAll(itemSelector);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add(revealClass), i * staggerMs);
        });
        observer.disconnect();
      }
    },
    { threshold: 0.15 }
  );

  observer.observe(container);
}

staggerReveal(
  '.box-container',
  '.child-image1, .child-image2, .child-image3, .child-image4, .child-image5, .child-image6',
  'img-revealed'
);

staggerReveal('.skills-container', '.skills-flex', 'card-revealed');

/* ══════════════════════════════════
   7. SCROLL REVEAL — section À propos
   ══════════════════════════════════ */
const aboutImg  = document.querySelector('.img-dzao');
const aboutText = document.querySelector('.about-text');

if (aboutImg && aboutText) {
  const aboutObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        aboutImg.classList.add('about-revealed');
        setTimeout(() => aboutText.classList.add('about-revealed'), 150);
        aboutObserver.disconnect();
      }
    },
    { threshold: 0.2 }
  );
  aboutObserver.observe(document.querySelector('.about-container'));
}