// /lib/gtag.ts

export const GA_MEASUREMENT_ID = "G-WZMB6KBB54";

// Registrar un pageview
export const pageview = (url: string) => {
  if (typeof window === "undefined") return; // SSR safe

  (window as any).gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Registrar un evento genérico
export const gaEvent = (
  action: string,
  params: Record<string, any> = {}
) => {
  if (typeof window === "undefined") return; // SSR safe

  (window as any).gtag("event", action, params);
};
