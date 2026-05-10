import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@sharufa/ui/components/sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sharufa Cargo | Opérations",
  description: "Portail opérationnel pour les partenaires Cargo Sharufa.",
};

export default function CargoRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="font-inter min-h-full flex flex-col bg-slate-50">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
