"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { gaEvent } from "@/lib/gtag";
import { useI18n } from "@/components/i18n/LanguageContext";

// Reusable Tailwind classes
const INPUT_CLASS =
  "w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs outline-none focus:border-[#FF6F3C]";
const LABEL_CLASS = "text-xs text-slate-400 block mb-1";

interface LeadFormProps {
  /** Identificador de página para GA4 (ej: "landing_home", "landing_light", etc.) */
  page?: string;
  /** Interés por defecto mostrado en el select (texto) */
  defaultInterest?: string;
  /** Número de WhatsApp al que llegan los leads (sin +, ej: 573227921640) */
  whatsappNumber?: string;
  /** Optional source/section that originated the lead (overrides sessionStorage) */
  source?: string;
}

interface FormState {
  fullName: string;
  restaurantName: string;
  whatsapp: string;
  email: string;
  interest: string;
  operationNotes: string;
}

export default function LeadForm({
  page = "landing_home",
  defaultInterest = "Solo menú digital (Light)",
  whatsappNumber = "573227921640",
  source,
}: LeadFormProps) {
  const { home, locale } = useI18n();
  const { contactSection } = home;
  const form = contactSection.form;

  // Consolidated form state
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    restaurantName: "",
    whatsapp: "",
    email: "",
    interest: defaultInterest,
    operationNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [resolvedSource, setResolvedSource] = useState<string | null>(
    source || null
  );

  // On mount, if no explicit source prop provided, read transient source from sessionStorage
  useEffect(() => {
    if (resolvedSource) return;
    try {
      const stored = sessionStorage.getItem("leadSource");
      if (stored) {
        setResolvedSource(stored);
        // clear it so it doesn't persist accidentally
        sessionStorage.removeItem("leadSource");
      }
    } catch (err) {
      // ignore sessionStorage errors (e.g. SSR or privacy settings)
    }
  }, [resolvedSource]);

  // Helper function to update form field
  const updateFormField = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper function to build message lines
  const buildMessageLines = (includeHeader: boolean = false): string[] => {
    const lines: (string | null)[] = [];
    if (includeHeader) {
      lines.push(form.whatsappIntro || (locale === "en"
        ? "👋 Hello — a lead arrived via the TuOrdenYa landing page."
        : "👋 Hola, llegó un lead desde la landing de TuOrdenYa."));
      lines.push("");
    }
    lines.push(formData.fullName ? (locale === "en" ? `👤 Name: ${formData.fullName}` : `👤 Nombre: ${formData.fullName}`) : null);
    lines.push(formData.restaurantName ? (locale === "en" ? `🏪 Restaurant: ${formData.restaurantName}` : `🏪 Restaurante: ${formData.restaurantName}`) : null);
    lines.push(formData.whatsapp ? (locale === "en" ? `📱 Client WhatsApp: ${formData.whatsapp}` : `📱 WhatsApp del cliente: ${formData.whatsapp}`) : null);
    lines.push(formData.email ? `✉️ Email: ${formData.email}` : null);
    lines.push(formData.interest ? (locale === "en" ? `⭐ Interest: ${formData.interest}` : `⭐ Interés: ${formData.interest}`) : null);
    lines.push(formData.operationNotes ? (locale === "en" ? `📝 About their operation: ${formData.operationNotes}` : `📝 Sobre su operación: ${formData.operationNotes}`) : null);
    if (includeHeader) {
      lines.push("");
    }
    lines.push(form.sourceLabel || (locale === "en" ? "Source: tuordenya.com" : "Fuente: tuordenya.com"));
    return lines.filter(Boolean) as string[];
  };

  // Helper function to get error message
  const getErrorMessage = (
    enMsg: string,
    esMsg: string
  ): string => {
    return locale === "en" ? enMsg : esMsg;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let hasTrackedView = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!hasTrackedView && entry.isIntersecting) {
            hasTrackedView = true;
            try {
              gaEvent("view_lead_form", {
                page,
              });
            } catch (err) {
              console.error("Error enviando evento view_lead_form:", err);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [page]);

  // Form submission: Supabase + WhatsApp + GA4
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validation
    if (!formData.fullName.trim() || !formData.whatsapp.trim()) {
      setErrorMessage(
        getErrorMessage(
          "Please fill in at least your name and WhatsApp.",
          "Por favor completa al menos tu nombre y WhatsApp."
        )
      );
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // If resolvedSource wasn't available at mount time (race/navigation),
      // try reading it again right before submit.
      let submitSource = resolvedSource;
      if (!submitSource) {
        try {
          const stored = sessionStorage.getItem("leadSource");
          if (stored) {
            submitSource = stored;
            // clear it so it doesn't persist accidentally
            sessionStorage.removeItem("leadSource");
            setResolvedSource(stored);
          }
        } catch (err) {
          // ignore storage errors
        }
      }
      // 1️⃣ Build message for Supabase
      const composedMessage = [
        submitSource ? (locale === "en" ? `Origin: ${submitSource}` : `Origen: ${submitSource}`) : null,
        formData.interest ? (locale === "en" ? `Interest: ${formData.interest}` : `Interés: ${formData.interest}`) : null,
        formData.operationNotes
          ? (locale === "en"
              ? `About operation: ${formData.operationNotes}`
              : `Sobre su operación: ${formData.operationNotes}`)
          : null,
        form.sourceLabel || (locale === "en" ? "Source: tuordenya.com" : "Fuente: tuordenya.com"),
      ]
        .filter(Boolean)
        .join(" | ");

      // 2️⃣ Save to Supabase (leads table)
      const { error } = await supabase.from("leads").insert([
        {
          name: formData.fullName || null,
          phone: formData.whatsapp || null,
          email: formData.email || null,
          restaurant: formData.restaurantName || null,
          interest: formData.interest || null,
          source: submitSource || page,
          message: composedMessage || null,
        },
      ]);

      if (error) {
        console.error("Error guardando lead en Supabase:", error);
        setErrorMessage(
          getErrorMessage(
            "There was an error saving your data. Please try again.",
            "Ocurrió un error guardando tus datos. Intenta de nuevo."
          )
        );
        return;
      }

      // 3️⃣ GA4 — Success event
      try {
        gaEvent("submit_lead_form", {
          page,
          interest: formData.interest || "No especificado",
          source: submitSource || page,
        });
      } catch (err) {
        console.error("Error enviando evento submit_lead_form:", err);
      }

      // 4️⃣ Build WhatsApp message
      const messageLines = buildMessageLines(true).join("\n");
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        messageLines
      )}`;

      // 5️⃣ Open WhatsApp in new tab
      window.open(whatsappUrl, "_blank");

      // 6️⃣ Clear form
      setFormData({
        fullName: "",
        restaurantName: "",
        whatsapp: "",
        email: "",
        interest: defaultInterest,
        operationNotes: "",
      });
    } catch (err) {
      console.error("Error inesperado en el submit:", err);
      setErrorMessage(
        getErrorMessage(
          "Unexpected error. Please try again.",
          "Ocurrió un error inesperado. Intenta de nuevo."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef}>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 space-y-4 text-sm"
      >
        {/* NOMBRE */}
        <div>
          <label className={LABEL_CLASS}>{form.nameLabel}</label>
          <input
            type="text"
            placeholder={form.namePlaceholder}
            value={formData.fullName}
            onChange={(e) => updateFormField("fullName", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        {/* RESTAURANTE */}
        <div>
          <label className={LABEL_CLASS}>{form.restaurantLabel}</label>
          <input
            type="text"
            placeholder={form.restaurantPlaceholder}
            value={formData.restaurantName}
            onChange={(e) => updateFormField("restaurantName", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        {/* WHATSAPP */}
        <div>
          <label className={LABEL_CLASS}>{form.whatsappLabel}</label>
          <input
            type="tel"
            placeholder={form.whatsappPlaceholder}
            value={formData.whatsapp}
            onChange={(e) => updateFormField("whatsapp", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className={LABEL_CLASS}>{form.emailLabel}</label>
          <input
            type="email"
            placeholder={form.emailPlaceholder}
            value={formData.email}
            onChange={(e) => updateFormField("email", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        {/* INTERÉS */}
        <div>
          <label className={LABEL_CLASS}>{form.interestLabel}</label>
          <select
            value={formData.interest}
            onChange={(e) => updateFormField("interest", e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="">{form.interestPlaceholder}</option>
            {form.interestOptions.map((opt) => (
              <option key={opt.value} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* NOTAS / OPERACIÓN */}
        <div>
          <label className={LABEL_CLASS}>{form.notesLabel}</label>
          <textarea
            rows={3}
            placeholder={form.notesPlaceholder}
            value={formData.operationNotes}
            onChange={(e) => updateFormField("operationNotes", e.target.value)}
            className={INPUT_CLASS}
          />
        </div>

        {errorMessage && (
          <p className="text-xs text-red-400">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 rounded-full bg-[#FF6F3C] text-slate-950 font-semibold text-sm py-2 hover:bg-[#FF814F] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? getErrorMessage("Sending...", "Enviando...")
            : form.submitLabel}
        </button>

        <p className="text-[11px] text-slate-500 mt-1">
          {getErrorMessage(
            "We respect your time: no spam, only relevant information for your restaurant.",
            "Respetamos tu tiempo: nada de spam, solo información relevante para tu restaurante."
          )}
        </p>
      </form>
    </div>
  );
}
