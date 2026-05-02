// ========================================
// HIMWAL — Hero (Cinematic Parallax, clean)
// ========================================
(function () {
  'use strict';

  const heroEl     = document.getElementById('hero');
  if (!heroEl) return;

  const layerBg    = document.getElementById('heroLayerBg');
  const layerMtn   = document.getElementById('heroLayerMtn');
  const contentWrap= document.getElementById('heroContentWrap');
  const scrollCue  = document.getElementById('heroScrollCue');

  // ── Entrance animations ─────────────────────────────────────────────────
  if (typeof gsap !== 'undefined') {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to('#heroEyebrow',  { opacity: 1, y: 0, duration: 0.8 }, 0.25)
      .to('#heroTitle',    { opacity: 1, y: 0, duration: 1.0 }, 0.45)
      .to('#heroSubtitle', { opacity: 1, y: 0, duration: 0.8 }, 0.72)
      .to('#heroButtons',  { opacity: 1, y: 0, duration: 0.7 }, 0.9);
  } else {
    ['#heroEyebrow','#heroTitle','#heroSubtitle','#heroButtons'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) { el.style.opacity = 1; el.style.transform = 'none'; }
    });
  }

  // ── Single rAF parallax loop ────────────────────────────────────────────
  const heroH = heroEl.offsetHeight;
  let lastY = -1, rafId = null;
  let heroBottom = heroEl.getBoundingClientRect().bottom + window.scrollY;

  function tick() {
    const y = window.scrollY;
    if (y === lastY) { rafId = null; return; }
    lastY = y;
    if (y > heroBottom) { rafId = null; return; }
    const p = Math.min(y / heroH, 1);
    if (layerBg)     layerBg.style.transform     = `translate3d(0,${p * 80}px,0)`;
    if (layerMtn)    layerMtn.style.transform    = `translate3d(0,${p * -60}px,0)`;
    if (contentWrap) {
      contentWrap.style.opacity   = Math.max(0, 1 - p * 2.5).toFixed(3);
      contentWrap.style.transform = `translate3d(0,${p * -55}px,0)`;
    }
    if (scrollCue)   scrollCue.style.opacity = Math.max(0, 1 - p * 10).toFixed(3);
    rafId = null;
  }

  window.addEventListener('scroll', () => { if (!rafId) rafId = requestAnimationFrame(tick); }, { passive: true });
  window.addEventListener('resize', () => { heroBottom = heroEl.getBoundingClientRect().bottom + window.scrollY; }, { passive: true });

  // ── Mouse parallax (desktop only) ───────────────────────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, mRaf = null;
    heroEl.addEventListener('mousemove', e => {
      const r = heroEl.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width  - 0.5;
      ty = (e.clientY - r.top)  / r.height - 0.5;
      if (!mRaf) mRaf = requestAnimationFrame(tilt);
    }, { passive: true });
    heroEl.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!mRaf) mRaf = requestAnimationFrame(tilt); }, { passive: true });
    function tilt() {
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      if (layerBg)  layerBg.style.transform  = `translate3d(${cx*8*0.3}px,${cy*8*0.3 + lastY*0.08}px,0)`;
      if (layerMtn) layerMtn.style.transform = `translate3d(${cx*8*1.1}px,${cy*8*0.6 + lastY*-0.06}px,0)`;
      mRaf = (Math.abs(tx-cx)>0.002||Math.abs(ty-cy)>0.002) ? requestAnimationFrame(tilt) : null;
    }
  }
}());
