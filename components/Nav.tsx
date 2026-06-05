"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/product", label: "Products" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 首页始终白色文字（暗色 Hero 背景），非首页深色文字
  const light = isHome;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-12 transition-all duration-300 ${
        scrolled
          ? "bg-bg/95 backdrop-blur-md border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      <Link
        href="/"
        className={`text-xl font-black tracking-tighter transition-colors ${
          light ? "text-white" : "text-text"
        }`}
        style={{ fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif" }}
      >
        TIDY
      </Link>

      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 right-0 bg-bg md:bg-transparent p-6 md:p-0 gap-6 md:gap-10 shadow-md md:shadow-none items-start md:items-center`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={`text-sm tracking-wide transition-colors ${
              light
                ? "text-white/90 hover:text-white"
                : pathname.startsWith(link.href)
                ? "text-text font-medium"
                : "text-text-light hover:text-text"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/configurator"
          onClick={() => setMenuOpen(false)}
          className={`text-sm font-semibold tracking-wide transition-colors md:ml-4 ${
            light ? "text-white hover:text-white/80" : "text-text hover:text-text-light"
          }`}
        >
          Customize →
        </Link>
      </div>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex md:hidden flex-col gap-[5px] p-2 cursor-pointer bg-transparent border-none"
        aria-label="Menu"
      >
        <span
          className={`block w-5 h-[1.5px] transition-all ${
            light ? "bg-white" : "bg-text"
          } ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
        />
        <span
          className={`block w-5 h-[1.5px] transition-all ${
            light ? "bg-white" : "bg-text"
          } ${menuOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`block w-5 h-[1.5px] transition-all ${
            light ? "bg-white" : "bg-text"
          } ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
        />
      </button>
    </nav>
  );
}
