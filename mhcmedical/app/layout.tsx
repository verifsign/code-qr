import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MHC Medical — Matériel médical à Marseille, pris en charge",
  description:
    "Votre matériel médical pris en charge sans avance de frais. Tiers payant intégral CPAM et mutuelle. Magasin à Marseille 15e — SAS Medical Health and Care.",
  keywords:
    "matériel médical Marseille, fauteuil roulant, lit médicalisé, tiers payant, CPAM, remboursement, prestataire médical",
  openGraph: {
    title: "MHC Medical — Matériel médical à Marseille",
    description:
      "Votre matériel médical pris en charge sans avance de frais. Tiers payant intégral CPAM et mutuelle.",
    url: "https://mhcmedical.fr",
    siteName: "MHC Medical",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-brand-blue focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Aller au contenu principal
        </a>
        <TopBar />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
