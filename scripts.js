// ========================================
// HIMWAL - Shared Scripts
// ========================================

// Animation / UX constants
const COUNTER_DURATION_MS  = 2000;
const STAGGER_DELAY_MS     = 80;
const COUNTER_THRESHOLD    = 0.5;
const FADE_THRESHOLD       = 0.1;
const SHADOW_SCROLL_TRIGGER = 50;

// Animated counter — counts from 0 up to el's data-target value
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (Number.isNaN(target)) return;  // guard against missing/invalid data-target
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / COUNTER_DURATION_MS, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(easeOutQuart * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', function () {

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('nav-open');
      this.classList.toggle('active');
      // Keep aria-expanded in sync for screen readers
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('nav-open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll — guard against bare "#" which causes querySelector SyntaxError
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;  // nothing to scroll to
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        if (nav) nav.classList.remove('nav-open');
        if (menuToggle) {
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Header shadow on scroll
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > SHADOW_SCROLL_TRIGGER
        ? '0 2px 20px rgba(0,0,0,0.1)'
        : 'none';
    }, { passive: true });
  }

  // Animated counters
  const impactNumbers = document.querySelectorAll('.impact-number');
  if (impactNumbers.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: COUNTER_THRESHOLD });
    impactNumbers.forEach(num => counterObserver.observe(num));
  }

  // Fade-in animations — CSS-class based to avoid invisible content if JS disabled
  const animatedElements = document.querySelectorAll(
    '.program-card, .info-card, .involve-card, .gallery-item, .product-card'
  );
  // NOTE: observer is declared before the callback to avoid the temporal dead zone
  // that would occur if onFadeEntry referenced `fadeObserver` via a separate named fn.
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), index * STAGGER_DELAY_MS);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: FADE_THRESHOLD });

  animatedElements.forEach(el => {
    el.classList.add('fade-in-ready');
    fadeObserver.observe(el);
  });

  // Contact form — opens email client with pre-filled message
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name     = document.getElementById('name').value.trim();
      const emailVal = document.getElementById('email').value.trim();
      const message  = document.getElementById('message').value.trim();
      if (!name || !emailVal || !message) { alert('Please fill in all fields.'); return; }
      if (message.length > 1000) { alert('Message is too long. Please keep it under 1000 characters.'); return; }
      const subject = encodeURIComponent('Website message from ' + name);
      const body    = encodeURIComponent('Name: ' + name + '\nEmail: ' + emailVal + '\n\nMessage:\n' + message);
      // Reset before opening mailto so the form clears regardless of browser behaviour
      contactForm.reset();
      window.location.href = 'mailto:himwalsociety@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

  // Reusable filter — handles gallery (.filter-btn/.gallery-item)
  // and products (.cat-tab/.product-card) from a single function
  function initFilter(tabSelector, itemSelector) {
    const tabs  = document.querySelectorAll(tabSelector);
    const items = document.querySelectorAll(itemSelector);
    if (!tabs.length) return;
    function onTabClick() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      items.forEach(item => {
        item.style.display =
          (filter === 'all' || item.dataset.category === filter) ? '' : 'none';
      });
    }
    tabs.forEach(tab => tab.addEventListener('click', onTabClick));
  }

  initFilter('.filter-btn', '.gallery-item');
  initFilter('.cat-tab',    '.product-card');

});
