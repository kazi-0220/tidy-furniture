"use client";

import { useState, useEffect, useRef } from "react";
import AssemblyPlayground from "@/components/AssemblyPlayground";
import CADDisplay from "@/components/CADDisplay";

const chapters = [
  { id: "ch01", label: "01 设计调研" },
  { id: "ch02", label: "02 背景与趋势" },
  { id: "ch04", label: "04 用户调研" },
  { id: "ch05", label: "05 设计构思" },
  { id: "ch06", label: "06 草图推演" },
  { id: "ch07", label: "07 效果图呈现" },
  { id: "ch08", label: "08 材质与色彩" },
  { id: "ch09", label: "09 结构工艺" },
  { id: "ch10", label: "10 尺寸三视图" },
  { id: "ch11", label: "11 整体总结" },
];

export default function ProductPage() {
  const [active, setActive] = useState("ch01");
  const [exiting, setExiting] = useState<string | null>(null);
  const [entering, setEntering] = useState<string | null>(null);
  const pendingRef = useRef<string | null>(null);

  const switchTo = (id: string) => {
    if (id === active || entering) return; // block clicks during animation
    setExiting(active);
    setEntering(id);
    pendingRef.current = id;
  };

  const onAnimEnd = () => {
    const next = pendingRef.current;
    if (!next) return;
    setActive(next);
    setExiting(null);
    setEntering(null);
    pendingRef.current = null;
  };

  useEffect(() => {
    return () => { pendingRef.current = null; };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row pt-16 min-h-screen">
      {/* TOC */}
      <aside className="lg:w-56 shrink-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto px-4 lg:px-6 py-8">
        <span className="hidden lg:block text-[11px] tracking-[0.2em] uppercase text-text-muted mb-6 px-1">
          关于作品
        </span>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {chapters.map((ch) => {
            const isCurrent = active === ch.id;
            const isEntering = entering === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => switchTo(ch.id)}
                className={`relative shrink-0 text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 ${
                  isCurrent || isEntering
                    ? "text-primary bg-primary/6 font-medium"
                    : "text-text-light hover:text-text hover:bg-bg-card/40"
                }`}
              >
                {(isCurrent || isEntering) && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-full hidden lg:block" />
                )}
                {ch.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 pt-5 border-t border-border/30">
          <a
            href="/configurator"
            className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-primary font-medium bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <span>✦</span>
            定制你专属
          </a>
        </div>
      </aside>

      {/* Card Area */}
      <main className="flex-1 flex justify-stretch p-4 lg:p-8">
        <div className="w-full max-w-[1080px] mx-auto relative overflow-hidden" style={{ minHeight: "calc(100vh - 8rem)" }}>
          {/* Old card — sits underneath, gets covered by new one */}
          {exiting && active && (
            <div
              className="absolute inset-0 bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-border/30 p-10 md:p-14 z-0"
              style={{ pointerEvents: "none" }}
            >
              <Chapter id={active} />
            </div>
          )}

          {/* New card — slides up from below ON TOP of the old card */}
          <div
            className="relative bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-border/30 p-10 md:p-14 z-10"
            onAnimationEnd={onAnimEnd}
            style={{
              animation: entering ? "slideCover 0.45s cubic-bezier(0.22, 1, 0.36, 1) both" : "none",
            }}
          >
            <Chapter id={entering || active} />
          </div>
        </div>
      </main>

      <style>{`
        @keyframes slideCover {
          0% { transform: translateY(120%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Chapter Content Mapping ── */
function Chapter({ id }: { id: string }) {
  switch (id) {
    case "ch01":
      return (
        <CardSection num="01" title="设计调研" subtitle="榫卯工艺的当代可能性">
          <p>榫卯是中国传统木工的灵魂，无需一钉一螺，靠精密的几何咬合实现结构稳固。然而传统榫卯工艺门槛高、难以量产，逐渐淡出日常家具市场。</p>
          <p>我们调研了市面上现有的榫卯家具产品，发现大多面向高端收藏市场或教育场景，<span className="text-[#c85a4a] font-medium">缺少面向儿童、兼具趣味性与可定制性的榫卯家具产品</span>。这成为了本项目的核心切入点。</p>
          <Chart />
        </CardSection>
      );
    case "ch02":
      return (
        <CardSection num="02" title="背景与趋势" subtitle="个性化消费 + 数字制造">
          <p>近年来，消费市场的两大趋势日益显著：一是消费者对<span className="text-[#c85a4a] font-medium">个性化定制</span>的需求持续上升，二是<span className="text-[#c85a4a] font-medium">数字制造技术</span>（3D 打印、CNC 切割）的普及使小批量生产成为可能。</p>
          <p>AI 生成设计进一步降低了设计门槛——用户不再需要专业技能，只需表达喜好，AI 即可生成符合结构要求的设计方案。</p>
          <TrendChart />
        </CardSection>
      );
    case "ch04":
      return (
        <CardSection num="04" title="用户调研" subtitle="儿童需要什么样的家具？">
          <p>通过访谈 12 组有 4-10 岁孩子的家庭，我们总结了儿童家具的三大核心需求：</p>
          <div className="grid md:grid-cols-3 gap-5 my-6">
            {[
              { icon: "🎨", title: "趣味性", desc: "孩子愿意与之互动的家具" },
              { icon: "🛠️", title: "参与感", desc: "孩子可以参与组装过程" },
              { icon: "♻️", title: "成长性", desc: "随孩子长大可更换部件" },
            ].map((n) => (
              <div key={n.title} className="bg-bg-card rounded-2xl p-6 text-center">
                <div className="text-2xl mb-3">{n.icon}</div>
                <h4 className="text-sm font-semibold text-text mb-1">{n.title}</h4>
                <p className="text-xs text-text-light">{n.desc}</p>
              </div>
            ))}
          </div>
          <Highlight>同时家长普遍关注安全圆角、环保材质、不过时的设计感。</Highlight>
        </CardSection>
      );
    case "ch05":
      return (
        <CardSection num="05" title="设计构思" subtitle="标准化 + 定制化">
          <p>核心策略：将家具拆分为<span className="text-[#c85a4a] font-medium">标准化结构件</span>和<span className="text-[#c85a4a] font-medium">定制化装饰件</span>。</p>
          <div className="grid md:grid-cols-2 gap-5 my-6">
            <div className="border border-border/60 rounded-2xl p-6">
              <span className="text-xs tracking-[0.1em] uppercase text-text-muted">标准化</span>
              <p className="text-sm text-text-light mt-2">坐板、靠背、榫卯连接件——尺寸固定，可批量 CNC 切割和 3D 打印。</p>
            </div>
            <div className="border border-border/60 rounded-2xl p-6">
              <span className="text-xs tracking-[0.1em] uppercase text-text-muted">定制化</span>
              <p className="text-sm text-text-light mt-2">两侧装饰面板——AI 根据用户喜好生成动物剪影轮廓。</p>
            </div>
          </div>
          <p>灵感来源于儿童画中的小动物椅子——兔子蹲坐的姿态天然形成稳定的三角支撑结构，两侧侧板夹持坐面和靠背，既是结构又是装饰。</p>
        </CardSection>
      );
    case "ch06":
      return (
        <CardSection num="06" title="草图推演" subtitle="从构想到雏形">
          <p>设计过程中经历了多轮草图推演，核心解决三个问题：</p>
          <ul className="space-y-2 my-4 text-text-light text-sm">
            {["如何让动物侧板既生动又满足结构强度", "榫卯节点的位置与形态设计", "组装顺序的可操作性"].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-primary/40 text-xs font-mono mt-0.5 shrink-0">0{i + 1}</span>
                {item}
              </li>
            ))}
          </ul>
          <SketchGrid />
        </CardSection>
      );
    case "ch07":
      return (
        <CardSection num="07" title="效果图呈现" subtitle="最终设计方案">
          <p>经过多轮迭代，最终确定以兔子蹲坐姿态作为侧板轮廓，坐板和靠背采用圆角矩形，整体造型圆润亲和。</p>
          <img src="/images/render-side.webp" alt="Bunny Tidy 侧面效果图" className="w-full rounded-2xl border border-border/30 my-6" />
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <img src="/images/render-front.webp" alt="正面视角" className="w-full rounded-2xl border border-border/30 aspect-square object-cover" />
            <img src="/images/render-top.webp" alt="俯视视角" className="w-full rounded-2xl border border-border/30 aspect-square object-cover" />
          </div>
        </CardSection>
      );
    case "ch08":
      return (
        <CardSection num="08" title="材质与色彩" subtitle="温暖自然的材质语言">
          <p>主材选用北美黑胡桃木和樱桃木两种选项，榫卯连接件采用 3D 打印 PLA 材质，可自由选择配色。</p>
          <div className="grid md:grid-cols-2 gap-5 my-6">
            {[
              { gradient: "from-[#5c3d2e] to-[#8b5e3c]", name: "北美黑胡桃", desc: "深棕巧克力色，纹理优雅" },
              { gradient: "from-[#d4a574] to-[#e8c9a0]", name: "樱桃木", desc: "暖红棕色，日久变深" },
            ].map((m) => (
              <div key={m.name} className="border border-border/60 rounded-2xl p-5">
                <div className={`h-12 rounded-xl bg-gradient-to-br ${m.gradient} mb-3 shadow-sm`} />
                <h4 className="text-sm font-semibold text-text">{m.name}</h4>
                <p className="text-xs text-text-light mt-1">{m.desc}</p>
              </div>
            ))}
          </div>
          <h4 className="text-sm font-semibold text-text mb-3">榫卯配色选项</h4>
          <div className="flex gap-3 flex-wrap">
            {["#c85a4a", "#f5a623", "#7eb8da", "#8bc34a", "#9b59b6", "#e74c3c"].map((c) => (
              <span key={c} className="w-9 h-9 rounded-full border-2 border-white shadow-[0_0_0_1px_#e5ddd4] transition-transform hover:scale-110 cursor-pointer" style={{ background: c }} />
            ))}
          </div>
        </CardSection>
      );
    case "ch09":
      return (
        <CardSection num="09" title="结构工艺" subtitle="榫卯结构 · 交互拼装">
          <p>Bunny Tidy 由两个兔形侧板、一个坐板、一个靠背组成，通过 3D 打印的榫卯连接件固定。无需工具，徒手即可完成组装。</p>
          <div className="mt-6">
            <AssemblyPlayground />
          </div>
        </CardSection>
      );
    case "ch10":
      return (
        <CardSection num="10" title="尺寸三视图" subtitle="精确尺寸（单位：mm）">
          <p>以下为 Bunny Tidy 的零件尺寸图。所有数据均基于 CAD 模型测量。</p>

          {/* 16:9 CAD 动态展示 · 左右分屏 */}
          <div className="my-6 rounded-xl overflow-hidden border border-border/30">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2">
                <CADDisplay />
              </div>
              <div className="w-full md:w-1/2 bg-[#0a0a0a] flex items-center justify-center p-8 min-h-[200px] md:min-h-[auto]"
                style={{ aspectRatio: "16 / 9" }}>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full border border-white/10 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.3">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>
                  <p className="text-white/30 text-xs font-mono tracking-wider">RENDER AREA</p>
                  <p className="text-white/10 text-[10px] mt-1">材料渲染 · 右侧预留区域</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 my-6">
            {[
              { src: "/images/正视图.png", label: "正视图 — 整体外观" },
              { src: "/images/侧板.png", label: "侧板 — 兔形轮廓" },
              { src: "/images/底板.png", label: "底板 — 坐板尺寸" },
              { src: "/images/靠板.png", label: "靠背 — 靠板尺寸" },
            ].map((img) => (
              <div key={img.label} className="border border-border/60 rounded-2xl p-3 text-center bg-white/50">
                <img src={img.src} alt={img.label} className="w-full aspect-[4/3] object-contain rounded-lg mb-2" />
                <span className="text-xs text-text-light">{img.label}</span>
              </div>
            ))}
          </div>
          <Highlight>
            <div className="text-sm leading-loose">
              <strong>零件尺寸</strong><br />
              侧板（兔形轮廓）：约 450mm × 500mm<br />
              坐板：300mm × 300mm<br />
              靠背：250mm × 300mm<br />
              榫卯连接件：根据接合点定制
            </div>
          </Highlight>
        </CardSection>
      );
    case "ch11":
      return (
        <CardSection num="11" title="整体总结" subtitle="传统榫卯 + AI 定制 + 儿童友好">
          <p>Bunny Tidy 是 tidy 品牌的首款作品，它探索了一种全新的家具生产方式：</p>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            {[
              "标准化结构降低生产成本和组装难度",
              "AI 定制让每一件家具独一无二",
              "榫卯连接传承传统工艺智慧",
              "儿童友好的交互体验培养动手能力",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 border border-border/60 rounded-2xl p-4">
                <span className="text-sm text-primary/40 font-mono shrink-0 mt-0.5">0{i + 1}</span>
                <p className="text-sm text-text-light leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <blockquote className="border-l-[3px] border-primary/25 pl-5 py-2 text-sm text-text-light italic leading-relaxed my-6">
            <span className="text-3xl text-primary/10 font-serif leading-none align-top mr-1">&ldquo;</span>
            我们相信，最好的家具是人和技术一起创造的。
          </blockquote>
        </CardSection>
      );
    default:
      return null;
  }
}

/* ── Card Section Header ── */
function CardSection({ num, title, subtitle, children }: { num: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs text-primary/40 font-mono tracking-wider">{num}</span>
        <span className="h-[1px] flex-1 bg-border/30" />
      </div>
      <h2 className="text-2xl font-medium text-text mb-1">{title}</h2>
      <p className="text-[14px] text-text-light mb-8 pb-5 border-b border-border/30">{subtitle}</p>
      <div className="space-y-4 text-[15px] text-text-light leading-relaxed">{children}</div>
    </section>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#fdf6f4] border border-primary/10 rounded-2xl p-4 text-sm text-text-light leading-relaxed">{children}</div>;
}

function Chart() {
  const data = [
    { label: "传统", v: 60 }, { label: "定制", v: 80 }, { label: "互动", v: 85 },
    { label: "榫卯+AI", v: 95 }, { label: "儿童", v: 75 }, { label: "教育", v: 65 }, { label: "收藏", v: 55 },
  ];
  return (
    <div className="w-full aspect-[16/9] border border-border/20 rounded-2xl overflow-hidden my-6 bg-white/30">
      <svg viewBox="0 0 800 450" className="w-full h-full">
        <text x="400" y="36" textAnchor="middle" fill="#8a8a8a" fontSize="13" fontFamily="system-ui" fontWeight="500">榫卯家具市场需求调研</text>
        {data.map((d, i) => {
          const x = 120 + i * 95; const h = d.v * 1.8;
          return (<g key={d.label}>
            <rect x={x} y={400 - h} width={50} height={h} rx={3} fill="#c85a4a" opacity={0.6 + i * 0.05} />
            <text x={x + 25} y="425" textAnchor="middle" fill="#8a8a8a" fontSize="11" fontFamily="system-ui">{d.label}</text>
            <text x={x + 25} y={400 - h - 6} textAnchor="middle" fill="#c85a4a" fontSize="10" fontFamily="system-ui" fontWeight="500">{d.v}%</text>
          </g>);
        })}
        <line x1="80" y1="400" x2="750" y2="400" stroke="#e5ddd4" strokeWidth="1" />
      </svg>
    </div>
  );
}

function TrendChart() {
  return (
    <div className="w-full aspect-[16/9] border border-border/20 rounded-2xl overflow-hidden my-6 bg-white/30">
      <svg viewBox="0 0 800 450" className="w-full h-full">
        <text x="400" y="36" textAnchor="middle" fill="#8a8a8a" fontSize="13" fontFamily="system-ui" fontWeight="500">个性化消费 + 数字制造 市场增长趋势</text>
        <line x1="100" y1="380" x2="720" y2="380" stroke="#e5ddd4" strokeWidth="1" />
        <path d="M120 350 Q200 320 300 250 T500 140 T680 90" stroke="#c85a4a" strokeWidth="2.5" fill="none" />
        <circle cx="300" cy="240" r="3.5" fill="#c85a4a" /><circle cx="500" cy="130" r="3.5" fill="#c85a4a" />
        <text x="300" y="225" fill="#c85a4a" fontSize="11" fontFamily="system-ui" textAnchor="middle" fontWeight="500">2024</text>
        <text x="500" y="115" fill="#c85a4a" fontSize="11" fontFamily="system-ui" textAnchor="middle" fontWeight="500">2026</text>
        <path d="M120 370 Q200 360 300 330 T500 290 T680 270" stroke="#e78070" strokeWidth="1.5" fill="none" strokeDasharray="6 3" opacity="0.4" />
        <text x="680" y="85" fill="#c85a4a" fontSize="11" fontFamily="system-ui">AI 定制家具</text>
        <text x="680" y="268" fill="#e78070" fontSize="11" fontFamily="system-ui">传统定制</text>
        <text x="105" y="400" fill="#8a8a8a" fontSize="10" fontFamily="system-ui">2018</text>
        <text x="355" y="400" fill="#8a8a8a" fontSize="10" fontFamily="system-ui">2022</text>
        <text x="605" y="400" fill="#8a8a8a" fontSize="10" fontFamily="system-ui">2026</text>
      </svg>
    </div>
  );
}

function SketchGrid() {
  return (
    <>
      <div className="w-full aspect-[16/9] bg-[#faf8f5] rounded-2xl overflow-hidden my-6 border border-border/30">
        <svg viewBox="0 0 800 450" className="w-full h-full">
          <rect x="20" y="20" width="760" height="410" rx="6" fill="none" stroke="#d5ccc2" strokeWidth="1" strokeDasharray="6 4" />
          <path d="M120 380 Q140 340 180 360 T220 280 T260 300 T300 200 T340 240" stroke="#555" strokeWidth="1.5" fill="none" opacity="0.3" />
          <path d="M450 380 Q470 320 520 340 T560 260 T600 280 T640 160 T680 220" stroke="#555" strokeWidth="1.5" fill="none" opacity="0.3" />
          <path d="M100 300 Q160 280 200 320 T300 250 T400 290" stroke="#c85a4a" strokeWidth="1.5" fill="none" strokeDasharray="8 4" opacity="0.5" />
          <rect x="250" y="310" width="300" height="40" rx="4" stroke="#999" strokeWidth="1" fill="none" strokeDasharray="4 2" opacity="0.4" />
          <text x="400" y="335" textAnchor="middle" fill="#8a8a8a" fontSize="12" fontFamily="system-ui">结构推演过程草图</text>
        </svg>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "侧板轮廓", el: <path d="M80 340 Q100 280 120 300 T140 240 T160 260 T180 180 T200 200 T220 130 T240 160" stroke="#555" strokeWidth="1.2" fill="none" opacity="0.4" /> },
          { label: "坐板", el: <rect x="60" y="100" width="180" height="180" rx="4" stroke="#c85a4a" strokeWidth="1.5" fill="none" strokeDasharray="6 3" opacity="0.6" /> },
          { label: "榫卯节点", el: <><circle cx={150} cy={140} r={60} stroke="#555" strokeWidth="1" fill="none" opacity="0.3" /><circle cx={150} cy={140} r={40} stroke="#c85a4a" strokeWidth="1.5" fill="none" strokeDasharray="6 3" opacity="0.6" /></> },
        ].map((sketch, i) => (
          <div key={i} className="aspect-[3/4] bg-[#faf8f5] rounded-2xl overflow-hidden border border-border/30">
            <svg viewBox="0 0 300 400" className="w-full h-full">
              {sketch.el}
              <text x="150" y="380" textAnchor="middle" fill="#aaa" fontSize="10" fontFamily="system-ui">{sketch.label}</text>
            </svg>
          </div>
        ))}
      </div>
    </>
  );
}
