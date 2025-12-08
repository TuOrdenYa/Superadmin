import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Light – Menú digital + QR",
  description:
    "Menú digital responsive con código QR por local y pedidos por WhatsApp. Perfecto para cafeterías, food trucks y restaurantes pequeños.",
  keywords: [
    "menú digital light",
    "QR menú",
    "menú cafetería",
    "menú food truck",
    "carta digital",
    "pedidos WhatsApp",
  ],
  openGraph: {
    title: "TuOrdenYa Light – Menú digital + QR",
    description:
      "Menú digital responsive con código QR y pedidos por WhatsApp. Ideal para cafeterías y food trucks.",
    url: "https://tuordenya.com/light",
    images: [
      {
        url: "/og-light.png",
        width: 1200,
        height: 630,
        alt: "TuOrdenYa Light - Menú digital con QR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TuOrdenYa Light – Menú digital + QR",
    description:
      "Menú digital responsive con código QR y pedidos por WhatsApp.",
    images: ["/og-light.png"],
  },
};

export default function LightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
