import EquipmentPageTemplate from "@/components/EquipmentPageTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salle de bain et toilettes — MHC Medical Marseille",
  description: "Barres d'appui, sièges de douche, rehausseurs WC pour sécuriser la salle de bain.",
};

export default function SalleDeBainPage() {
  return (
    <EquipmentPageTemplate
      titre="Salle de bain et toilettes"
      emoji="🚿"
      breadcrumb="Salle de bain et toilettes"
      description="La salle de bain est la pièce la plus à risque de chute. Ces équipements simples à installer changent tout en termes de sécurité."
      produits={[
        { nom: "Barre d'appui droite murale", description: "En aluminium ou inox, fixation murale solide. Disponible en 40, 60 et 80 cm." },
        { nom: "Barre d'appui d'angle", description: "Pour les coins de douche, maintien optimal lors de l'entrée et la sortie." },
        { nom: "Siège de douche mural rabattable", description: "Se replie lorsqu'il n'est pas utilisé. Charge max 150 kg en général." },
        { nom: "Chaise de douche avec dossier", description: "Autonome, sans fixation murale. Avec ou sans accoudoirs, hauteur réglable." },
        { nom: "Planche de bain", description: "S'accroche sur les bords de la baignoire pour faciliter les transferts." },
        { nom: "Rehausseur de WC simple", description: "Élève la hauteur des toilettes de 10 à 15 cm. Facile à poser et retirer." },
        { nom: "Rehausseur de WC avec accoudoirs", description: "Accoudoirs relevables pour faciliter le lever. Indispensable après opération de la hanche." },
        { nom: "Chaise percée", description: "Pour les personnes ne pouvant pas se déplacer aux toilettes. Avec seau hygiénique." },
      ]}
      conseil="Nous pouvons vous conseiller sur les équipements les mieux adaptés à la configuration de votre salle de bain. Certains nécessitent une ordonnance pour être pris en charge — appelez-nous pour faire le point."
    />
  );
}
