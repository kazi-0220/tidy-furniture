import Link from "next/link";

const footerLinks = {
  产品: [
    { href: "/product", label: "Bunny Tidy" },
    { href: "/collections", label: "所有系列" },
    { href: "/configurator", label: "AI 定制" },
  ],
  关于: [
    { href: "/about", label: "品牌故事" },
    { href: "/about", label: "设计理念" },
  ],
  支持: [
    { href: "#", label: "常见问题" },
    { href: "#", label: "联系我们" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#2c2c2c] text-[#f5f0ea] pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <h3 className="text-lg font-extrabold text-white mb-3 tracking-tight" style={{ fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif" }}>TIDY</h3>
            <p className="text-sm opacity-60 leading-relaxed max-w-xs">
              以传统榫卯结构为根基，用 AI 和 3D 打印技术，让每个人都能拥有独一无二的家具。
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm opacity-50 hover:opacity-100 hover:text-primary-light mb-2 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs opacity-40">
          <span>&copy; 2026 tidy. All rights reserved.</span>
          <span>Design with ❤️</span>
        </div>
      </div>
    </footer>
  );
}
