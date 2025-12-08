"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "./animations";
import { useI18n } from "../i18n/LanguageContext";

export default function IntegrationsSection() {
  const { integrations } = useI18n();

  return (
    <section className="py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2
          variants={fadeUp}
          className="text-xl sm:text-2xl font-semibold mb-2"
        >
          {integrations.title}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-sm text-slate-400 mb-6 max-w-xl"
        >
          {integrations.subtitle}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="grid sm:grid-cols-3 gap-4 text-xs"
        >
          {integrations.items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4"
            >
              <p className="font-semibold mb-1 text-sm">{item.title}</p>
              <p className="text-slate-400">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
