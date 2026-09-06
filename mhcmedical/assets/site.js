/* Menu mobile, consentement cookies et chargement différé de la carte.
   Aucun cookie n'est déposé sans consentement : la carte Google Maps
   n'est injectée qu'après accord explicite (bloc « cookies tiers »). */

(function () {
  "use strict";

  var CLE_CONSENTEMENT = "mhc-consentement-cookies";

  function lireConsentement() {
    try {
      var brut = localStorage.getItem(CLE_CONSENTEMENT);
      return brut ? JSON.parse(brut) : null;
    } catch (e) {
      return null;
    }
  }

  function enregistrerConsentement(choix) {
    try {
      localStorage.setItem(CLE_CONSENTEMENT, JSON.stringify(choix));
    } catch (e) { /* stockage indisponible : le bandeau réapparaîtra */ }
  }

  /* ---- Menu mobile ---- */
  var boutonMenu = document.querySelector(".bouton-menu");
  var nav = document.querySelector(".nav-principale");
  if (boutonMenu && nav) {
    boutonMenu.addEventListener("click", function () {
      var ouvert = nav.classList.toggle("ouvert");
      boutonMenu.setAttribute("aria-expanded", ouvert ? "true" : "false");
    });
  }

  /* ---- Carte Google Maps : chargée uniquement sur action + consentement ---- */
  var ADRESSE_MAPS =
    "https://www.google.com/maps?q=185+avenue+de+Saint+Louis,+13015+Marseille&output=embed";

  function chargerCarte(cadre) {
    var iframe = document.createElement("iframe");
    iframe.src = ADRESSE_MAPS;
    iframe.title = "Plan d'accès au magasin — 185 avenue de Saint Louis, 13015 Marseille";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.allowFullscreen = true;
    cadre.innerHTML = "";
    cadre.appendChild(iframe);
  }

  document.querySelectorAll("[data-carte]").forEach(function (cadre) {
    var consentement = lireConsentement();
    if (consentement && consentement.tiers) {
      chargerCarte(cadre);
      return;
    }
    var bouton = cadre.querySelector("[data-charger-carte]");
    if (bouton) {
      bouton.addEventListener("click", function () {
        var choix = lireConsentement() || { necessaires: true, tiers: false };
        choix.tiers = true;
        enregistrerConsentement(choix);
        chargerCarte(cadre);
        masquerBandeau();
      });
    }
  });

  /* ---- Bandeau cookies ---- */
  var bandeau = document.getElementById("bandeau-cookies");

  function masquerBandeau() {
    if (bandeau) bandeau.hidden = true;
  }

  if (bandeau) {
    if (!lireConsentement()) {
      bandeau.hidden = false;
    }

    var boutonAccepter = bandeau.querySelector("[data-cookies-accepter]");
    var boutonRefuser = bandeau.querySelector("[data-cookies-refuser]");
    var boutonParametrer = bandeau.querySelector("[data-cookies-parametrer]");
    var boutonValider = bandeau.querySelector("[data-cookies-valider]");
    var zoneParametres = bandeau.querySelector(".cookies-parametres");
    var caseTiers = bandeau.querySelector("#cookies-tiers");

    if (boutonAccepter) {
      boutonAccepter.addEventListener("click", function () {
        enregistrerConsentement({ necessaires: true, tiers: true });
        masquerBandeau();
        document.querySelectorAll("[data-carte]").forEach(chargerCarte);
      });
    }
    if (boutonRefuser) {
      boutonRefuser.addEventListener("click", function () {
        enregistrerConsentement({ necessaires: true, tiers: false });
        masquerBandeau();
      });
    }
    if (boutonParametrer && zoneParametres) {
      boutonParametrer.addEventListener("click", function () {
        zoneParametres.hidden = !zoneParametres.hidden;
        boutonParametrer.setAttribute("aria-expanded", zoneParametres.hidden ? "false" : "true");
      });
    }
    if (boutonValider) {
      boutonValider.addEventListener("click", function () {
        var tiers = !!(caseTiers && caseTiers.checked);
        enregistrerConsentement({ necessaires: true, tiers: tiers });
        masquerBandeau();
        if (tiers) document.querySelectorAll("[data-carte]").forEach(chargerCarte);
      });
    }
  }

  /* Lien « gérer mes cookies » dans le pied de page : rouvre le bandeau */
  document.querySelectorAll("[data-rouvrir-cookies]").forEach(function (lien) {
    lien.addEventListener("click", function (e) {
      e.preventDefault();
      if (bandeau) {
        bandeau.hidden = false;
        bandeau.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    });
  });
})();
