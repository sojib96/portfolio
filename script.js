(function () {
  'use strict';

  /* ==========================================
     Scroll Reveal — Intersection Observer
     ========================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ==========================================
     Header — scroll state
     ========================================== */
  const header = document.getElementById('header');
  let ticking = false;

  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateHeader();

  /* ==========================================
     Active Nav Link — Intersection Observer
     ========================================== */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[data-section]');

  if (sections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach((a) => {
              a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.25, rootMargin: '-64px 0px 0px 0px' }
    );

    sections.forEach((s) => sectionObserver.observe(s));
  }

  /* ==========================================
     Stat Counters
     ========================================== */
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            if (isNaN(target)) return;

            let current = 0;
            const increment = Math.max(1, Math.floor(target / 40));
            const duration = 1200;
            const stepTime = Math.floor(duration / (target / increment));

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                el.textContent = target + '+';
                clearInterval(timer);
              } else {
                el.textContent = current;
              }
            }, stepTime);

            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((el) => counterObserver.observe(el));
  }

  /* ==========================================
     Mobile Nav Toggle
     ========================================== */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const closeNav = () => {
    navLinks.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const toggleNav = () => {
    const expanded = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', expanded);
    navLinks.classList.toggle('active');
    document.body.style.overflow = expanded ? 'hidden' : '';
  };

  navToggle.addEventListener('click', toggleNav);

  /* Close nav on link click */
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  /* Close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      closeNav();
    }
  });

  /* ==========================================
     Smooth Scroll (anchor links)
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = parseInt(
          getComputedStyle(document.documentElement).scrollPaddingTop,
          10
        );
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();
