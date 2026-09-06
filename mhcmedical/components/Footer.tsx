import Link from "next/link";
import { Phone, MapPin, Clock, Mail, Shield, FileText, Cookie, AlertCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Bloc principal */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Identité */}
          <div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-lg mb-4"
              style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}
              aria-hidden="true"
            >
              MHC
            </div>
            <h3 className="text-white font-bold text-lg mb-2">MHC Medical</h3>
            <p className="text-sm leading-relaxed mb-4">
              SAS Medical Health and Care<br />
              Prestataire de services et distributeur de matériels médicaux — PSDM
            </p>
            <p className="text-xs text-neutral-500">
              SIREN 983 367 699 — RCS Marseille
            </p>
          </div>

          {/* Coordonnées */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Nous trouver</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="flex-shrink-0 mt-0.5 text-brand-teal" aria-hidden="true" />
                <span>185 avenue de Saint-Louis<br />13015 Marseille</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0 text-brand-teal" aria-hidden="true" />
                <a
                  href="tel:+33XXXXXXXXX"
                  className="hover:text-white transition-colors"
                >
                  04 XX XX XX XX
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0 text-brand-teal" aria-hidden="true" />
                <a
                  href="mailto:contact@mhcmedical.fr"
                  className="hover:text-white transition-colors"
                >
                  contact@mhcmedical.fr
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={16} className="flex-shrink-0 mt-0.5 text-brand-teal" aria-hidden="true" />
                <span>Lun–Ven : 9h–12h &amp; 14h30–18h</span>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Le site</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/patient", label: "Vous êtes patient" },
                { href: "/aidant", label: "Vous êtes aidant" },
                { href: "/equipements", label: "Nos équipements" },
                { href: "/professionnels", label: "Professionnels de santé" },
                { href: "/magasin", label: "Le magasin" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Informations légales</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mentions-legales" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <FileText size={14} aria-hidden="true" />
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Shield size={14} aria-hidden="true" />
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Cookie size={14} aria-hidden="true" />
                  Gestion des cookies
                </Link>
              </li>
              <li>
                <Link href="/reclamations" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <AlertCircle size={14} aria-hidden="true" />
                  Réclamations &amp; matériovigilance
                </Link>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-neutral-800 rounded-lg text-xs text-neutral-400 leading-relaxed">
              Les dispositifs médicaux proposés sont des produits de santé réglementés portant le marquage CE.
            </div>
          </div>
        </div>
      </div>

      {/* Barre de bas */}
      <div className="border-t border-neutral-800">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} SAS Medical Health and Care — Tous droits réservés</p>
            <p>Hébergé par OVH — 2 rue Kellermann, 59100 Roubaix</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
