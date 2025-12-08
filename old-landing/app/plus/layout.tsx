import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Plus – Pedidos y reportes",
  description:
    "Registro de pedidos básicos y reportes de ventas. Para restaurantes con volumen que necesitan datos claros sin complejidad.",
  keywords: [
    "menú digital plus",
    "pedidos restaurante",
    "reportes ventas",
    "sistema pedidos",
    "software restaurante",
    "gestión pedidos",
  ],
  openGraph: {
    title: "TuOrdenYa Plus – Pedidos y reportes",
    description:
      "Registro de pedidos y reportes de ventas. Para restaurantes en crecimiento.",
    url: "https://tuordenya.com/plus",
    images: [
      {
        url: "/og-plus.png",
        width: 1200,
        height: 630,
        alt: "TuOrdenYa Plus - Pedidos y reportes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TuOrdenYa Plus – Pedidos y reportes",
    description:
      "Registro de pedidos y reportes de ventas para restaurantes.",
    images: ["/og-plus.png"],
  },
};

export default function PlusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
