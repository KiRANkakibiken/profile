/**
 * 髙橋 葵 Official Profile — Script v3.1
 * Theme switching & accordion interactions
 */

(() => {
  'use strict';

  /* ━━ Theme Controller ━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const THEMES = ['theme-kiran', 'theme-mix', 'theme-biken'];
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');

  // Find active theme index in a highly compatible way
  let currentIndex = 1; // Default to theme-mix
  if (body) {
    if (body.classList.contains('theme-kiran')) {
      currentIndex = 0;
    } else if (body.classList.contains('theme-biken')) {
      currentIndex = 2;
    }
  }

  // Restore persisted theme
  let saved = null;
  try {
    saved = localStorage.getItem('aoi-theme');
  } catch (e) {
    console.warn('localStorage is not accessible:', e);
  }
  if (saved && THEMES.includes(saved) && body) {
    body.classList.remove('theme-kiran', 'theme-mix', 'theme-biken');
    body.classList.add(saved);
    currentIndex = THEMES.indexOf(saved);
  }

  if (toggle && body) {
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
  }

  /* ━━ Accordion ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const accordions = document.querySelectorAll('.accordion');
  if (accordions && accordions.length > 0) {
    accordions.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('aria-controls');
        if (!targetId) return;
        const target = document.getElementById(targetId);
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
  }

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
