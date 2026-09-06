import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — MHC Medical",
  description: "Mentions légales du site mhcmedical.fr — SAS Medical Health and Care, SIREN 983 367 699.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <section className="py-12 bg-neutral-50 border-b border-neutral-200">
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-4">
            <ol className="flex items-center gap-2 text-neutral-500 text-sm">
              <li><Link href="/" className="hover:text-brand-blue">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-neutral-800 font-medium">Mentions légales</li>
            </ol>
          </nav>
          <h1 className="text-brand-blue">Mentions légales</h1>
        </div>
      </section>

      <div className="section bg-white">
        <div className="container max-w-3xl">
          <div className="prose prose-lg max-w-none space-y-10">

            <section>
              <h2 className="text-brand-blue">1. Éditeur du site</h2>
              <dl className="space-y-2 text-neutral-700">
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-neutral-100">
                  <dt className="font-semibold">Dénomination sociale</dt>
                  <dd>SAS Medical Health and Care</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-neutral-100">
                  <dt className="font-semibold">Forme juridique</dt>
                  <dd>Société par actions simplifiée (SAS)</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-neutral-100">
                  <dt className="font-semibold">Capital social</dt>
                  <dd>[À compléter] €</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-neutral-100">
                  <dt className="font-semibold">SIREN</dt>
                  <dd>983 367 699</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-neutral-100">
                  <dt className="font-semibold">RCS</dt>
                  <dd>Marseille</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-neutral-100">
                  <dt className="font-semibold">N° TVA intracommunautaire</dt>
                  <dd>[À compléter]</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-neutral-100">
                  <dt className="font-semibold">Siège social</dt>
                  <dd>185 avenue de Saint-Louis, 13015 Marseille</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-neutral-100">
                  <dt className="font-semibold">Téléphone</dt>
                  <dd>04 XX XX XX XX</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2 border-b border-neutral-100">
                  <dt className="font-semibold">Email</dt>
                  <dd>contact@mhcmedical.fr</dd>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <dt className="font-semibold">Directeur de publication</dt>
                  <dd>[À compléter]</dd>
                </div>
              </dl>
            </section>

            <section>
              <h2 className="text-brand-blue">2. Hébergeur</h2>
              <p className="text-neutral-700 leading-relaxed">
                Ce site est hébergé par :<br />
                <strong>OVH SAS</strong><br />
                2 rue Kellermann — BP 80157<br />
                59053 Roubaix Cedex 1<br />
                Téléphone : 1007 (depuis la France)
              </p>
            </section>

            <section>
              <h2 className="text-brand-blue">3. Activité réglementée</h2>
              <p className="text-neutral-700 leading-relaxed">
                SAS Medical Health and Care exerce l&apos;activité de{" "}
                <strong>prestataire de services et distributeur de matériels médicaux (PSDM)</strong>.
                Cette activité est conventionnée avec l&apos;Assurance Maladie.
              </p>
              <p className="text-neutral-700 leading-relaxed mt-3">
                Les dispositifs médicaux proposés sont des <strong>produits de santé réglementés
                portant le marquage CE</strong>. Ils sont soumis aux dispositions du règlement
                (UE) 2017/745 relatif aux dispositifs médicaux.
              </p>
            </section>

            <section>
              <h2 className="text-brand-blue">4. Propriété intellectuelle</h2>
              <p className="text-neutral-700 leading-relaxed">
                L&apos;ensemble du contenu de ce site (textes, visuels, structure) est la
                propriété de SAS Medical Health and Care ou de ses fournisseurs, et est
                protégé par les lois françaises et internationales relatives à la propriété
                intellectuelle. Toute reproduction ou représentation, même partielle, est
                interdite sans autorisation préalable.
              </p>
            </section>

            <section>
              <h2 className="text-brand-blue">5. Limitation de responsabilité</h2>
              <p className="text-neutral-700 leading-relaxed">
                Les informations publiées sur ce site ont un caractère général et
                informatif. Elles ne constituent en aucun cas un avis médical ou une
                garantie de remboursement. Les conditions de prise en charge des
                dispositifs médicaux dépendent de chaque situation individuelle et des
                dispositions de l&apos;Assurance Maladie en vigueur.
              </p>
            </section>

            <section>
              <h2 className="text-brand-blue">6. Données personnelles et cookies</h2>
              <p className="text-neutral-700 leading-relaxed">
                Consultez notre{" "}
                <Link href="/confidentialite" className="text-brand-blue underline">
                  politique de confidentialité
                </Link>{" "}
                et notre{" "}
                <Link href="/cookies" className="text-brand-blue underline">
                  politique de gestion des cookies
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-brand-blue">7. Contact matériovigilance et réclamations</h2>
              <p className="text-neutral-700 leading-relaxed">
                Pour toute réclamation ou signalement de matériovigilance, consultez notre
                page dédiée :{" "}
                <Link href="/reclamations" className="text-brand-blue underline">
                  Réclamations et matériovigilance
                </Link>.
              </p>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
