import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion des cookies — MHC Medical",
  description: "Comment MHC Medical utilise les cookies sur son site web.",
};

export default function CookiesPage() {
  return (
    <>
      <section className="py-12 bg-neutral-50 border-b border-neutral-200">
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-4">
            <ol className="flex items-center gap-2 text-neutral-500 text-sm">
              <li><Link href="/" className="hover:text-brand-blue">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-neutral-800 font-medium">Gestion des cookies</li>
            </ol>
          </nav>
          <h1 className="text-brand-blue">Gestion des cookies</h1>
        </div>
      </section>

      <div className="section bg-white">
        <div className="container max-w-3xl space-y-8">
          <article>
            <h2 className="text-brand-blue mb-3">Qu&apos;est-ce qu&apos;un cookie ?</h2>
            <p className="text-neutral-700 leading-relaxed">
              Un cookie est un petit fichier texte déposé sur votre appareil lors de la
              visite d&apos;un site web. Il permet de mémoriser des informations sur votre
              navigation.
            </p>
          </article>

          <article>
            <h2 className="text-brand-blue mb-3">Cookies utilisés sur ce site</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse" aria-label="Liste des cookies">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="text-left px-4 py-3 border border-neutral-200 font-semibold text-neutral-700">Cookie</th>
                    <th className="text-left px-4 py-3 border border-neutral-200 font-semibold text-neutral-700">Finalité</th>
                    <th className="text-left px-4 py-3 border border-neutral-200 font-semibold text-neutral-700">Durée</th>
                    <th className="text-left px-4 py-3 border border-neutral-200 font-semibold text-neutral-700">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 border border-neutral-200 font-mono text-xs">mhc_cookie_consent</td>
                    <td className="px-4 py-3 border border-neutral-200 text-neutral-600">Mémorise votre choix de consentement aux cookies</td>
                    <td className="px-4 py-3 border border-neutral-200 text-neutral-600">1 an</td>
                    <td className="px-4 py-3 border border-neutral-200"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">Essentiel</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-neutral-600 text-sm mt-3 leading-relaxed">
              Ce site n&apos;utilise pas de cookies publicitaires ni de traceurs tiers. Aucune
              donnée de navigation n&apos;est transmise à des tiers.
            </p>
          </article>

          <article>
            <h2 className="text-brand-blue mb-3">Comment modifier vos préférences ?</h2>
            <p className="text-neutral-700 leading-relaxed">
              Vous pouvez modifier vos préférences à tout moment en effaçant les cookies
              de votre navigateur (paramètres › vie privée › cookies). Vous pouvez également
              configurer votre navigateur pour refuser l&apos;ensemble des cookies, mais cela
              pourrait affecter le fonctionnement du site.
            </p>
          </article>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <p className="text-neutral-600 text-sm leading-relaxed">
              Pour toute question, consultez notre{" "}
              <Link href="/confidentialite" className="text-brand-blue underline">
                politique de confidentialité
              </Link>{" "}
              ou contactez-nous à{" "}
              <a href="mailto:contact@mhcmedical.fr" className="text-brand-blue underline">
                contact@mhcmedical.fr
              </a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
