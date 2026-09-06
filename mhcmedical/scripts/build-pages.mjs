#!/usr/bin/env node
/**
 * Génère les pages HTML à partir de définitions de contenu.
 * Usage: node scripts/build-pages.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function shell({ title, description, page, base = '', trail = [], content }) {
  const trailJson = JSON.stringify(trail);
  return `<!DOCTYPE html>
<html lang="fr" data-base="${base}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — MHC Medical Health and Care</title>
  <meta name="description" content="${description}">
  <link rel="icon" href="${base}assets/images/logo-icon.png" type="image/png">
  <link rel="stylesheet" href="${base}css/style.css">
</head>
<body data-page="${page}">
  <a href="#main" class="skip-link">Aller au contenu principal</a>
  <div id="site-header"></div>
  <main id="main">
    <div class="page-hero">
      <div class="container">
        <div id="breadcrumbs" data-trail='${trailJson.replace(/'/g, '&#39;')}'></div>
        ${content.hero}
      </div>
    </div>
    <div class="content"><div class="container">${content.body}</div></div>
  </main>
  <div id="site-footer"></div>
  <script src="${base}js/site-config.js"></script>
  <script src="${base}js/layout.js"></script>
  <script src="${base}js/main.js"></script>
</body>
</html>`;
}

const cta = `<div class="cta-band">
  <p>Une question ? Appelez-nous, c'est le plus simple.</p>
  <a href="tel:+33777778947" class="btn btn--primary">07 77 77 89 47</a>
</div>`;

const note = `<div class="note">La prise en charge est effectuée selon les conditions en vigueur et sous réserve de l'accord de votre caisse d'assurance maladie.</div>`;

const pages = [
  {
    file: 'vous-etes-patient.html',
    title: 'Vous êtes patient',
    description: 'Parcours patient : ordonnance, prise en charge, tiers payant. Matériel médical à Marseille sans avance de frais.',
    page: 'vous-etes-patient.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Vous êtes patient' }],
    hero: '<h1>Vous êtes patient</h1><p>Vous avez une ordonnance et vous voulez savoir comment ça se passe ? On vous explique tout, simplement.</p>',
    body: `
      <p>Que vous soyez en perte d'autonomie, en sortie d'hospitalisation ou simplement en besoin d'un équipement médical, nous sommes là pour vous accompagner.</p>
      <div class="guide-list">
        <a href="comment-ca-marche.html" class="guide-item"><div class="guide-item__icon">📋</div><div><h2 class="guide-item__title">Comment ça marche</h2><p class="guide-item__text">Le parcours en 4 étapes : ordonnance, visite au magasin, équipement, facturation directe.</p></div></a>
        <a href="prise-en-charge.html" class="guide-item"><div class="guide-item__icon">💶</div><div><h2 class="guide-item__title">Ce qui est pris en charge</h2><p class="guide-item__text">Tiers payant, accord préalable, achat ou location — tout ce qu'il faut savoir sur le remboursement.</p></div></a>
        <a href="le-magasin.html" class="guide-item"><div class="guide-item__icon">📍</div><div><h2 class="guide-item__title">Venir au magasin</h2><p class="guide-item__text">Adresse, horaires, plan d'accès. Apportez votre ordonnance et votre carte Vitale.</p></div></a>
      </div>
      ${cta}`
  },
  {
    file: 'vous-etes-aidant.html',
    title: 'Vous êtes aidant',
    description: 'Guides pour les proches aidants : équiper le domicile, retour d\'hospitalisation, prévenir les chutes. Conseils MHC Marseille.',
    page: 'vous-etes-aidant.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Vous êtes aidant' }],
    hero: '<h1>Vous êtes un proche aidant</h1><p>Vous équipez le domicile d\'un parent, d\'un conjoint ou d\'un voisin ? Nous vous guidons, sans jargon.</p>',
    body: `
      <p>C'est souvent vous qui décidez et qui vous déplacez. Nous le savons, et nous sommes là pour vous conseiller rapidement.</p>
      <div class="guide-list">
        <a href="aidant/equiper-domicile.html" class="guide-item"><div class="guide-item__icon">🏠</div><div><h2 class="guide-item__title">Équiper le domicile d'un proche</h2><p class="guide-item__text">Par où commencer, quels équipements prévoir, comment organiser l'aménagement.</p></div></a>
        <a href="aidant/retour-hospitalisation.html" class="guide-item"><div class="guide-item__icon">🏥</div><div><h2 class="guide-item__title">Retour d'hospitalisation</h2><p class="guide-item__text">Équipement rapide pour faciliter le retour à domicile en toute sécurité.</p></div></a>
        <a href="aidant/prevenir-chutes.html" class="guide-item"><div class="guide-item__icon">⚠️</div><div><h2 class="guide-item__title">Prévenir les chutes</h2><p class="guide-item__text">Déambulateurs, barres d'appui, aménagements pour sécuriser le domicile.</p></div></a>
      </div>
      <p>Vous pouvez aussi nous appeler directement pour être conseillé par téléphone.</p>
      ${cta}`
  },
  {
    file: 'prise-en-charge.html',
    title: 'Ce qui est pris en charge',
    description: 'Tiers payant intégral, accord préalable, achat ou location. Ce que couvre l\'Assurance Maladie pour le matériel médical.',
    page: 'prise-en-charge.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Vous êtes patient', href: 'vous-etes-patient.html' }, { label: 'Prise en charge' }],
    hero: '<h1>Ce qui est pris en charge</h1><p>Combien ça coûte ? En général : rien à avancer. Voici comment ça fonctionne.</p>',
    body: `
      <h2>Le tiers payant intégral</h2>
      <p>Pour le matériel médical prescrit et pris en charge par l'Assurance Maladie, <strong>vous n'avancez aucun frais</strong>. Nous facturons directement :</p>
      <ul><li>La CPAM (part obligatoire)</li><li>Votre mutuelle complémentaire (part complémentaire)</li></ul>
      ${note}
      <h2>Quels produits sont concernés ?</h2>
      <p>Nous délivrons les dispositifs médicaux inscrits aux <strong>Titres I et IV</strong> de la LPPR : mobilité, chambre, salle de bain, vie quotidienne, diagnostic.</p>
      <p>Les produits de confort (non remboursés) sont vendus librement, sans ordonnance.</p>
      <h2>L'accord préalable</h2>
      <p>Certains matériels nécessitent l'accord du médecin conseil de votre caisse avant la délivrance. <strong>Nous constituons le dossier et assurons le suivi</strong> — vous n'avez rien à faire.</p>
      <h2>Achat ou location ?</h2>
      <p>Selon le type de matériel et la durée du besoin, la prise en charge peut être en achat ou en location. Nous vous expliquons ce qui est le plus adapté lors de votre visite.</p>
      <h2>Ce que nous ne couvrons pas</h2>
      <p>Nous ne commercialisons pas les dispositifs du Titre II (orthèses, semelles, genouillères, attelles). Si votre prescription concerne ce type de produit, votre médecin vous orientera vers un autre professionnel.</p>
      ${cta}`
  },
  {
    file: 'equipe.html',
    title: "L'équipe",
    description: "L'équipe MHC Medical Health and Care à Marseille. Des conseillers à votre écoute du lundi au vendredi.",
    page: 'equipe.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: "L'équipe" }],
    hero: '<h1>L\'équipe</h1><p>Un magasin, des gens. Venez nous rencontrer à Marseille.</p>',
    body: `
      <p>Chez MHC, vous n'êtes pas face à un site anonyme. Vous avez une adresse, un numéro de téléphone, et des conseillers qui vous accueillent au magasin.</p>
      <div class="team-grid">
        <div class="team-card"><div class="team-card__photo" aria-hidden="true">👤</div><p class="team-card__name">Notre équipe</p><p class="team-card__role">Conseillers matériel médical</p></div>
      </div>
      <div class="note" style="margin-top:32px;"><strong>Photos à venir</strong> — Les photos de l'équipe et de la devanture seront ajoutées prochainement, avec l'accord de chaque collaborateur. En attendant, venez nous rencontrer au magasin !</div>
      <p style="margin-top:24px;"><a href="le-magasin.html">Voir l'adresse et les horaires →</a></p>
      ${cta}`
  },
  {
    file: 'aidant/equiper-domicile.html',
    base: '../',
    title: 'Équiper le domicile',
    description: 'Guide aidant : comment équiper le domicile d\'un proche en perte d\'autonomie. Conseils MHC Marseille.',
    page: 'aidant/equiper-domicile.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Aidant', href: 'vous-etes-aidant.html' }, { label: 'Équiper le domicile' }],
    hero: '<h1>Équiper le domicile d\'un proche</h1><p>Par où commencer quand un parent ou un conjoint perd en autonomie ?</p>',
    body: `
      <h2>1. Faites le point avec le médecin</h2>
      <p>La première étape : une ordonnance adaptée à la situation. Le médecin traitant ou le gériatre prescrit le matériel nécessaire.</p>
      <h2>2. Identifiez les besoins prioritaires</h2>
      <ul>
        <li><strong>Mobilité</strong> — difficulté à marcher, risque de chute</li>
        <li><strong>Chambre</strong> — lever/coucher difficile, risque d'escarre</li>
        <li><strong>Salle de bain</strong> — toilette et douche en sécurité</li>
        <li><strong>Vie quotidienne</strong> — repas, habillage, préhension</li>
      </ul>
      <h2>3. Venez au magasin ou appelez-nous</h2>
      <p>Apportez l'ordonnance et la carte Vitale de votre proche. Nous vous conseillons, équipons et gérons la prise en charge. <strong>Vous n'avancez rien</strong> pour le matériel remboursé.</p>
      <h2>4. Pensez à l'installation</h2>
      <p>Nous livrons et installons le matériel à domicile dans les Bouches-du-Rhône. Nous expliquons le fonctionnement à vous et à votre proche.</p>
      ${note}
      ${cta}`
  },
  {
    file: 'aidant/retour-hospitalisation.html',
    base: '../',
    title: "Retour d'hospitalisation",
    description: "Équiper rapidement le domicile après une hospitalisation. Guide aidant MHC Marseille.",
    page: 'aidant/retour-hospitalisation.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Aidant', href: 'vous-etes-aidant.html' }, { label: "Retour d'hospitalisation" }],
    hero: '<h1>Retour d\'hospitalisation</h1><p>La sortie d\'hôpital approche ? Voici comment préparer le retour à domicile.</p>',
    body: `
      <h2>Anticipez la sortie</h2>
      <p>L'hôpital ou le service social vous indique le matériel nécessaire. Dès que vous avez l'ordonnance, contactez-nous — nous pouvons souvent équiper <strong>le jour même</strong> pour les produits en stock.</p>
      <h2>Équipements fréquents</h2>
      <ul>
        <li>Lit médicalisé et matelas anti-escarres</li>
        <li>Fauteuil roulant ou déambulateur</li>
        <li>Barres d'appui et siège de douche</li>
        <li>Aides à la préhension et aux repas</li>
        <li>Matériel de surveillance (tensiomètre, oxymètre)</li>
      </ul>
      <h2>On s'occupe des papiers</h2>
      <p>Entente préalable, télétransmission, facturation CPAM et mutuelle : c'est notre métier. Vous vous concentrez sur votre proche.</p>
      ${note}
      ${cta}`
  },
  {
    file: 'aidant/prevenir-chutes.html',
    base: '../',
    title: 'Prévenir les chutes',
    description: 'Sécuriser le domicile contre les chutes : déambulateurs, barres d\'appui, conseils. MHC Marseille.',
    page: 'aidant/prevenir-chutes.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Aidant', href: 'vous-etes-aidant.html' }, { label: 'Prévenir les chutes' }],
    hero: '<h1>Prévenir les chutes</h1><p>Les chutes sont la première cause d\'accidents domestiques chez les personnes âgées. Voici comment agir.</p>',
    body: `
      <h2>Évaluer les risques</h2>
      <p>Observez les déplacements de votre proche à la maison : escaliers, salle de bain, chambre, passages étroits. Notez les moments de difficulté.</p>
      <h2>Équipements utiles</h2>
      <ul>
        <li><strong>Déambulateur ou canne</strong> — pour les déplacements intérieurs et extérieurs</li>
        <li><strong>Barres d'appui</strong> — dans la salle de bain, aux toilettes, dans les couloirs</li>
        <li><strong>Siège de douche</strong> — pour se laver en position assise</li>
        <li><strong>Rehausseur de WC</strong> — pour faciliter le lever</li>
        <li><strong>Éclairage</strong> — veilleuses pour les déplacements nocturnes</li>
      </ul>
      <h2>Aménagements simples</h2>
      <ul>
        <li>Dégager les tapis et les obstacles au sol</li>
        <li>Fixer les câbles le long des murs</li>
        <li>Installer des poignées de porte faciles à manipuler</li>
      </ul>
      <h2>Consultez-nous</h2>
      <p>Apportez l'ordonnance de votre médecin ou appelez-nous pour un conseil personnalisé. Nous visitons le domicile si nécessaire pour l'installation.</p>
      ${cta}`
  },
  {
    file: 'equipements/mobilite.html',
    base: '../',
    title: 'Mobilité et déplacement',
    description: 'Fauteuils roulants, déambulateurs, cannes à Marseille. Prise en charge CPAM et mutuelle, tiers payant intégral.',
    page: 'equipements/mobilite.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Équipements', href: 'nos-equipements.html' }, { label: 'Mobilité' }],
    hero: '<h1>Mobilité et déplacement</h1><p>Fauteuils roulants, déambulateurs, cannes — retrouver votre autonomie en toute sécurité.</p>',
    body: `
      <ul>
        <li>Fauteuils roulants manuels et électriques</li>
        <li>Déambulateurs et rollators</li>
        <li>Cannes de marche et cannes anglaises</li>
        <li>Verticalisateurs et lève-personnes</li>
        <li>Coussins et accessoires de positionnement</li>
      </ul>
      <p>Le choix du matériel dépend de la prescription médicale et de votre mode de vie. Nous vous conseillons en magasin et procédons aux réglages nécessaires.</p>
      ${note}
      <p><a href="../nos-equipements.html">← Tous nos équipements</a></p>
      ${cta}`
  },
  {
    file: 'equipements/chambre.html',
    base: '../',
    title: 'Chambre et lit médicalisé',
    description: 'Lits médicalisés, matelas anti-escarres, potences à Marseille. Tiers payant intégral MHC.',
    page: 'equipements/chambre.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Équipements', href: 'nos-equipements.html' }, { label: 'Chambre' }],
    hero: '<h1>Chambre et lit médicalisé</h1><p>Confort, sécurité et prévention des escarres pour des nuits sereines.</p>',
    body: `
      <ul>
        <li>Lits médicalisés et lits articulés</li>
        <li>Matelas anti-escarres et surmatelas</li>
        <li>Potences et barres de lit</li>
        <li>Tables de lit et accessoires</li>
        <li>Protection et linge adapté</li>
      </ul>
      <p>Nous livrons et installons le lit à domicile dans les Bouches-du-Rhône. Nous expliquons le fonctionnement au patient et à l'aidant.</p>
      ${note}
      <p><a href="../nos-equipements.html">← Tous nos équipements</a></p>
      ${cta}`
  },
  {
    file: 'equipements/salle-de-bain.html',
    base: '../',
    title: 'Salle de bain et WC',
    description: 'Barres d\'appui, sièges de douche, rehausseurs WC à Marseille. Matériel médical pris en charge.',
    page: 'equipements/salle-de-bain.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Équipements', href: 'nos-equipements.html' }, { label: 'Salle de bain' }],
    hero: '<h1>Salle de bain et toilettes</h1><p>Sécuriser les moments du quotidien : toilette, douche, transferts.</p>',
    body: `
      <ul>
        <li>Barres d'appui murales et de baignoire</li>
        <li>Sièges de douche et de bain</li>
        <li>Rehausseurs de WC</li>
        <li>Chaises percées</li>
        <li>Tapis antidérapants</li>
      </ul>
      <p>La salle de bain est le lieu le plus à risque pour les chutes. Nous vous conseillons sur les aménagements adaptés à votre salle de bain.</p>
      ${note}
      <p><a href="../nos-equipements.html">← Tous nos équipements</a></p>
      ${cta}`
  },
  {
    file: 'equipements/vie-quotidienne.html',
    base: '../',
    title: 'Vie quotidienne',
    description: 'Aides aux repas, habillage et préhension à Marseille. Matériel médical MHC, tiers payant.',
    page: 'equipements/vie-quotidienne.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Équipements', href: 'nos-equipements.html' }, { label: 'Vie quotidienne' }],
    hero: '<h1>Vie quotidienne</h1><p>Des aides pour conserver votre autonomie au quotidien.</p>',
    body: `
      <ul>
        <li>Aides aux repas (couverts ergonomiques, plateaux)</li>
        <li>Aides à l'habillage</li>
        <li>Aides à la préhension</li>
        <li>Protection et incontinence</li>
        <li>Rehausseurs de meubles</li>
      </ul>
      <p>Ces aides permettent de maintenir l'autonomie le plus longtemps possible. Venez les essayer en magasin.</p>
      ${note}
      <p><a href="../nos-equipements.html">← Tous nos équipements</a></p>
      ${cta}`
  },
  {
    file: 'equipements/diagnostic.html',
    base: '../',
    title: 'Diagnostic et surveillance',
    description: 'Tensiomètres, oxymètres, thermomètres à Marseille. Matériel de surveillance MHC.',
    page: 'equipements/diagnostic.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Équipements', href: 'nos-equipements.html' }, { label: 'Diagnostic' }],
    hero: '<h1>Diagnostic et surveillance</h1><p>Le suivi à domicile, prescrit par votre médecin.</p>',
    body: `
      <ul>
        <li>Tensiomètres</li>
        <li>Oxymètres de pouls</li>
        <li>Thermomètres</li>
        <li>Matériel de surveillance prescrit</li>
      </ul>
      <p>Nous vous expliquons l'utilisation du matériel et assurons le suivi de la prescription.</p>
      ${note}
      <p><a href="../nos-equipements.html">← Tous nos équipements</a></p>
      ${cta}`
  },
  {
    file: 'comment-ca-marche.html',
    title: 'Comment ça marche',
    description: 'Comment obtenir votre matériel médical pris en charge à Marseille. Ordonnance, tiers payant, délais.',
    page: 'comment-ca-marche.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Vous êtes patient', href: 'vous-etes-patient.html' }, { label: 'Comment ça marche' }],
    hero: '<h1>Comment ça marche</h1><p>Apportez votre ordonnance, on s\'occupe du reste.</p>',
    body: `
      <h2>Faut-il une ordonnance ?</h2>
      <p>Oui, pour tout le matériel pris en charge. Pour les produits de confort, aucune ordonnance n'est nécessaire.</p>
      <h2>Combien ça coûte ?</h2>
      <p>Pour le matériel pris en charge : <strong>rien à avancer</strong>. Tiers payant intégral CPAM et mutuelle.</p>
      ${note}
      <h2>Accord préalable ?</h2>
      <p><strong>C'est nous qui nous en occupons</strong> : dossier et suivi inclus.</p>
      <h2>Achat ou location ?</h2>
      <p>Nous vous expliquons ce qui est adapté lors de votre visite.</p>
      <h2>Combien de temps ?</h2>
      <p>Produits en stock : souvent le jour même. Avec accord préalable : nous vous tenons informés.</p>
      <h2>Matériel ne convient pas ?</h2>
      <p>Réglage, échange ou SAV — nous nous en occupons.</p>
      <h2 id="aidant">Vous êtes aidant ?</h2>
      <p>Consultez nos guides :</p>
      <ul>
        <li><a href="aidant/retour-hospitalisation.html">Retour d'hospitalisation</a></li>
        <li><a href="aidant/equiper-domicile.html">Équiper le domicile</a></li>
        <li><a href="aidant/prevenir-chutes.html">Prévenir les chutes</a></li>
      </ul>
      <div style="margin-top:32px;text-align:center;">
        <a href="tel:+33777778947" class="btn btn--primary">Nous appeler</a>
        <a href="le-magasin.html" class="btn btn--secondary" style="margin-left:12px;">Venir au magasin</a>
      </div>`
  },
  {
    file: 'nos-equipements.html',
    title: 'Nos équipements',
    description: 'Catalogue matériel médical Marseille : mobilité, chambre, salle de bain, vie quotidienne, diagnostic.',
    page: 'nos-equipements.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Nos équipements' }],
    hero: '<h1>Nos équipements</h1><p>Matériel médical pour le maintien à domicile. Pas de prix affiché.</p>',
    body: `
      <div class="note">Nous ne commercialisons que les dispositifs des Titres I et IV de la LPPR. Aucun prix ni montant de remboursement n'est affiché.</div>
      <div class="guide-list">
        <a href="equipements/mobilite.html" class="guide-item"><div class="guide-item__icon">🦽</div><div><h2 class="guide-item__title">Mobilité et déplacement</h2><p class="guide-item__text">Fauteuils roulants, déambulateurs, cannes</p></div></a>
        <a href="equipements/chambre.html" class="guide-item"><div class="guide-item__icon">🛏️</div><div><h2 class="guide-item__title">Chambre et lit médicalisé</h2><p class="guide-item__text">Lits, matelas anti-escarres, potences</p></div></a>
        <a href="equipements/salle-de-bain.html" class="guide-item"><div class="guide-item__icon">🚿</div><div><h2 class="guide-item__title">Salle de bain et WC</h2><p class="guide-item__text">Barres d'appui, sièges de douche, rehausseurs</p></div></a>
        <a href="equipements/vie-quotidienne.html" class="guide-item"><div class="guide-item__icon">🍽️</div><div><h2 class="guide-item__title">Vie quotidienne</h2><p class="guide-item__text">Aides aux repas, habillage, préhension</p></div></a>
        <a href="equipements/diagnostic.html" class="guide-item"><div class="guide-item__icon">💓</div><div><h2 class="guide-item__title">Diagnostic et surveillance</h2><p class="guide-item__text">Tensiomètres, oxymètres, thermomètres</p></div></a>
      </div>
      ${cta}`
  },
  {
    file: 'professionnels-sante.html',
    title: 'Professionnels de santé',
    description: 'Partenaire PSDM pour prescripteurs à Marseille. Délivrance, installation, gestion administrative.',
    page: 'professionnels-sante.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Professionnels de santé' }],
    hero: '<h1>Un partenaire pour vos patients</h1><p>De la prescription à l\'installation, nous gérons tout l\'administratif.</p>',
    body: `
      <h2>Ce que nous délivrons</h2>
      <p>Dispositifs médicaux Titres I et IV : mobilité, chambre, salle de bain, vie quotidienne, diagnostic. <a href="nos-equipements.html">Voir le catalogue →</a></p>
      <h2>Zone d'intervention</h2>
      <p>Magasin et livraison/installation dans les Bouches-du-Rhône. Point de vente à Marseille 15<sup>e</sup>.</p>
      <h2>Délais</h2>
      <p>En stock : jour même ou sous 48h. Avec accord préalable : dossier constitué et suivi assuré.</p>
      <h2>Gestion administrative</h2>
      <ul><li>Ententes préalables</li><li>Télétransmission CPAM et mutuelles</li><li>Tiers payant intégral</li><li>Suivi et renouvellement</li></ul>
      <h2>Contact prescripteurs</h2>
      <p><strong>Tél :</strong> <a href="tel:+33777778947">07 77 77 89 47</a> · <strong>Email :</strong> <a href="mailto:contact@mhcmedical.fr">contact@mhcmedical.fr</a></p>
      <p><a href="contact.html?type=prescripteur" class="btn btn--primary">Demande d'équipement pour un patient</a></p>`
  },
  {
    file: 'le-magasin.html',
    title: 'Le magasin',
    description: 'Magasin matériel médical Marseille : 185 av. de Saint Louis. Horaires et plan d\'accès.',
    page: 'le-magasin.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Le magasin' }],
    hero: '<h1>Le magasin</h1><p>Un magasin, des gens. Venez nous rencontrer à Marseille.</p>',
    body: `
      <div class="store-grid">
        <div class="store-info">
          <h3 style="margin-top:0;">Adresse</h3><p><strong>185 avenue de Saint Louis</strong><br>13015 Marseille</p>
          <h3>Horaires</h3><p>Lun–ven : 9h–12h / 14h30–18h</p>
          <h3>Téléphone</h3><p><a href="tel:+33777778947" style="font-size:22px;font-weight:700;">07 77 77 89 47</a></p>
          <h3>Quoi apporter ?</h3>
          <ul><li>Ordonnance médicale</li><li>Carte Vitale</li><li>Attestation mutuelle</li></ul>
          <a href="equipe.html" class="btn btn--secondary" style="margin-top:12px;">Découvrir l'équipe</a>
        </div>
        <div class="store-map"><iframe title="Plan MHC Marseille" src="https://maps.google.com/maps?q=185+avenue+de+Saint+Louis+13015+Marseille&output=embed" loading="lazy" allowfullscreen></iframe></div>
      </div>
      ${cta}`
  },
  {
    file: 'contact.html',
    title: 'Contact',
    description: 'Contactez MHC Marseille : 07 77 77 89 47, contact@mhcmedical.fr',
    page: 'contact.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Contact' }],
    hero: '<h1>Contact</h1><p>Le plus simple : appelez-nous.</p>',
    body: `
      <div class="store-grid">
        <div>
          <h2 style="margin-top:0;color:var(--blue);">Nous appeler</h2>
          <p style="font-size:28px;font-weight:700;"><a href="tel:+33777778947">07 77 77 89 47</a></p>
          <p>Lun–ven 9h–12h / 14h30–18h</p>
          <h2>Email</h2><p><a href="mailto:contact@mhcmedical.fr">contact@mhcmedical.fr</a></p>
          <h2>Adresse</h2><p>185 avenue de Saint Louis, 13015 Marseille</p>
          <div class="note" style="margin-top:20px;"><strong>Pas de données de santé</strong> dans le formulaire. Pour une question médicale, appelez-nous.</div>
        </div>
        <div>
          <h2 style="margin-top:0;color:var(--blue);">Formulaire de contact</h2>
          <form class="form" id="contact-form">
            <div class="form-group"><label for="name">Votre nom</label><input type="text" id="name" name="name" required autocomplete="name"></div>
            <div class="form-group"><label for="email">Votre email</label><input type="email" id="email" name="email" required autocomplete="email"></div>
            <div class="form-group"><label for="type">Vous êtes</label>
              <select id="type" name="type">
                <option value="patient">Patient ou aidant</option>
                <option value="prescripteur">Professionnel de santé</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div class="form-group"><label for="message">Votre message</label>
              <textarea id="message" name="message" required placeholder="Sans informations médicales"></textarea>
              <p class="form-hint">Ne mentionnez pas de données de santé. Appelez le 07 77 77 89 47 pour toute question médicale.</p>
            </div>
            <button type="submit" class="btn btn--primary">Envoyer</button>
          </form>
        </div>
      </div>`
  },
  {
    file: '404.html',
    title: 'Page introuvable',
    description: 'Page non trouvée',
    page: '404.html',
    trail: [{ label: 'Accueil', href: 'index.html' }, { label: 'Page introuvable' }],
    hero: '<h1>Page introuvable</h1><p>Désolé, cette page n\'existe pas ou a été déplacée.</p>',
    body: `<div class="error-page" style="padding:20px 0;">
      <p><a href="index.html" class="btn btn--primary">Retour à l'accueil</a></p>
      <p style="margin-top:20px;">Ou appelez-nous : <a href="tel:+33777778947">07 77 77 89 47</a></p>
    </div>`
  }
];

for (const p of pages) {
  const dir = dirname(join(ROOT, p.file));
  mkdirSync(dir, { recursive: true });
  const html = shell({
    title: p.title,
    description: p.description,
    page: p.page,
    base: p.base || '',
    trail: p.trail,
    content: { hero: p.hero, body: p.body }
  });
  writeFileSync(join(ROOT, p.file), html);
  console.log('✓', p.file);
}

console.log(`\n${pages.length} pages générées.`);
