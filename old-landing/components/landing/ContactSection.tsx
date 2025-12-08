"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "./animations";
import LeadForm from "../LeadForm";
import { useI18n } from "../i18n/LanguageContext";

export default function ContactSection() {
  const { home } = useI18n();
  const { contactSection } = home;

  return (
    <section
      id="contacto"
      className="py-12 border-t border-slate-800/70 mb-10"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid md:grid-cols-[1.1fr,1fr] gap-8 items-start"
      >
        <motion.div variants={fadeUp}>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            {contactSection.title}
          </h2>

          <p className="text-sm text-slate-400 mb-4">
            {contactSection.subtitle}
          </p>

          <ul className="text-xs text-slate-400 space-y-1">
            {contactSection.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeUp}>
          <LeadForm
            page="landing_home"
            defaultInterest="Solo menú digital (Light)"
            whatsappNumber="573227921640"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
