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
  const lastScrollTop = useRef(0);
  const pathname = usePathname();

  // Cart integration using Zustand store
  const { getCartCount, getCartSummary } = useCartStore();
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

  // Update cart count and summary safely to prevent hydration mismatches
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
  }, [getCartCount, getCartSummary]);

  // Enhanced scroll behavior with WebKit support
  useEffect(() => {
    if (
      pathname === "/konfigurator" &&
      rightPanelRef &&
      rightPanelRef.current
    ) {
      const header = headerRef.current;
      if (!header) return;
      const rightPanel = rightPanelRef.current;
      let lastScrollTop = 0;
      const getScrollPosition = () => rightPanel.scrollTop;
      const onScroll = () => {
        const currentScrollY = getScrollPosition();
        const threshold = isMobile ? 3 : 5;
        if (Math.abs(currentScrollY - lastScrollTop) < threshold) return;
        if (currentScrollY > lastScrollTop && currentScrollY > 50) {
          header.style.transform = "translateY(-100%)";
          header.style.transition = "transform 0.3s ease-out";
        } else if (currentScrollY < lastScrollTop) {
          header.style.transform = "translateY(0)";
          header.style.transition = "transform 0.3s ease-out";
        }
        lastScrollTop = currentScrollY;
      };
      rightPanel.addEventListener("scroll", onScroll);
      return () => rightPanel.removeEventListener("scroll", onScroll);
    }
    const header = headerRef.current;
    if (!header) return;
    // Cross-browser scroll position with WebKit optimizations
    const getScrollPosition = () => {
      return (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      );
    };
    lastScrollTop.current = getScrollPosition();
    // Optimized polling for better performance on mobile
    const intervalId = setInterval(
      () => {
        const currentScrollY = getScrollPosition();
        // Reduced threshold for mobile WebKit
        const threshold = isMobile ? 3 : 5;
        if (Math.abs(currentScrollY - lastScrollTop.current) < threshold)
          return;
        if (currentScrollY > lastScrollTop.current && currentScrollY > 50) {
          // Scrolling down - hide (WebKit-friendly transform)
          header.style.transform = "translateY(-100%)";
          header.style.transition = "transform 0.3s ease-out";
        } else if (currentScrollY < lastScrollTop.current) {
          // Scrolling up - show
          header.style.transform = "translateY(0)";
          header.style.transition = "transform 0.3s ease-out";
        }
        lastScrollTop.current = currentScrollY;
      },
      isMobile ? 150 : 200
    ); // Faster polling on mobile
    return () => clearInterval(intervalId);
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
    { name: "Entdecken", path: "/entdecken" },
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
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-black text-sm font-medium hover:opacity-80 transition-opacity leading-none"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side Icons */}
        <div
          className={`${isMobile ? "hidden" : "flex"} items-center space-x-4 pr-4`}
        >
          <Link
            href="/konfigurator"
            className="focus:outline-none text-black flex items-center p-1.5 min-w-[44px] min-h-[44px] justify-center"
            aria-label="Konfigurator"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>

          {/* Shopping Cart Icon with Zustand integration */}
          <Link
            href="/warenkorb"
            className="focus:outline-none relative text-black flex items-center p-1.5 min-w-[44px] min-h-[44px] justify-center"
            aria-label={`Warenkorb - ${cartSummary}`}
            title={cartCount > 0 ? cartSummary : "Warenkorb leer"}
          >
            {cartCount > 0 ? (
              // House icon when cart has items (house in cart)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            ) : (
              // Shopping bag icon when cart is empty
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            )}
            {cartCount > 0 && (
              <span className="absolute top-2 right-0 translate-x-1/8 -translate-y-1/8 bg-red-500 text-white text-xs leading-none font-bold rounded-full w-3 h-3 flex items-center justify-center min-w-[12px] min-h-[12px]">
                {cartCount > 9 ? "9+" : cartCount}
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
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-black text-sm font-medium hover:opacity-80 transition-opacity py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Menu - Konfigurator Link */}
            <Link
              href="/konfigurator"
              className="text-black text-sm font-medium hover:opacity-80 transition-opacity py-2 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Konfigurator
            </Link>

            {/* Mobile Menu - Shopping Cart Link */}
            <Link
              href="/warenkorb"
              className="text-black text-sm font-medium hover:opacity-80 transition-opacity py-2 flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {cartCount > 0 ? (
                // House icon when cart has items (house in cart)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              ) : (
                // Shopping bag icon when cart is empty
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              )}
              Warenkorb {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
