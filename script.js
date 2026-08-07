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

/* ══════════════════════════════════
   8. FORMULAIRE DE CONTACT — EmailJS
   ══════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   1) IDENTIFIANTS EMAILJS — à remplacer par tes propres valeurs
   (Dashboard EmailJS : https://dashboard.emailjs.com/)
   ───────────────────────────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = 'nCtQHysOv9hWInBC6';   // Account > General > Public Key
const EMAILJS_SERVICE_ID  = 'service_38dzzm3';   // Email Services > Service ID
const EMAILJS_TEMPLATE_ID = 'template_ru1er8z';  // Email Templates > Template ID

/* Initialisation du SDK EmailJS avec la clé publique */
(function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  } else {
    console.error('EmailJS SDK non chargé : vérifie que le script CDN est bien inclus dans le HTML.');
  }
})();

const contactForm   = document.getElementById('contactForm');
const submitBtn     = document.getElementById('submitBtn');
const formStatusEl  = document.getElementById('formStatus');
const successModal      = document.getElementById('successModal');
const successModalText  = document.getElementById('successModalText');
const successModalClose = document.getElementById('successModalClose');

/* Affiche un message de statut (uniquement les erreurs — le succès passe par la popup) */
function showFormStatus(message, type) {
  if (!formStatusEl) return;
  formStatusEl.textContent = message;
  formStatusEl.style.color      = type === 'success' ? '#2e7d32' : '#c0392b';
  formStatusEl.style.fontSize   = '0.85rem';
  formStatusEl.style.fontWeight = '500';
  formStatusEl.style.margin     = '0';
}

/* Ouvre / ferme la popup de confirmation d'envoi */
function showSuccessModal(message) {
  if (!successModal) return;
  if (successModalText && message) successModalText.textContent = message;
  successModal.classList.add('show');
  successModal.setAttribute('aria-hidden', 'false');
}

function hideSuccessModal() {
  if (!successModal) return;
  successModal.classList.remove('show');
  successModal.setAttribute('aria-hidden', 'true');
}

if (successModalClose) successModalClose.addEventListener('click', hideSuccessModal);
if (successModal) {
  // ferme la popup si on clique en dehors de la boîte
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) hideSuccessModal();
  });
}

/* Active / désactive le bouton "Get a solution" pendant l'envoi (flèche remplacée par un spinner) */
function setSubmitLoading(isLoading) {
  if (!submitBtn) return;
  if (isLoading) {
    submitBtn.dataset.loading = 'true';
    submitBtn.classList.add('is-loading');
    submitBtn.style.pointerEvents = 'none';   // désactive le clic (c'est un <a>, pas de "disabled" natif)
    submitBtn.style.opacity       = '0.75';
  } else {
    submitBtn.dataset.loading = 'false';
    submitBtn.classList.remove('is-loading');
    submitBtn.style.pointerEvents = '';
    submitBtn.style.opacity       = '';
  }
}

/* Vérifie que tous les champs obligatoires sont remplis */
function validateContactForm(data) {
  if (!data.name.trim())    return 'Merci de renseigner votre nom.';
  if (!data.email.trim())   return 'Merci de renseigner votre e-mail.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "L'adresse e-mail n'est pas valide.";
  if (!data.industry.trim())return 'Merci de sélectionner une industrie.';
  if (!data.message.trim()) return 'Merci de renseigner votre message.';
  return null; // pas d'erreur
}

if (contactForm && submitBtn) {
  contactForm.addEventListener('submit', handleContactSubmit);
  // Le bouton est un <a> (pas de type="submit"), donc on gère aussi le clic directement
  submitBtn.addEventListener('click', handleContactSubmit);
}

function handleContactSubmit(e) {
  e.preventDefault(); // empêche le rechargement de la page

  if (submitBtn.dataset.loading === 'true') return; // évite les doubles envois

  const formData = {
    name:     document.getElementById('name').value,
    email:    document.getElementById('email').value,
    industry: document.getElementById('industry').value,
    message:  document.getElementById('message').value,
  };

  const validationError = validateContactForm(formData);
  if (validationError) {
    showFormStatus(validationError, 'error');
    return;
  }

  setSubmitLoading(true);
  showFormStatus('', 'success'); // efface un ancien message d'erreur éventuel

  /* Paramètres envoyés au template EmailJS.
     Les noms ci-dessous doivent correspondre aux variables {{...}} utilisées
     dans le template EmailJS (dashboard > Email Templates). */
  const templateParams = {
    name:     formData.name,
    email:    formData.email,
    industry: formData.industry,
    message:  formData.message,
    to_email: 'tiana.mahery526@gmail.com', // destinataire — à renseigner aussi dans "To Email" du template EmailJS
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      showSuccessModal('Votre message a bien été envoyé. Merci !');
      contactForm.reset();
    })
    .catch((error) => {
      // error.status et error.text contiennent le motif exact renvoyé par l'API EmailJS
      console.error('Erreur EmailJS — status:', error?.status, '| détail:', error?.text || error);
      showFormStatus("Une erreur est survenue lors de l'envoi. Merci de réessayer.", 'error');
    })
    .finally(() => {
      setSubmitLoading(false);
    });
}