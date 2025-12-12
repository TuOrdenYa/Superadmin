import React, { useEffect, useRef } from 'react';

interface TurnstileProps {
  siteKey: string;
  onSuccess?: (token: string) => void;
}

const Turnstile: React.FC<TurnstileProps> = ({ siteKey, onSuccess }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, [siteKey, onSuccess]);

  return <div ref={ref} className="cf-turnstile" />;
};

export default Turnstile;
