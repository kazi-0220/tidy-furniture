import Link from "next/link";
import MagazineOverlay from "@/components/MagazineOverlay";

export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════
          HERO — 全屏大图 + 极简大字
          ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 背景图 */}
        <div className="absolute inset-0">
          <img
            src="/images/hero.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>

        {/* 文字 — 居中 */}
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <p className="text-white/50 text-xs tracking-[0.35em] uppercase mb-8">
            榫卯 · 数字 · 温度
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-[-0.02em] leading-[1.05]">
            当传统榫卯
            <br />
            遇见数字温度
          </h1>

          <p className="text-white/55 text-base md:text-lg mt-8 max-w-lg mx-auto leading-relaxed">
            每一件家具，都可以是你想象中的样子
          </p>

          <div className="flex gap-5 mt-12 justify-center">
            <Link
              href="/configurator"
              className="px-8 py-3.5 bg-white text-text text-sm font-medium tracking-wide hover:bg-white/90 transition-colors"
            >
              开始定制
            </Link>
            <MagazineOverlay />
          </div>
        </div>

        {/* 底部滚动线 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PHILOSOPHY
          ══════════════════════════════════════════ */}
      <section className="py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p className="text-xs tracking-[0.35em] uppercase text-text-muted mb-4">
              核心理念
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-text tracking-tight leading-tight max-w-2xl">
              标准化结构 · 无限创意
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              { num: "01", title: "标准化结构", desc: "坐板、靠背、榫卯连接件均为标准尺寸，模块化生产，快速迭代。" },
              { num: "02", title: "AI 生成侧板", desc: "输入动物名称，AI 即刻生成侧板剪影轮廓，每一件都是限量款。" },
              { num: "03", title: "自由搭配", desc: "木材、颜色、榫卯配色自由选择，从材料到色彩，完全由你定义。" },
            ].map((f) => (
              <div key={f.num}>
                <span className="text-7xl font-black text-border/40 tracking-tighter leading-none">
                  {f.num}
                </span>
                <h3 className="text-lg font-medium text-text mt-5 mb-3">{f.title}</h3>
                <p className="text-sm text-text-light leading-relaxed max-w-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRODUCT PREVIEW
          ══════════════════════════════════════════ */}
      <section className="py-32 px-6 lg:px-12 bg-bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="bg-white aspect-[4/3] overflow-hidden">
              <img
                src="/images/hero.jpg"
                alt="Bunny Tidy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>

            <div>
              <p className="text-xs tracking-[0.35em] uppercase text-text-muted mb-4">
                首款作品
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-text tracking-tight leading-tight">
                Bunny Tidy
              </h2>
              <p className="text-text-light mt-6 leading-relaxed max-w-md">
                两个兔子侧板夹持坐板和靠背。无需工具，徒手即可完成组装。
              </p>
              <div className="flex flex-wrap gap-2 mt-6 mb-10">
                {["兔形侧板", "榫卯结构", "4 个零件", "徒手拼装"].map((t) => (
                  <span key={t} className="px-3 py-1.5 text-xs text-text-light border border-border">
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/product" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-light transition-colors group">
                查看完整设计
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
          ══════════════════════════════════════════ */}
      <section className="py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary-dark px-8 md:px-20 py-20 md:py-28 text-center text-white">
            <p className="text-xs tracking-[0.35em] uppercase text-white/40 mb-5">
              AI 定制
            </p>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-tight">
              设计你的专属家具
            </h2>
            <p className="text-white/45 mt-5 max-w-md mx-auto text-base leading-relaxed">
              选一个你喜欢的小动物，AI 帮你生成侧板轮廓。
              颜色、木材、榫卯配色，全部由你决定。
            </p>
            <Link
              href="/configurator"
              className="inline-flex px-10 py-4 mt-10 bg-white text-primary-dark text-sm font-medium tracking-wide hover:bg-bg transition-colors"
            >
              开始定制 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
