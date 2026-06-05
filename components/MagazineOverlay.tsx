"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function MagazineOverlay() {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 控制视频延迟播放
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (open) {
      // 打开时：先暂停 → 等待滑入动画完成 → 再播放
      video.currentTime = 0;
      video.pause();
      const timer = setTimeout(() => {
        video.play().catch(() => {});
      }, 900);
      return () => clearTimeout(timer);
    } else {
      // 关闭时：暂停并重置
      video.pause();
      video.currentTime = 0;
    }
  }, [open]);

  return (
    <>
      {/* 触发按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="btn btn-outline !px-8 !py-3"
      >
        了解 Bunny Tidy
      </button>

      {/* 上滑覆盖层 */}
      <div
        className={`fixed inset-0 z-[200] transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="h-full w-full bg-[#faf8f4] flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="shrink-0 flex items-center justify-between px-6 lg:px-10 py-5">
            <button
              onClick={() => setOpen(false)}
              className="text-lg font-black tracking-tighter text-text hover:text-primary transition-colors"
              style={{ fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif" }}
            >
              TIDY
            </button>
            <div className="flex items-center gap-8">
              {[
                { href: "/product", label: "Bunny Tidy" },
                { href: "/collections", label: "Collections" },
                { href: "/about", label: "About" },
                { href: "/configurator", label: "Customize" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[11px] tracking-widest text-text-light hover:text-text transition-colors uppercase"
                >
                  {l.label}
                </Link>
              ))}
              {/* 关闭按钮 */}
              <button
                onClick={() => setOpen(false)}
                className="ml-4 text-text-light hover:text-text transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </header>

          {/* Body */}
          <div className="flex-1 flex min-h-0">
            {/* Left: 3 small images */}
            <div className="w-[28%] shrink-0 flex flex-col justify-center items-center gap-6 px-4">
              <img src="/images/front.png" alt="正面" className="w-full max-w-[200px] h-auto object-contain" />
              <img src="/images/top.png" alt="顶面" className="w-full max-w-[180px] h-auto object-contain" />
              <img src="/images/back.png" alt="背面" className="w-full max-w-[200px] h-auto object-contain" />
            </div>

            {/* Right: video + text overlay */}
            <div className="flex-1 relative overflow-hidden bg-black">
              <video
                ref={videoRef}
                src="/video/2044_raw.MP4"
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

              <div className="absolute inset-0">
                {/* 右上角：产品名 */}
                <div className="absolute top-10 right-8 lg:right-12 text-right">
                  <p className="text-white/50 text-[11px] tracking-[0.35em] uppercase mb-3">First Edition</p>
                  <h1
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-[-0.03em] leading-[0.9]"
                    style={{ fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif" }}
                  >
                    BUNNY
                    <br />
                    TIDY
                    <br />
                    CHAIR
                  </h1>
                </div>

                {/* 左下角：材质 + 标语 */}
                <div className="absolute bottom-10 left-8 lg:left-12 max-w-sm">
                  <p className="text-white/70 text-xs tracking-[0.25em] uppercase mb-3">
                    海洋板 + 3D 打印配件
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed">
                    &ldquo;最好的家具，是人和技术一起创造的。&rdquo;
                  </p>
                </div>

                {/* 右下角：尺寸 */}
                <div className="absolute bottom-10 right-8 lg:right-12 text-right">
                  <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase mb-3">Dimensions (mm)</p>
                  <div className="space-y-1 text-xs text-white/55 tracking-wide">
                    <p>侧板 450 × 500</p>
                    <p>坐板 300 × 300</p>
                    <p>靠背 250 × 300</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
