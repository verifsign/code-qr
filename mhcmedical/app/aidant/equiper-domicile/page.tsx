import Link from "next/link";
import { Phone, ChevronRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Équiper le domicile d'un proche — MHC Medical Marseille",
  description: "Guide pratique pour adapter le domicile d'un proche âgé ou en perte d'autonomie. Matériel, remboursement, conseils.",
};

export default function EquiperDomicilePage() {
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
              <li className="text-white font-medium">Équiper le domicile</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Équiper le domicile d&apos;un proche</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed">
            Un guide pratique, pièce par pièce, pour sécuriser et adapter le logement.
          </p>
        </div>
      </section>

      <div className="section bg-white">
        <div className="container max-w-3xl space-y-10">
          {[
            {
              titre: "Par où commencer ?",
              contenu: "Avant de commander quoi que ce soit, faites le tour du logement avec votre proche — ou avec un professionnel de santé. Les besoins varient beaucoup selon la pathologie, le niveau d'autonomie et la configuration du logement. Un médecin traitant ou un ergothérapeute peut réaliser une évaluation formelle.",
            },
            {
              titre: "La salle de bain en priorité",
              contenu: "C'est la pièce la plus à risque. Les équipements prioritaires : barres d'appui (mur et baignoire), siège de douche ou de bain, rehausseur de WC avec accoudoirs, revêtement antidérapant. La plupart de ces équipements sont pris en charge sur ordonnance.",
            },
            {
              titre: "La chambre",
              contenu: "Si votre proche a du mal à se lever ou se coucher, un lit médicalisé peut changer la vie. Il permet de régler la hauteur, le dossier et les jambes électriquement. Une potence de lit facilite les transferts. Ces équipements sont pris en charge sur prescription médicale.",
            },
            {
              titre: "La circulation dans le logement",
              contenu: "Un déambulateur ou un rollator aide à se déplacer en sécurité à l'intérieur. Pour l'extérieur, un fauteuil roulant peut être utile pour les sorties. Pensez aussi aux barres de couloir si les murs le permettent.",
            },
            {
              titre: "Le financement",
              contenu: "La plupart des équipements listés ci-dessus sont pris en charge par l'Assurance Maladie sur ordonnance. Certaines aides à l'adaptation du logement (travaux) relèvent d'autres dispositifs : ANAH, caisse de retraite, conseil départemental. Nous nous occupons uniquement du matériel médical.",
            },
          ].map((section, idx) => (
            <article key={idx}>
              <h2 className="text-brand-blue mb-3">{section.titre}</h2>
              <p className="text-neutral-700 leading-relaxed">{section.contenu}</p>
            </article>
          ))}

          <div className="rounded-2xl p-8 text-white text-center" style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}>
            <h2 className="text-white mb-3">Vous ne savez pas par où commencer ?</h2>
            <p className="text-white/85 mb-6">Appelez-nous. En quelques minutes, on fait le point sur ce qui est vraiment utile et ce qui peut être pris en charge.</p>
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
