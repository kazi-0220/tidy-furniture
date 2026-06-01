import Link from "next/link";

export default function CollectionsPage() {
  return (
    <section className="pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="text-[11px] tracking-[0.2em] uppercase text-text-muted">产品系列</span>
          <h1 className="text-2xl md:text-3xl font-light text-text mt-3">所有系列</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="group border border-border rounded-sm overflow-hidden transition-shadow hover:shadow-card">
            <div className="aspect-[4/3] bg-bg-card flex items-center justify-center text-5xl">🐰</div>
            <div className="p-6">
              <span className="text-[10px] tracking-[0.2em] uppercase text-text-muted">首款作品</span>
              <h3 className="text-base font-medium text-text mt-1 mb-2">Bunny Tidy</h3>
              <p className="text-sm text-text-light mb-5">AI 定制侧板，榫卯连接，三个步骤完成组装。</p>
              <Link href="/product" className="btn btn-primary !px-4 !py-2 text-xs">查看详情 →</Link>
            </div>
          </div>

          {[1, 2].map((i) => (
            <div key={i} className="opacity-30 border border-border rounded-sm overflow-hidden">
              <div className="aspect-[4/3] bg-bg-card flex items-center justify-center text-4xl text-text-muted">?</div>
              <div className="p-6">
                <span className="text-[10px] tracking-[0.2em] uppercase text-text-muted">即将推出</span>
                <h3 className="text-base font-medium text-text mt-1 mb-2">敬请期待</h3>
                <p className="text-sm text-text-light">更多家具正在设计中。</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
