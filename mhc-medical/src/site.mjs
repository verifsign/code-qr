/* Configuration centrale du site — coordonnées, navigation, mentions.
   NOTE : les valeurs marquées « À CONFIRMER » sont des espaces réservés à
   remplacer par les informations définitives fournies par le client. */

export const site = {
  name: "Medical Health and Care",
  legalName: "SAS MEDICAL HEALTH AND CARE",
  shortName: "MHC",
  domain: "mhcmedical.fr",
  baseUrl: "https://mhcmedical.fr",
  tagline: "Votre matériel médical pris en charge, sans avance de frais.",

  // Coordonnées — À CONFIRMER (numéro et email professionnels définitifs)
  phoneDisplay: "04 91 00 00 00",
  phoneHref: "+33491000000",
  email: "contact@mhcmedical.fr",
  proPhoneDisplay: "04 91 00 00 00",
  proPhoneHref: "+33491000000",
  proEmail: "prescripteurs@mhcmedical.fr",

  address: {
    street: "185 avenue de Saint Louis",
    zip: "13015",
    city: "Marseille",
    country: "France",
  },
  mapsQuery: "185+avenue+de+Saint+Louis+13015+Marseille",

  hours: [
    { day: "Lundi", value: "9h–12h · 14h30–18h" },
    { day: "Mardi", value: "9h–12h · 14h30–18h" },
    { day: "Mercredi", value: "9h–12h · 14h30–18h" },
    { day: "Jeudi", value: "9h–12h · 14h30–18h" },
    { day: "Vendredi", value: "9h–12h · 14h30–18h" },
    { day: "Samedi", value: "Fermé" },
    { day: "Dimanche", value: "Fermé" },
  ],
  hoursShort: "Du lundi au vendredi · 9h–12h et 14h30–18h",

  // Mentions légales
  siren: "983 367 699",
  rcs: "RCS Marseille",
  capital: "À CONFIRMER (capital social)",
  tva: "À CONFIRMER (TVA intracommunautaire)",
  publicationDirector: "À CONFIRMER (directeur de la publication)",
  host: {
    name: "OVH SAS",
    detail:
      "2 rue Kellermann — 59100 Roubaix — France. RCS Lille Métropole 424 761 419 00045. Téléphone : 1007.",
  },
};

// Structure de navigation principale (les 3 publics + magasin + contact)
export const nav = [
  {
    label: "Vous êtes patient",
    href: "patient.html",
    children: [
      { label: "Comment ça marche", href: "comment-ca-marche.html" },
      { label: "Ce qui est pris en charge", href: "pris-en-charge.html" },
      { label: "Venir au magasin", href: "magasin.html" },
    ],
  },
  {
    label: "Vous êtes aidant",
    href: "aidant.html",
    children: [
      { label: "Équiper le domicile d’un proche", href: "aidant-equiper-domicile.html" },
      { label: "Retour d’hospitalisation", href: "aidant-retour-hospitalisation.html" },
      { label: "Prévenir les chutes", href: "aidant-prevenir-chutes.html" },
    ],
  },
  {
    label: "Nos équipements",
    href: "equipements.html",
    children: [
      { label: "Mobilité et déplacement", href: "equipements-mobilite.html" },
      { label: "Chambre et lit médicalisé", href: "equipements-chambre.html" },
      { label: "Salle de bain et toilettes", href: "equipements-salle-de-bain.html" },
      { label: "Vie quotidienne", href: "equipements-vie-quotidienne.html" },
      { label: "Diagnostic et surveillance", href: "equipements-diagnostic.html" },
    ],
  },
  {
    label: "Professionnels de santé",
    href: "professionnels.html",
    children: [
      { label: "Travailler avec nous", href: "professionnels.html#travailler" },
      { label: "Ce que nous délivrons", href: "professionnels.html#delivrons" },
      { label: "Contact direct prescripteurs", href: "professionnels.html#contact" },
    ],
  },
  { label: "Le magasin", href: "magasin.html" },
  { label: "Contact", href: "contact.html" },
];

export const footerLinks = [
  { label: "Mentions légales", href: "mentions-legales.html" },
  { label: "Politique de confidentialité", href: "confidentialite.html" },
  { label: "Gestion des cookies", href: "cookies.html" },
  { label: "Réclamations et matériovigilance", href: "materiovigilance.html" },
];
