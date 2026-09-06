"use client";
import Link from "next/link";
import { Phone, Clock, MapPin, Mail } from "lucide-react";

export default function TopBar() {
  return (
    <div
      className="bg-brand-blue text-white py-3 sticky top-0 z-50 shadow-md"
      role="banner"
    >
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          {/* Téléphone — élément principal */}
          <a
            href="tel:+33XXXXXXXXX"
            className="flex items-center gap-3 text-white hover:text-brand-teal-light transition-colors focus-visible:outline-white"
            aria-label="Appelez-nous au 04 XX XX XX XX"
          >
            <Phone
              size={22}
              className="flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-xl font-bold tracking-wide">
              04 XX XX XX XX
            </span>
          </a>

          {/* Infos secondaires */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock size={16} aria-hidden="true" />
              <span>Lun–Ven 9h–12h &amp; 14h30–18h</span>
            </span>
            <span className="flex items-center gap-1.5 hidden md:flex">
              <MapPin size={16} aria-hidden="true" />
              <span>185 av. de Saint-Louis, 13015 Marseille</span>
            </span>
            <Link
              href="/contact"
              className="flex items-center gap-1.5 bg-brand-teal hover:bg-brand-teal-light text-white px-4 py-1.5 rounded-full font-medium transition-colors text-sm"
            >
              <Mail size={15} aria-hidden="true" />
              Nous écrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
