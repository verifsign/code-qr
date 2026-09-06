"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("mhc_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("mhc_cookie_consent", "accepted");
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem("mhc_cookie_consent", "refused");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Gestion des cookies"
      aria-modal="true"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-brand-blue shadow-2xl"
    >
      <div className="container py-5">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Cookie
            size={28}
            className="flex-shrink-0 text-brand-teal"
            aria-hidden="true"
          />
          <div className="flex-1">
            <p className="font-semibold text-neutral-800 mb-1">
              Ce site utilise des cookies
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Nous utilisons des cookies essentiels au fonctionnement du site et,
              avec votre accord, des cookies d&apos;analyse d&apos;audience (aucune donnée
              de santé n&apos;est collectée). Consultez notre{" "}
              <Link
                href="/cookies"
                className="text-brand-blue underline hover:no-underline"
              >
                politique de gestion des cookies
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={refuse}
              className="flex items-center gap-1.5 px-4 py-2.5 border-2 border-neutral-300 text-neutral-700 rounded-lg font-medium hover:border-neutral-500 transition-colors text-sm min-h-[44px]"
              aria-label="Refuser les cookies non essentiels"
            >
              <X size={16} aria-hidden="true" />
              Refuser
            </button>
            <button
              onClick={accept}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal-light transition-colors text-sm min-h-[44px]"
              aria-label="Accepter tous les cookies"
            >
              <Check size={16} aria-hidden="true" />
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
