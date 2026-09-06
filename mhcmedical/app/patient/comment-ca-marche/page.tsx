import Link from "next/link";
import { Phone, ArrowRight, ChevronRight, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment ça marche — MHC Medical Marseille",
  description:
    "Tout ce qu'il faut savoir sur l'obtention de votre matériel médical pris en charge : ordonnance, remboursement, délais, achat ou location.",
};

const sections = [
  {
    id: "ordonnance",
    titre: "Faut-il une ordonnance ?",
    contenu: (
      <>
        <p className="leading-relaxed text-neutral-700">
          <strong>Oui</strong>, pour tout matériel pris en charge par l&apos;Assurance
          Maladie (Sécurité Sociale). L&apos;ordonnance est la pièce de base : sans elle,
          nous ne pouvons pas enclencher la prise en charge.
        </p>
        <p className="leading-relaxed text-neutral-700 mt-3">
          L&apos;ordonnance doit être <strong>signée par un médecin</strong> (médecin
          traitant, médecin spécialiste, médecin hospitalier). Certains équipements
          peuvent également être prescrits par un masseur-kinésithérapeute ou un
          médecin de service hospitalier.
        </p>
        <p className="leading-relaxed text-neutral-700 mt-3">
          Pour les petits articles de confort non remboursables (certaines cannes
          légères, coussins de confort…), une ordonnance n&apos;est pas obligatoire — mais
          ces articles sont à votre charge.
        </p>
      </>
    ),
  },
  {
    id: "cout",
    titre: "Combien ça coûte ?",
    contenu: (
      <>
        <p className="leading-relaxed text-neutral-700">
          Pour le matériel pris en charge : <strong>rien à avancer.</strong> Nous
          pratiquons le tiers payant intégral : nous facturons directement la CPAM
          (Assurance Maladie) et votre complémentaire santé (mutuelle). Vous ne
          déboursez rien au moment de prendre le matériel.
        </p>
        <p className="leading-relaxed text-neutral-700 mt-3">
          <strong>Conditions :</strong> le remboursement dépend des taux en vigueur fixés
          par la Liste des Produits et Prestations (LPP). Si votre mutuelle ne couvre
          pas l&apos;intégralité du reste à charge, nous vous le signalons avant de
          procéder.
        </p>
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Important :</strong> nous ne pouvons pas indiquer de montants précis,
            car les tarifs de remboursement évoluent. Pour une estimation personnalisée,
            appelez-nous avec votre ordonnance.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "accord-prealable",
    titre: "Et si j'ai besoin d'un accord préalable ?",
    contenu: (
      <>
        <p className="leading-relaxed text-neutral-700">
          Certains matériels (notamment les lits médicalisés, les fauteuils roulants
          électriques ou certains matelas anti-escarres) nécessitent un{" "}
          <strong>accord préalable du médecin-conseil</strong> de votre caisse
          d&apos;Assurance Maladie avant de pouvoir être délivrés.
        </p>
        <p className="leading-relaxed text-neutral-700 mt-3">
          <strong>Vous n&apos;avez rien à faire.</strong> C&apos;est notre rôle. Nous
          montons le dossier, nous l&apos;envoyons à votre caisse, et nous vous tenons
          informé. Dès que l&apos;accord arrive, nous vous contactons pour vous remettre
          le matériel.
        </p>
      </>
    ),
  },
  {
    id: "achat-location",
    titre: "Achat ou location ?",
    contenu: (
      <>
        <p className="leading-relaxed text-neutral-700">
          Ça dépend du matériel et de la durée du besoin.
        </p>
        <ul className="mt-3 space-y-3 text-neutral-700">
          <li className="flex items-start gap-2">
            <span className="text-brand-teal font-bold mt-0.5">→</span>
            <span>
              <strong>Location :</strong> pour les besoins temporaires (convalescence
              après opération, rééducation…). Exemples : béquilles, déambulateurs,
              fauteuils roulants manuels.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-blue font-bold mt-0.5">→</span>
            <span>
              <strong>Achat :</strong> pour les besoins permanents liés à une perte
              d&apos;autonomie durable. Exemples : barres d&apos;appui, sièges de douche,
              rehausseurs WC.
            </span>
          </li>
        </ul>
        <p className="mt-3 text-neutral-700 leading-relaxed">
          Dans tous les cas, nous vous orientons vers la solution la plus adaptée et
          la plus avantageuse pour vous, selon votre situation et les conditions de
          prise en charge en vigueur.
        </p>
      </>
    ),
  },
  {
    id: "delais",
    titre: "Combien de temps ça prend ?",
    contenu: (
      <>
        <p className="leading-relaxed text-neutral-700">
          La plupart des équipements courants sont disponibles <strong>immédiatement</strong>{" "}
          en magasin : cannes, déambulateurs, barres d&apos;appui, sièges de douche,
          rehausseurs WC, tensiomètres, oxymètres.
        </p>
        <p className="leading-relaxed text-neutral-700 mt-3">
          Pour les équipements nécessitant un accord préalable ou une livraison à
          domicile (lits médicalisés, fauteuils roulants électriques…), comptez
          quelques jours ouvrés à partir de la réception de l&apos;accord de votre caisse.
          Nous vous communiquons un délai précis dès votre venue en magasin.
        </p>
      </>
    ),
  },
  {
    id: "sav",
    titre: "Et si le matériel ne convient pas ?",
    contenu: (
      <>
        <p className="leading-relaxed text-neutral-700">
          Notre travail ne s&apos;arrête pas à la remise du matériel. Si un réglage est
          nécessaire, nous le faisons sur place ou lors d&apos;un passage à domicile.
        </p>
        <p className="leading-relaxed text-neutral-700 mt-3">
          En cas de problème technique, nous avons un service après-vente. Appelez-nous
          — nous trouvons une solution avec vous, que ce soit un remplacement, un
          réglage ou une pièce détachée.
        </p>
      </>
    ),
  },
];

export default function CommentCaMarchePage() {
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
              <li className="text-white font-medium">Comment ça marche</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Comment ça marche ?</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed">
            Tout ce qu&apos;il faut savoir avant de venir — en langage clair.
          </p>
        </div>
      </section>

      {/* Sommaire */}
      <nav
        aria-label="Sommaire de la page"
        className="bg-white border-b border-neutral-200"
      >
        <div className="container py-4 overflow-x-auto">
          <div className="flex gap-2 flex-nowrap">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 hover:bg-brand-blue hover:text-white transition-colors text-sm font-medium"
              >
                {s.titre}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Sections */}
      <div className="section bg-white">
        <div className="container max-w-3xl">
          <div className="space-y-12">
            {sections.map((section, idx) => (
              <article key={section.id} id={section.id} className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{
                      background:
                        idx % 2 === 0
                          ? "linear-gradient(135deg, #1a4e8a, #2a6db8)"
                          : "linear-gradient(135deg, #2a9d8f, #3dbdad)",
                    }}
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>
                  <h2 className="text-brand-blue">{section.titre}</h2>
                </div>
                <div className="pl-12">{section.contenu}</div>
                {idx < sections.length - 1 && (
                  <hr className="mt-12 border-neutral-100" />
                )}
              </article>
            ))}
          </div>

          {/* CTA */}
          <div
            className="mt-14 rounded-2xl p-8 text-white text-center"
            style={{
              background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)",
            }}
          >
            <h2 className="text-white mb-3">Il vous reste une question ?</h2>
            <p className="text-white/85 mb-6">
              Appelez-nous — c&apos;est gratuit et sans engagement.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+33XXXXXXXXX" className="btn btn-outline-white">
                <Phone size={20} aria-hidden="true" />
                04 XX XX XX XX
              </a>
              <Link href="/patient/prise-en-charge" className="btn btn-secondary">
                Ce qui est pris en charge
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
