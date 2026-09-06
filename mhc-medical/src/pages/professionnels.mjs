import { site } from "../site.mjs";
import { icons } from "../icons.mjs";
import { categories } from "../data.mjs";

const delivrons = categories
  .map(
    (c) => `<div class="trust">${icons[c.icon]}<div><h3>${c.title}</h3><p>${c.short}</p></div></div>`
  )
  .join("");

const body = `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow" style="color:#8fd3d4">Professionnels de santé</p>
      <h1>Un partenaire pour vos patients</h1>
      <p class="lead">Médecin, infirmier libéral, kinésithérapeute, service hospitalier, EHPAD, assistante sociale : nous accompagnons vos patients de la prescription à l’installation, et gérons l’intégralité des démarches administratives.</p>
      <div class="hero-actions">
        <a class="btn btn-accent btn-lg" href="tel:${site.proPhoneHref}">${icons.phone}<span>Contact direct prescripteurs</span></a>
        <a class="btn btn-outline btn-lg" href="#contact" style="background:transparent;color:#fff;border-color:#fff">Nous écrire</a>
      </div>
    </div>
  </section>

  <section id="travailler">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Travailler avec nous</p>
        <h2>Fiable, joignable, réactif</h2>
        <p class="lead">Ce que vous attendez d’un prestataire, nous en faisons notre engagement.</p>
      </div>
      <div class="grid grid-3">
        <div class="card"><h3>Un interlocuteur direct</h3><p>Une personne référente qui connaît vos patients et vos habitudes. Pas de standard anonyme.</p></div>
        <div class="card"><h3>Gestion administrative complète</h3><p>Nous prenons en charge l’entente préalable, la télétransmission et le suivi du dossier.</p></div>
        <div class="card"><h3>Installation à domicile</h3><p>Livraison, réglage et explication au patient. Nous restons disponibles pour les ajustements.</p></div>
        <div class="card"><h3>Tiers payant intégral</h3><p>Vos patients n’avancent rien&nbsp;: nous facturons directement la CPAM et la mutuelle.</p></div>
        <div class="card"><h3>Zone d’intervention</h3><p>Marseille et les Bouches-du-Rhône. Précisez-nous la commune, nous confirmons les délais.</p></div>
        <div class="card"><h3>Délais courts</h3><p>Mise à disposition rapide du matériel disponible ; délai annoncé clairement pour le reste.</p></div>
      </div>
    </div>
  </section>

  <section class="section-alt" id="delivrons">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Ce que nous délivrons</p>
        <h2>Nos grandes familles de matériel</h2>
      </div>
      <div class="grid grid-3">${delivrons}</div>
      <p class="mt-2"><a class="btn btn-outline" href="equipements.html">Voir le détail des équipements ${icons.arrow}</a></p>
    </div>
  </section>

  <section id="contact">
    <div class="container">
      <div class="shop">
        <div>
          <div class="section-head">
            <p class="eyebrow">Contact direct prescripteurs</p>
            <h2>Demander un équipement pour un patient</h2>
            <p class="lead">Laissez-nous vos coordonnées, nous vous rappelons. Pour une demande urgente, appelez directement la ligne prescripteurs.</p>
          </div>
          <ul class="info-list">
            <li>${icons.phone}<span><strong>Ligne prescripteurs</strong><a href="tel:${site.proPhoneHref}">${site.proPhoneDisplay}</a></span></li>
            <li>${icons.mail}<span><strong>Email dédié</strong><a href="mailto:${site.proEmail}">${site.proEmail}</a></span></li>
            <li>${icons.clock}<span><strong>Horaires</strong>${site.hoursShort}</span></li>
          </ul>
        </div>
        <div>
          <form class="card" action="#" method="post" novalidate aria-describedby="pro-form-note">
            <div class="form-grid">
              <div class="field">
                <label for="pro-nom">Votre nom<span aria-hidden="true"> *</span></label>
                <input id="pro-nom" name="nom" type="text" autocomplete="name" required>
              </div>
              <div class="field">
                <label for="pro-profession">Profession</label>
                <input id="pro-profession" name="profession" type="text" placeholder="Médecin, IDEL, kiné…">
              </div>
              <div class="field">
                <label for="pro-tel">Téléphone<span aria-hidden="true"> *</span></label>
                <input id="pro-tel" name="telephone" type="tel" autocomplete="tel" required>
              </div>
              <div class="field">
                <label for="pro-email">Email</label>
                <input id="pro-email" name="email" type="email" autocomplete="email">
              </div>
              <div class="field full">
                <label for="pro-msg">Votre demande</label>
                <textarea id="pro-msg" name="message" placeholder="Type de matériel, commune du patient, délai souhaité…"></textarea>
                <span class="hint">Merci de ne pas indiquer d’information de santé identifiante concernant le patient.</span>
              </div>
              <div class="field full consent">
                <input id="pro-consent" name="consent" type="checkbox" required>
                <label for="pro-consent">J’accepte d’être recontacté par Medical Health and Care au sujet de ma demande.</label>
              </div>
            </div>
            <p class="form-note" id="pro-form-note">Ce formulaire de démonstration n’envoie pas encore de message. Le raccordement à une messagerie sécurisée sera effectué à la mise en production. En attendant, appelez-nous ou écrivez à <a href="mailto:${site.proEmail}">${site.proEmail}</a>.</p>
            <p style="margin-top:1rem"><button class="btn btn-primary btn-lg" type="submit">Envoyer ma demande</button></p>
          </form>
        </div>
      </div>
    </div>
  </section>

  <section class="section-teal section-tight">
    <div class="container center">
      <h2>Besoin d’équiper un patient rapidement&nbsp;?</h2>
      <p class="lead">Appelez la ligne prescripteurs, nous nous occupons du reste.</p>
      <p><a class="btn btn-primary btn-lg" href="tel:${site.proPhoneHref}">${icons.phone}<span>${site.proPhoneDisplay}</span></a></p>
    </div>
  </section>
`;

export const professionnels = {
  slug: "professionnels.html",
  title: "Professionnels de santé",
  description:
    "Prescripteurs : un partenaire fiable à Marseille pour équiper vos patients. Gestion de l’entente préalable, télétransmission, installation à domicile, délais courts.",
  current: "professionnels.html",
  breadcrumb: [{ label: "Accueil", href: "index.html" }, { label: "Professionnels de santé" }],
  body,
};
