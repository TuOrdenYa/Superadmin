"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "./animations";
import { useI18n } from "@/components/i18n/LanguageContext";
import setLeadSource from "@/components/lib/leadSource";

export default function ProDetailsSection() {
  const { home } = useI18n();
  const { proDetailsSection } = home;

  return (
    <section id="pro" className="py-12 border-t border-slate-800/70">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid md:grid-cols-[1.1fr,1fr] gap-8 items-start"
      >
        <motion.div variants={fadeUp}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">
            {proDetailsSection.title}
          </h2>
          <p className="text-sm text-slate-400 mb-4 max-w-xl">
            {proDetailsSection.subtitle}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {proDetailsSection.cards.map((card) => (
              <div key={card.title} className="space-y-2">
                {card.badge && (
                  <p className="text-xs font-semibold text-[#FF6F3C]">{card.badge}</p>
                )}
                <p className="font-semibold">{card.title}</p>
                <p className="text-slate-400 text-xs">{card.description}</p>
                {card.bullets && (
                  <ul className="text-xs text-slate-400 mt-2 space-y-1">
                    {card.bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="rounded-3xl border border-[#4A90E2] bg-gradient-to-br from-slate-900 to-slate-950 p-5 text-sm"
        >
          {proDetailsSection.note && (
            <p className="text-xs font-semibold text-[#4A90E2] mb-2">{proDetailsSection.note}</p>
          )}
          {proDetailsSection.cards && (
            <ul className="space-y-2 text-xs">
              {proDetailsSection.cards.map((c) => (
                <li key={c.title}>• {c.title}</li>
              ))}
            </ul>
          )}
          <a
            href="#contacto"
            onClick={() => setLeadSource("pro_details")}
            className="inline-flex mt-4 px-4 py-2 rounded-full bg-[#4A90E2] text-slate-50 text-xs font-semibold hover:bg-[#5fa3ff]"
          >
            {proDetailsSection.ctaLabel ?? "Quiero hablar de la versión Pro"}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
