import { site } from "../site.mjs";
import { icons } from "../icons.mjs";
import { mediaPlaceholder, callBanner } from "../components.mjs";

/* ------------------------------------------------------- Le magasin */
const hoursRows = site.hours
  .map(
    (h) => `<li><span><strong>${h.day}</strong></span><span>${h.value}</span></li>`
  )
  .join("");

const magasinBody = `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow" style="color:#8fd3d4">Le magasin</p>
      <h1>Venez nous voir à Marseille</h1>
      <p class="lead">Un magasin, des gens. Passez avec votre ordonnance et votre carte Vitale, nous nous occupons du reste.</p>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="shop">
        <div class="map-wrap">
          <iframe class="map" title="Plan d’accès au magasin Medical Health and Care, ${site.address.street}, ${site.address.city}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=${site.mapsQuery}&output=embed"></iframe>
        </div>
        <div>
          <ul class="info-list">
            <li>${icons.pin}<span><strong>Adresse</strong>${site.address.street}<br>${site.address.zip} ${site.address.city}</span></li>
            <li>${icons.phone}<span><strong>Téléphone</strong><a href="tel:${site.phoneHref}">${site.phoneDisplay}</a></span></li>
            <li>${icons.mail}<span><strong>Email</strong><a href="mailto:${site.email}">${site.email}</a></span></li>
          </ul>
          <p class="mt-2">
            <a class="btn btn-primary" href="https://www.google.com/maps/dir/?api=1&destination=${site.mapsQuery}" target="_blank" rel="noopener">${icons.pin}<span>Itinéraire</span></a>
            <a class="btn btn-outline" href="tel:${site.phoneHref}">${icons.phone}<span>Appeler</span></a>
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="section-alt">
    <div class="container">
      <div class="shop">
        <div>
          <h2>Horaires d’ouverture</h2>
          <ul class="info-list">${hoursRows}</ul>
        </div>
        <div>
          <h2>Accès et stationnement</h2>
          <p>Le magasin se situe ${site.address.street}, dans le 15ᵉ arrondissement de Marseille. Un espace est prévu pour se garer à proximité et décharger facilement le matériel.</p>
          <p>Vous avez des difficultés à vous déplacer&nbsp;? Appelez-nous&nbsp;: selon votre situation, nous pouvons organiser la livraison et l’installation à domicile.</p>
          ${mediaPlaceholder("Devanture du magasin", "Photo de la devanture à intégrer")}
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow">L’équipe</p>
        <h2>Des visages, pas un standard</h2>
        <p class="lead">Une équipe qui connaît le matériel, les démarches, et qui prend le temps de vous expliquer.</p>
      </div>
      <div class="grid grid-3">
        <div class="card"><div class="tag">Photo à venir</div><h3 style="margin-top:.6rem">Accueil et conseil</h3><p>Pour vous orienter et choisir le bon matériel.</p></div>
        <div class="card"><div class="tag">Photo à venir</div><h3 style="margin-top:.6rem">Démarches et facturation</h3><p>Entente préalable, tiers payant, mutuelles.</p></div>
        <div class="card"><div class="tag">Photo à venir</div><h3 style="margin-top:.6rem">Livraison et installation</h3><p>À domicile, avec réglage et explications.</p></div>
      </div>
    </div>
  </section>

  ${callBanner()}
`;

export const magasin = {
  slug: "magasin.html",
  title: "Le magasin",
  description: `Magasin de matériel médical à Marseille : ${site.address.street}, ${site.address.zip} ${site.address.city}. Horaires, accès, stationnement et plan.`,
  current: "magasin.html",
  breadcrumb: [{ label: "Accueil", href: "index.html" }, { label: "Le magasin" }],
  body: magasinBody,
};

/* ---------------------------------------------------------- Contact */
const contactBody = `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow" style="color:#8fd3d4">Contact</p>
      <h1>Parlons-en</h1>
      <p class="lead">Le plus simple, c’est le téléphone. Vous pouvez aussi nous écrire, nous vous répondrons rapidement.</p>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="shop">
        <div>
          <div class="card" style="background:var(--navy-soft);border:none">
            <h2 style="margin-top:0">Nous appeler</h2>
            <p style="color:var(--muted)">Du lundi au vendredi, 9h–12h et 14h30–18h.</p>
            <p><a class="btn btn-primary btn-lg btn-block" href="tel:${site.phoneHref}">${icons.phone}<span>${site.phoneDisplay}</span></a></p>
          </div>
          <ul class="info-list mt-2">
            <li>${icons.pin}<span><strong>Adresse</strong>${site.address.street}, ${site.address.zip} ${site.address.city}</span></li>
            <li>${icons.mail}<span><strong>Email</strong><a href="mailto:${site.email}">${site.email}</a></span></li>
            <li>${icons.clock}<span><strong>Horaires</strong>${site.hoursShort}</span></li>
          </ul>
          <p><a class="btn btn-outline" href="magasin.html">${icons.store}<span>Voir le plan d’accès</span></a></p>
        </div>
        <div>
          <form class="card" action="#" method="post" novalidate aria-describedby="contact-note">
            <h2 style="margin-top:0">Nous écrire</h2>
            <div class="form-grid">
              <div class="field">
                <label for="c-nom">Nom<span aria-hidden="true"> *</span></label>
                <input id="c-nom" name="nom" type="text" autocomplete="name" required>
              </div>
              <div class="field">
                <label for="c-tel">Téléphone</label>
                <input id="c-tel" name="telephone" type="tel" autocomplete="tel">
              </div>
              <div class="field full">
                <label for="c-email">Email<span aria-hidden="true"> *</span></label>
                <input id="c-email" name="email" type="email" autocomplete="email" required>
              </div>
              <div class="field full">
                <label for="c-msg">Votre message<span aria-hidden="true"> *</span></label>
                <textarea id="c-msg" name="message" required></textarea>
                <span class="hint">Merci de ne pas indiquer d’information concernant votre santé. Pour toute situation médicale, appelez-nous&nbsp;: <a href="tel:${site.phoneHref}">${site.phoneDisplay}</a>.</span>
              </div>
              <div class="field full consent">
                <input id="c-consent" name="consent" type="checkbox" required>
                <label for="c-consent">J’accepte que mes coordonnées soient utilisées pour répondre à ma demande. Voir la <a href="confidentialite.html">politique de confidentialité</a>.</label>
              </div>
            </div>
            <p class="form-note" id="contact-note">Ce formulaire de démonstration n’envoie pas encore de message&nbsp;: le raccordement à une messagerie sécurisée sera fait à la mise en production. En attendant, écrivez-nous à <a href="mailto:${site.email}">${site.email}</a> ou appelez-nous.</p>
            <p style="margin-top:1rem"><button class="btn btn-primary btn-lg" type="submit">Envoyer</button></p>
          </form>
        </div>
      </div>
    </div>
  </section>
`;

export const contact = {
  slug: "contact.html",
  title: "Contact",
  description:
    "Contacter Medical Health and Care à Marseille : téléphone, email et formulaire. Aucune donnée de santé demandée par le formulaire.",
  current: "contact.html",
  breadcrumb: [{ label: "Accueil", href: "index.html" }, { label: "Contact" }],
  body: contactBody,
};
