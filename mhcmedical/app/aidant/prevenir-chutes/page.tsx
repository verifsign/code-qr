import Link from "next/link";
import { Phone, ChevronRight, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prévenir les chutes — MHC Medical Marseille",
  description: "Guide pour prévenir les chutes à domicile chez les personnes âgées. Équipements, aménagements, conseils pratiques.",
};

export default function PrevenirChutesPage() {
  return (
    <>
      <section className="py-14 md:py-20" style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}>
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm flex-wrap">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><Link href="/aidant" className="hover:text-white">Aidant</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-white font-medium">Prévenir les chutes</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Prévenir les chutes à domicile</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed">
            La chute est la première cause d&apos;hospitalisation des plus de 65 ans.
            Des aménagements simples peuvent changer la situation.
          </p>
        </div>
      </section>

      <div className="section bg-white">
        <div className="container max-w-3xl space-y-10">
          {[
            {
              titre: "Les zones à risque dans le logement",
              contenu: "Salle de bain (sol mouillé, entrée/sortie de douche ou baignoire), escaliers, couloirs étroits ou encombrés, chambres mal éclairées. Ce sont les endroits où les chutes arrivent le plus souvent.",
            },
            {
              titre: "Les équipements qui font la différence",
              contenu: "Barres d'appui dans la douche, à côté des toilettes et dans le couloir. Siège de douche pour éviter de rester debout. Revêtements antidérapants. Rehausseur WC pour faciliter les transferts. Bonne partie de ces équipements sont remboursés sur ordonnance.",
            },
            {
              titre: "Les aides à la marche",
              contenu: "Un déambulateur ou un rollator apporte un appui stable pour les déplacements intérieurs. Une canne simple peut suffire pour compenser une légère instabilité. L'important est d'utiliser l'aide adaptée — votre médecin ou kinésithérapeute peut vous conseiller.",
            },
            {
              titre: "Si une chute arrive",
              contenu: "Ne bougez pas la personne si vous n'y êtes pas formé. Appelez le 15 (SAMU) ou le 18 (pompiers). Une fois la situation stabilisée, c'est souvent le moment de réévaluer l'aménagement du domicile.",
            },
          ].map((section, idx) => (
            <article key={idx}>
              <h2 className="text-brand-blue mb-3">{section.titre}</h2>
              <p className="text-neutral-700 leading-relaxed">{section.contenu}</p>
            </article>
          ))}

          <div className="rounded-2xl p-8 text-white text-center" style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}>
            <h2 className="text-white mb-3">On fait le point ensemble ?</h2>
            <p className="text-white/85 mb-6">Appelez-nous pour identifier le matériel utile et vérifier ce qui peut être pris en charge.</p>
            <a href="tel:+33XXXXXXXXX" className="btn btn-outline-white">
              <Phone size={20} aria-hidden="true" />
              04 XX XX XX XX
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
