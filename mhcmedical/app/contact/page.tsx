"use client";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ChevronRight, Send, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

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
              <li className="text-white font-medium">Contact</li>
            </ol>
          </nav>
          <h1 className="text-white mb-4">Nous contacter</h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed">
            Pour tout ce qui concerne une situation médicale, un conseil ou une
            urgence, <strong className="text-white">appelez-nous directement</strong>.
            C&apos;est plus rapide.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Coordonnées */}
            <div>
              <h2 className="text-brand-blue mb-8">Nos coordonnées</h2>
              <div className="space-y-5">
                <a
                  href="tel:+33XXXXXXXXX"
                  className="card flex items-center gap-4 hover:no-underline group"
                >
                  <div className="w-14 h-14 rounded-xl bg-brand-blue flex items-center justify-center flex-shrink-0">
                    <Phone size={26} className="text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500 mb-0.5">Téléphone</div>
                    <div className="text-xl font-bold text-brand-blue group-hover:text-brand-blue-dark">
                      04 XX XX XX XX
                    </div>
                    <div className="text-sm text-neutral-500">Lun–Ven 9h–12h et 14h30–18h</div>
                  </div>
                </a>

                <a
                  href="mailto:contact@mhcmedical.fr"
                  className="card flex items-center gap-4 hover:no-underline group"
                >
                  <div className="w-14 h-14 rounded-xl bg-brand-teal flex items-center justify-center flex-shrink-0">
                    <Mail size={26} className="text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500 mb-0.5">Email général</div>
                    <div className="text-lg font-semibold text-brand-blue group-hover:text-brand-blue-dark">
                      contact@mhcmedical.fr
                    </div>
                    <div className="text-sm text-neutral-500">Réponse sous 24–48h ouvrées</div>
                  </div>
                </a>

                <div className="card flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={26} className="text-brand-blue" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500 mb-0.5">Adresse</div>
                    <div className="font-semibold text-neutral-800">
                      185 avenue de Saint-Louis<br />13015 Marseille
                    </div>
                    <Link href="/magasin" className="inline-block mt-1 text-brand-blue text-sm font-medium hover:underline">
                      Plan et accès →
                    </Link>
                  </div>
                </div>

                <div className="card flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={26} className="text-brand-teal" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500 mb-0.5">Horaires</div>
                    <div className="text-neutral-800">
                      Lundi au vendredi<br />
                      <strong>9h–12h</strong> et <strong>14h30–18h</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note médecin */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-amber-800 text-sm leading-relaxed">
                  <strong>Urgence médicale :</strong> ce formulaire ne convient pas.
                  Appelez le 15 (SAMU) ou le 18 (pompiers) en cas d&apos;urgence de santé.
                </p>
              </div>

              {/* Professionnels */}
              <div className="mt-4 p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-xl">
                <p className="text-neutral-700 text-sm leading-relaxed">
                  <strong>Professionnel de santé ?</strong> Utilisez notre{" "}
                  <Link href="/professionnels/contact" className="text-brand-blue underline">
                    formulaire prescripteurs
                  </Link>{" "}
                  ou écrivez à{" "}
                  <a href="mailto:pro@mhcmedical.fr" className="text-brand-blue underline">
                    pro@mhcmedical.fr
                  </a>
                </p>
              </div>
            </div>

            {/* Formulaire */}
            <div>
              <h2 className="text-brand-blue mb-8">Nous écrire</h2>
              {sent ? (
                <div className="card text-center p-10">
                  <div className="text-5xl mb-4" role="img" aria-label="Message envoyé">✅</div>
                  <h3 className="text-brand-blue mb-3">Message envoyé !</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Nous reviendrons vers vous sous 24 à 48h ouvrées.<br />
                    Pour une réponse plus rapide, appelez-nous au{" "}
                    <a href="tel:+33XXXXXXXXX" className="text-brand-blue font-semibold">
                      04 XX XX XX XX
                    </a>.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="card space-y-5"
                  aria-label="Formulaire de contact"
                  noValidate
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-prenom" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                        Prénom <span aria-label="obligatoire">*</span>
                      </label>
                      <input
                        id="contact-prenom"
                        type="text"
                        required
                        autoComplete="given-name"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-brand-teal focus:outline-none text-neutral-800 text-base"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-nom" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                        Nom <span aria-label="obligatoire">*</span>
                      </label>
                      <input
                        id="contact-nom"
                        type="text"
                        required
                        autoComplete="family-name"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-brand-teal focus:outline-none text-neutral-800 text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-tel" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Téléphone
                    </label>
                    <input
                      id="contact-tel"
                      type="tel"
                      autoComplete="tel"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-brand-teal focus:outline-none text-neutral-800 text-base"
                      placeholder="04 XX XX XX XX"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-brand-teal focus:outline-none text-neutral-800 text-base"
                      placeholder="votre@email.fr"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      Message <span aria-label="obligatoire">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-brand-teal focus:outline-none text-neutral-800 text-base resize-none"
                      placeholder="Comment pouvons-nous vous aider ? Ne transmettez pas d'informations médicales sensibles par ce formulaire."
                    />
                  </div>

                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Les informations saisies sont utilisées uniquement pour répondre à votre demande. Aucune donnée de santé ne doit figurer dans ce formulaire. Consultez notre{" "}
                    <Link href="/confidentialite" className="text-brand-blue underline">
                      politique de confidentialité
                    </Link>.
                  </p>

                  <button type="submit" className="btn btn-primary w-full">
                    <Send size={18} aria-hidden="true" />
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
