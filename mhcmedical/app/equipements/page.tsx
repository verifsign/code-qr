import Link from "next/link";
import { ChevronRight, ArrowRight, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos équipements médicaux — MHC Medical Marseille",
  description:
    "Catalogue d'équipements médicaux pris en charge : mobilité, chambre médicalisée, salle de bain, diagnostic. Livraison à Marseille et Bouches-du-Rhône.",
};

const categories = [
  {
    emoji: "🦽",
    titre: "Mobilité et déplacement",
    description:
      "Fauteuils roulants manuels et électriques, déambulateurs, rollators, cannes, béquilles. Pour se déplacer en sécurité à l'intérieur comme à l'extérieur.",
    exemples: ["Fauteuil roulant manuel standard", "Déambulateur 4 roues (rollator)", "Canne simple réglable", "Béquilles anglaises", "Coussins anti-escarres pour fauteuil"],
    href: "/equipements/mobilite",
    couleur: "#1a4e8a",
  },
  {
    emoji: "🛏️",
    titre: "Chambre et lit médicalisé",
    description:
      "Lits médicalisés électriques pour faciliter les transferts et le confort. Matelas anti-escarres, potences, barrières de lit.",
    exemples: ["Lit médicalisé électrique 1 moteur", "Lit médicalisé électrique 3 moteurs", "Matelas anti-escarres", "Potence de lit", "Barrières de sécurité"],
    href: "/equipements/chambre",
    couleur: "#2a9d8f",
  },
  {
    emoji: "🚿",
    titre: "Salle de bain et toilettes",
    description:
      "Barres d'appui, sièges de douche, rehausseurs WC. Des équipements essentiels pour sécuriser les pièces les plus à risque de chute.",
    exemples: ["Barre d'appui droite 60 cm", "Siège de douche réglable", "Rehausseur WC avec accoudoirs", "Chaise percée", "Planche de bain"],
    href: "/equipements/salle-de-bain",
    couleur: "#1a4e8a",
  },
  {
    emoji: "🏠",
    titre: "Vie quotidienne",
    description:
      "Aides techniques pour les gestes du quotidien : repas, habillage, préhension. Des petits équipements qui changent beaucoup.",
    exemples: ["Enfile-bas et chausse-pied", "Couverts adaptés", "Aide à la préhension", "Plateau de lit", "Coussin de positionnement"],
    href: "/equipements/vie-quotidienne",
    couleur: "#2a9d8f",
  },
  {
    emoji: "💊",
    titre: "Diagnostic et surveillance",
    description:
      "Tensiomètres, oxymètres, thermomètres, glucomètres. Pour surveiller des paramètres de santé au quotidien, à domicile.",
    exemples: ["Tensiomètre bras automatique", "Oxymètre de pouls", "Thermomètre médical", "Lecteur de glycémie", "Nébuliseur / aérosol"],
    href: "/equipements/diagnostic",
    couleur: "#1a4e8a",
  },
];

export default function EquipementsPage() {
  return (
    <>
      <section
        className="py-14 md:py-20"
        style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}
      >
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-white font-medium">Nos équipements</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Nos équipements</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed">
            Du matériel médical de qualité, pris en charge par l&apos;Assurance Maladie
            selon les conditions de remboursement en vigueur — sans prix affiché,
            parce qu&apos;ils évoluent et que votre situation est unique.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="space-y-6">
            {categories.map((cat, idx) => (
              <article
                key={cat.href}
                className="card"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <span
                      className="text-4xl flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ background: idx % 2 === 0 ? "#e8f0fb" : "#e6f7f5" }}
                      role="img"
                      aria-hidden="true"
                    >
                      {cat.emoji}
                    </span>
                    <div className="flex-1">
                      <h2 className="text-neutral-900 mb-2">{cat.titre}</h2>
                      <p className="text-neutral-600 leading-relaxed mb-4">{cat.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {cat.exemples.map((ex) => (
                          <span
                            key={ex}
                            className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center md:items-end justify-start md:justify-end">
                    <Link
                      href={cat.href}
                      className="inline-flex items-center gap-1.5 text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm"
                      style={{ background: cat.couleur }}
                      aria-label={`En savoir plus sur ${cat.titre}`}
                    >
                      En savoir plus
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Note LPP */}
      <section className="section-sm bg-neutral-50">
        <div className="container max-w-3xl text-center">
          <p className="text-neutral-600 leading-relaxed">
            Les niveaux de prise en charge sont définis par la Liste des Produits et
            Prestations Remboursables (LPP) et peuvent évoluer. Pour savoir si votre
            matériel est pris en charge, appelez-nous avec votre ordonnance.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a href="tel:+33XXXXXXXXX" className="btn btn-primary">
              <Phone size={20} aria-hidden="true" />
              04 XX XX XX XX
            </a>
            <Link href="/patient/comment-ca-marche" className="btn btn-outline">
              Comment ça marche ?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
