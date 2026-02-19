import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Association Dorothy - Centre Social Kaz Habitant",
  description: "Site officiel de l'association Dorothy en Martinique",
  keywords:
    "centre social, martinique, dorothy, seniors, reeap, ti-ludo, jeunesse, solidarité, accompagnement social",
  authors: [{ name: "Centre Social Kaz'Habitant Dorothy" }],
  icons: {
    icon: [
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "48x48", type: "image/png" },
      { url: "/logo.png", sizes: "64x64", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Centre Social Kaz'Habitant - Dorothy",
    description:
      "Centre Social en Martinique - Services dédiés aux seniors, familles et jeunesse",
    type: "website",
    locale: "fr_FR",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        {children}
        <Footer />
      </body>
    </html>
  );
}
