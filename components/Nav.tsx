"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/product", label: "Bunny Tidy" },
  { href: "/collections", label: "所有系列" },
  { href: "/about", label: "关于" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 lg:px-10 transition-colors duration-300 ${scrolled ? "bg-bg/90 backdrop-blur-md border-b border-border/30" : "bg-transparent"}`}>
      <Link href="/" className="text-xl font-extrabold text-primary tracking-tight uppercase" style={{ fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif" }}>
        TIDY
      </Link>

      <div className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 right-0 bg-bg md:bg-transparent p-6 md:p-0 gap-4 md:gap-8 shadow-md md:shadow-none items-start md:items-center`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={`text-sm transition-colors ${pathname.startsWith(link.href) ? "text-primary" : "text-text-light hover:text-text"}`}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/configurator" onClick={() => setMenuOpen(false)} className="btn btn-primary !px-4 !py-1.5 text-xs md:ml-2">
          开始定制
        </Link>
      </div>

      <button onClick={() => setMenuOpen(!menuOpen)} className="flex md:hidden flex-col gap-[5px] p-2 cursor-pointer bg-transparent border-none" aria-label="菜单">
        <span className={`block w-5 h-[1.5px] bg-text transition-all ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
        <span className={`block w-5 h-[1.5px] bg-text transition-all ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-[1.5px] bg-text transition-all ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
      </button>
    </nav>
  );
}
