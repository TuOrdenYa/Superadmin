import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Script from "next/script";
import Analytics from "@/app/analytics";
import StructuredData from "@/app/structured-data";

// 👇 Import I18n Provider
import { I18nProvider } from "@/components/i18n/LanguageContext";

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
    default: "TuOrdenYa – Menús digitales y gestión para restaurantes",
    template: "%s | TuOrdenYa",
  },
  description:
    "Sistema de menús digitales con QR, pedidos por WhatsApp y operación completa para restaurantes. Versiones Light, Plus y Pro adaptadas a tu negocio.",
  keywords: [
    "menú digital",
    "restaurante",
    "QR menú",
    "pedidos WhatsApp",
    "gestión restaurante",
    "POS restaurante",
    "sistema pedidos",
    "menú QR",
    "software restaurante",
    "TuOrdenYa",
    "carta digital",
    "pedidos online",
  ],
  authors: [{ name: "TuOrdenYa" }],
  creator: "TuOrdenYa",
  publisher: "TuOrdenYa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://tuordenya.com"),
  alternates: {
    canonical: "/",
    languages: {
      "es-CO": "/",
      "en-US": "/",
    },
  },
  openGraph: {
    title: "TuOrdenYa – Menús digitales y gestión para restaurantes",
    description:
      "Sistema de menús digitales con QR, pedidos por WhatsApp y operación completa para restaurantes. Versiones Light, Plus y Pro.",
    url: "https://tuordenya.com",
    siteName: "TuOrdenYa",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TuOrdenYa - Menús digitales para restaurantes",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TuOrdenYa – Menús digitales para restaurantes",
    description:
      "Menús digitales con QR, pedidos por WhatsApp y operación completa. Versiones Light, Plus y Pro.",
    images: ["/og-image.png"],
    creator: "@tuordenya",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
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
    <html lang="es" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ==========================================
              🔥 GOOGLE ANALYTICS 4 — INIT
           ========================================== */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WZMB6KBB54"
          strategy="afterInteractive"
        />

        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WZMB6KBB54', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Registrar pageviews automáticos */}
        <Analytics />

        {/* ==========================================
               🌍 I18N PROVIDER WRAPPING
           ========================================== */}
        <I18nProvider>
          {children}
        </I18nProvider>

      </body>
    </html>
  );
}
