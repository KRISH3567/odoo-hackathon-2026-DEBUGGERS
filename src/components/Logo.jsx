import React from 'react';

/**
 * StockSense Brand Logo Component
 * Renders the official isometric package & surging velocity arrow logo.
 * 
 * Variants:
 * - 'dark' (default): High-contrast white isometric wireframe with radiant purple arrow, optimized for dark backgrounds.
 * - 'light': Dark-navy isometric wireframe with purple arrow, optimized for white print sheets & light backgrounds.
 * - 'badge': Encased in enterprise dark-navy rounded squircle with violet ambient border.
 */
export default function Logo({
  variant = 'dark',
  className = 'w-8 h-8',
  showText = false,
  textClassName = 'text-lg',
  subtitle = null,
  imgClassName = ''
}) {
  const getLogoSrc = () => {
    switch (variant) {
      case 'badge':
      case 'icon':
        return '/stocksense-icon.png';
      case 'light':
      case 'print':
        return '/stocksense-logo-transparent.png';
      case 'dark':
      default:
        return '/stocksense-logo-dark.png';
    }
  };

  return (
    <div className="inline-flex items-center gap-2.5">
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <img
          src={getLogoSrc()}
          alt="StockSense Logo"
          className={`w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(124,58,237,0.35)] transition-transform duration-200 hover:scale-105 ${imgClassName}`}
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-headline font-bold tracking-tight text-on-surface ${textClassName}`}>
              Stock<span className="text-primary-light">Sense</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary-container/40 text-primary-light font-mono font-bold border border-primary/30">
              MVP
            </span>
          </div>
          {subtitle && (
            <span className="text-[11px] text-secondary font-medium">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
