import EquipmentPageTemplate from "@/components/EquipmentPageTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnostic et surveillance — MHC Medical Marseille",
  description: "Tensiomètres, oxymètres, thermomètres et glucomètres pour la surveillance à domicile.",
};

export default function DiagnosticPage() {
  return (
    <EquipmentPageTemplate
      titre="Diagnostic et surveillance"
      emoji="💊"
      breadcrumb="Diagnostic et surveillance"
      description="Des appareils de mesure fiables pour surveiller les paramètres de santé au quotidien, à domicile ou en déplacement."
      produits={[
        { nom: "Tensiomètre bras automatique", description: "Mesure de la pression artérielle au bras. Mémoire des mesures, détection d'arythmie sur certains modèles." },
        { nom: "Tensiomètre poignet", description: "Compact et portable. Pratique pour les contrôles réguliers en déplacement." },
        { nom: "Oxymètre de pouls", description: "Mesure la saturation en oxygène (SpO2) et la fréquence cardiaque en quelques secondes." },
        { nom: "Thermomètre frontal ou auriculaire", description: "Lecture rapide et sans contact ou auriculaire. Fiable et facile d'utilisation." },
        { nom: "Lecteur de glycémie", description: "Pour les personnes diabétiques. Avec bandelettes et lancettes fournies sur ordonnance." },
        { nom: "Nébuliseur / aérosol", description: "Pour les traitements inhalés des voies respiratoires (asthme, BPCO). Pris en charge sur prescription." },
        { nom: "Peak flow", description: "Mesure le débit expiratoire de pointe. Utile pour le suivi de l'asthme." },
        { nom: "Balance médicale", description: "Pesée précise avec mémoire des mesures. Pour le suivi pondéral des patients cardiaques ou sous dialyse.", remboursable: false },
      ]}
      conseil="Certains appareils de diagnostic sont remboursés sur ordonnance (lecteurs de glycémie, nébuliseurs…). Pour les autres, nous vous proposons des modèles grand public de qualité. Appelez-nous pour vérifier ce qui est pris en charge dans votre situation."
    />
  );
}
