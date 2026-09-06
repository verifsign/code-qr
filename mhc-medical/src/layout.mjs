import { site, nav, footerLinks } from "./site.mjs";
import { icons } from "./icons.mjs";

const year = new Date().getFullYear();

function renderTopbar() {
  return `
  <div class="topbar">
    <div class="container">
      <a class="phone" href="tel:${site.phoneHref}">${icons.phone}<span>${site.phoneDisplay}</span></a>
      <span class="info">${icons.clock}<span>${site.hoursShort}</span></span>
      <span class="info">${icons.pin}<span>${site.address.street}, ${site.address.zip} ${site.address.city}</span></span>
      <span class="spacer"></span>
      <a class="btn btn-accent" href="contact.html">${icons.mail}<span>Nous écrire</span></a>
    </div>
  </div>`;
}

function renderNavItem(item, current) {
  const isCurrent = item.href === current;
  const aria = isCurrent ? ' aria-current="page"' : "";
  if (item.children && item.children.length) {
    const sub = item.children
      .map((c) => `<li><a href="${c.href}">${c.label}</a></li>`)
      .join("");
    return `
      <li class="has-sub">
        <button type="button" aria-expanded="false">${item.label} <span class="caret" aria-hidden="true"></span></button>
        <ul class="submenu">
          <li><a href="${item.href}"${aria}><strong>${item.label}</strong></a></li>
          ${sub}
        </ul>
      </li>`;
  }
  return `<li><a href="${item.href}"${aria}>${item.label}</a></li>`;
}

function renderHeader(current) {
  const items = nav.map((i) => renderNavItem(i, current)).join("");
  return `
  <header class="site-header">
    <div class="container">
      <a class="brand" href="index.html">
        <img class="logo" src="assets/img/logo.svg" alt="" width="46" height="46">
        <span class="brand-text">
          <span class="brand-name">Medical Health and Care</span>
          <span class="brand-sub">Matériel médical · Marseille</span>
        </span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav">
        <span class="bars" aria-hidden="true"></span> Menu
      </button>
      <nav class="main-nav" id="main-nav" aria-label="Navigation principale">
        <ul>${items}</ul>
      </nav>
    </div>
    <div class="nav-backdrop" hidden></div>
  </header>`;
}

function renderBreadcrumb(trail) {
  if (!trail || !trail.length) return "";
  const items = trail
    .map((t, i) => {
      const last = i === trail.length - 1;
      if (last || !t.href) return `<li aria-current="page">${t.label}</li>`;
      return `<li><a href="${t.href}">${t.label}</a></li>`;
    })
    .join("");
  return `
  <nav class="breadcrumb" aria-label="Fil d’ariane">
    <div class="container"><ol>${items}</ol></div>
  </nav>`;
}

function renderFooter() {
  const legal = footerLinks
    .map((l) => `<li><a href="${l.href}">${l.label}</a></li>`)
    .join("");
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="brand-name">Medical Health and Care</div>
          <p>Prestataire de services et distributeur de matériels médicaux (PSDM) à Marseille. Nous équipons votre domicile et pratiquons le tiers payant intégral.</p>
          <p><a href="tel:${site.phoneHref}"><strong>${site.phoneDisplay}</strong></a><br>
          <a href="mailto:${site.email}">${site.email}</a></p>
        </div>
        <div>
          <h2>Le magasin</h2>
          <ul>
            <li>${site.address.street}</li>
            <li>${site.address.zip} ${site.address.city}</li>
            <li>${site.hoursShort}</li>
            <li><a href="magasin.html">Adresse et plan</a></li>
          </ul>
        </div>
        <div>
          <h2>Navigation</h2>
          <ul>
            <li><a href="patient.html">Vous êtes patient</a></li>
            <li><a href="aidant.html">Vous êtes aidant</a></li>
            <li><a href="equipements.html">Nos équipements</a></li>
            <li><a href="professionnels.html">Professionnels de santé</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h2>Informations légales</h2>
          <ul>
            ${legal}
            <li><a href="cookies.html" data-cookie="reopen">Modifier mes choix cookies</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-legal">
        <p>${site.legalName} — ${site.rcs} — SIREN ${site.siren}</p>
        <p>Dispositifs médicaux : produits de santé réglementés portant le marquage CE. Lisez attentivement les instructions figurant sur la notice. Prestataire conventionné avec l’Assurance Maladie.</p>
        <p>© ${year} ${site.name}. Tous droits réservés.</p>
      </div>
    </div>
  </footer>`;
}

function renderCookieBanner() {
  return `
  <div class="cookie-banner" id="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title" hidden>
    <h2 id="cookie-title">Nous respectons votre vie privée</h2>
    <p>Ce site utilise uniquement des cookies nécessaires à son fonctionnement. Avec votre accord, nous pouvons aussi mesurer l’audience pour améliorer le site. Aucun cookie de mesure n’est déposé sans votre consentement.</p>
    <div class="cookie-actions">
      <button class="btn btn-primary" type="button" data-cookie="accept">Tout accepter</button>
      <button class="btn btn-outline" type="button" data-cookie="reject">Tout refuser</button>
      <button class="btn btn-outline" type="button" data-cookie="prefs" aria-expanded="false" aria-controls="cookie-prefs">Paramétrer</button>
    </div>
    <div class="cookie-prefs" id="cookie-prefs" hidden>
      <div class="cookie-pref">
        <input type="checkbox" checked disabled id="cookie-essential">
        <span class="txt"><strong>Cookies nécessaires</strong><span>Indispensables au fonctionnement du site. Toujours actifs.</span></span>
      </div>
      <div class="cookie-pref">
        <input type="checkbox" id="cookie-analytics">
        <span class="txt"><strong>Mesure d’audience</strong><span>Statistiques anonymes de fréquentation pour améliorer le site.</span></span>
      </div>
      <button class="btn btn-primary" type="button" data-cookie="save">Enregistrer mes choix</button>
    </div>
  </div>`;
}

/**
 * Génère une page HTML complète.
 * @param {{slug:string,title:string,description:string,current?:string,breadcrumb?:Array,body:string}} page
 */
export function renderPage(page) {
  const pageTitle =
    page.slug === "index.html"
      ? `${site.name} — ${site.tagline}`
      : `${page.title} · ${site.name}`;
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${page.description}">
  <meta name="theme-color" content="#0f3a5f">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:locale" content="fr_FR">
  <link rel="canonical" href="${site.baseUrl}/${page.slug === "index.html" ? "" : page.slug}">
  <link rel="icon" type="image/svg+xml" href="assets/img/favicon.svg">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <a class="skip-link" href="#contenu">Aller au contenu principal</a>
  ${renderTopbar()}
  ${renderHeader(page.current || page.slug)}
  ${renderBreadcrumb(page.breadcrumb)}
  <main id="contenu">
${page.body}
  </main>
  ${renderFooter()}
  ${renderCookieBanner()}
  <script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}
