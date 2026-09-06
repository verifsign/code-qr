import EquipmentPageTemplate from "@/components/EquipmentPageTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vie quotidienne — MHC Medical Marseille",
  description: "Aides techniques pour les gestes du quotidien : habillage, repas, préhension.",
};

export default function VieQuotidiennePage() {
  return (
    <EquipmentPageTemplate
      titre="Vie quotidienne"
      emoji="🏠"
      breadcrumb="Vie quotidienne"
      description="Des aides techniques simples qui préservent l'autonomie au quotidien et facilitent la vie des aidants."
      produits={[
        { nom: "Enfile-bas et chausse-pied long", description: "Pour s'habiller sans se pencher. Indispensable après opération de la hanche.", remboursable: false },
        { nom: "Couverts à manchons épaissis", description: "Manches larges faciles à saisir pour les personnes avec une mobilité réduite des mains.", remboursable: false },
        { nom: "Assiettes antidérapantes", description: "Fond ventousé pour maintenir l'assiette en place lors du repas.", remboursable: false },
        { nom: "Pince de préhension", description: "Permet de ramasser des objets au sol sans se baisser.", remboursable: false },
        { nom: "Plateau de lit multipositions", description: "Pour manger, lire ou travailler au lit. Réglable en hauteur et inclinaison.", remboursable: false },
        { nom: "Coussin de positionnement", description: "Pour maintenir une position confortable dans le lit ou le fauteuil.", remboursable: false },
        { nom: "Aide à la marche intérieure", description: "Barres de couloir ou poignées de porte pour sécuriser les déplacements dans le logement." },
        { nom: "Téléalarme / détecteur de chute", description: "Pour les personnes seules. Déclenche une alerte en cas de chute ou à la demande.", remboursable: false },
      ]}
      conseil="La plupart des aides de la vie quotidienne sont des ventes libres. Certains équipements peuvent bénéficier d'aides locales (conseil départemental, caisse de retraite). Contactez-nous pour un conseil personnalisé."
    />
  );
}
