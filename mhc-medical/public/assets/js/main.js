/* =========================================================================
   MEDICAL HEALTH AND CARE — Interactions front (sans dépendance)
   1. Menu mobile accessible (clavier + focus)
   2. Bandeau cookies avec choix réel (accepter / refuser / paramétrer)
   ========================================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------ Menu mobile */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  var backdrop = document.querySelector(".nav-backdrop");

  function openNav() {
    if (!nav) return;
    nav.classList.add("open");
    if (backdrop) backdrop.hidden = false;
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    if (!nav) return;
    nav.classList.remove("open");
    if (backdrop) backdrop.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("open")) closeNav();
      else openNav();
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeNav);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* Sous-menus : ouverture au clic (tactile / clavier) en plus du survol */
  var subButtons = document.querySelectorAll(".has-sub > button");
  Array.prototype.forEach.call(subButtons, function (btn) {
    btn.addEventListener("click", function () {
      var sub = btn.parentNode.querySelector(".submenu");
      if (!sub) return;
      var isOpen = sub.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  /* ------------------------------------------------ Cookies */
  var STORAGE_KEY = "mhc-consent";
  var banner = document.getElementById("cookie-banner");
  if (!banner) return;

  var prefsPanel = banner.querySelector(".cookie-prefs");
  var btnAccept = banner.querySelector('[data-cookie="accept"]');
  var btnReject = banner.querySelector('[data-cookie="reject"]');
  var btnPrefs = banner.querySelector('[data-cookie="prefs"]');
  var btnSave = banner.querySelector('[data-cookie="save"]');
  var reopen = document.querySelector('[data-cookie="reopen"]');

  function readConsent() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return null;
    }
  }
  function saveConsent(consent) {
    consent.date = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) {}
    applyConsent(consent);
  }
  function applyConsent(consent) {
    // Point d'extension : n'activer les scripts de mesure d'audience
    // que si consent.analytics === true. Aucun cookie tiers par défaut.
    document.documentElement.setAttribute(
      "data-analytics",
      consent && consent.analytics ? "on" : "off"
    );
  }
  function showBanner() { banner.hidden = false; }
  function hideBanner() { banner.hidden = true; }

  if (btnAccept) btnAccept.addEventListener("click", function () {
    saveConsent({ essential: true, analytics: true });
    hideBanner();
  });
  if (btnReject) btnReject.addEventListener("click", function () {
    saveConsent({ essential: true, analytics: false });
    hideBanner();
  });
  if (btnPrefs) btnPrefs.addEventListener("click", function () {
    if (!prefsPanel) return;
    var open = prefsPanel.hidden;
    prefsPanel.hidden = !open;
    btnPrefs.setAttribute("aria-expanded", open ? "true" : "false");
  });
  if (btnSave) btnSave.addEventListener("click", function () {
    var analytics = banner.querySelector("#cookie-analytics");
    saveConsent({ essential: true, analytics: !!(analytics && analytics.checked) });
    hideBanner();
  });
  if (reopen) reopen.addEventListener("click", function (e) {
    e.preventDefault();
    var current = readConsent();
    var analytics = banner.querySelector("#cookie-analytics");
    if (analytics && current) analytics.checked = !!current.analytics;
    if (prefsPanel) prefsPanel.hidden = false;
    showBanner();
  });

  var existing = readConsent();
  if (existing) applyConsent(existing);
  else showBanner();
})();
