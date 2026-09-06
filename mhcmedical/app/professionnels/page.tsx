import Link from "next/link";
import { Phone, ArrowRight, ChevronRight, CheckCircle, Clock, Mail, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professionnels de santé — MHC Medical Marseille",
  description:
    "Partenaire des médecins, infirmiers, kinésithérapeutes et EHPAD à Marseille. Gestion administrative complète, délais courts, interlocuteur dédié.",
};

const gammes = [
  { label: "Aides à la mobilité", items: ["Fauteuils roulants manuels et électriques", "Déambulateurs et rollators", "Cannes, béquilles, cadres de marche"] },
  { label: "Maintien à domicile", items: ["Lits médicalisés et accessoires", "Lève-personnes", "Potences et barres de lit"] },
  { label: "Prévention des chutes", items: ["Barres d'appui", "Sièges et bancs de douche", "Rehausseurs WC"] },
  { label: "Diagnostic et surveillance", items: ["Tensiomètres, oxymètres", "Glucomètres", "Thermomètres médicaux"] },
];

export default function ProfessionnelsPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="py-14 md:py-20"
        style={{ background: "linear-gradient(135deg, #123a6a 0%, #1a4e8a 100%)" }}
      >
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-white font-medium">Professionnels de santé</li>
            </ol>
          </nav>
          <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            Médecins · Infirmiers · Kinésithérapeutes · EHPAD · Assistantes sociales
          </div>
          <h1 className="text-white mb-4">Un partenaire pour vos patients.</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed mb-8">
            Nous accompagnons vos patients de la prescription à l&apos;installation, et
            gérons l&apos;intégralité des démarches administratives. Un interlocuteur direct,
            des délais courts.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+33XXXXXXXXX" className="btn btn-outline-white">
              <Phone size={20} aria-hidden="true" />
              Ligne directe — 04 XX XX XX XX
            </a>
            <Link href="/professionnels/contact" className="btn btn-secondary">
              Contact prescripteurs
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation interne */}
      <nav aria-label="Sections" className="bg-white border-b border-neutral-200">
        <div className="container">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { href: "/professionnels/partenariat", label: "Travailler avec nous" },
              { href: "/professionnels/catalogue", label: "Ce que nous délivrons" },
              { href: "/professionnels/contact", label: "Contact direct" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="px-5 py-4 text-neutral-600 hover:text-brand-blue font-medium border-b-2 border-transparent hover:border-brand-blue transition-all whitespace-nowrap text-sm">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Engagements */}
      <section aria-labelledby="engagements-titre" className="section bg-neutral-50">
        <div className="container">
          <h2 id="engagements-titre" className="text-brand-blue text-center mb-10">
            Ce que nous faisons pour vous
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                titre: "Gestion administrative complète",
                texte: "Entente préalable, télétransmission CPAM, relances mutuelles — nous gérons tout. Vous prescrivez, on s'occupe du reste.",
                icon: FileText,
              },
              {
                titre: "Délais courts",
                texte: "La plupart des équipements courants sont disponibles immédiatement. Pour les matériels avec accord préalable, nous suivons le dossier et vous tenons informé.",
                icon: Clock,
              },
              {
                titre: "Un interlocuteur identifié",
                texte: "Pas de standard impersonnel. Une personne référente pour vos demandes, joignable directement par téléphone ou email.",
                icon: Phone,
              },
              {
                titre: "Livraison et installation à domicile",
                texte: "Pour les équipements lourds (lits médicalisés, lève-personnes…), nous livrons et installons directement chez votre patient.",
                icon: CheckCircle,
              },
              {
                titre: "Coordination avec votre équipe",
                texte: "Nous travaillons avec les infirmiers libéraux, les aides à domicile et les services hospitaliers pour garantir la continuité des soins.",
                icon: CheckCircle,
              },
              {
                titre: "Traçabilité des délivrances",
                texte: "Sur demande, nous pouvons vous transmettre un récapitulatif du matériel délivré à vos patients.",
                icon: FileText,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="card">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-brand-blue" aria-hidden="true" />
                  </div>
                  <h3 className="text-neutral-900 mb-2">{item.titre}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{item.texte}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ce que nous délivrons */}
      <section aria-labelledby="gammes-titre" className="section bg-white">
        <div className="container">
          <h2 id="gammes-titre" className="text-brand-blue text-center mb-4">
            Ce que nous délivrons
          </h2>
          <p className="text-neutral-600 text-center mb-10 max-w-2xl mx-auto">
            Notre activité couvre les Titres I et IV de la LPP. Nous ne délivrons pas d&apos;orthèses ni de prothèses (Titre II).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gammes.map((gamme) => (
              <div key={gamme.label} className="card">
                <h3 className="text-brand-blue mb-4">{gamme.label}</h3>
                <ul className="space-y-2">
                  {gamme.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-neutral-700">
                      <CheckCircle size={15} className="text-brand-teal flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zone d'intervention */}
      <section className="section bg-neutral-50">
        <div className="container max-w-3xl">
          <h2 className="text-brand-blue mb-6">Zone d&apos;intervention</h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Notre magasin est à <strong>Marseille 15e</strong> (185 avenue de Saint-Louis).
            Nous intervenons principalement sur <strong>Marseille et les Bouches-du-Rhône</strong> pour les livraisons et installations à domicile.
          </p>
          <p className="text-neutral-700 leading-relaxed">
            Pour les prescripteurs hors zone de livraison, les patients peuvent venir en magasin directement. Contactez-nous pour discuter de votre situation.
          </p>
        </div>
      </section>

      {/* Contact pro */}
      <section
        className="section"
        style={{ background: "linear-gradient(135deg, #123a6a 0%, #1a4e8a 100%)" }}
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-white mb-4">Nous contacter directement</h2>
              <p className="text-white/85 mb-6 leading-relaxed">
                Pour toute demande d&apos;équipement patient, question sur une prise en charge
                ou demande de partenariat, contactez-nous directement.
              </p>
              <div className="space-y-3">
                <a href="tel:+33XXXXXXXXX" className="flex items-center gap-3 text-white hover:text-brand-teal-light transition-colors">
                  <Phone size={20} aria-hidden="true" />
                  <span className="text-xl font-bold">04 XX XX XX XX</span>
                </a>
                <a href="mailto:pro@mhcmedical.fr" className="flex items-center gap-3 text-white/85 hover:text-white transition-colors">
                  <Mail size={18} aria-hidden="true" />
                  pro@mhcmedical.fr
                </a>
              </div>
            </div>
            <Link
              href="/professionnels/contact"
              className="card text-center hover:no-underline"
            >
              <div className="text-3xl mb-3" role="img" aria-hidden="true">📋</div>
              <h3 className="text-brand-blue mb-2">Formulaire de demande</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Transmettez une demande d&apos;équipement pour un de vos patients en quelques clics.
              </p>
              <span className="inline-flex items-center gap-1.5 text-brand-blue font-semibold text-sm">
                Accéder au formulaire
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
