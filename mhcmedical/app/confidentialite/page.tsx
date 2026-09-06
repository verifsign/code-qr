import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — MHC Medical",
  description: "Comment MHC Medical collecte et protège vos données personnelles.",
};

export default function ConfidentialitePage() {
  return (
    <>
      <section className="py-12 bg-neutral-50 border-b border-neutral-200">
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-4">
            <ol className="flex items-center gap-2 text-neutral-500 text-sm">
              <li><Link href="/" className="hover:text-brand-blue">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-neutral-800 font-medium">Politique de confidentialité</li>
            </ol>
          </nav>
          <h1 className="text-brand-blue">Politique de confidentialité</h1>
          <p className="text-neutral-600 mt-2">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </section>

      <div className="section bg-white">
        <div className="container max-w-3xl space-y-10">
          {[
            {
              titre: "1. Responsable du traitement",
              contenu: "SAS Medical Health and Care — 185 avenue de Saint-Louis, 13015 Marseille — contact@mhcmedical.fr",
            },
            {
              titre: "2. Données collectées",
              contenu: "Nous collectons uniquement les données que vous nous transmettez volontairement via le formulaire de contact : nom, prénom, téléphone, email et contenu de votre message. Aucune donnée de santé ne doit être transmise via ce formulaire. Pour toute question médicale, appelez-nous directement.",
            },
            {
              titre: "3. Finalité du traitement",
              contenu: "Vos données sont utilisées uniquement pour répondre à votre demande de contact. Elles ne sont pas utilisées à des fins commerciales, ni transmises à des tiers.",
            },
            {
              titre: "4. Durée de conservation",
              contenu: "Vos données de contact sont conservées pendant la durée nécessaire au traitement de votre demande, puis supprimées dans un délai maximum de 3 ans à compter du dernier contact.",
            },
            {
              titre: "5. Vos droits",
              contenu: "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, écrivez-nous à contact@mhcmedical.fr.",
            },
            {
              titre: "6. Cookies",
              contenu: "Consultez notre politique de gestion des cookies pour savoir comment nous utilisons les cookies sur ce site.",
            },
            {
              titre: "7. Réclamation",
              contenu: "Si vous estimez que le traitement de vos données porte atteinte à vos droits, vous pouvez adresser une réclamation à la CNIL (Commission Nationale de l'Informatique et des Libertés) — www.cnil.fr.",
            },
          ].map((section) => (
            <article key={section.titre}>
              <h2 className="text-brand-blue mb-3">{section.titre}</h2>
              <p className="text-neutral-700 leading-relaxed">{section.contenu}</p>
              {section.titre === "6. Cookies" && (
                <p className="text-neutral-700 leading-relaxed mt-2">
                  <Link href="/cookies" className="text-brand-blue underline">
                    Voir notre politique de gestion des cookies
                  </Link>
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
