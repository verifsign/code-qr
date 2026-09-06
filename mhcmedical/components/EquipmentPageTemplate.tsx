import Link from "next/link";
import { ChevronRight, Phone, CheckCircle } from "lucide-react";

interface EquipmentPageProps {
  titre: string;
  emoji: string;
  description: string;
  breadcrumb: string;
  produits: Array<{ nom: string; description: string; remboursable?: boolean }>;
  conseil: string;
  parent?: { href: string; label: string };
}

export default function EquipmentPageTemplate({
  titre,
  emoji,
  description,
  breadcrumb,
  produits,
  conseil,
}: EquipmentPageProps) {
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
              <li><Link href="/equipements" className="hover:text-white">Nos équipements</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-white font-medium">{breadcrumb}</li>
            </ol>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl" role="img" aria-hidden="true">{emoji}</span>
            <h1 className="text-white">{titre}</h1>
          </div>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed">{description}</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {produits.map((produit) => (
              <div key={produit.nom} className="card">
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={20}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: produit.remboursable !== false ? "#2a9d8f" : "#adb5bd" }}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-neutral-900 text-lg mb-1">{produit.nom}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">{produit.description}</p>
                    {produit.remboursable === false && (
                      <span className="inline-block mt-2 text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                        Vente libre (non remboursable)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container max-w-3xl">
          <div
            className="rounded-2xl p-8 text-white"
            style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}
          >
            <h2 className="text-white mb-3">Besoin d&apos;un conseil ?</h2>
            <p className="text-white/85 mb-6 leading-relaxed">{conseil}</p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+33XXXXXXXXX" className="btn btn-outline-white">
                <Phone size={20} aria-hidden="true" />
                04 XX XX XX XX
              </a>
              <Link href="/contact" className="btn btn-secondary">
                Nous écrire
              </Link>
            </div>
            <p className="text-white/60 text-sm mt-4">
              Sous réserve des conditions de prise en charge en vigueur et de l&apos;accord de votre caisse.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
