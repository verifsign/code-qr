import Link from "next/link";
import { Phone, ArrowRight, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ce qui est pris en charge — MHC Medical Marseille",
  description:
    "Découvrez quels équipements médicaux peuvent être remboursés par l'Assurance Maladie. Matériel disponible chez MHC Medical à Marseille.",
};

const familles = [
  {
    titre: "Mobilité et déplacement",
    emoji: "🦽",
    items: [
      "Fauteuils roulants manuels",
      "Déambulateurs et cadres de marche",
      "Cannes et béquilles",
      "Rollators (déambulateurs à roulettes)",
      "Coussins anti-escarres pour fauteuil",
    ],
    href: "/equipements/mobilite",
  },
  {
    titre: "Chambre et lit médicalisé",
    emoji: "🛏️",
    items: [
      "Lits médicalisés électriques et mécaniques",
      "Matelas anti-escarres",
      "Potences de lit",
      "Surmatelas et protections",
      "Barrières de lit",
    ],
    href: "/equipements/chambre",
  },
  {
    titre: "Salle de bain et toilettes",
    emoji: "🚿",
    items: [
      "Barres d'appui murales et amovibles",
      "Sièges et bancs de douche",
      "Rehausseurs de WC avec ou sans accoudoirs",
      "Chaises percées",
      "Tapis antidérapants",
    ],
    href: "/equipements/salle-de-bain",
  },
  {
    titre: "Diagnostic et surveillance",
    emoji: "💊",
    items: [
      "Tensiomètres bras et poignet",
      "Oxymètres de pouls",
      "Thermomètres médicaux",
      "Glucomètres et lecteurs de glycémie",
      "Aérosols et nébuliseurs",
    ],
    href: "/equipements/diagnostic",
  },
];

export default function PriseEnChargePage() {
  return (
    <>
      <section
        className="py-14 md:py-20"
        style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}
      >
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm flex-wrap">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><Link href="/patient" className="hover:text-white">Patient</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-white font-medium">Ce qui est pris en charge</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Ce qui est pris en charge</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed">
            Les principaux équipements que nous délivrons et qui peuvent être remboursés,
            selon les conditions de prise en charge en vigueur.
          </p>
        </div>
      </section>

      {/* Avertissement légal */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container py-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-amber-800 text-sm leading-relaxed">
              Les niveaux de remboursement sont fixés par la Liste des Produits et Prestations
              (LPP) et peuvent évoluer. Cette liste est indicative. Pour votre situation précise,
              appelez-nous avec votre ordonnance.
            </p>
          </div>
        </div>
      </div>

      {/* Familles */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {familles.map((famille) => (
              <article key={famille.titre} className="card">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl" role="img" aria-hidden="true">
                    {famille.emoji}
                  </span>
                  <h2 className="text-brand-blue text-xl">{famille.titre}</h2>
                </div>
                <ul className="space-y-2 mb-6">
                  {famille.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle size={16} className="text-brand-teal flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={famille.href}
                  className="inline-flex items-center gap-1.5 text-brand-blue font-semibold hover:gap-3 transition-all text-sm"
                >
                  Voir le détail
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Ce qu'on ne couvre pas */}
      <section className="section bg-neutral-50">
        <div className="container max-w-3xl">
          <h2 className="text-brand-blue mb-6">Ce que nous ne couvrons pas</h2>
          <div className="card border-l-4 border-amber-400">
            <p className="text-neutral-700 leading-relaxed mb-4">
              Notre activité concerne les équipements des Titres I et IV de la LPP
              (aides techniques, matériel de maintien à domicile). Nous ne délivrons
              pas de produits relevant du <strong>Titre II</strong> (orthèses, prothèses,
              attelles, genouillères…).
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Si votre ordonnance concerne ce type de matériel, nous vous orientons
              vers un prestataire spécialisé.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="section"
        style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}
      >
        <div className="container text-center text-white">
          <h2 className="text-white mb-4">Votre matériel est pris en charge ?</h2>
          <p className="text-white/85 mb-8 text-lg max-w-xl mx-auto">
            Venez au magasin avec votre ordonnance et votre carte Vitale.
            On s&apos;occupe de tout.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+33XXXXXXXXX" className="btn btn-outline-white text-lg">
              <Phone size={20} aria-hidden="true" />
              04 XX XX XX XX
            </a>
            <Link href="/magasin" className="btn btn-secondary">
              Venir au magasin
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
