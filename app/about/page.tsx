export default function AboutPage() {
  return (
    <section className="pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <span className="text-[11px] tracking-[0.2em] uppercase text-text-muted">关于品牌</span>
        <h1 className="text-2xl md:text-3xl font-light text-text mt-3 mb-6 leading-tight">
          tidy 是什么？
        </h1>
        <p className="text-[15px] text-text-light leading-relaxed">
          tidy 是一个探索传统工艺与数字技术融合的家具品牌。
          tidy 意味着整洁、利落——正如榫卯结构本身的精妙咬合，
          也代表着我们希望通过标准化模块和 AI 定制，让家具设计变得干净、简单、每个人都能参与。
        </p>
      </div>

      <hr className="border-border/50 max-w-6xl mx-auto my-16" />

      <div className="max-w-6xl mx-auto">
        <span className="text-[11px] tracking-[0.2em] uppercase text-text-muted">设计理念</span>
        <h2 className="text-2xl md:text-3xl font-light text-text mt-3 mb-10">三个关键词</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "🏗️", title: "结构即装饰", desc: "好的设计不需要多余的装饰。榫卯本身既是连接方式，也是美学语言。" },
            { icon: "🤖", title: "AI 赋能", desc: "AI 不是取代设计师，而是让每个人都能参与到设计过程中来。" },
            { icon: "♻️", title: "模块化 · 可持续", desc: "标准化的连接系统，让家具可以升级、更换、延续，减少浪费。" },
          ].map((item) => (
            <div key={item.title} className="border border-border rounded-sm p-6">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="text-base font-medium text-text mb-2">{item.title}</h3>
              <p className="text-sm text-text-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-border/50 max-w-6xl mx-auto my-16" />

      <div className="max-w-6xl mx-auto">
        <span className="text-[11px] tracking-[0.2em] uppercase text-text-muted">技术栈</span>
        <h2 className="text-2xl md:text-3xl font-light text-text mt-3 mb-8">我们使用</h2>
        <div className="flex flex-wrap gap-3">
          {["Three.js", "DALL-E 3", "3D 打印", "CNC 切割", "KeyShot", "Fusion 360"].map((t) => (
            <span key={t} className="px-4 py-2 border border-border rounded-sm text-sm text-text-light">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
