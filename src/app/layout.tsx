import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DAR ELHIKMA - Librairie et Papeterie",
  description: "Votre librairie et papeterie en ligne au Mali. Découvrez des milliers de livres, BD, mangas et fournitures scolaires.",
  icons: {
    icon: "/images/books/logo.jpg",
    apple: "/images/books/logo.jpg",
  },
  openGraph: {
    title: "DAR ELHIKMA - Librairie et Papeterie",
    description: "Votre librairie et papeterie en ligne au Mali. Découvrez des milliers de livres, BD, mangas et fournitures scolaires.",
    url: "https://www.facebook.com/profile.php?id=61578883261940",
    siteName: "DAR ELHIKMA",
    images: [
      {
        url: "/images/books/logo.jpg",
        width: 400,
        height: 400,
        alt: "DAR ELHIKMA Logo",
      },
    ],
    locale: "fr_ML",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
