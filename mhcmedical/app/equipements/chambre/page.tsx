import EquipmentPageTemplate from "@/components/EquipmentPageTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chambre et lit médicalisé — MHC Medical Marseille",
  description: "Lits médicalisés, matelas anti-escarres et accessoires de chambre pris en charge à Marseille.",
};

export default function ChambrePage() {
  return (
    <EquipmentPageTemplate
      titre="Chambre et lit médicalisé"
      emoji="🛏️"
      breadcrumb="Chambre et lit médicalisé"
      description="Un lit médicalisé facilite les transferts, améliore le confort et réduit le travail des aidants. Livraison et installation à domicile incluses."
      produits={[
        { nom: "Lit médicalisé 1 moteur", description: "Réglage électrique de la hauteur. Facilite les entrées et sorties du lit. Livré et installé à domicile." },
        { nom: "Lit médicalisé 3 moteurs", description: "Réglage indépendant de la hauteur, du dossier et des jambes. Pour les patients nécessitant une position personnalisée." },
        { nom: "Matelas anti-escarres en mousse", description: "Mousse à mémoire de forme ou multi-densité. Prévient les escarres pour les personnes peu mobiles." },
        { nom: "Matelas anti-escarres à air", description: "Gonflage alternatif automatique. Pour les patients à risque élevé d'escarres." },
        { nom: "Potence de lit", description: "Barre fixée au cadre du lit pour faciliter les transferts et les retournements autonomes." },
        { nom: "Barrières de lit", description: "Demi-barrières amovibles pour sécuriser les nuits sans bloquer les sorties." },
        { nom: "Arceau de lit", description: "Maintient les couvertures soulevées, soulageant la pression sur les membres.", remboursable: false },
        { nom: "Coussin de positionnement", description: "Pour maintenir la position latérale ou surélever un membre.", remboursable: false },
      ]}
      conseil="Les lits médicalisés nécessitent une ordonnance et, pour certains modèles, un accord préalable du médecin-conseil. Contactez-nous pour préparer votre dossier et organiser la livraison."
    />
  );
}
