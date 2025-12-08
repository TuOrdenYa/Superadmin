"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";

type MarketingLayoutProps = {
  children: React.ReactNode;
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 transition-colors duration-300">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4">{children}</main>
      <Footer />
    </div>
  );
}
