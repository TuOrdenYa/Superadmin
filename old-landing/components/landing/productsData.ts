import type { ReactNode } from "react";

type ProductVariant = "light" | "plus" | "pro";

export type Product = {
  id: string;
  variant: ProductVariant;
  label: string;
  title: string;
  description: string;
  bullets: string[];
  bottomNote?: string;
  recommended?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

export const productsData: Product[] = [
  {
    id: "light",
    variant: "light",
    label: "Light",
    title: "Menú + QR + WhatsApp",
    description:
      "Ideal para cafeterías, food trucks y negocios pequeños que quieren salir del papel.",
    bullets: [
      "Menú digital responsive.",
      "Código QR por local.",
      "Botón “Ordenar por WhatsApp”.",
      "Ajuste básico a tu marca.",
    ],
    bottomNote: "👉 Punto de partida rápido y económico.",
  },
  {
    id: "plus",
    variant: "plus",
    label: "Plus",
    title: "Pedidos básicos + reportes",
    description:
      "Para restaurantes que empiezan a manejar más volumen y necesitan ver datos simples.",
    bullets: [
      "Todo lo de Light.",
      "Registro de pedidos básicos.",
      "Reportes de ventas sencillos.",
      "Mejor visibilidad de operación.",
    ],
    bottomNote: "👉 Ideal cuando ya superaste la fase “solo menú”.",
  },
  {
    id: "pro",
    variant: "pro",
    label: "Pro",
    title: "Operación completa",
    description:
      "Pensado para la operación diaria: mesas, cocina, cuentas, tiempos y reportes.",
    bullets: [
      "Todo lo de Light y Plus.",
      "Órdenes por mesa y canal.",
      "Flujo de cocina y barra.",
      "Cuentas, propinas y cierres.",
      "Reportes operativos clave.",
    ],
    recommended: true,
    ctaLabel: "Quiero cotizar Pro",
    ctaHref: "#contacto",
  },
];
