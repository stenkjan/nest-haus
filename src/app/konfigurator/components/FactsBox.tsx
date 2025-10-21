"use client";

import Link from "next/link";

interface FactsBoxProps {
  title: string;
  facts?: string[];
  links?: Array<{
    text: string;
    href: string;
  }>;
  children?: React.ReactNode;
  className?: string;
}

export default function FactsBox({
  title,
  facts,
  links,
  children,
  className = "",
}: FactsBoxProps) {
  return (
    <div className={`box_facts mt-4 rounded-[19px] px-6 ${className}`}>
      <p className="font-medium text-[16px] tracking-[0.02em] leading-tight mb-3 text-black">
        {title}
      </p>

      {/* Render facts array if provided */}
      {facts && facts.length > 0 && (
        <div className="space-y-2">
          {facts.map((fact, index) => (
            <p
              key={index}
              className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-black mb-2"
            >
              {fact}
            </p>
          ))}
        </div>
      )}

      {/* Render children content (for legacy compatibility) */}
      {children && (
        <div className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-black">
          {children}
        </div>
      )}

      {/* Render links if provided */}
      {links && links.length > 0 && (
        <>
          <div className="h-4"></div>
          <div className="space-y-2">
            {links.map((link, index) => (
              <p
                key={index}
                className="font-normal text-[12px] tracking-[0.03em] leading-[14px] text-black mb-2"
              >
                <Link
                  className="text-[#3D6CE1] font-medium text-[12px] tracking-[0.03em] leading-[14px] underline"
                  href={link.href}
                >
                  {link.text}
                </Link>
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
