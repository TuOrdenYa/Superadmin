"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "./animations";
import { useI18n } from "@/components/i18n/LanguageContext";
import ProductCard from "./ProductCard";

export default function ProductsSection() {
  const { home } = useI18n();
  const { productsSection } = home;

  return (
    <section id="productos" className="py-12 border-t border-slate-800/70">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-6"
      >
        <motion.div variants={fadeUp} className="max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            {productsSection.title}
          </h2>
          <p className="text-sm text-slate-400">{productsSection.subtitle}</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="grid md:grid-cols-3 gap-4 text-sm"
        >
          {productsSection.products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              variant={p.variant}
              label={p.label}
              title={p.title}
              description={p.description}
              bullets={p.bullets}
              bottomNote={p.bottomNote}
              recommended={p.recommended}
              ctaLabel={p.ctaLabel}
              ctaHref={p.ctaHref}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
