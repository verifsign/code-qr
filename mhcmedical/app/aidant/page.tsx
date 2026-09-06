import Link from "next/link";
import { Phone, ArrowRight, ChevronRight, Home, Building2, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vous êtes aidant — MHC Medical Marseille",
  description:
    "Vous aidez un proche à rester chez lui ? Guides pratiques pour équiper un domicile, préparer un retour d'hospitalisation et prévenir les chutes.",
};

const guides = [
  {
    icon: Home,
    titre: "Équiper le domicile d'un proche",
    description:
      "Vous souhaitez adapter le logement d'un parent âgé ou d'un proche en perte d'autonomie. Par où commencer, que faut-il vraiment, et comment est-ce pris en charge ?",
    href: "/aidant/equiper-domicile",
    couleur: "#1a4e8a",
    points: [
      "Évaluation des besoins",
      "Pièce par pièce : salle de bain, chambre, salon",
      "Les équipements prioritaires",
      "Financement et remboursement",
    ],
  },
  {
    icon: Building2,
    titre: "Retour d'hospitalisation",
    description:
      "Votre proche sort de l'hôpital ou d'une clinique. Vous avez peu de temps pour organiser le retour à domicile. Voici ce qu'il faut anticiper.",
    href: "/aidant/retour-hospitalisation",
    couleur: "#2a9d8f",
    points: [
      "Contacter le service social hospitalier",
      "Obtenir l'ordonnance de sortie",
      "Le matériel livrable en urgence",
      "Coordination avec l'équipe soignante",
    ],
  },
  {
    icon: Shield,
    titre: "Prévenir les chutes",
    description:
      "La chute à domicile est la première cause d'hospitalisation chez les personnes âgées. Des aménagements simples peuvent changer la situation.",
    href: "/aidant/prevenir-chutes",
    couleur: "#1a4e8a",
    points: [
      "Les zones à risque dans le logement",
      "Barres d'appui, revêtements, éclairage",
      "Les aides à la marche adaptées",
      "Les réflexes si une chute arrive",
    ],
  },
];

export default function AidantPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="py-14 md:py-20"
        style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}
      >
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-white font-medium">Vous êtes aidant</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Vous aidez un proche ?</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed mb-8">
            Fils, fille, conjoint, voisin — vous cherchez à équiper le domicile d&apos;un
            proche rapidement et bien, sans vous perdre dans les démarches. C&apos;est
            exactement ce que nous faisons.
          </p>
          <a href="tel:+33XXXXXXXXX" className="btn btn-outline-white">
            <Phone size={20} aria-hidden="true" />
            Nous appeler — 04 XX XX XX XX
          </a>
        </div>
      </section>

      {/* Intro */}
      <section className="section-sm bg-brand-teal-pale">
        <div className="container max-w-3xl text-center">
          <p className="text-neutral-800 text-lg leading-relaxed">
            <strong>Votre temps est précieux.</strong> Nous pouvons vous conseiller au
            téléphone, vous accueillir au magasin avec ou sans votre proche, préparer
            la liste du matériel nécessaire, et livrer à domicile.
            Appelez-nous, on fait le point ensemble.
          </p>
        </div>
      </section>

      {/* Guides */}
      <section aria-labelledby="guides-titre" className="section bg-white">
        <div className="container">
          <h2 id="guides-titre" className="text-brand-blue text-center mb-10">
            Nos guides pratiques
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {guides.map((guide) => {
              const Icon = guide.icon;
              return (
                <article key={guide.href} className="card flex flex-col gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: guide.couleur }}
                  >
                    <Icon size={28} className="text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-neutral-900">{guide.titre}</h3>
                  <p className="text-neutral-600 leading-relaxed flex-1">
                    {guide.description}
                  </p>
                  <ul className="space-y-1.5">
                    {guide.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-sm text-neutral-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal flex-shrink-0" aria-hidden="true" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={guide.href}
                    className="inline-flex items-center gap-1.5 text-brand-blue font-semibold hover:gap-3 transition-all text-sm mt-auto"
                  >
                    Lire le guide
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conseil téléphonique */}
      <section className="section bg-neutral-50">
        <div className="container max-w-3xl">
          <div className="card text-center">
            <div className="text-4xl mb-4" role="img" aria-label="Téléphone">📞</div>
            <h2 className="text-brand-blue mb-4">
              Pas le temps de chercher ? Appelez-nous.
            </h2>
            <p className="text-neutral-700 leading-relaxed mb-6">
              Décrivez-nous la situation de votre proche en quelques mots. En cinq
              minutes au téléphone, on peut souvent identifier le matériel nécessaire,
              vérifier s&apos;il est pris en charge, et vous dire quoi faire ensuite.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+33XXXXXXXXX" className="btn btn-primary text-lg">
                <Phone size={20} aria-hidden="true" />
                04 XX XX XX XX
              </a>
              <Link href="/contact" className="btn btn-outline">
                Nous écrire
              </Link>
            </div>
            <p className="text-neutral-500 text-sm mt-4">
              Lundi au vendredi · 9h–12h et 14h30–18h
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
