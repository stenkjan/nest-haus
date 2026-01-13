/**
 * Contextual Internal Link Component
 * 
 * Optimizes internal linking for SEO by adding relevant links within content
 * Improves page authority distribution and crawlability
 */

import Link from 'next/link';
import React from 'react';

export interface ContextualLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string; // SEO-friendly title attribute
}

export function ContextualLink({ href, children, className = '', title }: ContextualLinkProps) {
  const defaultClass = 'text-blue-600 hover:text-blue-800 underline font-medium transition-colors';

  return (
    <Link
      href={href}
      className={className || defaultClass}
      title={title}
    >
      {children}
    </Link>
  );
}

/**
 * Related Pages Section Component
 * Adds "Verwandte Seiten" section at bottom of content
 */
export interface RelatedPage {
  href: string;
  title: string;
  description: string;
  icon?: string;
}

export interface RelatedPagesProps {
  pages: RelatedPage[];
  title?: string;
}

export function RelatedPages({ pages, title = 'Verwandte Seiten' }: RelatedPagesProps) {
  if (pages.length === 0) return null;

  return (
    <div className="mt-16 mb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => (
            <Link
              key={index}
              href={page.href}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start gap-4">
                {page.icon && (
                  <div className="text-3xl shrink-0">{page.icon}</div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                    {page.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {page.description}
                  </p>
                  <div className="mt-3 text-sm text-blue-600 group-hover:text-blue-800 font-medium">
                    Mehr erfahren →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * SEO-optimized link presets for common pages
 */
export const COMMON_LINKS = {
  konfigurator: {
    href: '/konfigurator',
    text: 'interaktiver Konfigurator',
    title: 'Hoam online konfigurieren - Interaktiver Konfigurator mit Echtzeit-Preisberechnung',
  },
  konzeptCheck: {
    href: '/konzept-check',
    text: 'Konzept-Check',
    title: 'Konzept-Check bestellen - Grundstücksanalyse & individueller Entwurf',
  },
  kontakt: {
    href: '/kontakt',
    text: 'Termin vereinbaren',
    title: 'Kontakt aufnehmen - Kostenlose Beratung bei Hoam in Graz',
  },
  hoam: {
    href: '/hoam',
    text: '®Hoam Modulhäuser',
    title: '®Hoam - Modulare Häuser ab €213.000 | Transportabel & Erweiterbar',
  },
  hoamSystem: {
    href: '/hoam-system',
    text: 'Hoam-System',
    title: 'Hoam-System - Modulares Bausystem | Nachhaltig & Flexibel',
  },
} as const;

/**
 * Helper function to render contextual link with preset
 */
export function KonfiguratorLink() {
  const preset = COMMON_LINKS.konfigurator;
  return (
    <ContextualLink href={preset.href} title={preset.title}>
      {preset.text}
    </ContextualLink>
  );
}

export function KonzeptCheckLink() {
  const preset = COMMON_LINKS.konzeptCheck;
  return (
    <ContextualLink href={preset.href} title={preset.title}>
      {preset.text}
    </ContextualLink>
  );
}

export function KontaktLink() {
  const preset = COMMON_LINKS.kontakt;
  return (
    <ContextualLink href={preset.href} title={preset.title}>
      {preset.text}
    </ContextualLink>
  );
}

export function HoamLink() {
  const preset = COMMON_LINKS.hoam;
  return (
    <ContextualLink href={preset.href} title={preset.title}>
      {preset.text}
    </ContextualLink>
  );
}

export function HoamSystemLink() {
  const preset = COMMON_LINKS.hoamSystem;
  return (
    <ContextualLink href={preset.href} title={preset.title}>
      {preset.text}
    </ContextualLink>
  );
}
