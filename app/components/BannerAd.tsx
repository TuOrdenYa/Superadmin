import React, { useState } from 'react';

interface BannerAdProps {
  text?: string;
  linkUrl?: string;
  onClose?: () => void;
  marquee?: boolean;
}

const BannerAd: React.FC<BannerAdProps> = ({ text, linkUrl, onClose, marquee }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-orange-100 to-purple-100 border border-orange-300 rounded-lg shadow-md flex items-center justify-between px-4 py-3 mb-4">
      <div className="flex-1">
        {text && (
          marquee ? (
            <div style={{ width: '100%', maxWidth: '100vw', overflow: 'hidden', position: 'relative', height: '2.5rem' }}>
              {linkUrl ? (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-orange-700 text-lg banner-ad-marquee"
                  style={{ display: 'inline-block', position: 'absolute', whiteSpace: 'nowrap', right: 0, top: 0 }}
                >
                  {text}
                </a>
              ) : (
                <span
                  className="font-extrabold text-orange-700 text-lg banner-ad-marquee"
                  style={{ display: 'inline-block', position: 'absolute', whiteSpace: 'nowrap', right: 0, top: 0 }}
                >
                  {text}
                </span>
              )}
            </div>
          ) : (
            linkUrl ? (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-orange-700 hover:underline"
              >
                {text}
              </a>
            ) : (
              <span className="font-bold text-orange-700">{text}</span>
            )
          )
        )}
      </div>
      {onClose && (
        <button
          onClick={() => { setVisible(false); if (onClose) onClose(); }}
          className="ml-4 px-2 py-1 text-xs bg-orange-200 text-orange-800 rounded hover:bg-orange-300"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default BannerAd;
