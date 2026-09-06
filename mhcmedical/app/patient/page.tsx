import Link from "next/link";
import { ArrowRight, Phone, ClipboardList, Store, Package, Wallet, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vous êtes patient — MHC Medical Marseille",
  description:
    "Vous avez une ordonnance ? Découvrez comment obtenir votre matériel médical sans avancer d'argent à Marseille. Tiers payant intégral CPAM et mutuelle.",
};

export default function PatientPage() {
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
              <li className="text-white font-medium">Vous êtes patient</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Vous avez une ordonnance ?</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed mb-8">
            Apportez-la au magasin avec votre carte Vitale. On s&apos;occupe de tout — le
            matériel, l&apos;installation, et la facturation à votre caisse et votre mutuelle.
          </p>
          <a href="tel:+33XXXXXXXXX" className="btn btn-outline-white">
            <Phone size={20} aria-hidden="true" />
            Nous appeler — 04 XX XX XX XX
          </a>
        </div>
      </section>

      {/* Navigation interne */}
      <nav aria-label="Sections de la page" className="bg-white border-b border-neutral-200 sticky top-[52px] z-30">
        <div className="container">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { href: "/patient/comment-ca-marche", label: "Comment ça marche" },
              { href: "/patient/prise-en-charge", label: "Ce qui est pris en charge" },
              { href: "/magasin", label: "Venir au magasin" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-5 py-4 text-neutral-600 hover:text-brand-blue font-medium border-b-2 border-transparent hover:border-brand-blue transition-all whitespace-nowrap text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Parcours simplifié */}
      <section className="section bg-neutral-50">
        <div className="container">
          <h2 className="text-brand-blue text-center mb-10">Votre parcours en 4 étapes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                num: "1",
                icon: ClipboardList,
                titre: "Votre médecin vous prescrit",
                texte:
                  "Il écrit une ordonnance pour le matériel adapté à votre situation. Certains matériels nécessitent un accord préalable du médecin-conseil de votre caisse — on s'en occupe pour vous.",
              },
              {
                num: "2",
                icon: Store,
                titre: "Vous venez au magasin",
                texte:
                  "Apportez l'ordonnance et votre carte Vitale. Si vous avez une mutuelle, pensez à votre carte de tiers payant. Nous sommes au 185 avenue de Saint-Louis, Marseille 15e.",
              },
              {
                num: "3",
                icon: Package,
                titre: "Nous vous équipons",
                texte:
                  "On vous remet le matériel, on vous montre comment l'utiliser et on règle les ajustements nécessaires. Pour les lits médicalisés et certains équipements lourds, on livre et installe à domicile.",
              },
              {
                num: "4",
                icon: Wallet,
                titre: "Vous ne payez rien",
                texte:
                  "Nous envoyons la facture directement à l'Assurance Maladie et à votre mutuelle. Vous n'avancez pas d'argent — c'est le principe du tiers payant intégral.",
              },
            ].map((etape, idx) => {
              const Icon = etape.icon;
              return (
                <div
                  key={idx}
                  className="card flex items-start gap-5"
                >
                  <div
                    className="w-14 h-14 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{
                      background:
                        idx < 2
                          ? "linear-gradient(135deg, #1a4e8a, #2a6db8)"
                          : "linear-gradient(135deg, #2a9d8f, #3dbdad)",
                    }}
                    aria-hidden="true"
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-neutral-900 mb-2">{etape.titre}</h3>
                    <p className="text-neutral-600 leading-relaxed">{etape.texte}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/patient/comment-ca-marche" className="btn btn-primary">
              Toutes vos questions en détail
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ rapide */}
      <section className="section bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-brand-blue text-center mb-10">Les questions qu&apos;on nous pose le plus souvent</h2>
          <div className="space-y-5">
            {[
              {
                q: "Est-ce que j'ai besoin d'une ordonnance ?",
                r: "Oui, pour tout matériel pris en charge par l'Assurance Maladie. Sans ordonnance, le matériel ne peut pas être remboursé. Certains petits articles de confort (rehausseurs simples, cannes légères…) peuvent être vendus librement sans ordonnance.",
              },
              {
                q: "Combien ça va me coûter ?",
                r: "Pour le matériel pris en charge : rien à avancer. Nous facturons directement la CPAM et votre mutuelle. Cela s'appelle le tiers payant intégral. Si votre mutuelle ne couvre pas la totalité, nous vous en informons avant de procéder.",
              },
              {
                q: "Et si mon médecin n'a pas fait la bonne ordonnance ?",
                r: "Pas de panique. Nous vérifierons avec vous ce qu'il faut. Dans certains cas, il suffit d'appeler le cabinet pour qu'il complète l'ordonnance. On vous guide.",
              },
              {
                q: "Combien de temps pour avoir le matériel ?",
                r: "La plupart des équipements courants (déambulateurs, fauteuils, barres d'appui…) sont disponibles immédiatement en magasin. Pour les lits médicalisés et certains équipements sur mesure, comptez quelques jours selon les conditions de remboursement en vigueur.",
              },
              {
                q: "Et si le matériel ne me convient pas ?",
                r: "On règle ensemble. Si un ajustement est possible, on le fait sur place. Si le matériel ne convient vraiment pas, on cherche une solution alternative avec vous.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="border border-neutral-200 rounded-xl overflow-hidden group"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-neutral-800 hover:bg-neutral-50 list-none">
                  {item.q}
                  <ChevronRight
                    size={20}
                    className="text-brand-blue flex-shrink-0 group-open:rotate-90 transition-transform"
                    aria-hidden="true"
                  />
                </summary>
                <div className="px-5 pb-5 text-neutral-600 leading-relaxed border-t border-neutral-100 pt-4">
                  {item.r}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section
        className="section"
        style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}
      >
        <div className="container text-center text-white">
          <h2 className="text-white mb-4">Une question ? Appelez-nous.</h2>
          <p className="text-white/85 mb-8 text-lg max-w-xl mx-auto">
            Notre équipe répond du lundi au vendredi, de 9h à 12h et de 14h30 à 18h.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+33XXXXXXXXX" className="btn btn-outline-white text-lg">
              <Phone size={20} aria-hidden="true" />
              04 XX XX XX XX
            </a>
            <Link href="/contact" className="btn btn-secondary">
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
