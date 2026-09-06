import Link from "next/link";
import { Phone, ChevronRight, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retour d'hospitalisation — MHC Medical Marseille",
  description: "Organiser le retour à domicile après une hospitalisation. Matériel médical, démarches, ordonnance de sortie.",
};

export default function RetourHospitalisationPage() {
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
              <li className="text-white font-medium">Retour d&apos;hospitalisation</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Retour d&apos;hospitalisation</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed">
            Comment organiser le retour à domicile en toute sécurité, même dans l&apos;urgence.
          </p>
        </div>
      </section>

      <div className="section bg-white">
        <div className="container max-w-3xl space-y-10">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>En urgence :</strong> si la sortie est prévue dans moins de 48h et que vous avez besoin de matériel rapidement, appelez-nous dès que possible. Nous pouvons souvent livrer et installer dans la journée pour les équipements courants.
            </p>
          </div>

          {[
            {
              titre: "1. Anticipez avant la sortie",
              contenu: "Idéalement, prenez contact avec l'assistante sociale du service hospitalier dès que la sortie est envisagée. Elle peut coordonner les intervenants à domicile (infirmiers, aides-soignants, kinésithérapeutes) et vous indiquer le matériel nécessaire.",
            },
            {
              titre: "2. L'ordonnance de sortie",
              contenu: "Le médecin hospitalier établit une ordonnance de sortie avec le matériel nécessaire. C'est cette ordonnance qu'il faut apporter chez nous. Si elle manque ou est incomplète, contactez le service — il peut la compléter ou en établir une nouvelle.",
            },
            {
              titre: "3. Ce qu'on peut livrer rapidement",
              contenu: "Barres d'appui, rehausseur WC, déambulateur, béquilles, fauteuil roulant : généralement disponibles le jour même ou le lendemain. Pour les lits médicalisés, prévenez-nous à l'avance si possible.",
            },
            {
              titre: "4. La coordination avec l'équipe soignante",
              contenu: "Si un infirmier ou une aide à domicile intervient chez votre proche, nous pouvons coordonner la livraison et l'installation avec eux. N'hésitez pas à nous communiquer leurs coordonnées.",
            },
          ].map((section, idx) => (
            <article key={idx}>
              <h2 className="text-brand-blue mb-3">{section.titre}</h2>
              <p className="text-neutral-700 leading-relaxed">{section.contenu}</p>
            </article>
          ))}

          <div className="rounded-2xl p-8 text-white text-center" style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}>
            <h2 className="text-white mb-3">Sortie prochaine ? Appelons-nous maintenant.</h2>
            <p className="text-white/85 mb-6">Plus vous appelez tôt, mieux on peut préparer le retour à domicile.</p>
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
