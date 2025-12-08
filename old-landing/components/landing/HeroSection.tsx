"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, staggerContainer } from "./animations";
import { useI18n } from "@/components/i18n/LanguageContext";
import setLeadSource from "@/components/lib/leadSource";

type Plan = "Light" | "Plus" | "Pro";

export default function HeroSection() {
  const { home, locale } = useI18n();
  const { hero } = home;

  const [selectedPlan, setSelectedPlan] = useState<Plan>("Light");
  const [isPlanMenuOpen, setIsPlanMenuOpen] = useState(false);

  const planLabelMap: Record<Plan, string> = hero.planCtaLabel;

  const handlePrimaryClick = () => {
    setLeadSource(`hero_${selectedPlan.toLowerCase()}`);

    const section = document.getElementById("contacto");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "#contacto";
    }
  };

  const summaryTexts = hero.summary ?? {
    suiteLabel: locale === "en" ? "TuOrdenYa Suite" : "Suite TuOrdenYa",
    title:
      locale === "en"
        ? "Choose the level for your restaurant"
        : "Elige el nivel para tu restaurante",
    chip: locale === "en" ? "Scalable by stages" : "Escalable por etapas",
    lightTitle: "Light",
    lightChip: locale === "en" ? "Starting point" : "Punto de partida",
    lightText:
      locale === "en"
        ? "Responsive digital menu, QR per location and WhatsApp ordering. Ideal for coffee shops, food trucks and small venues."
        : "Menú digital responsive, QR por local y botón de pedido por WhatsApp. Ideal para cafeterías, food trucks y negocios pequeños.",
    plusTitle: "Plus",
    plusChip: locale === "en" ? "Orders + reports" : "Pedidos + reportes",
    plusText:
      locale === "en"
        ? "Everything in Light plus basic order tracking and simple reports so you know what sells and when."
        : "Todo lo de Light, más registro de pedidos básicos y reportes sencillos para entender qué se vende y cuándo.",
    proTitle: "Pro",
    proChip: locale === "en" ? "Full operations" : "Operación completa",
    proText:
      locale === "en"
        ? "Orders by table and channel, kitchen times, checks and closing. Designed for high-rotation restaurants and chains."
        : "Órdenes por mesa y canal, tiempos de cocina, cuentas y cierres. Pensado para restaurantes de alta rotación, cadenas y dark kitchens.",
    footer:
      locale === "en"
        ? "You start with the level you need today and can move to Plus or Pro without changing platform or menu."
        : "Empiezas con el nivel que necesitas hoy y puedes migrar a Plus o Pro sin cambiar de plataforma ni de menú.",
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-[1.2fr,1fr] gap-10 items-center"
      >
        {/* COLUMNA IZQUIERDA (texto principal hero) */}
        <motion.div variants={fadeUp} className="space-y-5">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6F3C] bg-[#FFD5C2] px-3 py-1 text-xs font-medium text-[#FF6F3C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6F3C]" />
            {hero.badge}
          </span>

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            {hero.title}{" "}
            <span className="text-[#FF6F3C]">{hero.highlight}</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-sm sm:text-base text-slate-400 max-w-xl">
            {hero.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Botón principal + selector de plan */}
            <div className="relative inline-flex">
              <button
                type="button"
                onClick={handlePrimaryClick}
                className="px-5 py-2.5 text-sm rounded-l-full rounded-r-none bg-[#FF6F3C] text-slate-950 font-semibold hover:bg-[#FF814F] transition-colors whitespace-nowrap"
              >
                {planLabelMap[selectedPlan]}
              </button>

              <button
                type="button"
                onClick={() => setIsPlanMenuOpen((open) => !open)}
                className="px-3 py-2.5 text-sm rounded-r-full rounded-l-none bg-[#FF6F3C] border-l border-[#FF814F] text-slate-950 font-semibold hover:bg-[#FF814F] transition-colors"
              >
                ▾
              </button>

              {isPlanMenuOpen && (
                <div className="absolute z-20 mt-1 w-full min-w-[260px] rounded-2xl border border-slate-800 bg-slate-950 shadow-lg overflow-hidden">
                  {(["Light", "Plus", "Pro"] as Plan[]).map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setIsPlanMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-900 ${
                        selectedPlan === plan ? "bg-slate-900" : ""
                      }`}
                    >
                      {plan === "Light" &&
                        "Light – Menú + QR + WhatsApp"}
                      {plan === "Plus" &&
                        "Plus – Pedidos básicos + reportes"}
                      {plan === "Pro" && "Pro – Operación completa"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA secundaria */}
            <a
              href="#productos"
              className="px-5 py-2.5 text-sm rounded-full border border-slate-700/70 hover:border-[#FF6F3C] hover:text-[#FF6F3C] transition-colors"
            >
              {hero.secondaryCta}
            </a>
          </div>

          {/* Segmentos */}
          <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-slate-400">
            {hero.segments.map((segment) => (
              <span
                key={segment}
                className="px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800/80"
              >
                {segment}
              </span>
            ))}
          </div>
        </motion.div>

        {/* COLUMNA DERECHA (tarjetica Suite TuOrdenYa) */}
        <motion.div
          variants={fadeUp}
          className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900 to-slate-950 p-5 sm:p-6 flex flex-col gap-4 shadow-xl"
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-xs text-slate-400">{summaryTexts.suiteLabel}</p>
              <p className="text-lg font-semibold">
                {summaryTexts.title}
              </p>
            </div>
            <span className="text-[10px] rounded-full px-3 py-1 bg-slate-900/80 border border-slate-700/80 text-slate-300">
              {summaryTexts.chip}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Light */}
            <div className="rounded-2xl border border-[#F7C325] bg-[#F7C3251A] px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{summaryTexts.lightTitle}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F7C325] text-slate-950 font-semibold">
                  {summaryTexts.lightChip}
                </span>
              </div>
              <p className="text-slate-200">{summaryTexts.lightText}</p>
            </div>

            {/* Plus */}
            <div className="rounded-2xl border border-[#2ECC71] bg-[#2ECC711A] px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{summaryTexts.plusTitle}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2ECC71] text-slate-950 font-semibold">
                  {summaryTexts.plusChip}
                </span>
              </div>
              <p className="text-slate-400">{summaryTexts.plusText}</p>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border border-[#4A90E2] bg-[#4A90E21A] px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{summaryTexts.proTitle}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4A90E2] text-slate-50 font-semibold">
                  {summaryTexts.proChip}
                </span>
              </div>
              <p className="text-slate-200">{summaryTexts.proText}</p>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-1">
            {summaryTexts.footer}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
