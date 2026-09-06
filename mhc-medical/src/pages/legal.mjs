import { site } from "../site.mjs";

function legalHero(title, lead) {
  return `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow" style="color:#8fd3d4">Informations légales</p>
      <h1>${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ""}
    </div>
  </section>`;
}

function crumb(label) {
  return [{ label: "Accueil", href: "index.html" }, { label }];
}

/* ------------------------------------------------ Mentions légales */
export const mentions = {
  slug: "mentions-legales.html",
  title: "Mentions légales",
  description: "Mentions légales de la SAS Medical Health and Care, prestataire de matériel médical à Marseille (PSDM).",
  breadcrumb: crumb("Mentions légales"),
  body: `
  ${legalHero("Mentions légales")}
  <section><div class="container prose">
    <h2>Éditeur du site</h2>
    <p>
      <strong>${site.legalName}</strong><br>
      Société par actions simplifiée (SAS)<br>
      Capital social : ${site.capital}<br>
      SIREN : ${site.siren} — ${site.rcs}<br>
      Numéro de TVA intracommunautaire : ${site.tva}
    </p>
    <p>
      Siège social et établissement :<br>
      ${site.address.street} — ${site.address.zip} ${site.address.city} — ${site.address.country}
    </p>
    <p>
      Téléphone : <a href="tel:${site.phoneHref}">${site.phoneDisplay}</a><br>
      Email : <a href="mailto:${site.email}">${site.email}</a>
    </p>
    <p>Directeur de la publication : ${site.publicationDirector}.</p>

    <h2>Hébergeur</h2>
    <p><strong>${site.host.name}</strong><br>${site.host.detail}</p>

    <h2>Activité réglementée</h2>
    <p>${site.legalName} exerce l’activité de <strong>prestataire de services et distributeur de matériels</strong> (PSDM). L’entreprise est <strong>conventionnée avec l’Assurance Maladie</strong> pour la délivrance de dispositifs médicaux pris en charge, dans le cadre du tiers payant.</p>
    <p>Les dispositifs médicaux proposés sont des <strong>produits de santé réglementés portant le marquage CE</strong>. Il convient de lire attentivement les instructions figurant sur la notice et l’étiquetage, et de demander conseil à un professionnel.</p>
    <p>Pour toute question relative à la sécurité des dispositifs ou pour une réclamation, consultez notre page <a href="materiovigilance.html">Réclamations et matériovigilance</a>.</p>

    <h2>Propriété intellectuelle</h2>
    <p>L’ensemble des contenus de ce site (textes, images, logo, mise en page) est protégé par le droit de la propriété intellectuelle. Toute reproduction sans autorisation est interdite.</p>

    <h2>Données personnelles et cookies</h2>
    <p>Le traitement des données est décrit dans notre <a href="confidentialite.html">politique de confidentialité</a>. La gestion des cookies est détaillée sur la page <a href="cookies.html">Gestion des cookies</a>.</p>
  </div></section>`,
};

/* ------------------------------------------------ Confidentialité */
export const confidentialite = {
  slug: "confidentialite.html",
  title: "Politique de confidentialité",
  description: "Politique de confidentialité (RGPD) de Medical Health and Care : données collectées via le formulaire de contact, finalités, durée et droits.",
  breadcrumb: crumb("Politique de confidentialité"),
  body: `
  ${legalHero("Politique de confidentialité", "Nous attachons une grande importance à la protection de vos données personnelles.")}
  <section><div class="container prose">
    <div class="note warn">
      <p><strong>Aucune donnée de santé.</strong> Les formulaires de ce site ne doivent pas être utilisés pour transmettre des informations relatives à votre santé. Pour toute situation médicale, contactez-nous par téléphone au <a href="tel:${site.phoneHref}">${site.phoneDisplay}</a>.</p>
    </div>

    <h2>Responsable du traitement</h2>
    <p>${site.legalName} — ${site.address.street}, ${site.address.zip} ${site.address.city}. Contact : <a href="mailto:${site.email}">${site.email}</a>.</p>

    <h2>Données collectées</h2>
    <p>Via le formulaire de contact, nous collectons uniquement les données que vous nous transmettez volontairement&nbsp;: nom, coordonnées (téléphone, email) et le contenu de votre message. Aucune donnée sensible n’est demandée.</p>

    <h2>Finalités et base légale</h2>
    <p>Ces données servent exclusivement à répondre à votre demande et à assurer le suivi de la relation. La base légale est votre consentement et, le cas échéant, l’intérêt légitime à traiter votre demande.</p>

    <h2>Durée de conservation</h2>
    <p>Vos données sont conservées le temps nécessaire au traitement de votre demande, puis archivées ou supprimées conformément aux durées légales applicables.</p>

    <h2>Destinataires</h2>
    <p>Vos données sont destinées aux seules personnes habilitées de ${site.shortName}. Elles ne sont ni vendues, ni cédées à des tiers à des fins commerciales.</p>

    <h2>Vos droits</h2>
    <p>Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité. Pour les exercer, écrivez à <a href="mailto:${site.email}">${site.email}</a>. Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>).</p>

    <h2>Cookies</h2>
    <p>La gestion des cookies est détaillée sur la page <a href="cookies.html">Gestion des cookies</a>. Aucun cookie de mesure d’audience n’est déposé sans votre consentement préalable.</p>
  </div></section>`,
};

/* ------------------------------------------------ Cookies */
export const cookies = {
  slug: "cookies.html",
  title: "Gestion des cookies",
  description: "Gestion des cookies sur mhcmedical.fr : cookies nécessaires uniquement par défaut, mesure d’audience soumise à votre consentement.",
  breadcrumb: crumb("Gestion des cookies"),
  body: `
  ${legalHero("Gestion des cookies", "Vous gardez le contrôle. Par défaut, seuls les cookies nécessaires au fonctionnement du site sont utilisés.")}
  <section><div class="container prose">
    <h2>Qu’est-ce qu’un cookie&nbsp;?</h2>
    <p>Un cookie est un petit fichier déposé sur votre appareil lors de la visite d’un site. Il permet, par exemple, de mémoriser vos préférences.</p>

    <h2>Les cookies que nous utilisons</h2>
    <h3>Cookies nécessaires</h3>
    <p>Indispensables au fonctionnement du site et à la mémorisation de vos choix de consentement. Ils ne nécessitent pas votre accord et sont toujours actifs.</p>
    <h3>Mesure d’audience (optionnelle)</h3>
    <p>Avec votre accord, nous pouvons mesurer la fréquentation du site de façon anonyme afin de l’améliorer. Ces cookies ne sont déposés qu’après votre consentement explicite.</p>

    <h2>Modifier vos choix</h2>
    <p>Vous pouvez à tout moment revenir sur votre choix.</p>
    <p><button class="btn btn-primary" type="button" data-cookie="reopen">Modifier mes préférences cookies</button></p>
    <p>Vous pouvez également configurer votre navigateur pour bloquer ou supprimer les cookies.</p>
  </div></section>`,
};

/* ------------------------------------------------ Matériovigilance */
export const materiovigilance = {
  slug: "materiovigilance.html",
  title: "Réclamations et matériovigilance",
  description: "Signaler un incident lié à un dispositif médical ou déposer une réclamation auprès de Medical Health and Care à Marseille.",
  breadcrumb: crumb("Réclamations et matériovigilance"),
  body: `
  ${legalHero("Réclamations et matériovigilance", "Votre sécurité est notre priorité. Voici comment nous signaler un problème.")}
  <section><div class="container prose">
    <h2>Les dispositifs médicaux</h2>
    <p>Les dispositifs médicaux que nous délivrons sont des <strong>produits de santé réglementés portant le marquage CE</strong>. Lisez attentivement la notice et l’étiquetage, et respectez les conditions d’utilisation. En cas de doute, demandez-nous conseil.</p>

    <h2>Signaler un incident (matériovigilance)</h2>
    <p>La matériovigilance a pour objet de surveiller les incidents pouvant résulter de l’utilisation d’un dispositif médical. Si vous constatez un défaut, un dysfonctionnement ou un incident lié à un matériel délivré par nos soins, signalez-le nous sans délai&nbsp;:</p>
    <ul>
      <li>Par téléphone : <a href="tel:${site.phoneHref}">${site.phoneDisplay}</a></li>
      <li>Par email : <a href="mailto:${site.email}">${site.email}</a></li>
      <li>Au magasin : ${site.address.street}, ${site.address.zip} ${site.address.city}</li>
    </ul>
    <div class="note warn">
      <p><strong>Urgence médicale&nbsp;:</strong> en cas de danger immédiat pour une personne, contactez le 15 (SAMU) ou le 112.</p>
    </div>
    <p>Les incidents graves peuvent également être signalés à l’Agence nationale de sécurité du médicament et des produits de santé (ANSM) via le portail officiel de signalement des événements sanitaires indésirables (<a href="https://signalement.social-sante.gouv.fr" target="_blank" rel="noopener">signalement.social-sante.gouv.fr</a>).</p>

    <h2>Déposer une réclamation</h2>
    <p>Pour toute réclamation concernant un matériel, une livraison ou une prestation, contactez-nous par téléphone, par email ou directement au magasin. Nous accusons réception de votre demande et nous nous engageons à y apporter une réponse dans les meilleurs délais.</p>
  </div></section>`,
};
