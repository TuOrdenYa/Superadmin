"use client";

import Image from "next/image";
import { useState } from "react";

// 👇 Importamos el hook del contexto de idioma
import { useI18n } from "@/components/i18n/LanguageContext";
import setLeadSource from "@/components/lib/leadSource";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default function Navbar() {
  const { locale, setLocale, home } = useI18n();
  const { navbar } = home;

  const [isHeaderPlansOpen, setIsHeaderPlansOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobilePlansOpen, setIsMobilePlansOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobilePlansOpen(false);
  };

  return (
    <header className="border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur bg-slate-950/90">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
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
                {navbar.subtitle}
              </span>
            </div>
          </a>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6 text-sm">

          <a href="#como-funciona" className="hover:text-[#FF6F3C]">
            {navbar.howItWorks}
          </a>

          {/* PRODUCTOS DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsHeaderPlansOpen((open) => !open)}
              className="inline-flex items-center gap-1 hover:text-[#FF6F3C]"
            >
              {navbar.products}
              <span className="text-[10px]">▼</span>
            </button>

            {isHeaderPlansOpen && (
              <div className="absolute left-0 mt-2 w-52 rounded-xl border border-slate-800 bg-slate-900 shadow-lg py-2 text-xs z-40">
                <a
                  href="/light"
                  className="block px-3 py-1.5 hover:bg-slate-800 hover:text-[#FF6F3C]"
                >
                  {navbar.light}
                </a>
                <a
                  href="/plus"
                  className="block px-3 py-1.5 hover:bg-slate-800 hover:text-[#FF6F3C]"
                >
                  {navbar.plus}
                </a>
                <a
                  href="/pro"
                  className="block px-3 py-1.5 hover:bg-slate-800 hover:text-[#FF6F3C]"
                >
                  {navbar.pro}
                </a>
              </div>
            )}
          </div>

          <a href="#faq" className="hover:text-[#FF6F3C]">
            {navbar.faq}
          </a>
        </div>

        {/* ACCIONES DERECHA */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* CTA Desktop */}
          <a
            href="#contacto"
            onClick={() => setLeadSource("contact_navbar")}
            className="hidden sm:inline-flex text-xs sm:text-sm px-4 py-2 rounded-full bg-[#FF6F3C] text-slate-950 font-semibold hover:bg-[#FF814F] transition-colors md:inline-flex"
          >
            {navbar.demo}
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center md:hidden h-9 w-9 rounded-full border border-slate-700 text-slate-100"
            onClick={() =>
              setIsMobileMenuOpen((open) => {
                const next = !open;
                if (!next) setIsMobilePlansOpen(false);
                return next;
              })
            }
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-2 text-sm">
            
            <a
              href="#como-funciona"
              className="block py-2 text-slate-100 hover:text-[#FF6F3C]"
              onClick={closeMobileMenu}
            >
              {navbar.howItWorks}
            </a>

            {/* Productos Mobile Accordion */}
            <div className="pt-1">
              <button
                type="button"
                className="w-full flex items-center justify-between py-2 text-slate-100 hover:text-[#FF6F3C]"
                onClick={() => setIsMobilePlansOpen((open) => !open)}
              >
                <span>{navbar.products}</span>
                <span className="text-[10px]">
                  {isMobilePlansOpen ? "▲" : "▼"}
                </span>
              </button>

              {isMobilePlansOpen && (
                <div className="mt-1 space-y-1 text-xs pl-3 border-l border-slate-800">
                  <a
                    href="/light"
                    className="block py-1 text-slate-200 hover:text-[#FF6F3C]"
                    onClick={closeMobileMenu}
                  >
                    {navbar.light}
                  </a>
                  <a
                    href="/plus"
                    className="block py-1 text-slate-200 hover:text-[#FF6F3C]"
                    onClick={closeMobileMenu}
                  >
                    {navbar.plus}
                  </a>
                  <a
                    href="/pro"
                    className="block py-1 text-slate-200 hover:text-[#FF6F3C]"
                    onClick={closeMobileMenu}
                  >
                    {navbar.pro}
                  </a>
                </div>
              )}
            </div>

            <a
              href="#faq"
              className="block pt-2 pb-1 text-slate-100 hover:text-[#FF6F3C]"
              onClick={closeMobileMenu}
            >
              {navbar.faq}
            </a>

            <div className="flex justify-center pt-2 pb-2">
              <LanguageSwitcher />
            </div>

            <a
              href="#contacto"
              onClick={() => {
                setLeadSource("contact_navbar_mobile");
                closeMobileMenu();
              }}
              className="mt-2 inline-flex w-full justify-center text-xs sm:text-sm px-4 py-2.5 rounded-full bg-[#FF6F3C] text-slate-950 font-semibold hover:bg-[#FF814F] transition-colors"
            >
              {navbar.demo}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
