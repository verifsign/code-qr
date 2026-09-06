(function () {
  'use strict';

  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (!toggle || !nav || toggle._bound) return;
    toggle._bound = true;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  initNav();

  function setCookieBannerOpen(open) {
    document.body.classList.toggle('cookie-banner-open', open);
  }

  // Cookie banner
  var COOKIE_KEY = 'mhc_cookie_consent';
  var banner = document.getElementById('cookie-banner');
  if (banner && !localStorage.getItem(COOKIE_KEY)) {
    banner.classList.add('is-visible');
    setCookieBannerOpen(true);
    banner.querySelector('[data-cookie-accept]')?.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'accepted');
      banner.classList.remove('is-visible');
      setCookieBannerOpen(false);
    });
    banner.querySelector('[data-cookie-refuse]')?.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'refused');
      banner.classList.remove('is-visible');
      setCookieBannerOpen(false);
    });
  }

  // Contact form — prescripteur prefill + erreur URL + timestamp anti-bot
  var form = document.getElementById('contact-form');
  if (form) {
    var tsInput = form.querySelector('[name="_ts"]');
    if (tsInput) {
      tsInput.value = String(Date.now());
    }
    var typeSelect = form.querySelector('[name="type"]');
    if (typeSelect && location.search.includes('type=prescripteur')) {
      typeSelect.value = 'prescripteur';
    }
    if (location.search.includes('erreur')) {
      var err = document.getElementById('form-error');
      if (err) err.style.display = 'block';
    }
  }
})();
