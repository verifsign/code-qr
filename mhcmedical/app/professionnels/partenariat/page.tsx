import Link from "next/link";
import { ChevronRight, Phone, CheckCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travailler avec nous — MHC Medical Marseille",
  description: "Devenez partenaire de MHC Medical. Nous accompagnons vos patients et gérons l'ensemble des démarches administratives.",
};

export default function PartenariatPage() {
  return (
    <>
      <section className="py-14 md:py-20" style={{ background: "linear-gradient(135deg, #123a6a 0%, #1a4e8a 100%)" }}>
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm flex-wrap">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><Link href="/professionnels" className="hover:text-white">Professionnels</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-white font-medium">Travailler avec nous</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Travailler avec nous</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed">
            Un partenariat simple : vous prescrivez, nous délivrons, nous gérons.
          </p>
        </div>
      </section>

      <div className="section bg-white">
        <div className="container max-w-3xl space-y-10">
          {[
            {
              titre: "Ce que nous attendons de vous",
              items: [
                "Une ordonnance lisible et complète",
                "Les coordonnées du patient si une livraison est nécessaire",
                "Un moyen de contact pour les questions éventuelles",
              ],
            },
            {
              titre: "Ce que vous pouvez attendre de nous",
              items: [
                "Disponibilité téléphonique du lundi au vendredi",
                "Prise en charge administrative complète (accord préalable, télétransmission)",
                "Délais transparents et tenus",
                "Retour d'information si un dossier pose problème",
                "Un interlocuteur identifié, pas un numéro de standard",
              ],
            },
          ].map((section) => (
            <article key={section.titre}>
              <h2 className="text-brand-blue mb-4">{section.titre}</h2>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-brand-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <div className="rounded-2xl p-8 text-white" style={{ background: "linear-gradient(135deg, #123a6a 0%, #1a4e8a 100%)" }}>
            <h2 className="text-white mb-3">Initier le contact</h2>
            <p className="text-white/85 mb-6 leading-relaxed">
              Pas de formalité particulière pour travailler avec nous. Appelez-nous ou envoyez-nous
              votre première demande — le reste suivra naturellement.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+33XXXXXXXXX" className="btn btn-outline-white">
                <Phone size={20} aria-hidden="true" />
                04 XX XX XX XX
              </a>
              <Link href="/professionnels/contact" className="btn btn-secondary">
                Formulaire prescripteurs
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
