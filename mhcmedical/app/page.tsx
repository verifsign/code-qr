import Link from "next/link";
import {
  Phone,
  ArrowRight,
  User,
  Heart,
  Stethoscope,
  ClipboardList,
  Store,
  Package,
  Wallet,
  Users,
  MapPin,
  CheckCircle,
  Award,
  Truck,
  Building2,
  ChevronRight,
} from "lucide-react";

/* ─── Données ────────────────────────────────────────────── */

const portesEntree = [
  {
    icon: User,
    titre: "Je suis patient",
    description:
      "J'ai une ordonnance et je veux savoir comment obtenir mon matériel sans avancer d'argent.",
    href: "/patient",
    couleur: "bg-brand-blue",
    cta: "Mon parcours en 4 étapes",
  },
  {
    icon: Heart,
    titre: "Je suis un proche aidant",
    description:
      "J'équipe le domicile d'un parent ou d'un proche. Je cherche un conseil rapide et fiable.",
    href: "/aidant",
    couleur: "bg-brand-teal",
    cta: "Guides pratiques",
  },
  {
    icon: Stethoscope,
    titre: "Je suis professionnel de santé",
    description:
      "Je prescris ou j'oriente mes patients. Je cherche un partenaire qui gère tout l'administratif.",
    href: "/professionnels",
    couleur: "bg-brand-blue-dark",
    cta: "Espace professionnels",
  },
];

const etapes = [
  {
    num: "1",
    titre: "Votre médecin vous prescrit",
    texte: "Une ordonnance pour le matériel dont vous avez besoin.",
    icon: ClipboardList,
  },
  {
    num: "2",
    titre: "Vous venez au magasin",
    texte: "Avec votre ordonnance et votre carte Vitale. Nous sommes ouverts du lundi au vendredi.",
    icon: Store,
  },
  {
    num: "3",
    titre: "Nous vous équipons",
    texte: "On vous remet le matériel et on vous explique comment l'utiliser.",
    icon: Package,
  },
  {
    num: "4",
    titre: "Nous facturons directement",
    texte: "La CPAM et votre mutuelle reçoivent la facture. Vous ne payez rien.",
    icon: Wallet,
  },
];

const equipements = [
  {
    titre: "Mobilité et déplacement",
    description: "Fauteuils roulants, déambulateurs, cannes, béquilles",
    href: "/equipements/mobilite",
    emoji: "🦽",
  },
  {
    titre: "Chambre médicalisée",
    description: "Lits médicalisés, matelas anti-escarres, potences",
    href: "/equipements/chambre",
    emoji: "🛏️",
  },
  {
    titre: "Salle de bain et WC",
    description: "Barres d'appui, sièges de douche, rehausseurs WC",
    href: "/equipements/salle-de-bain",
    emoji: "🚿",
  },
  {
    titre: "Vie quotidienne",
    description: "Aides aux repas, à l'habillage, à la préhension",
    href: "/equipements/vie-quotidienne",
    emoji: "🏠",
  },
  {
    titre: "Diagnostic et surveillance",
    description: "Tensiomètres, oxymètres, thermomètres",
    href: "/equipements/diagnostic",
    emoji: "💊",
  },
];

const reassurance = [
  {
    icon: Award,
    titre: "Prestataire conventionné",
    texte: "Enregistré auprès de l'Assurance Maladie.",
  },
  {
    icon: Wallet,
    titre: "Tiers payant intégral",
    texte: "CPAM et mutuelles facturées directement.",
  },
  {
    icon: Truck,
    titre: "Conseil et installation",
    texte: "Nous expliquons, ajustons et livrons à domicile.",
  },
  {
    icon: Building2,
    titre: "Un magasin près de chez vous",
    texte: "À Marseille 15e, du lundi au vendredi.",
  },
];

/* ─── Page ────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      {/* ── BLOC 2 : Accroche principale ─────────────────────── */}
      <section
        aria-labelledby="hero-titre"
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a4e8a 0%, #1e6ba8 50%, #2a9d8f 100%)",
        }}
      >
        {/* Motif décoratif */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
          aria-hidden="true"
        />

        <div className="container relative py-16 md:py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <CheckCircle size={16} aria-hidden="true" />
              Prestataire conventionné Assurance Maladie
            </div>

            <h1 id="hero-titre" className="text-white mb-5 text-balance">
              Votre matériel médical,{" "}
              <span className="text-brand-teal-light">pris en charge.</span>
            </h1>

            <p className="text-white/90 text-xl mb-8 max-w-xl leading-relaxed">
              Nous équipons votre domicile et facturons directement l&apos;Assurance
              Maladie et votre mutuelle.{" "}
              <strong className="text-white">Vous n&apos;avancez rien.</strong>
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="tel:+33XXXXXXXXX"
                className="btn btn-outline-white text-lg"
                aria-label="Appelez-nous au 04 XX XX XX XX"
              >
                <Phone size={20} aria-hidden="true" />
                Nous appeler
              </a>
              <Link href="/patient/comment-ca-marche" className="btn btn-secondary">
                Comment ça marche
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            {/* Adresse rapide */}
            <p className="text-white/70 text-sm mt-8 flex items-center gap-2">
              <MapPin size={15} aria-hidden="true" />
              185 avenue de Saint-Louis, 13015 Marseille — Lun–Ven 9h–12h &amp; 14h30–18h
            </p>
          </div>
        </div>
      </section>

      {/* ── BLOC 3 : Trois portes d'entrée ──────────────────── */}
      <section
        aria-labelledby="portes-titre"
        className="section bg-neutral-50"
      >
        <div className="container">
          <div className="text-center mb-10">
            <h2 id="portes-titre" className="text-brand-blue mb-3">
              Qui êtes-vous ?
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto">
              Choisissez votre profil pour trouver rapidement l&apos;information qu&apos;il vous faut.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portesEntree.map((porte) => {
              const Icon = porte.icon;
              return (
                <Link
                  key={porte.href}
                  href={porte.href}
                  className="card flex flex-col gap-4 hover:no-underline group"
                  aria-label={porte.titre}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${porte.couleur}`}
                  >
                    <Icon size={28} className="text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-neutral-900 mb-2">{porte.titre}</h3>
                    <p className="text-neutral-600 text-base leading-relaxed">
                      {porte.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-brand-blue font-semibold text-sm group-hover:gap-2.5 transition-all">
                    {porte.cta}
                    <ChevronRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BLOC 4 : Parcours 4 étapes ───────────────────────── */}
      <section aria-labelledby="parcours-titre" className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 id="parcours-titre" className="text-brand-blue mb-3">
              Comment ça se passe ?
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto">
              Apportez votre ordonnance, on s&apos;occupe du reste.
            </p>
          </div>

          {/* Frise */}
          <div className="relative">
            {/* Ligne de connexion (desktop) */}
            <div
              className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-brand-blue via-brand-teal to-brand-teal"
              aria-hidden="true"
            />

            <ol className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {etapes.map((etape, idx) => {
                const Icon = etape.icon;
                return (
                  <li key={idx} className="flex flex-col items-center text-center">
                    {/* Numéro + icône */}
                    <div className="relative mb-5">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center shadow-md relative z-10"
                        style={{
                          background:
                            idx < 2
                              ? "linear-gradient(135deg, #1a4e8a, #2a6db8)"
                              : "linear-gradient(135deg, #2a9d8f, #3dbdad)",
                        }}
                      >
                        <Icon size={32} className="text-white" aria-hidden="true" />
                      </div>
                      <span
                        className="absolute -top-1 -right-1 w-7 h-7 bg-white border-2 border-neutral-200 rounded-full flex items-center justify-center text-xs font-bold text-brand-blue z-20"
                        aria-hidden="true"
                      >
                        {etape.num}
                      </span>
                    </div>
                    <h3 className="text-neutral-900 mb-2 text-lg">{etape.titre}</h3>
                    <p className="text-neutral-600 text-base leading-relaxed">
                      {etape.texte}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Message central */}
          <div className="mt-12 text-center">
            <div
              className="inline-block rounded-2xl px-8 py-5 text-white text-xl font-bold"
              style={{
                background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)",
              }}
            >
              Vous ne payez rien.
            </div>
            <p className="text-neutral-500 text-sm mt-3">
              Sous réserve des conditions de prise en charge en vigueur et de l&apos;accord de votre caisse.
            </p>
          </div>
        </div>
      </section>

      {/* ── BLOC 5 : Nos équipements ────────────────────────── */}
      <section aria-labelledby="equipements-titre" className="section bg-neutral-50">
        <div className="container">
          <div className="text-center mb-10">
            <h2 id="equipements-titre" className="text-brand-blue mb-3">
              Nos équipements
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto">
              Du matériel pris en charge par l&apos;Assurance Maladie, selon les conditions de remboursement en vigueur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {equipements.map((eq) => (
              <Link
                key={eq.href}
                href={eq.href}
                className="card flex items-start gap-4 hover:no-underline group"
                aria-label={`${eq.titre} — ${eq.description}`}
              >
                <span
                  className="text-4xl flex-shrink-0 leading-none"
                  role="img"
                  aria-hidden="true"
                >
                  {eq.emoji}
                </span>
                <div className="flex-1">
                  <h3 className="text-neutral-900 mb-1 text-lg group-hover:text-brand-blue transition-colors">
                    {eq.titre}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-3">
                    {eq.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-brand-teal font-medium text-sm group-hover:gap-2 transition-all">
                    En savoir plus
                    <ChevronRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}

            {/* CTA catalogue complet */}
            <Link
              href="/equipements"
              className="card border-dashed border-2 border-brand-blue/30 flex items-center justify-center text-center hover:no-underline hover:border-brand-blue group"
              aria-label="Voir tout notre catalogue"
            >
              <div>
                <div className="text-3xl mb-3" aria-hidden="true">📋</div>
                <h3 className="text-brand-blue text-lg mb-2">Tout le catalogue</h3>
                <p className="text-neutral-500 text-sm">
                  Consultez l&apos;ensemble de nos gammes
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BLOC 6 : Réassurance ────────────────────────────── */}
      <section aria-labelledby="reassurance-titre" className="section bg-white">
        <div className="container">
          <h2 id="reassurance-titre" className="sr-only">
            Pourquoi nous choisir
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {reassurance.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center">
                  <div
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
                    style={{
                      background: idx % 2 === 0 ? "#e8f0fb" : "#e6f7f5",
                    }}
                  >
                    <Icon
                      size={26}
                      style={{ color: idx % 2 === 0 ? "#1a4e8a" : "#2a9d8f" }}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-neutral-900 text-base mb-1">{item.titre}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{item.texte}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BLOC 7 : Espace professionnels ──────────────────── */}
      <section
        aria-labelledby="pro-titre"
        className="section"
        style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #123a6a 100%)" }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Users size={16} aria-hidden="true" />
              Médecins · Infirmiers · Kinésithérapeutes · EHPAD
            </div>
            <h2 id="pro-titre" className="text-white mb-4">
              Vous êtes professionnel de santé ?
            </h2>
            <p className="text-white/85 text-lg mb-8 leading-relaxed">
              Nous accompagnons vos patients de la prescription à l&apos;installation, et
              gérons l&apos;intégralité des démarches administratives — entente préalable,
              télétransmission, suivi. Un interlocuteur direct, des délais courts.
            </p>
            <Link href="/professionnels" className="btn btn-secondary text-lg">
              <Stethoscope size={20} aria-hidden="true" />
              Espace professionnels de santé
            </Link>
          </div>
        </div>
      </section>

      {/* ── BLOC 8 : Le magasin ─────────────────────────────── */}
      <section aria-labelledby="magasin-titre" className="section bg-neutral-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 id="magasin-titre" className="text-brand-blue mb-4">
                Un vrai magasin, à Marseille
              </h2>
              <p className="text-neutral-700 mb-6 leading-relaxed">
                Pas un site anonyme — une adresse, une équipe, et quelqu&apos;un au téléphone.
                Venez nous voir avec votre ordonnance, on prend tout en charge.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin size={22} className="text-brand-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-neutral-800">Adresse</div>
                    <div className="text-neutral-600">
                      185 avenue de Saint-Louis, 13015 Marseille
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={22} className="text-brand-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-neutral-800">Téléphone</div>
                    <a
                      href="tel:+33XXXXXXXXX"
                      className="text-brand-blue font-semibold hover:underline"
                    >
                      04 XX XX XX XX
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={22} className="text-brand-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-neutral-800">Horaires</div>
                    <div className="text-neutral-600">
                      Lundi au vendredi, 9h–12h et 14h30–18h
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/magasin" className="btn btn-primary">
                Voir le plan et l&apos;accès
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            {/* Carte Google Maps */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
              <iframe
                title="Localisation MHC Medical — 185 avenue de Saint-Louis, Marseille"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2904.9!2d5.3668!3d43.3570!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9c46b7e8a8e8b%3A0x0!2s185+Avenue+de+Saint-Louis%2C+13015+Marseille!5e0!3m2!1sfr!2sfr!4v1"
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-label="Carte montrant la localisation du magasin MHC Medical à Marseille"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
