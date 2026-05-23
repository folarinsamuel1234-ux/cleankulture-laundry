/* =========================================
   CLEANCULTURE LAUNDRY SERVICES
   Shared JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ---- LOADER ----
  const loader = document.querySelector('.loader-wrap');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
    // Fallback: hide after 3s
    setTimeout(() => loader.classList.add('hidden'), 3000);
  }

  // ---- MOBILE NAV TOGGLE ----
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // ---- ANNOUNCEMENT BAR CLOSE ----
  const announceClose = document.querySelector('.announce-close');
  const announceBar = document.querySelector('.announce-bar');
  if (announceClose && announceBar) {
    announceClose.addEventListener('click', () => {
      announceBar.style.display = 'none';
    });
  }

  // ---- HEADER SCROLL EFFECT ----
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ---- BACK TO TOP ----
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = document.querySelector('header')?.offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- SCROLL REVEAL ANIMATIONS ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // ---- COUNTER ANIMATION ----
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    }, 16);
  }

  // ---- ACTIVE NAV LINK ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});

// ---- FAQ ACCORDION ----
function toggleFaq(el) {
  const answer = el.nextElementSibling;
  const isOpen = el.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('open'));
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  // Open clicked (if was closed)
  if (!isOpen) {
    el.classList.add('open');
    answer.classList.add('open');
  }
}

// ---- FORM VALIDATION ----
function validateBookingForm(form) {
  let valid = true;
  const fields = form.querySelectorAll('[required]');
  fields.forEach(field => {
    const group = field.closest('.form-group');
    if (!field.value.trim()) {
      group?.classList.add('error');
      valid = false;
    } else {
      group?.classList.remove('error');
    }
  });
  if (valid) {
    const phone = form.querySelector('[name="phone"]');
    if (phone && !/^[\d\s+()-]{7,15}$/.test(phone.value.trim())) {
      phone.closest('.form-group')?.classList.add('error');
      valid = false;
    }
  }
  return valid;
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const form = e.target;
  if (validateBookingForm(form)) {
    // Show success message
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Booking Submitted!';
    btn.style.background = '#059669';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      form.reset();
    }, 3000);
  }
}

function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  if (validateBookingForm(form)) {
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
    btn.style.background = '#059669';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      form.reset();
    }, 3000);
  }
}

// ---- NEWSLETTER FORM ----
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check-circle"></i> Subscribed!';
  btn.style.background = '#059669';
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    form.reset();
  }, 3000);
}
