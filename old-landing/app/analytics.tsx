"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { pageview } from "@/lib/gtag";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Evitar tracking en páginas especiales si molestan
    if (pathname === "/404" || pathname === "/_not-found") return;

    pageview(pathname);
  }, [pathname]);

  return null;
}
