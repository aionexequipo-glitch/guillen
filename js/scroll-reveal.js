/**
 * scroll-reveal.js
 * Activa la clase .revealed en elementos [data-reveal] al entrar al viewport.
 * Soporta data-reveal-delay="N" en milisegundos para escalonar hijos.
 */
(function () {
  'use strict';

  function initScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const delay = parseInt(el.dataset.revealDelay || '0', 10);

          setTimeout(function () {
            el.classList.add('revealed');
          }, delay);

          observer.unobserve(el);
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -32px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }
})();
