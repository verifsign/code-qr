(function () {
  'use strict';

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
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

  // Cookie banner
  var COOKIE_KEY = 'mhc_cookie_consent';
  var banner = document.getElementById('cookie-banner');
  if (banner && !localStorage.getItem(COOKIE_KEY)) {
    banner.classList.add('is-visible');
    banner.querySelector('[data-cookie-accept]')?.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'accepted');
      banner.classList.remove('is-visible');
    });
    banner.querySelector('[data-cookie-refuse]')?.addEventListener('click', function () {
      localStorage.setItem(COOKIE_KEY, 'refused');
      banner.classList.remove('is-visible');
    });
  }

  // Contact form (client-side only — no backend yet)
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]').value;
      var email = form.querySelector('[name="email"]').value;
      var message = form.querySelector('[name="message"]').value;
      var subject = encodeURIComponent('Contact depuis le site MHC');
      var body = encodeURIComponent('Nom : ' + name + '\nEmail : ' + email + '\n\n' + message);
      window.location.href = 'mailto:contact@mhcmedical.fr?subject=' + subject + '&body=' + body;
    });
  }
})();
