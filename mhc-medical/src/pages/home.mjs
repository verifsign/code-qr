import { site } from "../site.mjs";
import { icons } from "../icons.mjs";
import { categories } from "../data.mjs";
import { mediaPlaceholder, parcoursSteps, proCta } from "../components.mjs";

function audienceCards() {
  const cards = [
    {
      icon: "patient",
      h: "Je suis patient",
      p: "J’ai une ordonnance, je veux savoir comment ça se passe.",
      href: "patient.html",
      cta: "Comment ça marche",
    },
    {
      icon: "aidant",
      h: "Je suis un proche aidant",
      p: "J’équipe le domicile d’un proche.",
      href: "aidant.html",
      cta: "Être accompagné",
    },
    {
      icon: "pro",
      h: "Je suis professionnel de santé",
      p: "Je prescris ou j’oriente mes patients.",
      href: "professionnels.html",
      cta: "Travailler avec nous",
    },
  ];
  return cards
    .map(
      (c) => `<a class="audience-card" href="${c.href}">
      ${icons[c.icon]}
      <h3>${c.h}</h3>
      <p>${c.p}</p>
      <span class="go">${c.cta} ${icons.arrow}</span>
    </a>`
    )
    .join("");
}

function equipCards() {
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

function trustItems() {
  const items = [
    { icon: "shield", h: "Prestataire conventionné", p: "Enregistré auprès de l’Assurance Maladie." },
    { icon: "card", h: "Tiers payant intégral", p: "CPAM et mutuelles facturées directement." },
    { icon: "hand", h: "Conseil et installation", p: "Nous expliquons, nous ajustons, nous livrons." },
    { icon: "store", h: "Un magasin près de chez vous", p: "À Marseille, du lundi au vendredi." },
  ];
  return items
    .map(
      (i) => `<div class="trust">${icons[i.icon]}<div><h3>${i.h}</h3><p>${i.p}</p></div></div>`
    )
    .join("");
}

const body = `
  <section class="hero">
    <div class="container">
      <div>
        <h1>Votre matériel médical, pris en charge.</h1>
        <p class="lead">Nous équipons votre domicile et facturons directement l’Assurance Maladie et votre mutuelle. Vous n’avancez rien.</p>
        <div class="hero-actions">
          <a class="btn btn-primary btn-lg" href="tel:${site.phoneHref}">${icons.phone}<span>Nous appeler</span></a>
          <a class="btn btn-outline btn-lg" href="comment-ca-marche.html">Comment ça marche</a>
        </div>
      </div>
      <div class="hero-media">
        ${mediaPlaceholder("Une personne âgée accompagnée d’un proche, à la maison", "Photo humaine et chaleureuse à intégrer")}
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow">Par où commencer&nbsp;?</p>
        <h2>Vous êtes…</h2>
      </div>
      <div class="grid grid-3">${audienceCards()}</div>
    </div>
  </section>

  <section class="section-alt">
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow">Simple et sans avance de frais</p>
        <h2>Comment ça se passe, en 4 étapes</h2>
      </div>
      ${parcoursSteps()}
    </div>
  </section>

  <section>
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Nos équipements</p>
        <h2>Ce que nous délivrons</h2>
        <p class="lead">Du matériel choisi pour l’autonomie et le confort à domicile. Nous vous aidons à trouver ce qui convient à votre situation.</p>
      </div>
      <div class="grid grid-3">${equipCards()}</div>
    </div>
  </section>

  <section class="section-alt">
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow">Pourquoi nous faire confiance</p>
        <h2>On s’occupe de tout</h2>
      </div>
      <div class="grid grid-4">${trustItems()}</div>
    </div>
  </section>

  ${proCta()}

  <section id="magasin">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Le magasin</p>
        <h2>Un magasin, des gens</h2>
        <p class="lead">Pas un site anonyme : une adresse à Marseille et quelqu’un au téléphone pour vous répondre.</p>
      </div>
      <div class="shop">
        <div class="map-wrap">
          <iframe class="map" title="Plan d’accès au magasin Medical Health and Care" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=${site.mapsQuery}&output=embed"></iframe>
        </div>
        <div>
          <ul class="info-list">
            <li>${icons.pin}<span><strong>Adresse</strong>${site.address.street}, ${site.address.zip} ${site.address.city}</span></li>
            <li>${icons.clock}<span><strong>Horaires</strong>${site.hoursShort}</span></li>
            <li>${icons.phone}<span><strong>Téléphone</strong><a href="tel:${site.phoneHref}">${site.phoneDisplay}</a></span></li>
            <li>${icons.mail}<span><strong>Email</strong><a href="mailto:${site.email}">${site.email}</a></span></li>
          </ul>
          <p class="mt-2"><a class="btn btn-primary" href="magasin.html">Accès, plan et stationnement ${icons.arrow}</a></p>
        </div>
      </div>
    </div>
  </section>
`;

export const home = {
  slug: "index.html",
  title: "Accueil",
  description:
    "Medical Health and Care à Marseille : matériel médical pris en charge, sans avance de frais. Tiers payant intégral, conseil et installation à domicile.",
  breadcrumb: null,
  body,
};
