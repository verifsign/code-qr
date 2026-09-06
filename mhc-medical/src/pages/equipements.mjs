import { site } from "../site.mjs";
import { icons } from "../icons.mjs";
import { categories } from "../data.mjs";
import { mediaPlaceholder, callBanner, proCta } from "../components.mjs";

/* ------------------------------------------------ Landing catalogue */
function catCards() {
  return categories
    .map(
      (c) => `<article class="equip-card">
      <div class="thumb">${mediaPlaceholder(c.title, "Photo d’usage à intégrer")}</div>
      <div class="equip-body">
        <h3>${c.title}</h3>
        <p>${c.short}</p>
        <a class="btn btn-outline" href="${c.slug}.html">En savoir plus</a>
      </div>
    </article>`
    )
    .join("");
}

const equipBody = `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow" style="color:#8fd3d4">Nos équipements</p>
      <h1>Le matériel qui rend le quotidien plus simple</h1>
      <p class="lead">Cinq grandes familles pour l’autonomie et le confort à domicile. Nous vous aidons à choisir ce qui convient à votre situation — beaucoup de ces équipements sont pris en charge sur ordonnance.</p>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="grid grid-3">${catCards()}</div>
      <div class="prose note" style="margin:2rem auto 0">
        <p>Les prix ne sont pas affichés car les tarifs et conditions de prise en charge évoluent régulièrement. Pour savoir ce qui s’applique à votre situation, <a href="tel:${site.phoneHref}">appelez-nous</a> ou passez au magasin.</p>
      </div>
    </div>
  </section>

  ${proCta()}
  ${callBanner()}
`;

export const equipements = {
  slug: "equipements.html",
  title: "Nos équipements",
  description:
    "Catalogue de matériel médical : mobilité, lit médicalisé, salle de bain, vie quotidienne, diagnostic. Sans prix, pris en charge sur ordonnance, à Marseille.",
  current: "equipements.html",
  breadcrumb: [{ label: "Accueil", href: "index.html" }, { label: "Nos équipements" }],
  body: equipBody,
};

/* ------------------------------------------------ Pages catégories */
function categoryPage(cat) {
  const list = cat.items.map((i) => `<li>${i}</li>`).join("");
  const others = categories
    .filter((c) => c.slug !== cat.slug)
    .map((c) => `<li><a href="${c.slug}.html">${c.title}</a></li>`)
    .join("");
  const body = `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow" style="color:#8fd3d4">Nos équipements</p>
      <h1>${cat.title}</h1>
      <p class="lead">${cat.intro}</p>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="shop">
        <div>${mediaPlaceholder(cat.title, "Photo d’usage à intégrer")}</div>
        <div class="prose" style="max-width:none">
          <h2>Ce que nous proposons</h2>
          <ul>${list}</ul>
          <div class="note">
            <p>Beaucoup de ces équipements sont pris en charge sur ordonnance, <em>selon les conditions en vigueur et sous réserve de l’accord de votre caisse</em>. Nous pratiquons le tiers payant intégral&nbsp;: vous n’avancez rien.</p>
          </div>
          <p><a class="btn btn-primary" href="tel:${site.phoneHref}">${icons.phone}<span>Demander conseil</span></a>
          <a class="btn btn-outline" href="comment-ca-marche.html">Comment ça marche</a></p>
        </div>
      </div>
    </div>
  </section>

  <section class="section-alt">
    <div class="container">
      <div class="section-head"><h2>Autres familles d’équipements</h2></div>
      <ul class="info-list" style="max-width:620px">${others}</ul>
    </div>
  </section>

  ${callBanner()}
  `;
  return {
    slug: `${cat.slug}.html`,
    title: cat.title,
    description: `${cat.title} — ${cat.short} ${cat.intro}`,
    current: "equipements.html",
    breadcrumb: [
      { label: "Accueil", href: "index.html" },
      { label: "Nos équipements", href: "equipements.html" },
      { label: cat.title },
    ],
    body,
  };
}

export const categoryPages = categories.map(categoryPage);
