(function () {
  'use strict';

  var cfg = window.MHC;
  if (!cfg) return;

  var base = document.documentElement.getAttribute('data-base') || '';
  var current = document.body.getAttribute('data-page') || '';

  function link(href) {
    if (!href || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return href;
    return base + href;
  }

  function isActive(href) {
    if (!href) return false;
    return current === href || current.endsWith('/' + href);
  }

  function isGroupActive(children) {
    return children.some(function (c) { return isActive(c.href); });
  }

  function renderNav() {
    return cfg.nav.map(function (item) {
      if (item.children) {
        var open = isGroupActive(item.children) ? ' is-open' : '';
        var kids = item.children.map(function (c) {
          var cur = isActive(c.href) ? ' aria-current="page"' : '';
          return '<li><a href="' + link(c.href) + '"' + cur + '>' + c.label + '</a></li>';
        }).join('');
        return '<div class="nav-group' + open + '">' +
          '<button class="nav-group__toggle" aria-expanded="' + (open ? 'true' : 'false') + '">' + item.label + '</button>' +
          '<ul class="nav-group__menu">' + kids + '</ul></div>';
      }
      var cur = isActive(item.href) ? ' aria-current="page"' : '';
      return '<a href="' + link(item.href) + '"' + cur + '>' + item.label + '</a>';
    }).join('');
  }

  function renderFooterNav() {
    return '<ul class="footer__list">' +
      '<li><a href="' + link('comment-ca-marche.html') + '">Comment ça marche</a></li>' +
      '<li><a href="' + link('nos-equipements.html') + '">Nos équipements</a></li>' +
      '<li><a href="' + link('professionnels-sante.html') + '">Professionnels de santé</a></li>' +
      '<li><a href="' + link('le-magasin.html') + '">Le magasin</a></li>' +
      '<li><a href="' + link('equipe.html') + '">L\'équipe</a></li>' +
      '<li><a href="' + link('contact.html') + '">Contact</a></li>' +
      '</ul>';
  }

  var headerEl = document.getElementById('site-header');
  if (headerEl) {
    headerEl.innerHTML =
      '<div class="top-bar" role="complementary" aria-label="Coordonnées">' +
        '<div class="top-bar__inner">' +
          '<a href="tel:' + cfg.phoneTel + '" class="top-bar__phone">' + cfg.phone + '</a>' +
          '<span class="top-bar__sep">|</span><span>' + cfg.hours + '</span>' +
          '<span class="top-bar__sep">|</span><span>' + cfg.address + ', ' + cfg.city + '</span>' +
          '<span class="top-bar__sep">|</span><a href="' + link('contact.html') + '">Nous écrire</a>' +
        '</div></div>' +
      '<header class="header"><div class="header__inner">' +
        '<a href="' + link('index.html') + '" class="logo" aria-label="' + cfg.name + ' — Accueil">' +
          '<img src="' + base + 'assets/images/logo-horizontal.png" alt="' + cfg.name + '" width="220" height="52">' +
        '</a>' +
        '<button class="nav-toggle" aria-expanded="false" aria-controls="main-nav">Menu</button>' +
        '<nav class="nav" id="main-nav" aria-label="Navigation principale">' + renderNav() + '</nav>' +
      '</div></header>';
  }

  var footerEl = document.getElementById('site-footer');
  if (footerEl) {
    footerEl.innerHTML =
      '<footer class="footer"><div class="container">' +
        '<div class="footer__grid">' +
          '<div><p class="footer__title">' + cfg.name + '</p>' +
            '<p>SAS MEDICAL HEALTH AND CARE<br>' + cfg.address + ', ' + cfg.city + '<br>' +
            'SIREN 983 367 699 — RCS Marseille<br>' +
            '<a href="tel:' + cfg.phoneTel + '">' + cfg.phone + '</a> · ' +
            '<a href="mailto:' + cfg.email + '">' + cfg.email + '</a></p></div>' +
          '<div><p class="footer__title">Navigation</p>' + renderFooterNav() + '</div>' +
          '<div><p class="footer__title">Informations légales</p>' +
            '<ul class="footer__list">' +
              '<li><a href="' + link('mentions-legales.html') + '">Mentions légales</a></li>' +
              '<li><a href="' + link('politique-confidentialite.html') + '">Politique de confidentialité</a></li>' +
              '<li><a href="' + link('cookies.html') + '">Gestion des cookies</a></li>' +
              '<li><a href="' + link('reclamations.html') + '">Réclamations et matériovigilance</a></li>' +
            '</ul></div>' +
        '</div>' +
        '<div class="footer__bottom">' +
          '<p>Prestataire de services et distributeur de matériels (PSDM) conventionné avec l\'Assurance Maladie.<br>' +
          'Les dispositifs médicaux sont des produits de santé réglementés portant le marquage CE.</p>' +
          '<p style="margin-top:8px;">© 2026 MHC Medical Health and Care — Tous droits réservés</p>' +
        '</div></div></footer>' +
      '<div class="cookie-banner" id="cookie-banner" role="dialog" aria-label="Gestion des cookies">' +
        '<div class="cookie-banner__inner">' +
          '<p>Ce site utilise des cookies pour améliorer votre expérience. L\'assistant en ligne nécessite votre accord. <a href="' + link('cookies.html') + '">En savoir plus</a></p>' +
          '<div class="cookie-banner__actions">' +
            '<button class="btn btn--primary" data-cookie-accept>Accepter</button>' +
            '<button class="btn btn--secondary" data-cookie-refuse>Refuser</button>' +
          '</div></div></div>' +
      '<div id="mhc-chat" class="chat-widget" hidden>' +
        '<div class="chat-panel" id="chat-panel" role="dialog" aria-label="Assistant MHC" hidden>' +
          '<div class="chat-panel__header">' +
            '<div><p class="chat-panel__title">Assistant MHC</p><p class="chat-panel__subtitle">Infos magasin & parcours patient</p></div>' +
            '<button type="button" class="chat-close" id="chat-close" aria-label="Fermer le chat">×</button>' +
          '</div>' +
          '<div class="chat-messages" id="chat-messages"></div>' +
          '<div class="chat-consent" id="chat-consent" hidden>' +
            'Pour utiliser l\'assistant, acceptez les cookies via le bandeau en bas de page. ' +
            '<a href="' + link('politique-confidentialite.html') + '">Politique de confidentialité</a>.' +
          '</div>' +
          '<form class="chat-form" id="chat-form" hidden>' +
            '<input type="text" id="chat-input" name="message" maxlength="500" placeholder="Votre question…" autocomplete="off" aria-label="Votre message">' +
            '<button type="submit">Envoyer</button>' +
          '</form>' +
        '</div>' +
        '<button type="button" class="chat-toggle" id="chat-toggle" aria-expanded="false" aria-controls="chat-panel" title="Ouvrir l\'assistant">💬</button>' +
      '</div>';
  }

  if (!document.querySelector('script[src*="chat.js"]')) {
    var chatScript = document.createElement('script');
    chatScript.src = base + 'js/chat.js';
    chatScript.defer = true;
    document.body.appendChild(chatScript);
  }

  var crumbsEl = document.getElementById('breadcrumbs');
  if (crumbsEl) {
    var items = JSON.parse(crumbsEl.getAttribute('data-trail') || '[]');
    if (items.length) {
      var html = '<nav class="breadcrumbs" aria-label="Fil d\'Ariane"><ol>';
      items.forEach(function (item, i) {
        var last = i === items.length - 1;
        html += '<li>';
        if (!last && item.href) html += '<a href="' + link(item.href) + '">';
        html += item.label;
        if (!last && item.href) html += '</a>';
        html += '</li>';
      });
      html += '</ol></nav>';
      crumbsEl.innerHTML = html;
    }
  }

  // Nav group toggles (mobile)
  document.querySelectorAll('.nav-group__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.closest('.nav-group');
      var open = group.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open);
    });
  });
})();
