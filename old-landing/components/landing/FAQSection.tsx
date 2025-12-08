// components/landing/FAQSection.tsx
"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "./animations";
import { useI18n } from "@/components/i18n/LanguageContext";

export default function FAQSection() {
  const { home } = useI18n();
  const { faqSection } = home;

  return (
    <section id="faq" className="py-12 border-t border-slate-800/70">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-3xl"
      >
        <motion.h2
          variants={fadeUp}
          className="text-xl sm:text-2xl font-semibold mb-2"
        >
          {faqSection.title}
        </motion.h2>

        <motion.p variants={fadeUp} className="text-sm text-slate-400 mb-6">
          {faqSection.subtitle}
        </motion.p>

        <motion.div variants={fadeUp} className="space-y-4 text-sm">
          {faqSection.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3"
            >
              <summary className="cursor-pointer list-none flex justify-between items-center">
                <span>{item.question}</span>
                <span className="text-xs text-slate-500 group-open:hidden">
                  +
                </span>
                <span className="text-xs text-slate-500 hidden group-open:inline">
                  –
                </span>
              </summary>
              <p className="mt-2 text-xs text-slate-400">{item.answer}</p>
            </details>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
