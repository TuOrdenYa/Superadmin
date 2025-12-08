"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "./animations";
import { useI18n } from "../i18n/LanguageContext";

export default function BenefitsSection() {
  const { benefits } = useI18n();

  return (
    <section className="py-10 border-t border-slate-800/70">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="md:col-span-1">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">
            {benefits.title}
          </h2>
          <p className="text-sm text-slate-400">{benefits.subtitle}</p>
        </motion.div>

        {/* Bullets */}
        <motion.div
          variants={fadeUp}
          className="md:col-span-2 grid sm:grid-cols-2 gap-4 text-sm"
        >
          <ul className="space-y-2">
            {benefits.bulletsLeft.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          <ul className="space-y-2">
            {benefits.bulletsRight.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
