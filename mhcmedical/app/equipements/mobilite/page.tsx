import EquipmentPageTemplate from "@/components/EquipmentPageTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobilité et déplacement — MHC Medical Marseille",
  description: "Fauteuils roulants, déambulateurs, rollators, cannes et béquilles pris en charge à Marseille.",
};

export default function MobilitePage() {
  return (
    <EquipmentPageTemplate
      titre="Mobilité et déplacement"
      emoji="🦽"
      breadcrumb="Mobilité et déplacement"
      description="Des équipements pour se déplacer en sécurité, à l'intérieur comme à l'extérieur. La plupart sont pris en charge sur ordonnance."
      produits={[
        { nom: "Fauteuil roulant manuel standard", description: "Cadre léger, accoudoirs et repose-pieds amovibles. Pour les déplacements quotidiens intérieurs et extérieurs." },
        { nom: "Fauteuil roulant confort", description: "Assise rembourrée, réglages personnalisés pour les personnes nécessitant un équipement prolongé." },
        { nom: "Déambulateur 2 roues", description: "Cadre stable avec patins arrière. Pour les déplacements intérieurs sur sol régulier." },
        { nom: "Rollator (déambulateur 4 roues)", description: "Avec siège intégré, frein de maintien et panier. Idéal pour l'extérieur." },
        { nom: "Canne simple réglable", description: "En aluminium léger, réglable en hauteur. Pour compenser une légère instabilité." },
        { nom: "Béquilles anglaises", description: "Avec manchon d'avant-bras, réglables. Pour les convalescences après fracture ou opération." },
        { nom: "Coussin anti-escarres pour fauteuil", description: "Mousse ou air, pour prévenir les escarres lors des longues stations assises." },
        { nom: "Plateau de fauteuil", description: "Fixé sur les accoudoirs, pour manger ou travailler en position assise.", remboursable: false },
      ]}
      conseil="Vous ne savez pas quel équipement choisir ? Appelez-nous avec l'ordonnance de votre médecin — nous vous orientons vers la solution la plus adaptée et vous précisons ce qui est pris en charge."
    />
  );
}
