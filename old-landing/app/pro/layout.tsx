import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Pro – Operación completa",
  description:
    "Gestión completa de mesas, cocina, barra y cuentas. Para restaurantes con alta rotación, cadenas y dark kitchens.",
  keywords: [
    "POS restaurante",
    "sistema mesas",
    "gestión cocina",
    "software restaurante profesional",
    "control mesas",
    "restaurante operación",
    "dark kitchen",
  ],
  openGraph: {
    title: "TuOrdenYa Pro – Operación completa",
    description:
      "Gestión completa de mesas, cocina, barra y cuentas para restaurantes profesionales.",
    url: "https://tuordenya.com/pro",
    images: [
      {
        url: "/og-pro.png",
        width: 1200,
        height: 630,
        alt: "TuOrdenYa Pro - Operación completa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TuOrdenYa Pro – Operación completa",
    description:
      "Gestión completa para restaurantes profesionales con alta rotación.",
    images: ["/og-pro.png"],
  },
};

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
