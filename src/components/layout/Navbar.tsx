"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useConfiguratorPanelRef } from "@/contexts/ConfiguratorPanelContext";

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

      window.addEventListener("scroll", onScroll);

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
    { name: "Dein Nest Haus", path: "/entdecken" },
    // { name: "Entdecken", path: "/entdecken" },
    { name: "Unser Part", path: "/unser-part" },
    { name: "Dein Part", path: "/dein-part" },
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
                ? "text-gray-500"
                : "text-black hover:text-gray-500"
            }`}
            aria-label="Konfigurator"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              {/* Complete hammer icon from Adobe XD */}
              <path
                d="M1.228.012h2.7A1.232,1.232,0,0,1,5.157,1.24v7.4a.608.608,0,0,1-.614.614H.614A.616.616,0,0,1,0,8.645V1.228A1.232,1.232,0,0,1,1.228,0Z"
                transform="translate(13.26 16.093) rotate(-45)"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <path
                d="M7.08,8.4l5.489,5.489,1.977-1.965L9.045,6.44"
                transform="translate(1.537 1.365)"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <line
                y1="1.965"
                x2="1.965"
                transform="translate(8.605 7.78)"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <line
                y1="0.909"
                x2="0.896"
                transform="translate(3.521 7.473)"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <line
                y1="0.909"
                x2="0.896"
                transform="translate(5.793 9.745)"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <path
                d="M5.51,8.094a1.341,1.341,0,0,1,1.9,0"
                transform="translate(1.179 1.651)"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <path
                d="M3.66,7.473a1.334,1.334,0,0,0,.258-1.535.7.7,0,0,1,.123-.749L6.582,2.648A8.771,8.771,0,0,1,9.91.7a8.223,8.223,0,0,1,4.114.049.365.365,0,0,1,.27.405l-.123,1.056a.365.365,0,0,1-.307.319,9.092,9.092,0,0,0-2.763.86,5.276,5.276,0,0,0-.9.651,2.788,2.788,0,0,0-.97,2.419,2.33,2.33,0,0,0,.577,1.314"
                transform="translate(0.758 0)"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.793,9.288l.295.295a.919.919,0,0,1,0,1.314l-1.3,1.3a.919.919,0,0,1-1.314,0L.611,9.337a.919.919,0,0,1,0-1.314l1.3-1.3a.919.919,0,0,1,1.314,0l.295.295"
                transform="translate(0 1.366)"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
            </svg>
          </Link>

          {/* Shopping Cart Icon with Zustand integration */}
          <Link
            href="/warenkorb"
            className={`focus:outline-none relative flex items-center p-1.5 min-w-[44px] min-h-[44px] justify-center transition-all duration-200 ${
              pathname === "/warenkorb"
                ? "text-gray-500"
                : "text-black hover:text-gray-500"
            }`}
            aria-label={`Warenkorb - ${cartSummary}`}
            title={cartCount > 0 ? cartSummary : "Warenkorb leer"}
          >
            {/* Packet icon */}
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              {/* Packet icon paths */}
              <line
                x1="9.757"
                y2="4.203"
                transform="translate(5.223 2.455)"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <line
                x1="2.065"
                y2="0.88"
                transform="translate(13.954 9.152)"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <line
                y1="10.009"
                transform="translate(10.107 8.754)"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <path
                d="M19.676,15.168l-9.443,4.056a.347.347,0,0,1-.252,0L.539,15.168a.322.322,0,0,1-.189-.293V4.761a.323.323,0,0,1,.189-.293L9.982.411a.347.347,0,0,1,.252,0l9.443,4.056a.322.322,0,0,1,.189.293V14.874A.323.323,0,0,1,19.676,15.168Z"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
              <path
                d="M.76,4.54l9.2,3.951a.347.347,0,0,0,.252,0L19.478,4.53"
                transform="translate(0.02 0.199)"
                strokeLinecap="round"
                strokeMiterlimit="10"
              />
            </svg>
            {cartCount > 0 && (
              <span
                className={`absolute bottom-3 right-3 rounded-full w-2 h-2 flex items-center justify-center ${
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
                  ? "text-gray-500"
                  : "text-black hover:text-gray-500"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.2}
              >
                {/* Complete hammer icon from Adobe XD */}
                <path
                  d="M1.228.012h2.7A1.232,1.232,0,0,1,5.157,1.24v7.4a.608.608,0,0,1-.614.614H.614A.616.616,0,0,1,0,8.645V1.228A1.232,1.232,0,0,1,1.228,0Z"
                  transform="translate(13.26 16.093) rotate(-45)"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                />
                <path
                  d="M7.08,8.4l5.489,5.489,1.977-1.965L9.045,6.44"
                  transform="translate(1.537 1.365)"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                />
                <line
                  y1="1.965"
                  x2="1.965"
                  transform="translate(8.605 7.78)"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                />
                <line
                  y1="0.909"
                  x2="0.896"
                  transform="translate(3.521 7.473)"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                />
                <line
                  y1="0.909"
                  x2="0.896"
                  transform="translate(5.793 9.745)"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                />
                <path
                  d="M5.51,8.094a1.341,1.341,0,0,1,1.9,0"
                  transform="translate(1.179 1.651)"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                />
                <path
                  d="M3.66,7.473a1.334,1.334,0,0,0,.258-1.535.7.7,0,0,1,.123-.749L6.582,2.648A8.771,8.771,0,0,1,9.91.7a8.223,8.223,0,0,1,4.114.049.365.365,0,0,1,.27.405l-.123,1.056a.365.365,0,0,1-.307.319,9.092,9.092,0,0,0-2.763.86,5.276,5.276,0,0,0-.9.651,2.788,2.788,0,0,0-.97,2.419,2.33,2.33,0,0,0,.577,1.314"
                  transform="translate(0.758 0)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.793,9.288l.295.295a.919.919,0,0,1,0,1.314l-1.3,1.3a.919.919,0,0,1-1.314,0L.611,9.337a.919.919,0,0,1,0-1.314l1.3-1.3a.919.919,0,0,1,1.314,0l.295.295"
                  transform="translate(0 1.366)"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                />
              </svg>
              Konfigurator
            </Link>

            {/* Mobile Menu - Shopping Cart Link */}
            <Link
              href="/warenkorb"
              className={`text-sm font-medium transition-all duration-200 py-2 flex items-center gap-2 relative ${
                pathname === "/warenkorb"
                  ? "text-gray-500"
                  : "text-black hover:text-gray-500"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="relative">
                {/* Packet icon */}
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.2}
                >
                  {/* Packet icon paths */}
                  <line
                    x1="9.757"
                    y2="4.203"
                    transform="translate(5.223 2.455)"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                  />
                  <line
                    x1="2.065"
                    y2="0.88"
                    transform="translate(13.954 9.152)"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                  />
                  <line
                    y1="10.009"
                    transform="translate(10.107 8.754)"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M19.676,15.168l-9.443,4.056a.347.347,0,0,1-.252,0L.539,15.168a.322.322,0,0,1-.189-.293V4.761a.323.323,0,0,1,.189-.293L9.982.411a.347.347,0,0,1,.252,0l9.443,4.056a.322.322,0,0,1,.189.293V14.874A.323.323,0,0,1,19.676,15.168Z"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M.76,4.54l9.2,3.951a.347.347,0,0,0,.252,0L19.478,4.53"
                    transform="translate(0.02 0.199)"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                  />
                </svg>
                {cartCount > 0 && (
                  <span
                    className={`absolute bottom-3 right-3 rounded-full w-2 h-2 flex items-center justify-center ${
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
