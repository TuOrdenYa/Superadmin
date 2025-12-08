// components/landing/HowItWorksSection.tsx
"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "./animations";
import { useI18n } from "@/components/i18n/LanguageContext";

export default function HowItWorksSection() {
  const { home } = useI18n();
  const { howItWorksSection } = home;

  return (
    <section
      id="como-funciona"
      className="py-12 border-t border-slate-800/70"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-6"
      >
        <motion.div variants={fadeUp} className="max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            {howItWorksSection.title}
          </h2>
          <p className="text-sm text-slate-400">
            {howItWorksSection.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="grid md:grid-cols-3 gap-4 text-sm"
        >
          {howItWorksSection.steps.map((step) => (
            <div
              key={step.label}
              className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FF6F3C] text-slate-950 text-xs font-bold">
                  {step.label}
                </span>
                <span className="text-[11px] text-slate-500">
                  TuOrdenYa
                </span>
              </div>
              <p className="font-semibold text-sm">{step.title}</p>
              <p className="text-xs text-slate-400">{step.description}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
