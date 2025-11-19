"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useConfiguratorPanelRef } from "@/contexts/ConfiguratorPanelContext";
import ClientBlobImage from "@/components/images/ClientBlobImage";
import { IMAGES } from "@/constants/images";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const _lastScrollTop = useRef(0);
  const pathname = usePathname();

  // Cart integration using Zustand store - subscribe to items for real-time updates
  const { items, getCartCount, getCartSummary } = useCartStore();
  const [cartCount, setCartCount] = useState(0);
  const [cartSummary, setCartSummary] = useState("Warenkorb leer");

  const rightPanelRef = useConfiguratorPanelRef();

  // Mobile detection following project rules (600-700px breakpoint)
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 650); // Mobile switch at 650px as per rules
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update cart count and summary when cart items change
  useEffect(() => {
    try {
      const count = getCartCount();
      const summary = getCartSummary();
      setCartCount(count);
      setCartSummary(summary);
    } catch (error) {
      console.error("Error getting cart count:", error);
      setCartCount(0);
      setCartSummary("Warenkorb leer");
    }
  }, [items, getCartCount, getCartSummary]); // Now depends on 'items' array

  // Enhanced scroll behavior with WebKit support
  useEffect(() => {
    if (pathname === "/konfigurator") {
      const header = headerRef.current;
      if (!header) {
        return;
      }

      let lastScrollTop = 0;

      // For konfigurator, always use window scroll since we confirmed that's what works
      const getScrollPosition = () => {
        return (
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0
        );
      };

      const onScroll = () => {
        const currentScrollY = getScrollPosition();
        const threshold = isMobile ? 3 : 5;

        if (Math.abs(currentScrollY - lastScrollTop) < threshold) {
          return;
        }

        if (currentScrollY > lastScrollTop && currentScrollY > 50) {
          header.style.transform = "translateY(-100%)";
          header.style.transition = "transform 0.3s ease-out";
        } else if (currentScrollY < lastScrollTop) {
          // For mobile konfigurator, only show navbar when very close to top
          const shouldShow = isMobile ? currentScrollY <= 10 : true;

          if (shouldShow) {
            header.style.transform = "translateY(0)";
            header.style.transition = "transform 0.3s ease-out";
          }
        }
        lastScrollTop = currentScrollY;
      };

      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }

    // Standard scroll handler for other pages
    if (rightPanelRef && rightPanelRef.current) {
      const header = headerRef.current;
      if (!header) {
        return;
      }
      const rightPanel = rightPanelRef.current;
      let lastScrollTop = 0;

      // Check if we're on mobile (panel doesn't have overflow-y-auto)
      const _panelIsScrollable =
        rightPanel.scrollHeight > rightPanel.clientHeight;
      const panelHasOverflow =
        window.getComputedStyle(rightPanel).overflowY === "auto";
      const shouldUseDocumentScroll = isMobile || !panelHasOverflow;

      const getScrollPosition = () => {
        if (shouldUseDocumentScroll) {
          return (
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0
          );
        } else {
          return rightPanel.scrollTop;
        }
      };

      const onScroll = () => {
        const currentScrollY = getScrollPosition();
        const threshold = isMobile ? 3 : 5;

        if (Math.abs(currentScrollY - lastScrollTop) < threshold) {
          return;
        }

        if (currentScrollY > lastScrollTop && currentScrollY > 50) {
          header.style.transform = "translateY(-100%)";
          header.style.transition = "transform 0.3s ease-out";
        } else if (currentScrollY < lastScrollTop) {
          // For non-konfigurator pages, always show navbar when scrolling up
          const shouldShow = true;

          if (shouldShow) {
            header.style.transform = "translateY(0)";
            header.style.transition = "transform 0.3s ease-out";
          }
        }
        lastScrollTop = currentScrollY;
      };

      // Choose the correct scroll target
      const scrollTarget = shouldUseDocumentScroll ? window : rightPanel;
      const eventType = shouldUseDocumentScroll ? "scroll" : "scroll";

      scrollTarget.addEventListener(eventType, onScroll);

      // Also test manual scroll detection
      const testInterval = setInterval(() => {
        const _currentScroll = getScrollPosition();
      }, 2000);

      return () => {
        scrollTarget.removeEventListener(eventType, onScroll);
        clearInterval(testInterval);
      };
    }

    // Return cleanup function for cases where neither condition is met
    return () => {
      // No cleanup needed for this case
    };
  }, [pathname, isMobile, rightPanelRef]);

  useEffect(() => {
    const setNavbarHeightVar = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--navbar-height",
          height + "px"
        );
      }
    };
    setNavbarHeightVar();
    window.addEventListener("resize", setNavbarHeightVar);
    return () => window.removeEventListener("resize", setNavbarHeightVar);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigation items - updated based on image
  const navItems = [
    { name: "Dein Nest", path: "/dein-nest" },
    { name: "Konzept-Check", path: "/konzept-check" },
    { name: "Nest System", path: "/nest-system" },
    { name: "Warum wir?", path: "/warum-wir" },
    { name: "Kontakt", path: "/kontakt" },
  ];

  return (
    <header
      ref={headerRef}
      className="fixed pointer-events-auto top-0 left-0 right-0 z-[100] bg-[#F4F4F4]/80 backdrop-blur-md border-b border-gray-200/30 shadow-sm"
      style={{
        willChange: "transform",
        // WebKit-specific optimizations
        WebkitTransform: "translateZ(0)", // Force hardware acceleration
        // Apple-style backdrop blur support
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <nav
        className="mx-auto px-4 w-full flex justify-between items-center"
        style={{ maxWidth: isMobile ? "100%" : "1144px" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center pl-4">
          <Image
            src="/0-homebutton-nest-haus.svg"
            alt="NEST Home"
            className="h-4 w-4"
            width={16}
            height={16}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div
          className={`${isMobile ? "hidden" : "flex"} space-x-8 mx-auto px-6`}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-all duration-200 leading-none ${
                  isActive ? "text-gray-500" : "text-black hover:text-gray-500"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Side Icons */}
        <div
          className={`${isMobile ? "hidden" : "flex"} items-center space-x-4 pr-4`}
        >
          <Link
            href="/konfigurator"
            className={`focus:outline-none flex items-center p-1.5 min-w-[44px] min-h-[44px] justify-center transition-all duration-200 ${
              pathname === "/konfigurator"
                ? "opacity-50"
                : "opacity-100 hover:opacity-70"
            }`}
            aria-label="Konfigurator"
          >
            <ClientBlobImage
              path={IMAGES.navbarIcons.hammer}
              alt="Konfigurator"
              width={16}
              height={16}
              className="h-4 w-4"
              enableCache={true}
              enableMobileDetection={false}
              showLoadingSpinner={false}
            />
          </Link>

          {/* Shopping Cart Icon with Zustand integration */}
          <Link
            href="/warenkorb"
            className={`focus:outline-none relative flex items-center p-1.5 min-w-[44px] min-h-[44px] justify-center transition-all duration-200 ${
              pathname === "/warenkorb"
                ? "opacity-50"
                : "opacity-100 hover:opacity-70"
            }`}
            aria-label={`Warenkorb - ${cartSummary}`}
            title={cartCount > 0 ? cartSummary : "Warenkorb leer"}
          >
            {/* Box icon - conditional based on cart contents */}
            <div className="relative flex items-end h-[18px]">
              {" "}
              {/* Fixed height container for consistent alignment */}
              <ClientBlobImage
                path={
                  cartCount > 0
                    ? IMAGES.navbarIcons.boxOpen
                    : IMAGES.navbarIcons.boxClosed
                }
                alt={
                  cartCount > 0 ? "Warenkorb mit Inhalt" : "Leerer Warenkorb"
                }
                width={16}
                height={cartCount > 0 ? 18 : 16} // Open box is slightly taller
                className={`${cartCount > 0 ? "h-[18px]" : "h-4"} w-4 object-bottom`} // Align both images to bottom
                enableCache={true}
                enableMobileDetection={false}
                showLoadingSpinner={false}
              />
            </div>
            {cartCount > 0 && (
              <span
                className={`absolute top-3 rounded-full w-2 h-2 flex items-center justify-center ${
                  pathname === "/warenkorb" ? "bg-yellow-500" : "bg-black"
                }`}
              >
                <span className="w-0.5 h-0.5 bg-white rounded-full"></span>
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            className="p-2 mr-2 text-black"
            aria-label="Toggle menu"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        )}
      </nav>

      {/* Mobile Menu Overlay - Aligned to the right */}
      {mobileMenuOpen && isMobile && (
        <div className="absolute top-full left-0 right-0 bg-[#F4F4F4] border-b border-gray-200/50 shadow-lg">
          <div className="px-4 py-4 flex flex-col items-end space-y-4">
            {/* Startseite Link */}
            <Link
              href="/"
              className={`text-sm font-medium transition-all duration-200 py-2 ${
                pathname === "/"
                  ? "text-gray-500"
                  : "text-black hover:text-gray-500"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Startseite
            </Link>

            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-all duration-200 py-2 ${
                    isActive
                      ? "text-gray-500"
                      : "text-black hover:text-gray-500"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Menu - Konfigurator Link */}
            <Link
              href="/konfigurator"
              className={`text-sm font-medium transition-all duration-200 py-2 flex items-center gap-2 ${
                pathname === "/konfigurator"
                  ? "opacity-50"
                  : "opacity-100 hover:opacity-70"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ClientBlobImage
                path={IMAGES.navbarIcons.hammer}
                alt="Konfigurator"
                width={16}
                height={16}
                className="h-4 w-4"
                enableCache={true}
                enableMobileDetection={false}
                showLoadingSpinner={false}
              />
              Konfigurator
            </Link>

            {/* Mobile Menu - Shopping Cart Link */}
            <Link
              href="/warenkorb"
              className={`text-sm font-medium transition-all duration-200 py-2 flex items-center gap-2 relative ${
                pathname === "/warenkorb"
                  ? "opacity-50"
                  : "opacity-100 hover:opacity-70"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="relative flex items-end h-[18px]">
                {" "}
                {/* Fixed height container for consistent alignment */}
                {/* Box icon - conditional based on cart contents */}
                <ClientBlobImage
                  path={
                    cartCount > 0
                      ? IMAGES.navbarIcons.boxOpen
                      : IMAGES.navbarIcons.boxClosed
                  }
                  alt={
                    cartCount > 0 ? "Warenkorb mit Inhalt" : "Leerer Warenkorb"
                  }
                  width={16}
                  height={cartCount > 0 ? 18 : 16} // Open box is slightly taller
                  className={`${cartCount > 0 ? "h-[18px]" : "h-4"} w-4 object-bottom`} // Align both images to bottom
                  enableCache={true}
                  enableMobileDetection={false}
                  showLoadingSpinner={false}
                />
                {cartCount > 0 && (
                  <span
                    className={`absolute top-3 rounded-full w-2 h-2 flex items-center justify-center ${
                      pathname === "/warenkorb" ? "bg-yellow-500" : "bg-black"
                    }`}
                  >
                    <span className="w-0.5 h-0.5 bg-white rounded-full"></span>
                  </span>
                )}
              </div>
              Warenkorb
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
