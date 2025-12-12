"use client";
// Fix for window.turnstile type
declare global {
  interface Window {
    turnstile?: any;
  }
}
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';


interface TurnstileProps {
  siteKey: string;
  onSuccess?: (token: string) => void;
}

export interface TurnstileHandle {
  reset: () => void;
}

const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(({ siteKey, onSuccess }, refHandle) => {
  const ref = useRef<HTMLDivElement>(null);

  useImperativeHandle(refHandle, () => ({
    reset: () => {
      if (window.turnstile && ref.current) {
        try {
          window.turnstile.reset(ref.current);
        } catch (e) {}
      }
    },
  }));

  useEffect(() => {
    // Clean up any previous widget before rendering a new one
    if (window.turnstile && ref.current) {
      try {
        window.turnstile.remove(ref.current);
      } catch (e) {
        // ignore if not rendered yet
      }
    }
    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        window.turnstile && window.turnstile.render(ref.current!, {
          sitekey: siteKey,
          callback: (token: string) => {
            if (onSuccess) onSuccess(token);
          },
        });
      };
    } else {
      window.turnstile.render(ref.current!, {
        sitekey: siteKey,
        callback: (token: string) => {
          if (onSuccess) onSuccess(token);
        },
      });
    }
    // Clean up on unmount
    return () => {
      if (window.turnstile && ref.current) {
        try {
          window.turnstile.remove(ref.current);
        } catch (e) {}
      }
    };
  }, [siteKey, onSuccess]);

  return <div ref={ref} className="cf-turnstile" />;
});

export default Turnstile;
