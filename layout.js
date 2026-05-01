// ========================================
// HIMWAL — Shared Layout (Header + Footer)
// Eliminates header/footer duplication across pages.
// ========================================
(function () {
  'use strict';

  const page = window.location.pathname.split('/').pop() || 'index.html';
  const isHome = page === 'index.html' || page === '';
  const contactLink = isHome ? '#contact' : 'index.html#contact';

  function nav(id) {
    return page === id ? ' class="active"' : '';
  }

  const HEADER = `
<a href="#main-content" class="skip-link">Skip to main content</a>
<header class="header">
  <div class="container header-inner">
    <a href="index.html" class="logo">
      <img src="images/LOGO.jpg" alt="HIMWAL Logo" width="60" height="60">
      <div class="logo-text">
        <span class="logo-title">HIMWAL</span>
        <span class="logo-tagline">Himalayan Women Awareness &amp; Livelihood Society</span>
      </div>
    </a>

    <nav class="nav" id="main-nav" aria-label="Primary navigation">
      <a href="index.html"${nav('index.html')}>Home</a>
      <a href="programs.html"${nav('programs.html')}>Programs</a>
      <a href="gallery.html"${nav('gallery.html')}>Gallery</a>
      <a href="products.html"${nav('products.html')}>Products</a>
      <a href="${contactLink}">Contact</a>
    </nav>

    <div class="header-actions">
      <a href="${contactLink}" class="btn btn-primary">Donate</a>
      <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>`;

  const FOOTER = `
<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <img src="images/LOGO.jpg" alt="HIMWAL Logo" class="footer-logo" width="60" height="60">
      <div>
        <strong>HIMWAL</strong>
        <p>Himalayan Women Awareness &amp; Livelihood Society</p>
        <p class="footer-tagline">Connecting communities &bull; Preserving culture &bull; Enabling livelihoods</p>
      </div>
    </div>

    <div class="footer-links">
      <h4>Quick Links</h4>
      <a href="index.html">Home</a>
      <a href="programs.html">Programs</a>
      <a href="gallery.html">Gallery</a>
      <a href="products.html">Products</a>
      <a href="${contactLink}">Contact</a>
    </div>

    <div class="footer-social">
      <h4>Follow Us</h4>
      <div class="social-links">
        <a href="#" aria-label="Facebook" rel="noopener noreferrer">FB</a>
        <a href="#" aria-label="Instagram" rel="noopener noreferrer">IG</a>
        <a href="#" aria-label="Twitter" rel="noopener noreferrer">X</a>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} HIMWAL. All rights reserved.</p>
    </div>
  </div>
</footer>`;

  const headerEl = document.getElementById('site-header');
  if (headerEl) headerEl.outerHTML = HEADER;

  const footerEl = document.getElementById('site-footer');
  if (footerEl) footerEl.outerHTML = FOOTER;
}());
