/**
 * 髙橋 葵 Official Profile — Script v3.0
 * Theme switching & accordion interactions
 */

(() => {
  'use strict';

  /* ━━ Theme Controller ━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const THEMES = ['theme-kiran', 'theme-mix', 'theme-biken'];
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');

  let currentIndex = THEMES.indexOf(
    [...body.classList].find(c => c.startsWith('theme-')) || 'theme-mix'
  );
  if (currentIndex < 0) currentIndex = 1;

  // Restore persisted theme
  let saved = null;
  try {
    saved = localStorage.getItem('aoi-theme');
  } catch (e) {
    console.warn('localStorage is not accessible:', e);
  }
  if (saved && THEMES.includes(saved)) {
    body.classList.remove(...THEMES);
    body.classList.add(saved);
    currentIndex = THEMES.indexOf(saved);
  }

  toggle.addEventListener('click', () => {
    body.classList.remove(THEMES[currentIndex]);
    currentIndex = (currentIndex + 1) % THEMES.length;
    body.classList.add(THEMES[currentIndex]);
    try {
      localStorage.setItem('aoi-theme', THEMES[currentIndex]);
    } catch (e) {
      console.warn('localStorage is not writable:', e);
    }
  });

  /* ━━ Accordion ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.querySelectorAll('.accordion').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.getAttribute('aria-controls'));
      if (!target) return;

      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));

      if (isOpen) {
        target.hidden = true;
      } else {
        target.hidden = false;
        // Smooth scroll into view
        try {
          requestAnimationFrame(() => {
            if (typeof target.scrollIntoView === 'function') {
              target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          });
        } catch (e) {
          console.warn('scrollIntoView failed:', e);
        }
      }
    });
  });


  /* ━━ Intersection Observer for entrance ━━━━━━━ */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.grid__item, .card, .divider, .footer').forEach(el => {
      observer.observe(el);
    });
  }
})();
