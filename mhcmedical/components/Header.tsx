"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

const navItems = [
  {
    label: "Vous êtes patient",
    href: "/patient",
    children: [
      { label: "Comment ça marche", href: "/patient/comment-ca-marche" },
      { label: "Ce qui est pris en charge", href: "/patient/prise-en-charge" },
      { label: "Venir au magasin", href: "/magasin" },
    ],
  },
  {
    label: "Vous êtes aidant",
    href: "/aidant",
    children: [
      { label: "Équiper le domicile d'un proche", href: "/aidant/equiper-domicile" },
      { label: "Retour d'hospitalisation", href: "/aidant/retour-hospitalisation" },
      { label: "Prévenir les chutes", href: "/aidant/prevenir-chutes" },
    ],
  },
  {
    label: "Nos équipements",
    href: "/equipements",
    children: [
      { label: "Mobilité et déplacement", href: "/equipements/mobilite" },
      { label: "Chambre et lit médicalisé", href: "/equipements/chambre" },
      { label: "Salle de bain et toilettes", href: "/equipements/salle-de-bain" },
      { label: "Vie quotidienne", href: "/equipements/vie-quotidienne" },
      { label: "Diagnostic et surveillance", href: "/equipements/diagnostic" },
    ],
  },
  {
    label: "Professionnels",
    href: "/professionnels",
    children: [
      { label: "Travailler avec nous", href: "/professionnels/partenariat" },
      { label: "Ce que nous délivrons", href: "/professionnels/catalogue" },
      { label: "Contact prescripteurs", href: "/professionnels/contact" },
    ],
  },
  { label: "Le magasin", href: "/magasin" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-brand-teal"
            aria-label="MHC Medical — Retour à l'accueil"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white text-lg"
              style={{ background: "linear-gradient(135deg, #1a4e8a 0%, #2a9d8f 100%)" }}
              aria-hidden="true"
            >
              MHC
            </div>
            <div>
              <div className="font-bold text-brand-blue text-xl leading-tight">
                MHC Medical
              </div>
              <div className="text-neutral-600 text-xs">
                Medical Health and Care
              </div>
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Navigation principale"
          >
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative group"
                onMouseEnter={() => item.children && setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-neutral-700 hover:text-brand-blue hover:bg-neutral-50 font-medium text-sm transition-colors"
                  onClick={() => setOpenDropdown(null)}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown size={15} aria-hidden="true" />
                  )}
                </Link>
                {item.children && openDropdown === item.href && (
                  <div className="absolute top-full left-0 w-64 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 py-2 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-neutral-700 hover:text-brand-blue hover:bg-neutral-50 text-sm transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Bouton hamburger mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-brand-blue hover:bg-neutral-100 transition-colors"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <nav
          className="lg:hidden bg-white border-t border-neutral-200 pb-4"
          aria-label="Navigation mobile"
        >
          <div className="container">
            {navItems.map((item) => (
              <div key={item.href} className="border-b border-neutral-100 last:border-0">
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-3.5 text-neutral-800 font-medium hover:text-brand-blue"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 pb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-2 text-neutral-600 hover:text-brand-blue text-sm"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
