"use client";
import Link from "next/link";
import { Phone, Mail, ChevronRight, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPrescripteursPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <section className="py-14 md:py-20" style={{ background: "linear-gradient(135deg, #123a6a 0%, #1a4e8a 100%)" }}>
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm flex-wrap">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><Link href="/professionnels" className="hover:text-white">Professionnels</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li className="text-white font-medium">Contact direct</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Contact prescripteurs</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed">
            Transmettez une demande d&apos;équipement ou posez-nous une question directement.
          </p>
        </div>
      </section>

      <div className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contacts directs */}
            <div>
              <h2 className="text-brand-blue mb-6">Nous joindre directement</h2>
              <div className="space-y-5">
                <a href="tel:+33XXXXXXXXX" className="card flex items-center gap-4 hover:no-underline group">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center flex-shrink-0">
                    <Phone size={22} className="text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-800 group-hover:text-brand-blue transition-colors">04 XX XX XX XX</div>
                    <div className="text-neutral-500 text-sm">Lun–Ven 9h–12h et 14h30–18h</div>
                  </div>
                </a>
                <a href="mailto:pro@mhcmedical.fr" className="card flex items-center gap-4 hover:no-underline group">
                  <div className="w-12 h-12 rounded-xl bg-brand-teal flex items-center justify-center flex-shrink-0">
                    <Mail size={22} className="text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-800 group-hover:text-brand-blue transition-colors">pro@mhcmedical.fr</div>
                    <div className="text-neutral-500 text-sm">Réponse sous 24h ouvrées</div>
                  </div>
                </a>
              </div>

              <div className="mt-8 p-5 bg-neutral-50 rounded-xl border border-neutral-200">
                <h3 className="text-neutral-800 mb-3 text-base">Avant d&apos;envoyer votre demande</h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li>• Indiquez le nom et prénom du patient</li>
                  <li>• Précisez le matériel souhaité ou la situation</li>
                  <li>• Ne transmettez pas de données médicales sensibles par ce formulaire — préférez l&apos;appel pour les situations complexes</li>
                </ul>
              </div>
            </div>

            {/* Formulaire */}
            <div>
              <h2 className="text-brand-blue mb-6">Formulaire de demande</h2>
              {sent ? (
                <div className="card text-center p-10">
                  <div className="text-4xl mb-4" role="img" aria-label="Succès">✅</div>
                  <h3 className="text-brand-blue mb-3">Demande envoyée</h3>
                  <p className="text-neutral-600">Nous revenons vers vous sous 24h ouvrées.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card space-y-5" aria-label="Formulaire de demande prescripteur" noValidate>
                  <div>
                    <label htmlFor="pro-nom" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Votre nom et établissement <span aria-label="obligatoire">*</span>
                    </label>
                    <input id="pro-nom" type="text" required autoComplete="name"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-brand-teal focus:outline-none text-neutral-800 text-base"
                      placeholder="Dr Dupont — Cabinet médical Marseille" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pro-tel" className="block text-sm font-semibold text-neutral-700 mb-1.5">Téléphone</label>
                      <input id="pro-tel" type="tel" autoComplete="tel"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-brand-teal focus:outline-none text-neutral-800 text-base"
                        placeholder="04 XX XX XX XX" />
                    </div>
                    <div>
                      <label htmlFor="pro-email" className="block text-sm font-semibold text-neutral-700 mb-1.5">Email</label>
                      <input id="pro-email" type="email" autoComplete="email"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-brand-teal focus:outline-none text-neutral-800 text-base"
                        placeholder="votre@email.fr" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="pro-message" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Votre demande <span aria-label="obligatoire">*</span>
                    </label>
                    <textarea id="pro-message" required rows={5}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-brand-teal focus:outline-none text-neutral-800 text-base resize-none"
                      placeholder="Décrivez votre demande (prénom/nom du patient, matériel souhaité, contexte…). Ne transmettez pas de données médicales confidentielles par ce formulaire." />
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Les données saisies sont utilisées uniquement pour traiter votre demande. Aucune donnée de santé ne doit figurer dans ce formulaire. Consultez notre{" "}
                    <Link href="/confidentialite" className="text-brand-blue underline">politique de confidentialité</Link>.
                  </p>
                  <button type="submit" className="btn btn-primary w-full">
                    <Send size={18} aria-hidden="true" />
                    Envoyer la demande
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
