// components/landing/TestimonialsSection.tsx
"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "./animations";
import { useI18n } from "@/components/i18n/LanguageContext";

export default function TestimonialsSection() {
  const { home } = useI18n();
  const { testimonialsSection } = home;

  return (
    <section className="py-12 border-t border-slate-800/70">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-6"
      >
        <motion.div variants={fadeUp} className="max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            {testimonialsSection.title}
          </h2>
          <p className="text-sm text-slate-400">
            {testimonialsSection.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="grid md:grid-cols-3 gap-4 text-sm"
        >
          {testimonialsSection.items.map((item) => (
            <div
              key={item.name + item.role}
              className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 flex flex-col justify-between gap-3"
            >
              <p className="text-xs text-slate-300 leading-relaxed">
                “{item.quote}”
              </p>
              <div className="pt-2 text-[11px] text-slate-400">
                <p className="font-semibold text-slate-100">{item.name}</p>
                <p>{item.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
