import Link from "next/link";
import { ChevronRight, AlertCircle, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réclamations et matériovigilance — MHC Medical",
  description: "Comment déposer une réclamation ou signaler un incident lié à un dispositif médical auprès de MHC Medical.",
};

export default function ReclamationsPage() {
  return (
    <>
      <section className="py-12 bg-neutral-50 border-b border-neutral-200">
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-4">
            <ol className="flex items-center gap-2 text-neutral-500 text-sm">
              <li><Link href="/" className="hover:text-brand-blue">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-neutral-800 font-medium">Réclamations et matériovigilance</li>
            </ol>
          </nav>
          <h1 className="text-brand-blue">Réclamations et matériovigilance</h1>
        </div>
      </section>

      <div className="section bg-white">
        <div className="container max-w-3xl space-y-10">

          {/* Réclamations */}
          <section>
            <h2 className="text-brand-blue mb-4">Déposer une réclamation</h2>
            <p className="text-neutral-700 leading-relaxed mb-6">
              Si vous n&apos;êtes pas satisfait de nos services, d&apos;un équipement fourni ou de
              notre accompagnement, nous vous invitons à nous le signaler. Votre retour
              nous aide à améliorer notre qualité de service.
            </p>
            <div className="space-y-4">
              <a href="tel:+33XXXXXXXXX" className="card flex items-center gap-4 hover:no-underline group">
                <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center flex-shrink-0">
                  <Phone size={22} className="text-white" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-neutral-800">Par téléphone</div>
                  <div className="text-brand-blue">04 XX XX XX XX</div>
                  <div className="text-neutral-500 text-sm">Lun–Ven 9h–12h et 14h30–18h</div>
                </div>
              </a>
              <a href="mailto:contact@mhcmedical.fr" className="card flex items-center gap-4 hover:no-underline group">
                <div className="w-12 h-12 rounded-xl bg-brand-teal flex items-center justify-center flex-shrink-0">
                  <Mail size={22} className="text-white" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-neutral-800">Par email</div>
                  <div className="text-brand-blue">contact@mhcmedical.fr</div>
                  <div className="text-neutral-500 text-sm">Réponse sous 48h ouvrées</div>
                </div>
              </a>
            </div>
            <p className="text-neutral-600 text-sm mt-4 leading-relaxed">
              Nous nous engageons à accuser réception de votre réclamation dans les 10
              jours ouvrés et à vous apporter une réponse dans les meilleurs délais.
            </p>
          </section>

          {/* Matériovigilance */}
          <section>
            <h2 className="text-brand-blue mb-4">Matériovigilance</h2>
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 mb-5">
              <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>En cas d&apos;urgence médicale,</strong> appelez le 15 (SAMU) ou le 18
                (pompiers). La matériovigilance ne concerne pas les urgences médicales.
              </p>
            </div>
            <p className="text-neutral-700 leading-relaxed mb-4">
              La matériovigilance est le système de surveillance des incidents ou risques
              d&apos;incidents liés à l&apos;utilisation des dispositifs médicaux.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Si vous avez constaté un <strong>incident ou un risque d&apos;incident</strong> lié
              à un dispositif médical que nous vous avons fourni (défaillance, dégradation,
              étiquetage inadéquat…), vous devez le signaler :
            </p>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="text-brand-blue font-bold mt-0.5">1.</span>
                <span>
                  <strong>À nous directement</strong> — par téléphone au 04 XX XX XX XX
                  ou par email à contact@mhcmedical.fr. Nous sommes tenus de déclarer
                  l&apos;incident auprès des autorités compétentes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-blue font-bold mt-0.5">2.</span>
                <span>
                  <strong>À l&apos;ANSM</strong> (Agence Nationale de Sécurité du Médicament
                  et des produits de santé) via le portail{" "}
                  <a
                    href="https://signalement.social-sante.gouv.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue underline"
                  >
                    signalement.social-sante.gouv.fr
                  </a>
                </span>
              </li>
            </ul>
          </section>

          <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
            <p className="text-neutral-600 text-sm leading-relaxed">
              Les dispositifs médicaux proposés par SAS Medical Health and Care sont des
              produits de santé réglementés portant le marquage CE, soumis aux dispositions
              du règlement (UE) 2017/745.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
