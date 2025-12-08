import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TuOrdenYa - Sistema de Gestión para Restaurantes",
    template: "%s | TuOrdenYa",
  },
  description: "Digitaliza tu restaurante con TuOrdenYa. Menús digitales, gestión de pedidos y análisis. Gratis para siempre con el plan Light.",
  keywords: "restaurante, menú digital, QR, gestión pedidos, punto de venta, América Latina",
  authors: [{ name: "TuOrdenYa" }],
  openGraph: {
    title: "TuOrdenYa - Sistema de Gestión para Restaurantes",
    description: "La plataforma de gestión de restaurantes más fácil de América Latina",
    type: "website",
    locale: "es_ES",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
