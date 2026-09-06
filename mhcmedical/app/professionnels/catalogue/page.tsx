import Link from "next/link";
import { ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ce que nous délivrons — MHC Medical Marseille",
  description: "Liste des gammes d'équipements médicaux délivrés par MHC Medical aux patients prescripteurs.",
};

const gammes = [
  {
    titre: "Aides à la mobilité (Titre I LPP)",
    items: [
      "Fauteuils roulants manuels (standard, confort, actif)",
      "Déambulateurs, rollators, cadres de marche",
      "Cannes et béquilles",
      "Coussins anti-escarres pour fauteuil",
    ],
  },
  {
    titre: "Maintien à domicile (Titre I LPP)",
    items: [
      "Lits médicalisés électriques (1 et 3 moteurs)",
      "Matelas anti-escarres (mousse et air)",
      "Potences et barrières de lit",
      "Barres d'appui, sièges de douche, rehausseurs WC",
    ],
  },
  {
    titre: "Dispositifs de surveillance (Titre I LPP)",
    items: [
      "Tensiomètres médicaux",
      "Oxymètres de pouls",
      "Thermomètres médicaux",
      "Nébuliseurs et aérosols",
    ],
  },
  {
    titre: "Aides techniques de la vie quotidienne",
    items: [
      "Aides à l'habillage et à la préhension",
      "Couverts et vaisselle adaptés",
      "Plateaux de lit",
    ],
  },
];

export default function CataloguePage() {
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
              <li className="text-white font-medium">Ce que nous délivrons</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Ce que nous délivrons</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed">
            Notre activité couvre les Titres I et IV de la LPP.
          </p>
        </div>
      </section>

      <div className="section bg-white">
        <div className="container">
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 max-w-3xl mx-auto">
            <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>Périmètre :</strong> nous ne délivrons pas de produits relevant du Titre II
              (orthèses, prothèses, attelles, genouillères). Si votre prescription concerne ces
              produits, nous vous orientons vers un prestataire spécialisé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {gammes.map((gamme) => (
              <div key={gamme.titre} className="card">
                <h2 className="text-brand-blue mb-4 text-lg">{gamme.titre}</h2>
                <ul className="space-y-2">
                  {gamme.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-neutral-700">
                      <CheckCircle size={15} className="text-brand-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
