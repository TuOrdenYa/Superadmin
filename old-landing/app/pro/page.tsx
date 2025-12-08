"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/components/i18n/LanguageContext";
import setLeadSource from "@/components/lib/leadSource";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function ProPage() {
  const [isHeaderPlansOpen, setIsHeaderPlansOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { home } = useI18n();
  const proPage = home.pages?.pro;
  const navbar = home.navbar;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 transition-colors duration-300">
      {/* NAVBAR */}
      <header className="border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur bg-slate-950/90">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Logo TuOrdenYa */}
            <a href="/" className="flex items-center gap-2">
              <div className="flex items-center">
                <Image
                  src="/logo-tuordenya-white.png"
                  alt="TuOrdenYa"
                  width={140}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-sm sm:text-base">
                  {navbar?.subtitle || "Menús y órdenes para restaurantes"}
                </span>
              </div>
            </a>
          </div>

          {/* NAV DESKTOP */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="/" className="hover:text-[#FF6F3C]">
              {navbar?.backToHome || "Volver al inicio"}
            </a>

            <a href="/#como-funciona" className="hover:text-[#FF6F3C]">
              {navbar?.howItWorks || "Cómo funciona"}
            </a>

            {/* Dropdown de productos en el header (desktop) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsHeaderPlansOpen((open) => !open)}
                className="inline-flex items-center gap-1 hover:text-[#FF6F3C]"
              >
                {navbar?.products || "Nuestros productos"}
                <span className="text-[10px]">▼</span>
              </button>

              {isHeaderPlansOpen && (
                <div className="absolute left-0 mt-2 w-52 rounded-xl border border-slate-800 bg-slate-900 shadow-lg py-2 text-xs z-40">
                  <a
                    href="/light"
                    className="block px-3 py-1.5 hover:bg-slate-800 hover:text-[#FF6F3C]"
                  >
                    {navbar?.light || "Light — Menú digital + QR"}
                  </a>
                  <a
                    href="/plus"
                    className="block px-3 py-1.5 hover:bg-slate-800 hover:text-[#FF6F3C]"
                  >
                    {navbar?.plus || "Plus — Pedidos y reportes"}
                  </a>
                  <a
                    href="/pro"
                    className="block px-3 py-1.5 hover:bg-slate-800 hover:text-[#FF6F3C]"
                  >
                    {navbar?.pro || "Pro — Operación completa"}
                  </a>
                </div>
              )}
            </div>

            <a href="/#faq" className="hover:text-[#FF6F3C]">
              {navbar?.faq || "FAQs"}
            </a>
          </div>

          {/* ACCIONES DERECHA */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* CTA desktop */}
            <a
              href="/#contacto"
              onClick={() => setLeadSource("pro_page_cta_top")}
              className="hidden sm:inline-flex text-xs sm:text-sm px-4 py-2 rounded-full bg-[#FF6F3C] text-slate-950 font-semibold hover:bg-[#FF814F] transition-colors md:inline-flex"
            >
              {proPage?.ctaLabel || "Quiero hablar de la versión Pro"}
            </a>

            {/* Botón menú móvil */}
            <button
              type="button"
              className="inline-flex items-center justify-center md:hidden h-9 w-9 rounded-full border border-slate-700 text-slate-100"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>

        {/* PANEL MENÚ MÓVIL */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950">
            <div className="max-w-6xl mx-auto px-4 py-3 space-y-2 text-sm">
              <a
                href="/"
                className="block py-2 text-slate-100 hover:text-[#FF6F3C]"
                onClick={closeMobileMenu}
              >
                {navbar?.backToHome || "Volver al inicio"}
              </a>

              <a
                href="/#como-funciona"
                className="block py-2 text-slate-100 hover:text-[#FF6F3C]"
                onClick={closeMobileMenu}
              >
                {navbar?.howItWorks || "Cómo funciona"}
              </a>

              <div className="pt-1">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                  {navbar?.products || "Nuestros productos"}
                </p>
                <div className="space-y-1 text-xs">
                  <a
                    href="/light"
                    className="block py-1 text-slate-200 hover:text-[#FF6F3C]"
                    onClick={closeMobileMenu}
                  >
                    {navbar?.light || "Light — Menú digital + QR"}
                  </a>
                  <a
                    href="/plus"
                    className="block py-1 text-slate-200 hover:text-[#FF6F3C]"
                    onClick={closeMobileMenu}
                  >
                    {navbar?.plus || "Plus — Pedidos y reportes"}
                  </a>
                  <a
                    href="/pro"
                    className="block py-1 text-slate-200 hover:text-[#FF6F3C]"
                    onClick={closeMobileMenu}
                  >
                    {navbar?.pro || "Pro — Operación completa"}
                  </a>
                </div>
              </div>

              <a
                href="/#faq"
                className="block pt-2 pb-1 text-slate-100 hover:text-[#FF6F3C]"
                onClick={closeMobileMenu}
              >
                {navbar?.faq || "FAQs"}
              </a>

              <div className="flex justify-center pt-2 pb-2">
                <LanguageSwitcher />
              </div>

              <a
                href="/#contacto"
                className="mt-2 inline-flex w-full justify-center text-xs sm:text-sm px-4 py-2.5 rounded-full bg-[#FF6F3C] text-slate-950 font-semibold hover:bg-[#FF814F] transition-colors"
                onClick={() => {
                  setLeadSource("pro_page_cta_mobile");
                  closeMobileMenu();
                }}
              >
                {proPage?.ctaLabel || "Quiero hablar de la versión Pro"}
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* HERO PRO */}
        <section className="py-12 sm:py-16 lg:py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-[1.2fr,1fr] gap-10 items-center"
          >
            {/* Columna izquierda: mensaje principal */}
            <motion.div variants={fadeUp} className="space-y-5">
              {/* Badge superior */}
              <span className="inline-flex items-center gap-2 rounded-full border border-[#4A90E2] bg-[#4A90E21A] px-3 py-1 text-xs font-medium text-[#4A90E2]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4A90E2]" />
                {proPage?.badge || "RestOrder Pro — Operación completa para restaurantes en serio"}
              </span>

              {/* Título */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                {proPage?.title || "Mesas, cocina, cuentas y tiempos"} {" "}
                <span className="text-[#4A90E2]">{proPage?.highlight || "en un solo sistema pensado para tu salón."}</span>
              </h1>

              {/* Subtítulo */}
              <p className="text-sm sm:text-base text-slate-400 max-w-xl">
                {proPage?.subtitle || "Pro es la versión para restaurantes que manejan mesas, varios ambientes, cocina y barra, y necesitan tener control fino sobre órdenes, tiempos, cuentas y cierres diarios."}
              </p>

              {/* Bullets clave */}
              <ul className="text-sm text-slate-300 space-y-2">
                {(proPage?.bullets || [
                  "Órdenes por mesa, canal y estado.",
                  "Envío a cocina y barra con estados de preparación.",
                  "Cuentas, división, propinas y preparación para POS/caja.",
                  "Reportes operativos para entender tu operación real.",
                ]).map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/#contacto"
                  onClick={() => setLeadSource("pro_page_cta_hero")}
                  className="px-5 py-2.5 text-sm rounded-full bg-[#4A90E2] text-slate-50 font-semibold hover:bg-[#5fa3ff] transition-colors"
                >
                  {proPage?.ctaLabel || "Quiero hablar de la versión Pro"}
                </a>
                <a
                  href="/#productos"
                  className="px-5 py-2.5 text-sm rounded-full border border-slate-700/70 hover:border-[#4A90E2] hover:text-[#4A90E2] transition-colors"
                >
                  Ver comparación Light / Plus / Pro
                </a>
              </div>

              {/* Segmento a quién va dirigido */}
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-slate-400">
                {(proPage?.segments || [
                  "🏬 Cadenas y marcas con varias sedes",
                  "🍽️ Restaurantes con salón y alta rotación",
                  "🍱 Dark kitchens con alto volumen",
                ]).map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800/80">{s}</span>
                ))}
              </div>
            </motion.div>

            {/* Columna derecha: tarjeta resumen Pro */}
            <motion.div
              variants={fadeUp}
              className="rounded-3xl border border-[#4A90E2] bg-gradient-to-br from-slate-900 to-slate-950 p-5 sm:p-6 flex flex-col gap-4 shadow-xl"
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-xs text-slate-400">{proPage?.summary?.label || "Resumen plan"}</p>
                  <p className="text-lg font-semibold">{proPage?.summary?.planName || "RestOrder Pro"}</p>
                </div>
                <span className="text-[10px] rounded-full px-3 py-1 bg-[#4A90E2] text-slate-50 font-semibold">
                  {proPage?.summary?.chip || "Operación completa"}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {(proPage?.summary?.stats || [
                  { label: "Tipo de solución", value: "Mesas + cocina + cuentas" },
                  { label: "Foco principal", value: "Operación en salón" },
                  { label: "Nivel de complejidad", value: "Alto, pero controlado" },
                ]).map((st) => (
                  <div className="flex justify-between" key={st.label}>
                    <span className="text-slate-400">{st.label}</span>
                    <span className="font-semibold text-slate-100">{st.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 h-px bg-slate-800/70" />

              <div className="space-y-2 text-xs">
                <p className="text-slate-400">{proPage?.summary?.includesTitle || "Incluye"}</p>
                <ul className="text-slate-300 space-y-1">
                  {(proPage?.summary?.includesList || [
                    "Todo lo de Light y Plus.",
                    "Órdenes por mesa, canal y estado.",
                    "Envío y seguimiento en cocina y barra.",
                    "Manejo de cuentas, división y propinas.",
                    "Reportes operativos por franja, canal y producto.",
                  ]).map((inc) => (
                    <li key={inc}>• {inc}</li>
                  ))}
                </ul>
              </div>

              <p className="text-[11px] text-slate-500 pt-1">
                {proPage?.summary?.footer || "Pro se construye sobre la misma base de TuOrdenYa, así que tu menú y tus QR siguen siendo los mismos, solo amplías la operación."}
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* SECCIÓN: DETALLE PRO */}
        <section className="py-10 border-t border-slate-800/70">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <motion.div variants={fadeUp} className="md:col-span-1">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                {proPage?.details?.title || "Cómo te ayuda Pro en el día a día"}
              </h2>
              <p className="text-sm text-slate-400">
                {proPage?.details?.subtitle || "Pro está pensado para la operación real de un restaurante: meseros, cocina, barra, cuentas y clientes que entran por diferentes canales."}
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="md:col-span-2 grid sm:grid-cols-2 gap-4 text-sm"
            >
              {(proPage?.details?.features || [
                { title: "Control de mesas y estados", text: "Visualiza mesas libres, ocupadas o listas para pagar." },
                { title: "Flujo de cocina y barra", text: "Envía órdenes y maneja estados preparación / listo / entregado." },
                { title: "Cuentas y pagos", text: "Divide cuentas, maneja propinas y prepara para caja/POS." },
                { title: "Reportes operativos", text: "Rotación de mesas, demanda por franja y canales con más tickets." },
              ]).map((f) => (
                <div className="space-y-2" key={f.title}>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-slate-400 text-xs">{f.text}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* SECCIÓN: TIPOS DE NEGOCIO Y AJUSTE */}
        <section className="py-12 border-t border-slate-800/70">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-[1.1fr,1fr] gap-8 items-start"
          >
            <motion.div variants={fadeUp}>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                {proPage?.upgrade?.title || "Diseñado para operaciones exigentes"}
              </h2>
              <p className="text-sm text-slate-400 mb-4 max-w-xl">
                {proPage?.upgrade?.subtitle || "RestOrder Pro es ideal para restaurantes con una operación repetitiva y estructurada, donde hay roles, rotación de mesas y necesidad de hacer seguimiento constante."}
              </p>
              <ul className="text-sm text-slate-300 space-y-2">
                {(proPage?.upgrade?.bullets || [
                  "Restaurantes de alta rotación con muchas mesas.",
                  "Bares y gastrobares con cocina y barra separadas.",
                  "Cadenas pequeñas y medianas con varias sedes.",
                  "Dark kitchens que necesitan orquestar varios canales a la vez.",
                ]).map((u) => (
                  <li key={u}>• {u}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5 text-sm"
            >
              <p className="text-xs font-semibold text-slate-300 mb-2">
                {proPage?.suitability?.title || "¿Es Pro para ti ahora?"}
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                {(proPage?.suitability?.bullets || [
                  "Ya sientes que se te quedan cosas por fuera en papel.",
                  "Manejas varios turnos, meseros y zonas.",
                  "Quieres estandarizar la operación y no depender de cada persona.",
                  "Necesitas tener claridad de tiempos y desempeño del salón.",
                ]).map((sb) => (
                  <li key={sb}>• {sb}</li>
                ))}
              </ul>
              <a
                href="/#contacto"
                onClick={() => setLeadSource("pro_page_cta_details")}
                className="inline-flex mt-4 px-4 py-2 rounded-full bg-[#4A90E2] text-slate-50 text-xs font-semibold hover:bg-[#5fa3ff]"
              >
                {proPage?.detailCtaLabel || "Agendar una conversación sobre Pro"}
              </a>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/70 py-6 text-[11px] text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between gap-3">
          <p>
            © {new Date().getFullYear()} TuOrdenYa. {home.footer?.copyright || "Todos los derechos reservados."}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/#productos" className="hover:text-[#FF6F3C]">
              {home.footer?.products || "Productos"}
            </a>
            <a href="/#faq" className="hover:text-[#FF6F3C]">
              {home.footer?.faq || "FAQs"}
            </a>
            <a href="/#contacto" className="hover:text-[#FF6F3C]" onClick={() => setLeadSource("pro_page_footer")}>
              {home.footer?.contact || "Contacto"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
