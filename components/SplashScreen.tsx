"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function SplashScreen() {
  const [dismissed, setDismissed] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);
  const dragging = useRef(false);

  const enter = useCallback(() => {
    setDismissed(true);
  }, []);

  // 触摸/鼠标上滑检测
  useEffect(() => {
    const onStart = (y: number) => {
      startY.current = y;
      dragging.current = true;
    };
    const onMove = (y: number) => {
      if (!dragging.current) return;
      const dy = startY.current - y;
      if (dy > 0) setDragY(Math.min(dy, 200));
    };
    const onEnd = (y: number) => {
      if (!dragging.current) return;
      dragging.current = false;
      const dy = startY.current - y;
      if (dy > 60) enter();
      else setDragY(0);
    };

    const handleTouchStart = (e: TouchEvent) => onStart(e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientY);
    const handleTouchEnd = (e: TouchEvent) => onEnd(e.changedTouches[0].clientY);

    const handleMouseDown = (e: MouseEvent) => onStart(e.clientY);
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientY);
    const handleMouseUp = (e: MouseEvent) => onEnd(e.clientY);

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [enter]);

  if (dismissed) return null;

  return (
    <>
      {/* 上滑遮罩 */}
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-end pb-24 bg-white transition-transform duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          transform: `translateY(${dismissed ? "-100%" : -dragY + "px"})`,
          transitionDuration: dismissed ? "600ms" : dragY > 0 ? "0ms" : "600ms",
        }}
      >
        <div className="flex flex-col items-center gap-12">
          {/* TIDY 大字 */}
          <div className="text-center">
            <h1
              className="text-[80px] md:text-[120px] font-black tracking-[-0.03em] text-neutral-900 leading-none select-none"
              style={{ fontFamily: "'Helvetica Neue', 'Arial Black', sans-serif" }}
            >
              TIDY
            </h1>
            <p className="text-sm text-neutral-400 tracking-[0.3em] mt-2">
              当传统榫卯遇见数字温度
            </p>
          </div>

          {/* 进入按钮 + 上滑提示 */}
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={enter}
              className="px-12 py-3 border border-neutral-300 text-neutral-500 text-sm tracking-[0.3em] hover:border-neutral-900 hover:text-neutral-900 transition-all duration-300 active:scale-95 select-none"
            >
              进入
            </button>

            {/* 上滑提示动画 */}
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <span className="text-[10px] text-neutral-300 tracking-widest">上滑进入</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="animate-bounce"
              >
                <path
                  d="M10 16V4M10 4L5 9M10 4L15 9"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-neutral-300"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
