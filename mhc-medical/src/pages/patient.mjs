import { site } from "../site.mjs";
import { icons } from "../icons.mjs";
import { parcoursSteps, callBanner } from "../components.mjs";

/* ---------------------------------------------------- Landing patient */
const patientBody = `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow" style="color:#8fd3d4">Vous êtes patient</p>
      <h1>Vous avez une ordonnance&nbsp;? On s’occupe du reste.</h1>
      <p class="lead">Apportez votre ordonnance et votre carte Vitale. Nous vous équipons, nous vous expliquons, et nous facturons directement l’Assurance Maladie et votre mutuelle.</p>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="section-head center">
        <h2>Comment ça se passe</h2>
        <p class="lead">Quatre étapes simples, sans avance de frais.</p>
      </div>
      ${parcoursSteps()}
    </div>
  </section>

  <section class="section-alt">
    <div class="container">
      <div class="grid grid-3">
        <a class="audience-card" href="comment-ca-marche.html">${icons.doc}<h3>Comment ça marche</h3><p>Ordonnance, coût, accord préalable, délais : toutes vos questions.</p><span class="go">Lire ${icons.arrow}</span></a>
        <a class="audience-card" href="pris-en-charge.html">${icons.check}<h3>Ce qui est pris en charge</h3><p>Le matériel que nous délivrons dans le cadre du tiers payant.</p><span class="go">Voir ${icons.arrow}</span></a>
        <a class="audience-card" href="magasin.html">${icons.store}<h3>Venir au magasin</h3><p>Adresse, horaires, accès et stationnement à Marseille.</p><span class="go">S’y rendre ${icons.arrow}</span></a>
      </div>
    </div>
  </section>

  ${callBanner()}
`;

export const patient = {
  slug: "patient.html",
  title: "Vous êtes patient",
  description:
    "Patient avec une ordonnance : comment obtenir votre matériel médical à Marseille sans avance de frais, avec le tiers payant intégral.",
  current: "patient.html",
  breadcrumb: [{ label: "Accueil", href: "index.html" }, { label: "Vous êtes patient" }],
  body: patientBody,
};

/* ------------------------------------------------ Comment ça marche */
const faq = [
  {
    q: "Faut-il une ordonnance&nbsp;?",
    a: `<p>Oui pour tout le matériel pris en charge : l’ordonnance de votre médecin est nécessaire pour la prise en charge par l’Assurance Maladie.</p>
        <p>Non pour les produits de confort, que vous pouvez acheter librement au magasin.</p>`,
  },
  {
    q: "Combien ça coûte&nbsp;?",
    a: `<p>Pour le matériel pris en charge, vous n’avez rien à avancer&nbsp;: nous facturons directement la CPAM et votre mutuelle, <em>selon les conditions de prise en charge en vigueur et sous réserve de l’accord de votre caisse</em>.</p>
        <p>Nous vous indiquons clairement, avant toute délivrance, ce qui est pris en charge dans votre situation.</p>`,
  },
  {
    q: "Et si j’ai besoin d’un accord préalable&nbsp;?",
    a: `<p>Certains matériels nécessitent l’accord du médecin conseil de l’Assurance Maladie (entente préalable). C’est notre métier&nbsp;: nous préparons le dossier et nous nous chargeons de la démarche pour vous.</p>`,
  },
  {
    q: "Achat ou location&nbsp;?",
    a: `<p>Selon le matériel et la durée du besoin, la solution la plus adaptée peut être l’achat ou la location. Nous vous expliquons ce qui convient le mieux à votre situation, <em>selon les conditions de prise en charge en vigueur</em>.</p>`,
  },
  {
    q: "Combien de temps ça prend&nbsp;?",
    a: `<p>Pour le matériel disponible au magasin, la mise à disposition est immédiate. Pour le matériel sur commande ou soumis à accord préalable, nous vous donnons un délai clair dès votre passage et nous vous tenons informé.</p>`,
  },
  {
    q: "Et si le matériel ne convient pas&nbsp;?",
    a: `<p>Nous réglons et ajustons le matériel avec vous. En cas de besoin, nous procédons à un échange ou assurons le service après-vente. Vous n’êtes jamais seul face à une difficulté d’utilisation.</p>`,
  },
];

const faqHtml = faq
  .map(
    (f) => `<details><summary>${f.q}</summary><div class="answer">${f.a}</div></details>`
  )
  .join("");

const commentBody = `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow" style="color:#8fd3d4">Vous êtes patient</p>
      <h1>Comment ça marche</h1>
      <p class="lead">Les questions que tout le monde se pose — et nos réponses, en toute clarté.</p>
    </div>
  </section>

  <section>
    <div class="container">
      ${parcoursSteps()}
    </div>
  </section>

  <section class="section-alt">
    <div class="container">
      <div class="section-head center"><h2>Vos questions</h2></div>
      <div class="faq prose" style="margin-inline:auto">${faqHtml}</div>
      <div class="prose note" style="margin-inline:auto">
        <p><strong>Bon à savoir.</strong> La prise en charge dépend de votre prescription et de vos droits. Les informations ci-dessus sont données à titre général&nbsp;: la prise en charge s’applique <em>selon les conditions en vigueur et sous réserve de l’accord de votre caisse</em>. Pour toute situation médicale précise, appelez-nous&nbsp;: <a href="tel:${site.phoneHref}">${site.phoneDisplay}</a>.</p>
      </div>
    </div>
  </section>

  ${callBanner("On vous explique tout, simplement.", "Un doute sur votre prise en charge&nbsp;? Le téléphone reste le plus simple.")}
`;

export const comment = {
  slug: "comment-ca-marche.html",
  title: "Comment ça marche",
  description:
    "Ordonnance, coût, entente préalable, achat ou location, délais, service après-vente : comment obtenir votre matériel médical pris en charge, sans avance de frais.",
  current: "patient.html",
  breadcrumb: [
    { label: "Accueil", href: "index.html" },
    { label: "Vous êtes patient", href: "patient.html" },
    { label: "Comment ça marche" },
  ],
  body: commentBody,
};

/* ------------------------------------------------ Ce qui est pris en charge */
const prisBody = `
  <section class="page-hero">
    <div class="container">
      <p class="eyebrow" style="color:#8fd3d4">Vous êtes patient</p>
      <h1>Ce qui est pris en charge</h1>
      <p class="lead">Le matériel médical inscrit sur ordonnance est pris en charge par l’Assurance Maladie, <em>selon les conditions en vigueur</em>. Nous pratiquons le tiers payant intégral : vous n’avancez rien.</p>
    </div>
  </section>

  <section>
    <div class="container prose">
      <h2>Le principe</h2>
      <p>Lorsque votre médecin vous prescrit du matériel figurant parmi les dispositifs pris en charge, nous nous chargeons de la facturation directe auprès de la CPAM et de votre mutuelle. Dans la plupart des cas, il ne reste rien à votre charge.</p>
      <div class="note">
        <p><strong>Toujours prudent.</strong> La prise en charge et son montant dépendent de votre prescription, de vos droits et de votre complémentaire. Elle s’applique <em>selon les conditions de prise en charge en vigueur et sous réserve de l’accord de votre caisse</em>. Nous vous indiquons clairement votre situation avant toute délivrance.</p>
      </div>

      <h2>Les familles de matériel concernées</h2>
      <ul>
        <li><strong>Mobilité et déplacement</strong> — fauteuils roulants, déambulateurs, cannes.</li>
        <li><strong>Chambre et lit médicalisé</strong> — lits médicalisés, matelas anti-escarres, potences.</li>
        <li><strong>Salle de bain et toilettes</strong> — barres d’appui, sièges de douche, rehausseurs.</li>
        <li><strong>Vie quotidienne</strong> — aides aux repas, à l’habillage, à la préhension.</li>
        <li><strong>Diagnostic et surveillance</strong> — tensiomètres, oxymètres, thermomètres.</li>
      </ul>
      <p><a class="btn btn-outline" href="equipements.html">Voir tous nos équipements ${icons.arrow}</a></p>

      <h2>Ce qu’il faut apporter</h2>
      <ul>
        <li>Votre <strong>ordonnance</strong> ;</li>
        <li>Votre <strong>carte Vitale</strong> à jour ;</li>
        <li>Votre <strong>attestation de mutuelle</strong> (si vous en avez une).</li>
      </ul>

      <div class="note warn">
        <p><strong>Une question sur votre situation médicale&nbsp;?</strong> N’indiquez pas d’information de santé par écrit. Appelez-nous, nous vous répondrons directement&nbsp;: <a href="tel:${site.phoneHref}">${site.phoneDisplay}</a>.</p>
      </div>
    </div>
  </section>

  ${callBanner()}
`;

export const prisEnCharge = {
  slug: "pris-en-charge.html",
  title: "Ce qui est pris en charge",
  description:
    "Le matériel médical sur ordonnance pris en charge par l’Assurance Maladie et votre mutuelle, avec tiers payant intégral. Sans avance de frais.",
  current: "patient.html",
  breadcrumb: [
    { label: "Accueil", href: "index.html" },
    { label: "Vous êtes patient", href: "patient.html" },
    { label: "Ce qui est pris en charge" },
  ],
  body: prisBody,
};
