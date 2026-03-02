// =============================================
// ARMED FORCES V3 — script.js
// =============================================

// ---- Hamburger Menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- Navbar: transparent → solid on scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// =============================================
// HERO SLIDER — auto-advances every 4 seconds
// =============================================
const slides      = document.querySelectorAll('.hero-slide');
const dots        = document.querySelectorAll('.slider-dot');
const prevBtn     = document.getElementById('sliderPrev');
const nextBtn     = document.getElementById('sliderNext');
let currentSlide  = 0;
let sliderTimer   = null;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function startAutoplay() {
  stopAutoplay();
  sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
}

function stopAutoplay() {
  if (sliderTimer) { clearInterval(sliderTimer); sliderTimer = null; }
}

// Dot clicks
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.getAttribute('data-index'), 10));
    startAutoplay(); // restart 4s timer on manual click
  });
});

// Arrow clicks
if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoplay(); });
if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoplay(); });

// Pause on hover, resume on leave
const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroSection.addEventListener('mouseenter', stopAutoplay);
  heroSection.addEventListener('mouseleave', startAutoplay);
}

// Start immediately
startAutoplay();

// =============================================
// EMERGENCY BUTTON — admin-only toggle
// Access via: yoursite.com/?admin=true
// Regular users never see the toggle button
// =============================================
const emergencyBtn    = document.getElementById('emergencyBtn');
const emergencyToggle = document.getElementById('emergencyToggle');
const toggleIcon      = document.getElementById('toggleIcon');

// Check if the current visitor is an admin
// Admin access: add ?admin=true to the URL
const urlParams   = new URLSearchParams(window.location.search);
const isAdmin     = urlParams.get('admin') === 'true';

// Show toggle ONLY to admins — hidden from all regular users
if (!isAdmin) {
  emergencyToggle.classList.add('admin-hidden');
}

let emergencyVisible = true;

function setEmergencyVisibility(visible) {
  emergencyVisible = visible;
  if (visible) {
    emergencyBtn.classList.remove('hidden');
    toggleIcon.className = 'fa fa-eye';
    emergencyToggle.classList.remove('btn-hidden');
  } else {
    emergencyBtn.classList.add('hidden');
    toggleIcon.className = 'fa fa-eye-slash';
    emergencyToggle.classList.add('btn-hidden');
  }
}

if (emergencyToggle) {
  emergencyToggle.addEventListener('click', () => {
    setEmergencyVisibility(!emergencyVisible);
  });
}

// ---- Utility: is element in viewport ----
function isInView(el, offset) {
  offset = offset || 90;
  const rect = el.getBoundingClientRect();
  return rect.top <= (window.innerHeight - offset) && rect.bottom >= 0;
}

// ---- Attach reveal animation classes ----
document.querySelectorAll('.value-card').forEach((el, i) => {
  el.classList.add('reveal', 'reveal-delay-' + (i + 1));
});

document.querySelectorAll('.news-card').forEach((el, i) => {
  el.classList.add('reveal', 'reveal-delay-' + (i + 1));
});

const infoLeft  = document.querySelector('.info-strip-inner .info-col:first-child');
const infoRight = document.querySelector('.info-strip-inner .info-col:last-child');
if (infoLeft)  infoLeft.classList.add('reveal-left');
if (infoRight) infoRight.classList.add('reveal-right');

document.querySelectorAll('.section-header').forEach(el => el.classList.add('reveal'));

const impactLeft  = document.querySelector('.impact-left');
const impactRight = document.querySelector('.impact-right');
if (impactLeft)  impactLeft.classList.add('reveal-left');
if (impactRight) impactRight.classList.add('reveal-right');

const involveImg  = document.querySelector('.involve-img-wrap');
const involveForm = document.querySelector('.involve-form-wrap');
if (involveImg)  involveImg.classList.add('reveal-left');
if (involveForm) involveForm.classList.add('reveal-right');

// ---- Count-up Animation ----
let counted = false;

function easeOutQuad(t) { return t * (2 - t); }

function countUp(el) {
  const target    = parseInt(el.getAttribute('data-target'), 10);
  const duration  = 2400;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.floor(easeOutQuad(progress) * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}

// ---- Main Scroll Handler ----
function onScroll() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    if (isInView(el, 80)) el.classList.add('visible');
  });

  if (!counted) {
    const impactSection = document.querySelector('.impact');
    if (impactSection && isInView(impactSection, 60)) {
      counted = true;
      document.querySelectorAll('.stat-number').forEach(el => countUp(el));
    }
  }

  let current = '';
  document.querySelectorAll('section[id], footer[id]').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && href === '#' + current) link.classList.add('active');
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });

function init() {
  onScroll();
  setTimeout(onScroll, 200);
  setTimeout(onScroll, 600);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
