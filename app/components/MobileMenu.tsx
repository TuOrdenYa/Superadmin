"use client";
import Link from "next/link";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="w-72 bg-white h-full shadow-lg p-6 flex flex-col gap-6">
        <button
          className="self-end text-2xl text-gray-500 mb-4"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          ×
        </button>
        <Link href="/pricing#light" className="text-gray-700 font-medium py-2" onClick={onClose}>
          Light — Menú + QR
        </Link>
        <Link href="/pricing#plus" className="text-gray-700 font-medium py-2" onClick={onClose}>
          Plus — Pedidos y reportes
        </Link>
        <Link href="/pricing#pro" className="text-gray-700 font-medium py-2" onClick={onClose}>
          Pro — Operación completa
        </Link>
        <Link href="#faq" className="text-gray-700 font-medium py-2" onClick={onClose}>
          FAQs
        </Link>
        <Link href="/backoffice/login" className="text-gray-700 font-medium py-2" onClick={onClose}>
          Iniciar Sesión
        </Link>
        <Link href="/admin" className="text-white bg-orange-600 rounded-lg px-4 py-2 font-semibold text-center" onClick={onClose}>
          Comenzar Gratis
        </Link>
        <div className="flex gap-2 mt-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
