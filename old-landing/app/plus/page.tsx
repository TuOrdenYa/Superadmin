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

export default function PlusPage() {
  const [isHeaderPlansOpen, setIsHeaderPlansOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { home } = useI18n();
  const plusPage = home.pages?.plus;
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

            {/* CTA desktop (marca global, sigue en naranja) */}
            <a
              href="/#contacto"
              onClick={() => setLeadSource("plus_page_cta_top")}
              className="hidden sm:inline-flex text-xs sm:text-sm px-4 py-2 rounded-full bg-[#FF6F3C] text-slate-950 font-semibold hover:bg-[#FF814F] transition-colors md:inline-flex"
            >
              {plusPage?.ctaLabel || "Quiero el plan Plus"}
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
                  setLeadSource("plus_page_cta_mobile");
                  closeMobileMenu();
                }}
              >
                {plusPage?.ctaLabel || "Quiero el plan Plus"}
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* HERO PLUS */}
        <section className="py-12 sm:py-16 lg:py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-[1.2fr,1fr] gap-10 items-center"
          >
            {/* Columna izquierda: mensaje principal */}
            <motion.div variants={fadeUp} className="space-y-5">
              {/* Badge superior (VERDE PLUS) */}
              <span className="inline-flex items-center gap-2 rounded-full border border-[#2ECC71] bg-[#2ECC711A] px-3 py-1 text-xs font-medium text-[#2ECC71]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2ECC71]" />
                {plusPage?.badge || "Plan Plus — Cuando ya quieres ver pedidos y datos"}
              </span>

              {/* Título */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                {plusPage?.title || "Pedidos básicos + reportes"}{" "}
                <span className="text-[#2ECC71]">{plusPage?.highlight || "para entender mejor tu operación."}</span>
              </h1>

              {/* Subtítulo */}
              <p className="text-sm sm:text-base text-slate-400 max-w-xl">
                {plusPage?.subtitle || "Plus es el paso natural después de Light: sigues teniendo tu menú digital y tus QR, pero ahora empiezas a registrar pedidos y ver reportes simples para tomar decisiones con datos."}
              </p>

              {/* Bullets clave */}
              <ul className="text-sm text-slate-300 space-y-2">
                {(plusPage?.bullets || [
                  "Registro básico de pedidos por día y canal.",
                  "Reportes sencillos: ventas, productos más vendidos.",
                  "Mantienes el mismo menú digital y QR de Light.",
                  "Sin complejidad de mesas ni flows de cocina avanzados.",
                ]).map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/#contacto"
                  onClick={() => setLeadSource("plus_page_cta_hero")}
                  className="px-5 py-2.5 text-sm rounded-full bg-[#2ECC71] text-slate-950 font-semibold hover:bg-[#38D27C] transition-colors"
                >
                  {plusPage?.ctaLabel || "Quiero el plan Plus"}
                </a>
                <a
                  href="/#productos"
                  className="px-5 py-2.5 text-sm rounded-full border border-slate-700/70 hover:border-[#2ECC71] hover:text-[#2ECC71] transition-colors"
                >
                  Comparar Light / Plus / Pro
                </a>
              </div>

              {/* Segmento a quién va dirigido */}
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-slate-400">
                {(plusPage?.segments || [
                  "🍽️ Restaurantes con más rotación",
                  "🍕 Marcas con domicilios frecuentes",
                  "🥡 Negocios que ya sienten más volumen",
                ]).map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800/80">{s}</span>
                ))}
              </div>
            </motion.div>

            {/* Columna derecha: tarjeta resumen Plus */}
            <motion.div
              variants={fadeUp}
              className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900 to-slate-950 p-5 sm:p-6 flex flex-col gap-4 shadow-xl"
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-xs text-slate-400">{plusPage?.summary?.label || "Resumen plan"}</p>
                  <p className="text-lg font-semibold">{plusPage?.summary?.planName || "TuOrdenYa Plus"}</p>
                </div>
                <span className="text-[10px] rounded-full px-3 py-1 bg-[#2ECC71] text-slate-950 font-semibold">
                  {plusPage?.summary?.chip || "Pedidos + datos"}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {(plusPage?.summary?.stats || [
                  { label: "Tipo de solución", value: "Menú + pedidos básicos" },
                  { label: "Foco principal", value: "Registro y reportes" },
                  { label: "Nivel de complejidad", value: "Medio / manejable" },
                ]).map((st) => (
                  <div className="flex justify-between" key={st.label}>
                    <span className="text-slate-400">{st.label}</span>
                    <span className="font-semibold text-slate-100">{st.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 h-px bg-slate-800/70" />

              <div className="space-y-2 text-xs">
                <p className="text-slate-400">{plusPage?.summary?.includesTitle || "Incluye"}</p>
                <ul className="text-slate-300 space-y-1">
                  {(plusPage?.summary?.includesList || [
                    "Todo lo del plan Light.",
                    "Registro de pedidos básicos.",
                    "Reportes de ventas por rango de fechas.",
                    "Productos más vendidos y tickets promedio.",
                  ]).map((inc) => (
                    <li key={inc}>• {inc}</li>
                  ))}
                </ul>
              </div>

              <p className="text-[11px] text-slate-500 pt-1">
                {plusPage?.summary?.footer || "Cuando necesites manejar mesas, tiempos de cocina y cuentas separadas, Pro es el siguiente paso natural en la misma plataforma."}
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* SECCIÓN: QUÉ INCLUYE PLUS */}
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
                {plusPage?.details?.title || "Lo que incluye el plan Plus"}
              </h2>
              <p className="text-sm text-slate-400">
                {plusPage?.details?.subtitle || "Plus combina tu menú digital con un registro simple de pedidos y reportes que te ayudan a entender cómo se comportan tus ventas."}
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="md:col-span-2 grid sm:grid-cols-2 gap-4 text-sm"
            >
              {(plusPage?.details?.features || [
                { title: "Registro centralizado de pedidos", text: "Control de pedidos por salón, WhatsApp o domicilio sin sistema complejo." },
                { title: "Reportes básicos", text: "Ventas por día, franja y canal para entender momentos fuertes y flojos." },
                { title: "Top de productos", text: "Identifica platos más vendidos y los que no se mueven para ajustar." },
                { title: "Base lista para Pro", text: "Estructura preparada para migrar sin empezar de cero." },
              ]).map((f) => (
                <div className="space-y-2" key={f.title}>
                  <p className="font-semibold">{f.title}</p>
                  <p className="text-slate-400 text-xs">{f.text}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* SECCIÓN: CUÁNDO SALTAR A PRO */}
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
                {plusPage?.upgrade?.title || "¿Cuándo tiene sentido subir a Pro?"}
              </h2>
              <p className="text-sm text-slate-400 mb-4 max-w-xl">
                {plusPage?.upgrade?.subtitle || "Si Plus te queda corto porque ya manejas muchas mesas, tiempos de cocina o varios ambientes, Pro se vuelve la herramienta adecuada."}
              </p>
              <ul className="text-sm text-slate-300 space-y-2">
                {(plusPage?.upgrade?.bullets || [
                  "Manejas varias mesas al tiempo y necesitas ver su estado.",
                  "Te interesa dividir cuentas, manejar propinas y controlar cierres.",
                  "Quieres ver tiempos de preparación y evitar cuellos de botella.",
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
                {plusPage?.suitability?.title || "¿Es Plus para ti?"}
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                {(plusPage?.suitability?.bullets || [
                  "Ya tienes buen volumen de pedidos.",
                  "Quieres ver datos claros sin complicarte.",
                  "Aún no estás listo para una operación de salón completa.",
                  "Necesitas más información que la que te da solo un menú.",
                ]).map((sb) => (
                  <li key={sb}>• {sb}</li>
                ))}
              </ul>
              <a
                href="/#contacto"
                onClick={() => setLeadSource("plus_page_cta_details")}
                className="inline-flex mt-4 px-4 py-2 rounded-full bg-[#2ECC71] text-slate-950 text-xs font-semibold hover:bg-[#38D27C]"
              >
                {plusPage?.detailCtaLabel || "Hablar del producto Plus"}
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
            <a href="/#contacto" className="hover:text-[#FF6F3C]" onClick={() => setLeadSource("plus_page_footer")}>
              {home.footer?.contact || "Contacto"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
