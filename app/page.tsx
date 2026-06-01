import Link from "next/link";

const features = [
  {
    title: "标准化结构",
    desc: "坐板、靠背、榫卯连接件均为标准尺寸，支持模块化生产与快速迭代。",
  },
  {
    title: "AI 生成侧板",
    desc: "输入你喜欢的小动物，AI 即刻生成侧板剪影轮廓，每一件都是限量款。",
  },
  {
    title: "自由搭配",
    desc: "木材、颜色、榫卯配色自由选择，从材料到色彩，完全由你定义。",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-16 pb-32">
        <span className="text-[11px] tracking-[0.2em] uppercase text-text-muted mb-6">
          榫卯 · 数字 · 定制
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-text tracking-tight leading-[1.15] max-w-4xl text-balance">
          当传统榫卯
          <br />
          遇见<span className="text-primary">数字温度</span>
        </h1>

        <p className="text-[15px] md:text-base text-text-light max-w-md mt-6 leading-relaxed">
          以传统榫卯结构为骨，AI 生成设计为魂。每一件家具，都可以是你想象中的样子。
        </p>

        <div className="flex gap-4 mt-10 flex-wrap justify-center">
          <Link href="/configurator" className="btn btn-primary !px-8 !py-3">
            开始定制
          </Link>
          <Link href="/product" className="btn btn-outline !px-8 !py-3">
            了解 Bunny Tidy
          </Link>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-10 bg-gradient-to-b from-border to-transparent" />
        </div>
      </section>

      {/* 核心理念 */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-md mb-16">
            <span className="text-[11px] tracking-[0.2em] uppercase text-text-muted">核心理念</span>
            <h2 className="text-2xl md:text-3xl font-light text-text mt-3 leading-tight">
              标准化结构 · 无限创意
            </h2>
            <p className="text-[15px] text-text-light mt-4 leading-relaxed">
              榫卯连接件 3D 打印，侧板 AI 生成，标准化板材——用最少的生产成本，实现最大的个性化。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="border-t border-border pt-5">
                <h3 className="text-base font-medium text-text mb-2">{f.title}</h3>
                <p className="text-sm text-text-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 产品展示 */}
      <section className="py-24 px-6 bg-bg-card/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <img src="/images/render-side.PNG" alt="Bunny Tidy" className="w-full h-full object-cover" />
            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-text-muted">首款作品</span>
              <h2 className="text-2xl md:text-3xl font-light text-text mt-3 mb-5 leading-tight">
                Bunny Tidy
              </h2>
              <p className="text-[15px] text-text-light leading-relaxed mb-6">
                两个兔子侧板夹持坐板和靠背，通过 3D 打印的榫卯连接件固定。无需工具，徒手即可完成组装。
              </p>
              <div className="flex gap-2 flex-wrap mb-7">
                {["兔形侧板", "榫卯结构", "4 个零件", "徒手拼装"].map((t) => (
                  <span key={t} className="px-3 py-1 text-xs text-text-light border border-border rounded-full">{t}</span>
                ))}
              </div>
              <Link href="/product" className="btn btn-primary !px-6 !py-2.5">
                查看完整设计 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-primary-dark rounded-sm px-8 md:px-16 py-16 md:py-20 text-center text-white">
            <span className="text-[11px] tracking-[0.2em] uppercase opacity-50">AI 定制</span>
            <h2 className="text-2xl md:text-3xl font-light mt-3 mb-4">设计你的专属家具</h2>
            <p className="opacity-70 max-w-md mx-auto mb-8 text-[15px] leading-relaxed">
              选一个你喜欢的小动物，AI 帮你生成侧板轮廓。颜色、木材、榫卯配色，全部由你决定。
            </p>
            <Link href="/configurator" className="inline-flex items-center gap-2 px-8 py-3 rounded-sm bg-white text-primary-dark text-sm font-medium hover:bg-bg transition-colors">
              开始定制 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
