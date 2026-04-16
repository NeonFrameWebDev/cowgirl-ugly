/* =============================================
   COWGIRL UGLY — main.js
   Scroll reveal, sticky nav, mobile menu,
   hero parallax, smooth scroll.
   ============================================= */

(function () {
  'use strict';

  /* DOM */
  var nav       = document.getElementById('siteNav');
  var toggle    = document.getElementById('navToggle');
  var links     = document.getElementById('navLinks');
  var navAnchors = links ? links.querySelectorAll('a') : [];
  var riseEls   = document.querySelectorAll('.rise');
  var heroBg    = document.getElementById('heroBg');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------
     SCROLL REVEAL
     ------------------------------------------- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      riseEls.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    riseEls.forEach(function (el) { observer.observe(el); });
  }

  /* -------------------------------------------
     STICKY NAV
     ------------------------------------------- */
  var navScrolled = false;

  function handleNavScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (y > 60 && !navScrolled) {
      nav.classList.add('scrolled');
      navScrolled = true;
    } else if (y <= 60 && navScrolled) {
      nav.classList.remove('scrolled');
      navScrolled = false;
    }
  }

  /* -------------------------------------------
     ACTIVE NAV LINK
     ------------------------------------------- */
  var sections = [];

  function cacheSections() {
    sections = [];
    navAnchors.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        var sec = document.querySelector(href);
        if (sec) sections.push({ el: sec, link: a });
      }
    });
  }

  function updateActiveLink() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].el.offsetTop - 120 <= y) {
        current = sections[i].link;
      }
    }
    navAnchors.forEach(function (a) { a.classList.remove('active'); });
    if (current) current.classList.add('active');
  }

  /* -------------------------------------------
     HERO PARALLAX
     ------------------------------------------- */
  function handleParallax() {
    if (!heroBg || prefersReduced) return;
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (y < window.innerHeight) {
      heroBg.style.transform = 'translateY(' + (y * 0.25) + 'px)';
    }
  }

  /* -------------------------------------------
     MOBILE MENU
     ------------------------------------------- */
  function closeMenu() {
    toggle.classList.remove('active');
    links.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (links.classList.contains('open')) {
      closeMenu();
    } else {
      toggle.classList.add('active');
      links.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  /* -------------------------------------------
     SMOOTH SCROLL
     ------------------------------------------- */
  function handleNavClick(e) {
    var href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        closeMenu();
        setTimeout(function () {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }

  /* -------------------------------------------
     SCROLL THROTTLE
     ------------------------------------------- */
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleNavScroll();
        updateActiveLink();
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  /* -------------------------------------------
     INIT
     ------------------------------------------- */
  function init() {
    // Force scroll to top on load (prevents browser restoring old position)
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    initReveal();

    window.addEventListener('scroll', onScroll, { passive: true });
    handleNavScroll();

    if (toggle) toggle.addEventListener('click', toggleMenu);

    navAnchors.forEach(function (a) {
      a.addEventListener('click', handleNavClick);
    });

    cacheSections();

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (links.classList.contains('open') &&
          !links.contains(e.target) &&
          !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close menu on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Hero scroll cue
    var cue = document.querySelector('.hero-cue');
    if (cue) {
      cue.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(cue.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
