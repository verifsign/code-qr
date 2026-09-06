import { site } from "../site.mjs";
import { icons } from "../icons.mjs";
import { mediaPlaceholder, callBanner } from "../components.mjs";

function guideCard(href, icon, h, p) {
  return `<a class="audience-card" href="${href}">${icons[icon]}<h3>${h}</h3><p>${p}</p><span class="go">Lire le guide ${icons.arrow}</span></a>`;
}

/* ---------------------------------------------------- Landing aidant */
const aidantBody = `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow" style="color:#8fd3d4">Vous êtes aidant</p>
      <h1>Vous aidez un proche&nbsp;? Nous vous guidons.</h1>
      <p class="lead">Fils, fille, conjoint, voisin : c’est souvent vous qui décidez et qui vous déplacez. Nous vous aidons à équiper le domicile, vite et bien, sans vous perdre dans les démarches.</p>
      <div class="hero-actions">
        <a class="btn btn-accent btn-lg" href="tel:${site.phoneHref}">${icons.phone}<span>Être conseillé</span></a>
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="section-head center">
        <h2>Des guides par situation</h2>
        <p class="lead">Choisissez la situation qui correspond au besoin de votre proche.</p>
      </div>
      <div class="grid grid-3">
        ${guideCard("aidant-equiper-domicile.html", "store", "Équiper le domicile d’un proche", "Par où commencer, pièce par pièce, pour un logement plus sûr.")}
        ${guideCard("aidant-retour-hospitalisation.html", "bed", "Retour d’hospitalisation", "Préparer le domicile avant le retour, sans stress.")}
        ${guideCard("aidant-prevenir-chutes.html", "shield", "Prévenir les chutes", "Les bons réflexes et le matériel qui réduit les risques.")}
      </div>
    </div>
  </section>

  <section class="section-alt">
    <div class="container">
      <div class="shop">
        <div>${mediaPlaceholder("Un aidant et son proche, à la maison", "Photo de situation à intégrer")}</div>
        <div>
          <h2>On peut aussi tout faire ensemble au téléphone</h2>
          <p>Décrivez-nous la situation de votre proche : nous vous orientons vers le matériel adapté, nous vous expliquons les démarches, et nous nous occupons de l’administratif. Vous n’avancez rien lorsque le matériel est pris en charge.</p>
          <p><a class="btn btn-primary btn-lg" href="tel:${site.phoneHref}">${icons.phone}<span>${site.phoneDisplay}</span></a></p>
        </div>
      </div>
    </div>
  </section>

  ${callBanner()}
`;

export const aidant = {
  slug: "aidant.html",
  title: "Vous êtes aidant",
  description:
    "Aidant d’un proche âgé ou en perte d’autonomie : guides pour équiper le domicile, préparer un retour d’hospitalisation et prévenir les chutes à Marseille.",
  current: "aidant.html",
  breadcrumb: [{ label: "Accueil", href: "index.html" }, { label: "Vous êtes aidant" }],
  body: aidantBody,
};

/* ---------------------------------------------------- Guides ------- */
function guidePage({ slug, title, lead, sections, media }) {
  const sectionsHtml = sections
    .map((s) => `<h2>${s.h}</h2>${s.body}`)
    .join("");
  const body = `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow" style="color:#8fd3d4">Guide aidant</p>
      <h1>${title}</h1>
      <p class="lead">${lead}</p>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="shop">
        <div class="prose" style="max-width:none">${sectionsHtml}</div>
        <div>
          ${media}
          <div class="card mt-2">
            <h3>Un doute&nbsp;? Appelez-nous</h3>
            <p style="color:var(--muted)">Nous vous conseillons gratuitement et nous occupons des démarches.</p>
            <p style="margin-top:1rem"><a class="btn btn-primary btn-block" href="tel:${site.phoneHref}">${icons.phone}<span>${site.phoneDisplay}</span></a></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${callBanner()}
  `;
  return {
    slug,
    title,
    description: lead.replace(/&nbsp;/g, " ").replace(/<[^>]+>/g, ""),
    current: "aidant.html",
    breadcrumb: [
      { label: "Accueil", href: "index.html" },
      { label: "Vous êtes aidant", href: "aidant.html" },
      { label: title },
    ],
    body,
  };
}

export const aidantEquiper = guidePage({
  slug: "aidant-equiper-domicile.html",
  title: "Équiper le domicile d’un proche",
  lead: "Rendre le logement plus sûr et plus confortable, pièce par pièce, sans transformer la maison en hôpital.",
  media: mediaPlaceholder("Salon aménagé pour l’autonomie", "Photo de situation à intégrer"),
  sections: [
    {
      h: "Commencez par les pièces à risque",
      body: `<p>La salle de bain et la chambre concentrent la plupart des difficultés. Ce sont les deux pièces à sécuriser en priorité.</p>
      <ul>
        <li><strong>Salle de bain</strong> — barres d’appui, siège de douche, tapis antidérapant, rehausseur de WC.</li>
        <li><strong>Chambre</strong> — lit à bonne hauteur (ou lit médicalisé), potence, matelas adapté.</li>
        <li><strong>Déplacements</strong> — déambulateur ou canne, selon l’autonomie.</li>
      </ul>`,
    },
    {
      h: "Ce qui peut être pris en charge",
      body: `<p>Une partie de ce matériel est prise en charge sur ordonnance, <em>selon les conditions en vigueur</em>. Nous vous disons ce qui relève d’une prescription et ce qui s’achète librement, et nous nous occupons des démarches.</p>`,
    },
    {
      h: "La bonne méthode",
      body: `<p>Inutile de tout acheter d’un coup. Décrivez-nous le quotidien de votre proche : nous priorisons avec vous, nous ajustons le matériel à son domicile et nous restons disponibles pour les réglages.</p>`,
    },
  ],
});

export const aidantRetour = guidePage({
  slug: "aidant-retour-hospitalisation.html",
  title: "Retour d’hospitalisation",
  lead: "Préparer le domicile avant le retour, pour que tout soit prêt le jour J.",
  media: mediaPlaceholder("Chambre préparée pour un retour à domicile", "Photo de situation à intégrer"),
  sections: [
    {
      h: "Anticiper avant la sortie",
      body: `<p>Dès que la date de sortie est connue, contactez-nous. Avec l’ordonnance de sortie, nous préparons le matériel nécessaire pour qu’il soit installé à temps.</p>`,
    },
    {
      h: "Le matériel souvent utile au retour",
      body: `<ul>
        <li>Lit médicalisé et matelas anti-escarres&nbsp;;</li>
        <li>Fauteuil roulant ou déambulateur&nbsp;;</li>
        <li>Aides pour la salle de bain et les WC&nbsp;;</li>
        <li>Aides au lever et au transfert.</li>
      </ul>`,
    },
    {
      h: "On gère l’administratif",
      body: `<p>Entente préalable, télétransmission, lien avec l’équipe soignante : nous prenons en charge les démarches. Vous vous concentrez sur l’essentiel, l’accueil de votre proche.</p>`,
    },
  ],
});

export const aidantChutes = guidePage({
  slug: "aidant-prevenir-chutes.html",
  title: "Prévenir les chutes",
  lead: "La chute est la première cause de perte d’autonomie. Quelques aménagements simples changent beaucoup.",
  media: mediaPlaceholder("Barre d’appui installée dans une salle de bain", "Photo de situation à intégrer"),
  sections: [
    {
      h: "Repérer les endroits à risque",
      body: `<ul>
        <li>Sols glissants et tapis non fixés&nbsp;;</li>
        <li>Salle de bain et douche&nbsp;;</li>
        <li>Passage du lit au fauteuil&nbsp;;</li>
        <li>Escaliers et seuils.</li>
      </ul>`,
    },
    {
      h: "Le matériel qui réduit les risques",
      body: `<ul>
        <li>Barres d’appui et poignées de maintien&nbsp;;</li>
        <li>Siège de douche, tapis antidérapant&nbsp;;</li>
        <li>Rehausseur de WC, chaise percée&nbsp;;</li>
        <li>Déambulateur ou canne adaptés.</li>
      </ul>`,
    },
    {
      h: "Nos conseils gratuits",
      body: `<p>Nous vous aidons à faire le tour du logement et à choisir les bons équipements, en fonction de l’autonomie de votre proche. Une partie du matériel peut être prise en charge sur ordonnance, <em>selon les conditions en vigueur</em>.</p>`,
    },
  ],
});
