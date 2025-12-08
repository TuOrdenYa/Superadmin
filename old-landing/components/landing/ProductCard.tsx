"use client";

import { useI18n } from "@/components/i18n/LanguageContext";

type ProductVariant = "light" | "plus" | "pro";

type ProductCardProps = {
  id?: string;
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

const baseClasses =
  "rounded-2xl border p-5 flex flex-col justify-between text-sm relative overflow-hidden";

const variantClasses: Record<ProductVariant, string> = {
  light: "border-slate-800/70 bg-slate-900/60",
  plus: "border-slate-800/70 bg-slate-900/80",
  pro: "border-[#FF6F3C] bg-gradient-to-br from-[#FF6F3C33] to-slate-900",
};

export default function ProductCard({
  variant,
  // accept an optional id to better identify product source if provided
  id,
  label,
  title,
  description,
  bullets,
  bottomNote,
  recommended,
  ctaLabel,
  ctaHref,
}: ProductCardProps) {
  const { home } = useI18n();
  const recommendedLabel = home.productsSection?.recommendedLabel ?? "Recomendado";
  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      {recommended && (
        <span className="absolute right-4 top-4 text-[10px] px-2 py-1 rounded-full bg-[#FF6F3C] text-slate-950 font-semibold">
          {recommendedLabel}
        </span>
      )}

      <div>
        <p
          className={
            variant === "pro"
              ? "text-xs font-semibold text-[#FF6F3C]"
              : "text-xs font-semibold text-slate-400"
          }
        >
          {label}
        </p>
        <p className="text-lg font-semibold mt-1 mb-1">{title}</p>
        <p
          className={
            variant === "pro"
              ? "text-xs text-slate-200 mb-3"
              : "text-xs text-slate-400 mb-3"
          }
        >
          {description}
        </p>
        <ul className="text-xs space-y-1">
          {bullets.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>

      {bottomNote && (
        <p className="mt-4 text-xs text-slate-500">{bottomNote}</p>
      )}

      {ctaLabel && ctaHref && (
        <a
          href={ctaHref}
          onClick={() => {
            // only set a product-specific source if the CTA leads to contact
            if (ctaHref.includes("#contacto")) {
              const productKey = id || `product_${variant}`;
              try {
                // import dynamically to avoid SSR issues
                const { setLeadSource } = require("@/components/lib/leadSource");
                setLeadSource(productKey);
              } catch (err) {
                try {
                  sessionStorage.setItem("leadSource", productKey);
                } catch (_) {
                  /* ignore */
                }
              }
            }
          }}
          className="mt-4 inline-flex px-4 py-2 rounded-full bg-[#FF6F3C] text-slate-950 text-xs font-semibold hover:bg-[#FF814F]"
        >
          {ctaLabel}
        </a>
      )}
    </div>
  );
}
