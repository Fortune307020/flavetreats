/* ============================================================
   FLAVE TREATS — script.js
   Shared JavaScript for all pages
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR SCROLL EFFECT ──────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── HAMBURGER MENU ────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── ACTIVE NAV LINK (highlight current page) ──────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── SCROLL REVEAL ─────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      // Stagger delay for grid children
      const parent = el.parentElement;
      if (parent && (parent.classList.contains('cards-grid') ||
                     parent.classList.contains('pricing-grid') ||
                     parent.classList.contains('gallery-grid') ||
                     parent.classList.contains('testimonials-grid'))) {
        const siblings = Array.from(parent.children);
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = (idx % 3) * 0.1 + 's';
      }
      revealObserver.observe(el);
    });
  }

  // ── CONTACT FORM SUBMISSION ───────────────────────────
  const contactForm    = document.getElementById('contactForm');
  const formSuccess    = document.getElementById('formSuccess');
  const submitBtn      = document.getElementById('submitBtn');

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name    = document.getElementById('fname')?.value.trim();
      const email   = document.getElementById('femail')?.value.trim();
      const product = document.getElementById('fproduct')?.value;

      if (!name || !email || !product) {
        showAlert('Please fill in your name, email, and select a service.');
        return;
      }

      if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address.');
        return;
      }

      // Show success state
      if (contactForm && formSuccess) {
        contactForm.style.display = 'none';
        formSuccess.classList.add('visible');
        window.scrollTo({ top: formSuccess.offsetTop - 100, behavior: 'smooth' });
      }
    });
  }

  // ── GALLERY FILTERS ───────────────────────────────────
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          if (match) {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.display = '';
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              if (item.dataset.category !== filter && btn.classList.contains('active') && btn.dataset.filter !== 'all') {
                // keep hidden via opacity, don't remove from layout to avoid reflow
              }
            }, 300);
          }
        });
      });
    });
  }

  // ── SMOOTH SCROLL for anchor links ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  // ── HELPERS ───────────────────────────────────────────
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showAlert(msg) {
    // Custom lightweight alert
    const existing = document.querySelector('.ft-alert');
    if (existing) existing.remove();

    const alert = document.createElement('div');
    alert.className = 'ft-alert';
    alert.style.cssText = `
      position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
      background: #2C1F14; color: #F5F0E8;
      padding: 1rem 2rem; font-family: 'Outfit', sans-serif; font-size: 0.875rem;
      border-radius: 2px; z-index: 9999; letter-spacing: 0.04em;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      animation: slideUp 0.3s ease forwards;
    `;
    alert.textContent = msg;
    document.body.appendChild(alert);
    setTimeout(() => { alert.style.opacity = '0'; alert.style.transition = 'opacity 0.3s'; setTimeout(() => alert.remove(), 300); }, 3500);
  }

  // ── HERO SLIDESHOW ──────────────────────────────────
    const slides = document.querySelectorAll('.slide');
    const dots   = document.querySelectorAll('.dot');
    let current  = 0;
    let timer;

    function goToSlide(n) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      clearInterval(timer);
      timer = setInterval(() => goToSlide(current + 1), 4000);
    }

    if (slides.length) {
      timer = setInterval(() => goToSlide(current + 1), 4000);
    }
});
