"use client";
// @ts-nocheck — pure SVG rendering with numeric string attrs

import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════
   侧板 · 兔形轮廓  ~450×500mm
   基于：Configurator3D 侧板跨度 45 units ≈ 450mm
   榫眼：坐板位 Y≈-8 (34% from bottom)，靠背位 Y≈+10 (70% from bottom)
   ══════════════════════════════════════════════════ */
function SidePanel() {
  // ViewBox 520×560 fits 450×500mm + 35mm margins for dim lines
  return (
    <svg viewBox="0 0 520 560" className="w-full h-full">
      {/* 主轮廓 —— 兔子坐姿侧影 */}
      <path
        d={[
          "M 55,510",             // 前脚底
          "L 58,480",
          "L 65,430",
          "Q 70,380 78,340",     // 前腿上升
          "Q 88,300 95,275",     // 胸部
          "Q 100,255 95,235",    // 脖颈
          "L 88,210",            // 下巴
          "L 92,185",            // 脸
          "L 98,155",            // 左耳升起
          "Q 102,135 108,125",   // 左耳尖
          "Q 115,120 120,130",   // 耳间凹
          "L 130,150",           // 右耳升起
          "Q 138,125 148,118",   // 右耳尖
          "Q 158,122 160,140",   // 右耳降
          "L 170,170",           // 头后
          "Q 185,185 210,195",   // 颈后
          "Q 250,210 300,220",   // 后背
          "Q 350,230 390,260",   // 臀部
          "Q 420,300 435,360",   // 后腿外
          "L 440,450",
          "L 445,510",           // 后脚底
          "L 55,510",            // 闭合回前脚
          "Z",
        ].join(" ")}
        fill="none" stroke="#ffffff" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* 结构参考线 */}
      <line x1="65" y1="355" x2="430" y2="355"
        stroke="#ffffff" strokeWidth="0.3" strokeDasharray="8 10" opacity="0.25" />
      <line x1="70" y1="220" x2="410" y2="220"
        stroke="#ffffff" strokeWidth="0.3" strokeDasharray="8 10" opacity="0.25" />

      {/* 榫卯凹槽：坐板位 2处 (Y≈340，距底约 34%) */}
      <g>
        <rect x="95" y="335" width="38" height="14" rx="2"
          fill="none" stroke="#ffffff" strokeWidth="0.7" strokeDasharray="3 3" />
        <text x="114" y="328" textAnchor="middle" fill="#aaaaaa" fontSize="6"
          fontFamily="monospace">坐板榫眼</text>
      </g>
      <g>
        <rect x="335" y="335" width="38" height="14" rx="2"
          fill="none" stroke="#ffffff" strokeWidth="0.7" strokeDasharray="3 3" />
        <text x="354" y="328" textAnchor="middle" fill="#aaaaaa" fontSize="6"
          fontFamily="monospace">坐板榫眼</text>
      </g>

      {/* 榫卯凹槽：靠背位 2处 (Y≈205) */}
      <g>
        <rect x="100" y="200" width="32" height="12" rx="2"
          fill="none" stroke="#ffffff" strokeWidth="0.7" strokeDasharray="3 3" />
        <text x="116" y="194" textAnchor="middle" fill="#aaaaaa" fontSize="6"
          fontFamily="monospace">靠背榫眼</text>
      </g>
      <g>
        <rect x="340" y="200" width="32" height="12" rx="2"
          fill="none" stroke="#ffffff" strokeWidth="0.7" strokeDasharray="3 3" />
        <text x="356" y="194" textAnchor="middle" fill="#aaaaaa" fontSize="6"
          fontFamily="monospace">靠背榫眼</text>
      </g>

      {/* 尺寸标注 */}
      <DimH y="540" x1="55" x2="445" label="450" />
      <DimV x="495" y1="118" y2="510" label="500" />
      <DimH y="390" x1="114" x2="354" label="240" sub="坐板位中心距" />

      <text x="250" y="555" textAnchor="middle" fill="#666666"
        fontSize="9" fontFamily="monospace" letterSpacing="1.5">
        侧板 · 兔形轮廓
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   底板 · 坐板  300×300×25mm
   Configurator3D: BoxGeometry(26, 3, 30) → ~300×300mm
   四角榫眼 Ø30mm，距边 35mm
   ══════════════════════════════════════════════════ */
function SeatBoard() {
  return (
    <svg viewBox="0 0 420 460" className="w-full h-full">
      {/* 俯视图主轮廓 */}
      <rect x="60" y="50" width="300" height="300" rx="12" ry="12"
        fill="none" stroke="#ffffff" strokeWidth="2.2" />

      {/* 板厚示意 */}
      <rect x="60" y="365" width="300" height="10" rx="3"
        fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.4" />

      {/* 中心参考线 */}
      <line x1="210" y1="50" x2="210" y2="350"
        stroke="#ffffff" strokeWidth="0.2" strokeDasharray="6 8" opacity="0.2" />
      <line x1="60" y1="200" x2="360" y2="200"
        stroke="#ffffff" strokeWidth="0.2" strokeDasharray="6 8" opacity="0.2" />

      {/* 四角榫眼 */}
      <circle cx="95" cy="85" r="14" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3" />
      <circle cx="325" cy="85" r="14" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3" />
      <circle cx="95" cy="315" r="14" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3" />
      <circle cx="325" cy="315" r="14" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3" />

      {/* 榫眼十字标 */}
      {[[95,85],[325,85],[95,315],[325,315]].map(([cx,cy], i) => (
        <g key={i}>
          <line x1={cx-6} y1={cy} x2={cx+6} y2={cy}
            stroke="#ffffff" strokeWidth="0.3" opacity="0.35" />
          <line x1={cx} y1={cy-6} x2={cx} y2={cy+6}
            stroke="#ffffff" strokeWidth="0.3" opacity="0.35" />
        </g>
      ))}

      {/* 尺寸 */}
      <DimH y="30" x1="60" x2="360" label="300" />
      <DimV x="390" y1="50" y2="350" label="300" />
      <DimT x="360" y1="365" y2="375" label="25" offset={310} />

      {/* 榫眼标注 */}
      <text x="95" y="44" textAnchor="middle" fill="#888888" fontSize="7"
        fontFamily="monospace">榫眼 Ø30</text>
      <line x1="95" y1="47" x2="95" y2="52" stroke="#888888" strokeWidth="0.3" />

      <text x="210" y="450" textAnchor="middle" fill="#666666"
        fontSize="9" fontFamily="monospace" letterSpacing="1.5">
        底板 · 坐板
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   靠背 · 靠板  250×300×25mm
   Configurator3D: BoxGeometry(26, 25, 3) ≈ 250H×260W
   底部两榫眼 Ø30mm，距底 30mm
   ══════════════════════════════════════════════════ */
function BackPanel() {
  return (
    <svg viewBox="0 0 370 460" className="w-full h-full">
      {/* 主轮廓 */}
      <rect x="60" y="45" width="250" height="300" rx="10" ry="10"
        fill="none" stroke="#ffffff" strokeWidth="2.2" />

      {/* 中心线 */}
      <line x1="185" y1="45" x2="185" y2="345"
        stroke="#ffffff" strokeWidth="0.2" strokeDasharray="6 8" opacity="0.2" />

      {/* 底部榫眼 */}
      <circle cx="110" cy="305" r="13" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3" />
      <circle cx="260" cy="305" r="13" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3" />

      {/* 板厚 */}
      <rect x="60" y="360" width="250" height="10" rx="3"
        fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.4" />

      {/* 尺寸 */}
      <DimH y="25" x1="60" x2="310" label="250" />
      <DimV x="340" y1="45" y2="345" label="300" />
      <DimT x="310" y1="360" y2="370" label="25" offset={262} />

      {/* 榫眼标注 */}
      <text x="185" y="335" textAnchor="middle" fill="#888888" fontSize="7"
        fontFamily="monospace">榫眼 Ø30 ×2</text>
      <line x1="185" y1="338" x2="185" y2="345" stroke="#888888" strokeWidth="0.3" />

      <text x="185" y="450" textAnchor="middle" fill="#666666"
        fontSize="9" fontFamily="monospace" letterSpacing="1.5">
        靠背 · 靠板
      </text>
    </svg>
  );
}

/* ── 共享标注组件 ── */
function DimH({ y, x1, x2, label, sub }: { y: number; x1: number; x2: number; label: string; sub?: string }) {
  const cx = (x1 + x2) / 2;
  return (
    <g>
      <line x1={x1} y1={y} x2={x1} y2={y + 6} stroke="#666666" strokeWidth="0.5" />
      <line x1={x2} y1={y} x2={x2} y2={y + 6} stroke="#666666" strokeWidth="0.5" />
      <line x1={x1} y1={y + 3} x2={x2} y2={y + 3} stroke="#666666" strokeWidth="0.5" />
      <polygon points={`${x1+5},${y+6} ${x1},${y+3} ${x1+5},${y}`} fill="#666666" />
      <polygon points={`${x2-5},${y+6} ${x2},${y+3} ${x2-5},${y}`} fill="#666666" />
      <text x={cx} y={y + 14} textAnchor="middle" fill="#aaaaaa" fontSize="8" fontFamily="monospace">
        {label}mm
      </text>
      {sub && (
        <text x={cx} y={y + 23} textAnchor="middle" fill="#555555" fontSize="6.5" fontFamily="monospace">
          {sub}
        </text>
      )}
    </g>
  );
}

function DimV({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) {
  const cy = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x} y1={y1} x2={x - 6} y2={y1} stroke="#666666" strokeWidth="0.5" />
      <line x1={x} y1={y2} x2={x - 6} y2={y2} stroke="#666666" strokeWidth="0.5" />
      <line x1={x - 3} y1={y1} x2={x - 3} y2={y2} stroke="#666666" strokeWidth="0.5" />
      <polygon points={`${x-6},${y1+5} ${x-3},${y1} ${x},${y1+5}`} fill="#666666" />
      <polygon points={`${x-6},${y2-5} ${x-3},${y2} ${x},${y2-5}`} fill="#666666" />
      <text x={x - 10} y={cy} textAnchor="end" fill="#aaaaaa" fontSize="8"
        fontFamily="monospace" transform={`rotate(-90, ${x-10}, ${cy})`}>{label}mm</text>
    </g>
  );
}

function DimT({ x, y1, y2, label, offset }: { x: number; y1: number; y2: number; label: string; offset: number }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x + 14} y2={y1} stroke="#666666" strokeWidth="0.5" />
      <line x1={x} y1={y2} x2={x + 14} y2={y2} stroke="#666666" strokeWidth="0.5" />
      <line x1={x + 11} y1={y1} x2={x + 11} y2={y2} stroke="#666666" strokeWidth="0.5" />
      <text x={x + 20} y={(y1 + y2) / 2 + 3} fill="#888888" fontSize="7" fontFamily="monospace">{label}mm</text>
    </g>
  );
}

/* ── 主组件 ── */
const slides = [
  { key: "side", label: "侧板", render: () => <SidePanel /> },
  { key: "seat", label: "底板", render: () => <SeatBoard /> },
  { key: "back", label: "靠背", render: () => <BackPanel /> },
];

export default function CADDisplay() {
  const [current, setCurrent] = useState(0);
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [renderKeys, setRenderKeys] = useState<Record<number, number>>({ 0: 0, 1: 0, 2: 0 });

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setCurrent((c) => (c + 1) % 3);
    }, 5000);
  }, []);

  useEffect(() => { resetTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [resetTimer]);

  const goTo = useCallback((i: number) => { setCurrent(i); resetTimer(); }, [resetTimer]);

  useEffect(() => { setRenderKeys((p) => ({ ...p, [current]: (p[current] || 0) + 1 })); }, [current]);

  return (
    <div className="w-full overflow-hidden rounded-sm" style={{ background: "#0a0a0a" }}>
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div
          className="absolute inset-0 overflow-hidden select-none"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          {slides.map((s, i) => (
            <div
              key={`${s.key}-${renderKeys[i] ?? 0}`}
              className="absolute inset-0"
              style={{ opacity: current === i ? 1 : 0, transition: "opacity 0.6s", pointerEvents: current === i ? "auto" : "none" }}
            >
              {s.render()}
            </div>
          ))}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {slides.map((s, i) => (
              <button key={s.key} onClick={(e) => { e.stopPropagation(); goTo(i); }} aria-label={s.label}>
                <span className="block transition-all duration-300"
                  style={{ width: current === i ? 28 : 8, height: 8, backgroundColor: current === i ? "#fff" : "#444", borderRadius: 4 }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        svg path, svg rect, svg line, svg circle, svg polygon {
          stroke-dasharray: 4000; stroke-dashoffset: 4000;
          animation: draw 1.6s ease-out forwards;
        }
        svg text { opacity: 0; animation: appear 0.5s ease-out forwards; }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes appear { to { opacity: 1; } }
      `}</style>
    </div>
  );
}
