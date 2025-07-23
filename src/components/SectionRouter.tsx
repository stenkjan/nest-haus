"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import React from "react";

interface Section {
  id: string;
  title: string;
  slug: string;
}

interface SectionRouterProps {
  sections: Section[];
  children: React.ReactNode;
  onSectionChange?: (sectionId: string) => void;
}

export const SectionRouter = ({
  sections,
  children,
  onSectionChange,
}: SectionRouterProps) => {
  const _router = useRouter();
  const _pathname = usePathname();
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [_currentSection, setCurrentSection] = useState<string>(
    sections[0]?.id || ""
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Handle hash changes and scroll to section
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const section = sections.find((s) => s.slug === hash);
        if (section && sectionRefs.current[section.id]) {
          sectionRefs.current[section.id]?.scrollIntoView({
            behavior: "smooth",
          });
          setCurrentSection(section.id);
          onSectionChange?.(section.id);
        }
      }
    };

    // Initial hash check
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [sections, onSectionChange]);

  // Set up intersection observer for scroll-based hash updates
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("data-section-id");
            if (sectionId) {
              const section = sections.find((s) => s.id === sectionId);
              if (section) {
                // Update URL hash without triggering scroll
                const newHash = `#${section.slug}`;
                if (window.location.hash !== newHash) {
                  window.history.replaceState(null, "", newHash);
                  setCurrentSection(sectionId);
                  onSectionChange?.(sectionId);
                }
              }
            }
          }
        });
      },
      {
        threshold: 0.5, // Section is considered visible when 50% is in view
        rootMargin: "-10% 0px -10% 0px", // Add some margin to prevent too frequent updates
      }
    );

    // Observe all sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) {
        observerRef.current?.observe(ref);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sections, onSectionChange]);

  // Add refs to sections
  const setSectionRef = (id: string, element: HTMLDivElement | null) => {
    sectionRefs.current[id] = element;
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ id?: string }>(child)) {
          const sectionId = child.props.id;
          if (!sectionId) return child;

          const section = sections.find((s) => s.id === sectionId);
          if (section) {
            return React.cloneElement(child, {
              ref: (el: HTMLDivElement) => setSectionRef(sectionId, el),
              id: section.slug,
              "data-section-id": sectionId,
            } as React.HTMLAttributes<HTMLDivElement>);
          }
        }
        return child;
      })}
    </div>
  );
};

export default SectionRouter;
