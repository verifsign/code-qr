/* Familles d'équipements. IMPORTANT : aucun prix, aucun remboursement chiffré.
   Uniquement des produits relevant du périmètre de la société (pas de Titre II :
   ni orthèses, ni attelles, ni genouillères). */

export const categories = [
  {
    slug: "equipements-mobilite",
    icon: "wheelchair",
    title: "Mobilité et déplacement",
    short: "Fauteuils roulants, déambulateurs, cannes.",
    intro:
      "Se déplacer chez soi et à l’extérieur en toute sécurité, retrouver de l’autonomie et soulager l’entourage.",
    items: [
      "Fauteuils roulants manuels, à pousser ou de confort",
      "Déambulateurs, cadres de marche et rollators",
      "Cannes, béquilles et accessoires de marche",
      "Scooters et aides à la mobilité",
      "Coussins de positionnement et anti-escarres pour l’assise",
    ],
  },
  {
    slug: "equipements-chambre",
    icon: "bed",
    title: "Chambre et lit médicalisé",
    short: "Lits médicalisés, matelas anti-escarres, potences.",
    intro:
      "Aménager la chambre pour le repos, les soins et la prévention, à domicile comme après une hospitalisation.",
    items: [
      "Lits médicalisés à hauteur variable, barrières et télécommande",
      "Matelas et surmatelas anti-escarres",
      "Potences de lit et poignées de redressement",
      "Tables de lit et adaptables",
      "Alèses et protections de literie",
    ],
  },
  {
    slug: "equipements-salle-de-bain",
    icon: "bath",
    title: "Salle de bain et toilettes",
    short: "Barres d’appui, sièges de douche, rehausseurs.",
    intro:
      "Rendre la toilette plus sûre et plus confortable — la salle de bain est l’endroit où surviennent le plus de chutes.",
    items: [
      "Barres d’appui et poignées de maintien",
      "Sièges et tabourets de douche, planches de bain",
      "Chaises percées et rehausseurs de WC",
      "Tapis antidérapants et marchepieds",
      "Chaises de douche à roulettes",
    ],
  },
  {
    slug: "equipements-vie-quotidienne",
    icon: "cup",
    title: "Vie quotidienne",
    short: "Aides aux repas, à l’habillage, à la préhension.",
    intro:
      "Les petits gestes du quotidien, facilités par des aides techniques simples et bien choisies.",
    items: [
      "Couverts ergonomiques, assiettes et verres adaptés",
      "Aides à l’habillage et à l’enfilage",
      "Pinces et aides à la préhension",
      "Rehausseurs de fauteuil et aides au lever",
      "Enfile-bas, tourne-clés et objets du quotidien adaptés",
    ],
  },
  {
    slug: "equipements-diagnostic",
    icon: "monitor",
    title: "Diagnostic et surveillance",
    short: "Tensiomètres, oxymètres, thermomètres.",
    intro:
      "Suivre quelques constantes simples à la maison, pour soi ou pour un proche.",
    items: [
      "Tensiomètres au bras et au poignet",
      "Oxymètres de pouls",
      "Thermomètres",
      "Pèse-personnes adaptés",
      "Accessoires de suivi à domicile",
    ],
  },
];

export const categoryBySlug = Object.fromEntries(
  categories.map((c) => [c.slug, c])
);
