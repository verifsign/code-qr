import Link from "next/link";
import { Phone, MapPin, Clock, Mail, ChevronRight, Car, Bus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le magasin — MHC Medical Marseille",
  description:
    "185 avenue de Saint-Louis, 13015 Marseille. Ouvert du lundi au vendredi 9h–12h et 14h30–18h. Plan, accès et stationnement.",
};

export default function MagasinPage() {
  return (
    <>
      <section
        className="py-14 md:py-20"
        style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}
      >
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-white font-medium">Le magasin</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Le magasin</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed">
            Nous vous attendons au 185 avenue de Saint-Louis, à Marseille 15e.
            Venez avec votre ordonnance et votre carte Vitale — on s&apos;occupe du reste.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Informations pratiques */}
            <div>
              <h2 className="text-brand-blue mb-8">Informations pratiques</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={22} className="text-brand-blue" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-neutral-900 mb-1">Adresse</h3>
                    <p className="text-neutral-600">
                      185 avenue de Saint-Louis<br />
                      13015 Marseille
                    </p>
                    <a
                      href="https://maps.google.com/?q=185+avenue+de+Saint-Louis+13015+Marseille"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-brand-blue text-sm font-medium hover:underline"
                    >
                      Ouvrir dans Google Maps →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={22} className="text-brand-teal" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-neutral-900 mb-1">Horaires d&apos;ouverture</h3>
                    <table className="text-neutral-600 text-sm" aria-label="Horaires d'ouverture">
                      <tbody>
                        {[
                          ["Lundi", "9h00 – 12h00 et 14h30 – 18h00"],
                          ["Mardi", "9h00 – 12h00 et 14h30 – 18h00"],
                          ["Mercredi", "9h00 – 12h00 et 14h30 – 18h00"],
                          ["Jeudi", "9h00 – 12h00 et 14h30 – 18h00"],
                          ["Vendredi", "9h00 – 12h00 et 14h30 – 18h00"],
                          ["Samedi", "Fermé"],
                          ["Dimanche", "Fermé"],
                        ].map(([jour, horaire]) => (
                          <tr key={jour}>
                            <td className="pr-4 py-0.5 font-medium text-neutral-700">{jour}</td>
                            <td className={horaire === "Fermé" ? "text-neutral-400" : ""}>{horaire}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={22} className="text-brand-blue" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-neutral-900 mb-1">Téléphone</h3>
                    <a
                      href="tel:+33XXXXXXXXX"
                      className="text-brand-blue font-bold text-xl hover:underline"
                    >
                      04 XX XX XX XX
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={22} className="text-brand-teal" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-neutral-900 mb-1">Email</h3>
                    <a
                      href="mailto:contact@mhcmedical.fr"
                      className="text-brand-blue hover:underline"
                    >
                      contact@mhcmedical.fr
                    </a>
                  </div>
                </div>
              </div>

              {/* Accès */}
              <div className="mt-8">
                <h3 className="text-neutral-900 mb-4">Accès et stationnement</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Car size={20} className="text-brand-blue flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      <strong>En voiture :</strong> stationnement disponible sur l&apos;avenue de
                      Saint-Louis et dans les rues adjacentes. Accès depuis le boulevard
                      de la Millière ou l&apos;autoroute A55.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Bus size={20} className="text-brand-teal flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      <strong>En transport en commun :</strong> bus RTM — arrêt Saint-Louis.
                      Consultez le site de la RTM pour les lignes desservant ce quartier.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
              <iframe
                title="Localisation MHC Medical — 185 avenue de Saint-Louis, Marseille 15e"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2904.9!2d5.3668!3d43.3570!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9c46b7e8a8e8b%3A0x0!2s185+Avenue+de+Saint-Louis%2C+13015+Marseille!5e0!3m2!1sfr!2sfr!4v1"
                width="100%"
                height="480"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-label="Carte Google Maps montrant la localisation du magasin MHC Medical à Marseille"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ce qu'il faut apporter */}
      <section className="section bg-neutral-50">
        <div className="container max-w-3xl">
          <h2 className="text-brand-blue mb-6 text-center">Ce qu&apos;il faut apporter</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { emoji: "📄", label: "Votre ordonnance", texte: "Signée par votre médecin traitant ou spécialiste." },
              { emoji: "💳", label: "Votre carte Vitale", texte: "Et votre attestation d'assurance maladie à jour." },
              { emoji: "🃏", label: "Votre carte mutuelle", texte: "Pour le tiers payant complémentaire si vous en avez une." },
              { emoji: "📋", label: "Un justificatif d'ALD", texte: "Si vous bénéficiez d'une prise en charge à 100% pour une affection longue durée." },
            ].map((item) => (
              <div key={item.label} className="card flex items-start gap-3">
                <span className="text-3xl" role="img" aria-hidden="true">{item.emoji}</span>
                <div>
                  <div className="font-semibold text-neutral-800 mb-1">{item.label}</div>
                  <div className="text-neutral-600 text-sm">{item.texte}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-neutral-500 text-sm text-center mt-6">
            Vous n&apos;êtes pas sûr d&apos;avoir tout ce qu&apos;il faut ? Appelez-nous avant de vous déplacer.
          </p>
        </div>
      </section>
    </>
  );
}
