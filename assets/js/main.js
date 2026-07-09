/* ============================================================
   LDMC — Main JavaScript
   Navigation, Scroll effects, Animations, Contact Form
   ============================================================ */

(function () {
  'use strict';

  /* ── Header scroll effect ─────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
        header.classList.remove('transparent');
      } else {
        header.classList.remove('scrolled');
        header.classList.add('transparent');
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Mobile menu ──────────────────────────────────────── */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav  = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    // Create overlay for tap-outside-to-close
    const navOverlay = document.createElement('div');
    navOverlay.className = 'mobile-nav-overlay';
    document.body.appendChild(navOverlay);

    function openMobileMenu() {
      menuToggle.classList.add('open');
      mobileNav.classList.add('open');
      navOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      menuToggle.setAttribute('aria-expanded', 'true');
    }
    function closeMobileMenu() {
      menuToggle.classList.remove('open');
      mobileNav.classList.remove('open');
      navOverlay.classList.remove('open');
      document.body.style.overflow = '';
      menuToggle.setAttribute('aria-expanded', 'false');
    }

    menuToggle.addEventListener('click', () => {
      menuToggle.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });
    // Close on overlay tap (outside menu)
    navOverlay.addEventListener('click', closeMobileMenu);
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMobileMenu);
    });
    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMobileMenu();
    });
  }

  /* ── Active nav link ──────────────────────────────────── */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && currentPath.includes(href) && href !== '/' && href !== '../') {
      a.classList.add('active');
    }
  });

  /* ── Hero background loaded animation ────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    const img = new Image();
    img.onload = () => heroBg.classList.add('loaded');
    img.src = window.getComputedStyle(heroBg).backgroundImage
      .replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    // Fallback
    setTimeout(() => heroBg.classList.add('loaded'), 500);
  }

  /* ── AOS (Animate on Scroll) — lightweight implementation */
  const aosElements = document.querySelectorAll('[data-aos]');
  if (aosElements.length > 0) {
    const aosObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.aosDelay || 0);
          const duration = parseInt(el.dataset.aosDuration || 600);
          el.style.transitionDuration = duration + 'ms';
          setTimeout(() => el.classList.add('aos-animate'), delay);
          aosObserver.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    aosElements.forEach(el => aosObserver.observe(el));
  }

  /* ── Product filter tabs ──────────────────────────────── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const filterItems = document.querySelectorAll('[data-category]');
  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.filter;
        filterItems.forEach(item => {
          if (cat === 'all' || item.dataset.category === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Gallery Lightbox ─────────────────────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item[data-src]');
  if (galleryItems.length > 0) {
    // Build lightbox DOM
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML = `
      <div class="lb-overlay"></div>
      <div class="lb-container">
        <button class="lb-close" aria-label="Close">&times;</button>
        <button class="lb-prev" aria-label="Previous">&#8592;</button>
        <button class="lb-next" aria-label="Next">&#8594;</button>
        <div class="lb-content">
          <img class="lb-img" src="" alt="" />
          <p class="lb-caption"></p>
        </div>
      </div>`;
    document.body.appendChild(lb);

    // Inject lightbox styles
    const style = document.createElement('style');
    style.textContent = `
      #lightbox{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;}
      #lightbox.open{display:flex;}
      .lb-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.92);}
      .lb-container{position:relative;z-index:1;max-width:90vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;}
      .lb-img{max-width:90vw;max-height:80vh;object-fit:contain;border-radius:4px;}
      .lb-caption{color:rgba(255,255,255,0.6);font-size:0.85rem;margin-top:12px;letter-spacing:0.05em;}
      .lb-close{position:fixed;top:20px;right:24px;color:#fff;font-size:2rem;line-height:1;opacity:0.7;transition:opacity .2s;background:none;border:none;cursor:pointer;}
      .lb-close:hover{opacity:1;}
      .lb-prev,.lb-next{position:fixed;top:50%;transform:translateY(-50%);color:#fff;font-size:2rem;background:rgba(255,255,255,0.1);border:none;cursor:pointer;padding:12px 18px;border-radius:4px;transition:background .2s;}
      .lb-prev{left:16px;} .lb-next{right:16px;}
      .lb-prev:hover,.lb-next:hover{background:rgba(201,162,39,0.7);}
      @media(max-width:480px){.lb-prev,.lb-next{font-size:1.4rem;padding:8px 12px;}}
    `;
    document.head.appendChild(style);

    const lbImg     = lb.querySelector('.lb-img');
    const lbCaption = lb.querySelector('.lb-caption');
    const lbClose   = lb.querySelector('.lb-close');
    const lbPrev    = lb.querySelector('.lb-prev');
    const lbNext    = lb.querySelector('.lb-next');
    const items     = Array.from(galleryItems);
    let current     = 0;

    const open = (idx) => {
      current = idx;
      const item = items[idx];
      lbImg.src = item.dataset.src;
      lbImg.alt = item.dataset.caption || '';
      lbCaption.textContent = item.dataset.caption || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      lbImg.focus();
    };
    const close = () => {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    };
    const prev = () => open((current - 1 + items.length) % items.length);
    const next = () => open((current + 1) % items.length);

    items.forEach((item, idx) => item.addEventListener('click', () => open(idx)));
    lbClose.addEventListener('click', close);
    lb.querySelector('.lb-overlay').addEventListener('click', close);
    lbPrev.addEventListener('click', prev);
    lbNext.addEventListener('click', next);
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });
  }

  /* ── Contact Form (EmailJS) ───────────────────────────── */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const successMsg = document.querySelector('.form-success');
    const submitBtn  = contactForm.querySelector('[type="submit"]');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = submitBtn.dataset.sending || 'Sending...';
      }

      const serviceId  = 'service_v91kv5c';
      const templateId = 'template_8g90x1p';
      const publicKey  = 'qM-USvXIqzUNbVy1P';

      const params = {
        name:    contactForm.querySelector('[name="name"]')?.value,
        email:   contactForm.querySelector('[name="email"]')?.value,
        phone:   contactForm.querySelector('[name="phone"]')?.value,
        message: contactForm.querySelector('[name="message"]')?.value,
        subject: contactForm.querySelector('[name="subject"]')?.value || 'Website inquiry',
      };

      try {
        await emailjs.send(serviceId, templateId, params, publicKey);
        contactForm.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
      } catch {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.original || 'Send Message';
        }
        alert('Something went wrong. Please call us directly at +212 662 145 915.');
      }
    });
  }

  /* ── Counter animation ────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          let start = 0;
          const duration = 1800;
          const step = target / (duration / 16);
          const update = () => {
            start = Math.min(start + step, target);
            el.textContent = Math.floor(start) + suffix;
            if (start < target) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

})();
