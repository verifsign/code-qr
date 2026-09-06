import { site } from "./site.mjs";
import { icons } from "./icons.mjs";

/* Média de remplacement en attendant les vraies photos (personnes, situations
   de vie). Le libellé décrit la photo attendue ; alt fourni à part si besoin. */
export function mediaPlaceholder(label, note = "Photo à intégrer") {
  return `<div class="media-ph" role="img" aria-label="${label}">
    ${icons.store}
    <span>${label}</span>
    <small>${note}</small>
  </div>`;
}

/* Frise du parcours en 4 étapes (réutilisée accueil + comment ça marche). */
export function parcoursSteps() {
  const steps = [
    { h: "Votre médecin vous prescrit", p: "Une ordonnance indique le matériel adapté à votre situation." },
    { h: "Vous venez au magasin", p: "Avec l’ordonnance et votre carte Vitale. Nous vous accueillons et vous conseillons." },
    { h: "Nous vous équipons", p: "Nous préparons le matériel, l’ajustons et vous expliquons comment l’utiliser." },
    { h: "Nous facturons directement", p: "Nous adressons la facture à la CPAM et à votre mutuelle, selon vos droits." },
  ];
  const cards = steps
    .map(
      (s) => `<div class="step"><span class="num" aria-hidden="true"></span><h3>${s.h}</h3><p>${s.p}</p></div>`
    )
    .join("");
  return `<div class="steps">
    <div class="grid grid-4">${cards}</div>
    <p class="payoff">Résultat : <span class="hl">vous ne payez rien.</span></p>
  </div>`;
}

/* Encart « Professionnels de santé » (bloc 7 de l’accueil, réutilisable). */
export function proCta() {
  return `
  <section class="pro-cta section-navy">
    <div class="container">
      <div>
        <p class="eyebrow">Professionnels de santé</p>
        <h2>Vous êtes médecin, infirmier, kinésithérapeute&nbsp;?</h2>
        <p class="lead">Nous accompagnons vos patients de la prescription à l’installation, et gérons l’intégralité des démarches administratives. Un interlocuteur direct, des délais courts.</p>
      </div>
      <div class="actions">
        <a class="btn btn-accent btn-lg" href="professionnels.html">${icons.pro}<span>Espace prescripteurs</span></a>
        <a class="btn btn-outline btn-lg" href="tel:${site.proPhoneHref}" style="background:transparent;color:#fff;border-color:#fff">${icons.phone}<span>${site.proPhoneDisplay}</span></a>
      </div>
    </div>
  </section>`;
}

/* Bandeau d’appel générique (téléphone) placé en bas de page. */
export function callBanner(title = "Une question&nbsp;? Appelez-nous.", text = "Le plus simple, c’est le téléphone. Nous répondons du lundi au vendredi.") {
  return `
  <section class="section-teal section-tight">
    <div class="container center">
      <h2>${title}</h2>
      <p class="lead">${text}</p>
      <p><a class="btn btn-primary btn-lg" href="tel:${site.phoneHref}">${icons.phone}<span>${site.phoneDisplay}</span></a>
      <a class="btn btn-outline btn-lg" href="contact.html">${icons.mail}<span>Nous écrire</span></a></p>
    </div>
  </section>`;
}
