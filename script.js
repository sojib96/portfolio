(function () {
  'use strict';

  /* ==========================================
     Scroll reveal
     ========================================== */
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));

  /* ==========================================
     Header scroll state
     ========================================== */
  const header = document.getElementById('header');
  let ticking = false;

  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { updateHeader(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  updateHeader();

  /* ==========================================
     Active nav link
     ========================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.25, rootMargin: '-64px 0px 0px 0px' }
    );

    sections.forEach((s) => sectionObserver.observe(s));
  }

  /* ==========================================
     Mobile nav toggle
     ========================================== */
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navLinks');

  const closeMenu = () => {
    menu.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', expanded);
    menu.classList.toggle('active');
    document.body.style.overflow = expanded ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
  });

  /* ==========================================
     Smooth scroll
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).scrollPaddingTop, 10);
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();
